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

        results = response.data
        response_data = []
        for result in results:
            response_data.append({
                'pdf_path': result['pdf_path'],
                'page_number': result['page_number'],
                'image_path': result['image_path'],
                'text': result['text']
            })

        print(f"Returning {len(response_data)} results: {response_data}")
        return jsonify(response_data)

    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Serve static files (images and PDFs)
@app.route('/imgs/<path:filename>', methods=['GET'])
def serve_image(filename):
    return send_from_directory('imgs', filename)

@app.route('/pdfs/<path:filename>', methods=['GET'])
def serve_pdf(filename):
    return send_from_directory('pdfs', filename)

if __name__ == '__main__':
    app.run(debug=True)
