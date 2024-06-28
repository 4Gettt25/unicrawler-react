from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from tasks import async_search
import os

app = Flask(__name__)
CORS(app)

# Set the directory where PDF files are stored
PDF_DIRECTORY = os.path.join(os.getcwd(), 'pdfs')

@app.route('/query', methods=['POST'])
def query():
    data = request.json
    query = data.get('query', '')
    task = async_search.apply_async(args=[query])
    return jsonify({"task_id": task.id})

@app.route('/results/<task_id>', methods=['GET'])
def get_results(task_id):
    task = async_search.AsyncResult(task_id)
    if task.state == 'SUCCESS':
        return jsonify({"pdf_results": task.result, "state": task.state})
    else:
        return jsonify({"state": task.state})

# Serve the PDF files
@app.route('/pdfs/<path:filename>', methods=['GET'])
def download_file(filename):
    try:
        return send_from_directory(PDF_DIRECTORY, filename, as_attachment=True)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
