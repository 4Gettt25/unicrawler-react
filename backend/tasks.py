from celery import Celery
import PyPDF2
import os
import logging

app = Celery('tasks', broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')

logging.basicConfig(level=logging.DEBUG)

@app.task(bind=True)
def async_search(self, query):
    pdf_dir = "pdfs"  # Directory where your PDFs are stored
    results = []

    # Iterate over all PDF files in the directory
    for pdf_file in os.listdir(pdf_dir):
        if pdf_file.endswith(".pdf"):
            pdf_path = os.path.join(pdf_dir, pdf_file)
            logging.info(f"Searching in PDF: {pdf_path}")

            # Open the PDF file
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                num_pages = len(reader.pages)

                # Search each page for the query
                for page_number in range(num_pages):
                    page = reader.pages[page_number]
                    text = page.extract_text()

                    if query.lower() in text.lower():
                        # If query is found, add the result
                        logging.info(f"Query found in {pdf_path} on page {page_number + 1}")
                        results.append({
                            "context": extract_context(text, query),
                            "file_path": pdf_path,
                            "page_number": page_number + 1  # Page numbers start from 1
                        })

    self.update_state(state='SUCCESS', meta={'result': results})
    return {"result": results}

def extract_context(text, query, context_length=200):
    """
    Extracts a snippet of text around the query for context.
    """
    query_index = text.lower().find(query.lower())
    start = max(query_index - context_length // 2, 0)
    end = min(query_index + len(query) + context_length // 2, len(text))
    return text[start:end]
