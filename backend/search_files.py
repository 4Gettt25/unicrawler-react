# search_files.py
from whoosh.index import open_dir
from whoosh.qparser import QueryParser
import sqlalchemy as db

engine = db.create_engine('sqlite:///pdf_index.db')
metadata = db.MetaData()
pdf_pages = db.Table('pdf_pages', metadata, autoload=True, autoload_with=engine)
connection = engine.connect()

def search_query(query):
    query = db.select([pdf_pages]).where(pdf_pages.c.text.contains(query))
    result_proxy = connection.execute(query)
    results = result_proxy.fetchall()
    return results

