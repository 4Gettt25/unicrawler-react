from flask import Flask, request, jsonify, send_file, url_for
from flask_cors import CORS
from celery import Celery
from pdf2image import convert_from_path
import logging
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

logging.basicConfig(level=logging.DEBUG)

# Configure Celery
celery = Celery(
    app.name,
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/0'
)
celery.conf.update(app.config)

@app.route('/query', methods=['POST'])
def query():
    data = request.json
    if not data or 'query' not in data:
        return jsonify({"error": "Invalid input"}), 400

    task = celery.send_task('tasks.async_search', args=[data['query']])
    return jsonify({"task_id": task.id}), 200

@app.route('/results/<task_id>', methods=['GET'])
def get_results(task_id):
    try:
        task = celery.AsyncResult(task_id)
        if task.state == 'PENDING':
            response = {
                'state': task.state,
                'current': 0,
                'total': 1,
                'status': 'Pending...'
            }
        elif task.state == 'SUCCESS':
            response = {
                'state': task.state,
                'result': task.info.get('result', [])
            }
        else:
            response = {
                'state': task.state,
                'status': str(task.info),  # this is the exception raised
            }
        return jsonify(response)
    except Exception as e:
        logging.error(f"Error fetching results for task {task_id}: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/pdf_image', methods=['POST'])
def pdf_image():
    try:
        data = request.json
        pdf_path = data.get('pdf_path')
        page_number = data.get('page_number')

        if not pdf_path or not page_number:
            return jsonify({"error": "Invalid input"}), 400

        logging.debug(f"Converting page {page_number} of {pdf_path} to image.")

        # Specify the path to Poppler if necessary
        poppler_path = None  # Update this path if needed
        images = convert_from_path(pdf_path, first_page=page_number, last_page=page_number, poppler_path=poppler_path)

        # Save the image to the static directory
        image_filename = f'temp_image_{page_number}.png'
        image_path = os.path.join('static', image_filename)
        images[0].save(image_path, 'PNG')

        image_url = url_for('static', filename=image_filename, _external=True)

        # Use a deferred cleanup approach
        from threading import Timer

        def delete_file(path):
            try:
                if os.path.exists(path):
                    os.remove(path)
                    logging.debug(f"Deleted temporary image: {path}")
            except Exception as e:
                logging.error(f"Error deleting file {path}: {e}")

        # Delete the file after 5 minutes
        Timer(300, delete_file, args=[image_path]).start()

        return jsonify({"image_url": image_url})

    except Exception as e:
        logging.error(f"Error processing PDF image: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
