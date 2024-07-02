import os
import logging
from pdfminer.high_level import extract_text
from pdf2image import convert_from_path
from PIL import Image
import sqlalchemy as db

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Set up the database
engine = db.create_engine('sqlite:///pdf_index.db')
metadata = db.MetaData()
pdf_pages = db.Table('pdf_pages', metadata,
                     db.Column('id', db.Integer, primary_key=True),
                     db.Column('pdf_path', db.String),
                     db.Column('page_number', db.Integer),
                     db.Column('text', db.Text),
                     db.Column('image_path', db.String))
metadata.create_all(engine)
connection = engine.connect()

PDF_DIRECTORY = 'pdfs'
IMAGE_DIRECTORY = 'imgs'

if not os.path.exists(IMAGE_DIRECTORY):
    os.makedirs(IMAGE_DIRECTORY)

def index_pdfs():
    for pdf_file in os.listdir(PDF_DIRECTORY):
        if pdf_file.endswith('.pdf'):
            pdf_path = os.path.join(PDF_DIRECTORY, pdf_file)
            logging.debug(f"Processing PDF: {pdf_path}")

            pages = convert_from_path(pdf_path)

            for i, page in enumerate(pages):
                logging.debug(f"Processing page {i + 1} of {pdf_file}")
                page_text = extract_text(pdf_path, page_numbers=[i])
                logging.debug(f"Extracted text for page {i + 1} of {pdf_file}")

                image_path = os.path.join(IMAGE_DIRECTORY, f"{pdf_file}_{i + 1}.png")
                page.save(image_path, 'PNG')
                logging.debug(f"Saved image for page {i + 1} of {pdf_file}")

                query = db.insert(pdf_pages).values(
                    pdf_path=pdf_path,
                    page_number=i + 1,
                    text=page_text,
                    image_path=image_path
                )
                connection.execute(query)
                logging.debug(f"Inserted page {i + 1} of {pdf_file} into database")

if __name__ == '__main__':
    index_pdfs()
