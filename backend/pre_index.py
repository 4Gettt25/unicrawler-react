import os
import logging
from pdfminer.high_level import extract_text
from pdf2image import convert_from_path
from PIL import Image
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Define directories
PDF_DIRECTORY = 'pdfs'
IMAGE_DIRECTORY = 'imgs'

# Ensure directories exist
os.makedirs(PDF_DIRECTORY, exist_ok=True)
os.makedirs(IMAGE_DIRECTORY, exist_ok=True)

# Get Supabase credentials from environment variables
SUPABASE_URL = os.getenv('SUPABASE_URL', 'http://127.0.0.1:54321')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'your-local-supabase-key')

# Create a Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def index_pdfs():
    for pdf_file in os.listdir(PDF_DIRECTORY):
        if pdf_file.endswith('.pdf'):
            pdf_path = os.path.join(PDF_DIRECTORY, pdf_file)
            logging.debug(f"Processing PDF: {pdf_path}")

            try:
                pages = convert_from_path(pdf_path)
                for i, page in enumerate(pages):
                    page_number = i + 1
                    logging.debug(f"Processing page {page_number} of {pdf_file}")

                    # Check if the page already exists in the database
                    response = supabase.table('pdf_pages').select('*').eq('pdf_path', pdf_path).eq('page_number', page_number).execute()
                    if response.data:
                        logging.info(f"Page {page_number} of {pdf_file} already indexed, skipping.")
                        continue

                    page_text = extract_text(pdf_path, page_numbers=[i])
                    logging.debug(f"Extracted text for page {page_number} of {pdf_file}")

                    image_path = os.path.join(IMAGE_DIRECTORY, f"{os.path.splitext(pdf_file)[0]}_{page_number}.png")
                    page.save(image_path, 'PNG')
                    logging.debug(f"Saved image for page {page_number} of {pdf_file}")

                    # Insert page data into the Supabase table
                    response = supabase.table('pdf_pages').insert({
                        'pdf_path': pdf_path,
                        'page_number': page_number,
                        'text': page_text,
                        'image_path': image_path
                    }).execute()

                    if response.data is None:
                        logging.error(f"Failed to insert page {page_number} of {pdf_file}: {response.json()}")
                    else:
                        logging.debug(f"Successfully inserted page {page_number} of {pdf_file} into database")

            except Exception as e:
                logging.error(f"Error processing {pdf_path}: {e}")

if __name__ == '__main__':
    index_pdfs()
