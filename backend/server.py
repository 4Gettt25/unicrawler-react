from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlalchemy as db
import os

app = Flask(__name__)
CORS(app)  # Allow CORS for all routes

# Database configuration
DB_FILE_PATH = 'pdf_index.sqlite'
engine = db.create_engine(f'sqlite:///{DB_FILE_PATH}')
connection = engine.connect()
metadata = db.MetaData()
pdf_pages = db.Table('pdf_pages', metadata, autoload_with=engine)

@app.route('/query', methods=['POST'])
def query_text():
    data = request.json
    search_query = data.get('query', '')

    # Perform the query
    query = db.select(
        pdf_pages.c.pdf_path,
        pdf_pages.c.page_number,
        pdf_pages.c.text,
        pdf_pages.c.image_path
    ).where(pdf_pages.c.text.contains(search_query))
    results = connection.execute(query).fetchall()

    response = []
    for result in results:
        response.append({
            'pdf_path': result[0],  # Accessing by index
            'page_number': result[1],
            'image_path': result[3],
            'text': result[2]
        })

    return jsonify(response)

# Serve static files (images and PDFs)
@app.route('/imgs/<path:filename>', methods=['GET'])
def serve_image(filename):
    return send_from_directory('imgs', filename)

@app.route('/pdfs/<path:filename>', methods=['GET'])
def serve_pdf(filename):
    return send_from_directory('pdfs', filename)

if __name__ == '__main__':
    app.run(debug=True)