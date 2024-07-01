import os
from pdfminer.high_level import extract_text
from pdf2image import convert_from_path
from PIL import Image
import sqlalchemy as db

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

def index_pdfs():
    for pdf_file in os.listdir(PDF_DIRECTORY):
        if pdf_file.endswith('.pdf'):
            pdf_path = os.path.join(PDF_DIRECTORY, pdf_file)
            text = extract_text(pdf_path)
            pages = convert_from_path(pdf_path)
            
            for i, page in enumerate(pages):
                page_text = text.split('\f')[i]
                image_path = os.path.join(IMAGE_DIRECTORY, f"{pdf_file}_{i+1}.png")
                page.save(image_path, 'PNG')
                
                query = db.insert(pdf_pages).values(
                    pdf_path=pdf_path,
                    page_number=i + 1,
                    text=page_text,
                    image_path=image_path
                )
                connection.execute(query)

if __name__ == '__main__':
    index_pdfs()
