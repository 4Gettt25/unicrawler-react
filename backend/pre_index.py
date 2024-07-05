import os
import logging
from pdfminer.high_level import extract_text
from pdf2image import convert_from_path
from PIL import Image
import sqlalchemy as db

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
                         db.Column('pdf_path', db.String, unique=True),
                         db.Column('page_number', db.Integer),
                         db.Column('text', db.Text),
                         db.Column('image_path', db.String))
    metadata.create_all(engine)
    connection = engine.connect()
    logging.debug(f"Database connected at {DB_FILE_PATH}")
except Exception as e:
    logging.error(f"Error creating or connecting to the database: {e}")
    raise

def index_pdfs():
    for pdf_file in os.listdir(PDF_DIRECTORY):
        if pdf_file.endswith('.pdf'):
            pdf_path = os.path.join(PDF_DIRECTORY, pdf_file)
            logging.debug(f"Processing PDF: {pdf_path}")

            # Check if the PDF is already indexed
            query = db.select([pdf_pages]).where(pdf_pages.c.pdf_path == pdf_path)
            result = connection.execute(query).fetchone()
            if result:
                logging.info(f"PDF already indexed, skipping: {pdf_path}")
                continue

            try:
                pages = convert_from_path(pdf_path)
                for i, page in enumerate(pages):
                    logging.debug(f"Processing page {i + 1} of {pdf_file}")
                    page_text = extract_text(pdf_path, page_numbers=[i])
                    logging.debug(f"Extracted text for page {i + 1} of {pdf_file}")

                    image_path = os.path.join(IMAGE_DIRECTORY, f"{os.path.splitext(pdf_file)[0]}_{i + 1}.png")
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
            except Exception as e:
                logging.error(f"Error processing {pdf_path}: {e}")
                connection.rollback()
            else:
                connection.commit()

if __name__ == '__main__':
    index_pdfs()
    connection.close()
