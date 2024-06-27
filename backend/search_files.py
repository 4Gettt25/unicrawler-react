# search_files.py
from whoosh.index import open_dir
from whoosh.qparser import QueryParser

def search_query(query):
    index = open_dir("indexdir")
    searcher = index.searcher()
    parser = QueryParser("content", index.schema)
    q = parser.parse(query)
    results = searcher.search(q, limit=None)
    return [{"file_path": r["file_path"], "context": r.highlights("content")} for r in results]
