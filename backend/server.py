# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from tasks import async_search

app = Flask(__name__)
CORS(app)

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
        return jsonify({"pdf_results": task.result})
    else:
        return jsonify({"state": task.state})

if __name__ == '__main__':
    app.run(debug=True)
