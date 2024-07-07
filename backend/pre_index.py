import os
import logging
from pdfminer.high_level import extract_text
from pdf2image import convert_from_path
from PIL import Image
import sqlalchemy as db
from multiprocessing import Pool, cpu_count
from functools import partial

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Define directories
PDF_DIRECTORY = 'pdfs'
IMAGE_DIRECTORY = 'imgs'
DB_FILE_PATH = 'pdf_index.sqlite'

# Ensure directories exist
os.makedirs(PDF_DIRECTORY, exist_ok=True)
os.makedirs(IMAGE_DIRECTORY, exist_ok=True)

# Ensure the database file path is correct
try:
    engine = db.create_engine(f'sqlite:///{DB_FILE_PATH}', echo=True)
    metadata = db.MetaData()
    pdf_pages = db.Table('pdf_pages', metadata,
                         db.Column('id', db.Integer, primary_key=True),
                         db.Column('pdf_path', db.String),
                         db.Column('page_number', db.Integer),
                         db.Column('text', db.Text),
                         db.Column('image_path', db.String),
                         db.UniqueConstraint('pdf_path', 'page_number', name='uix_pdf_page'))
    metadata.create_all(engine)
    connection = engine.connect()
    logging.debug(f"Database connected at {DB_FILE_PATH}")
except Exception as e:
    logging.error(f"Error creating or connecting to the database: {e}")
    raise

def process_page(pdf_file, page_number):
    pdf_path = os.path.join(PDF_DIRECTORY, pdf_file)
    logging.debug(f"Processing page {page_number + 1} of {pdf_file}")
    try:
        page_text = extract_text(pdf_path, page_numbers=[page_number])
        logging.debug(f"Extracted text for page {page_number + 1} of {pdf_file}")

        image_path = os.path.join(IMAGE_DIRECTORY, f"{os.path.splitext(pdf_file)[0]}_{page_number + 1}.png")
        page_image = convert_from_path(pdf_path, first_page=page_number + 1, last_page=page_number + 1)[0]
        page_image.save(image_path, 'PNG')
        logging.debug(f"Saved image for page {page_number + 1} of {pdf_file}")

        return {
            'pdf_path': pdf_path,
            'page_number': page_number + 1,
            'text': page_text,
            'image_path': image_path
        }
    except Exception as e:
        logging.error(f"Error processing page {page_number + 1} of {pdf_path}: {e}")
        return None

def process_pdf(pdf_file):
    pdf_path = os.path.join(PDF_DIRECTORY, pdf_file)
    logging.debug(f"Processing PDF: {pdf_path}")

    try:
        # Get the total number of pages in the PDF
        pages = convert_from_path(pdf_path, fmt="png")
        num_pages = len(pages)
        logging.debug(f"PDF {pdf_path} has {num_pages} pages")

        with Pool(cpu_count()) as pool:
            pages_data = pool.map(partial(process_page, pdf_file), range(num_pages))
        return [page_data for page_data in pages_data if page_data]
    except Exception as e:
        logging.error(f"Error processing {pdf_path}: {e}")
        return []

def index_pdfs():
    # Fetch the list of already indexed PDFs
    try:
        indexed_pdfs = connection.execute(db.select(pdf_pages.c.pdf_path)).fetchall()
        indexed_pdfs = set(row[0] for row in indexed_pdfs)
        logging.debug(f"Already indexed PDFs: {indexed_pdfs}")
    except Exception as e:
        logging.error(f"Error fetching indexed PDFs: {e}")
        indexed_pdfs = set()

    all_pages_data = []
    for pdf_file in os.listdir(PDF_DIRECTORY):
        if pdf_file.endswith('.pdf'):
            pdf_path = os.path.join(PDF_DIRECTORY, pdf_file)
            if pdf_path in indexed_pdfs:
                logging.info(f"PDF already indexed, skipping: {pdf_path}")
                continue

            pages_data = process_pdf(pdf_file)
            all_pages_data.extend(pages_data)
            logging.debug(f"Collected data for PDF: {pdf_file}")

    # Batch insert pages data
    if all_pages_data:
        try:
            connection.execute(pdf_pages.insert(), all_pages_data)
            logging.debug("Batch insert completed")
        except Exception as e:
            logging.error(f"Error during batch insert: {e}")

if __name__ == '__main__':
    index_pdfs()
    connection.close()
