from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import uuid

app = Flask(__name__)
CORS(app)  # Enables CORS for all routes

tasks = {}

@app.route('/query', methods=['POST'])
def query():
    data = request.get_json()
    query = data.get('query')
    if not query:
        return jsonify({'error': 'Query parameter is missing'}), 400
    
    task_id = str(uuid.uuid4())
    tasks[task_id] = {
        'state': 'PENDING',
        'pdf_results': []
    }
    
    # Simulate processing
    time.sleep(2)
    tasks[task_id]['state'] = 'SUCCESS'
    tasks[task_id]['pdf_results'] = [{'text': f'Result for {query}'}]
    
    return jsonify({'task_id': task_id})

@app.route('/results/<task_id>', methods=['GET'])
def results(task_id):
    task = tasks.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    return jsonify(task)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
