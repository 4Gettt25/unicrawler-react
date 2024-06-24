import requests
from bs4 import BeautifulSoup
import os

# Set the URL and directory for downloading files
url = "https://example.com"
download_dir = "..\downloads"

# Create the download directory if it doesn't exist
if not os.path.exists(download_dir):
    os.makedirs(download_dir)

def download_file(url, file_path, download_dir):
    try:
        response = requests.get(url, stream=True)
        with open(os.path.join(download_dir, file_path), 'wb') as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
        print(f"Downloaded {file_path} to {download_dir}")
    except Exception as e:
        print(f"Error downloading {file_path}: {str(e)}")

def scrape_files(url, download_dir):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find all links with specific extensions (e.g. PDFs, XLSX)
    file_links = soup.find_all('a', href=True)

    for link in file_links:
        file_path = link['href']
        file_ext = os.path.splitext(file_path)[1].lower()

        if file_ext in ['.pdf', '.xlsx', '.docx', '.txt']:
            download_file(urljoin(url, file_path), file_path, download_dir)

if __name__ == "__main__":
    scrape_files(url, download_dir)