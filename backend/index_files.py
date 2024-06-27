import os
import fitz  # PyMuPDF
import pandas as pd
from whoosh.index import create_in
from whoosh.fields import Schema, TEXT, ID
from whoosh.analysis import StemmingAnalyzer

# Schema Definition
schema = Schema(file_path=ID(stored=True), content=TEXT(stored=True, analyzer=StemmingAnalyzer()))

# Create index directory
if not os.path.exists("indexdir"):
    os.mkdir("indexdir")

# Create index
index = create_in("indexdir", schema)
writer = index.writer()

# Index PDF files
pdf_directory = 'pdfs'
for pdf_file in os.listdir(pdf_directory):
    if pdf_file.endswith('.pdf'):
        file_path = os.path.join(pdf_directory, pdf_file)
        doc = fitz.open(file_path)
        content = ""
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            content += page.get_text()
        writer.add_document(file_path=file_path, content=content)

# Index Excel files
excel_directory = 'excels'
for excel_file in os.listdir(excel_directory):
    if excel_file.endswith('.xlsx'):
        file_path = os.path.join(excel_directory, excel_file)
        df = pd.read_excel(file_path)
        content = df.to_string()
        writer.add_document(file_path=file_path, content=content)

writer.commit()
