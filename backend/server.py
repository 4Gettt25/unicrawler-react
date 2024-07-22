from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from supabase import create_client, Client
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)  # Allow CORS for all routes

# Load environment variables from .env file
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/query', methods=['POST'])
# This function defines a route '/query' that accepts POST requests and retrieves a search query from
# the JSON data sent in the request.
def query_text():
    data = request.json
    search_query = data.get('query', '')

    try:
        # Perform the query
        response = supabase.table('pdf_pages').select(
            'pdf_path', 'page_number', 'text', 'image_path'
        ).ilike('text', f'%{search_query}%').execute()

        # Check for errors in the response
        if not response.data:
            print(f"Error from Supabase: {response}")
            return jsonify({'error': 'Error from Supabase'}), 500

        # This block of code is processing the results obtained from a query to a Supabase table.
        results = response.data
        response_data = []
        for result in results:
            response_data.append({
                'pdf_path': result['pdf_path'],
                'page_number': result['page_number'],
                'image_path': result['image_path'],
                'text': result['text']
            })

# The code snippet `print(f"Returning {len(response_data)} results: {response_data}")` is printing a
# message to the console indicating the number of results returned by the query and the actual results
# themselves.
        print(f"Returning {len(response_data)} results: {response_data}")
        return jsonify(response_data)

# The `except Exception as e:` block in the code snippet is used for error handling. If an exception
# occurs during the execution of the code within the `try` block, the code inside the `except` block
# will be executed.
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return jsonify({'error': str(e)}), 500

"""
This Python function serves images from a specified directory based on the provided filename.

:param filename: The `filename` parameter in the route `/imgs/<path:filename>` is a dynamic
parameter that captures the path of the image file requested by the client. This parameter allows
your Flask application to serve images from the `imgs` directory based on the provided filename in
the URL
:return: an image file from the 'imgs' directory based on the filename provided in the URL path.
"""
@app.route('/imgs/<path:filename>', methods=['GET'])
def serve_image(filename):
    return send_from_directory('imgs', filename)

"""
The function serves a PDF file located in the 'pdfs' directory based on the provided filename.
    
:param filename: The `filename` parameter in the route `/pdfs/<path:filename>` is a variable part of
the URL that will be captured and passed as an argument to the `serve_pdf` function. It allows you
to dynamically serve PDF files based on the filename provided in the URL path
:return: The code is returning a PDF file from the "pdfs" directory with the filename specified in
the URL path parameter.
"""
@app.route('/pdfs/<path:filename>', methods=['GET'])
def serve_pdf(filename):
    return send_from_directory('pdfs', filename)

if __name__ == '__main__':
    app.run(debug=True)
