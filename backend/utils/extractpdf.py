import os
import pdfminer
from sqlalchemy import create_engine, Column, Integer, String, Text

# Extract text from PDF file using pdfminer
def extract_pdf_text(file_path):
    with open(file_path, 'rb') as f:
        paper = pdfminer.PDFFile(f)
        text = []
        for page in paper.pages:
            text.extend(page.extractText())
        return '\n'.join(text)

def extract_all_pdfs(directory_path):
    for filename in os.listdir(directory_path):
        if filename.endswith('.pdf'):
            file_path = os.path.join(directory_path, filename)
            extracted_text = extract_pdf_text(file_path)
            print(f"Extracted text from {filename}:\n{extracted_text}\n")

# Example usage:
downloads_directory_path = '..\downloads'
extract_all_pdfs(downloads_directory_path)