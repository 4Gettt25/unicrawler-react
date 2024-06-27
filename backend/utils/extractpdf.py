import os
from pdfminer.high_level import extract_text

def extract_pdf_text(file_path):
    # Use pdfminer.high_level.extract_text for simplified text extraction
    text = extract_text(file_path)
    return text

def extract_all_pdfs(directory_path):
    for filename in os.listdir(directory_path):
        if filename.endswith('.pdf'):
            file_path = os.path.join(directory_path, filename)
            extracted_text = extract_pdf_text(file_path)
            print(f"Extracted text from {filename}:\n{extracted_text}\n")

# Correct the path to use forward slashes and ensure it's correct relative to the script's execution context
downloads_directory_path = '../downloads'
extract_all_pdfs(downloads_directory_path)