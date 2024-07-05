from flask import Flask, request, jsonify
from sqlalchemy import create_engine, MetaData, Table, select

app = Flask(__name__)
DATABASE_URI = 'sqlite:///pdf_index.sqlite'
engine = create_engine(DATABASE_URI)
metadata = MetaData()
pdf_pages = Table('pdf_pages', metadata, autoload=True, autoload_with=engine)

@app.route('/query', methods=['POST'])
def query_text():
    data = request.json
    query = data['query']
    connection = engine.connect()
    s = select([pdf_pages]).where(pdf_pages.c.text.like(f'%{query}%'))
    result = connection.execute(s).fetchall()
    connection.close()

    results = [
        {
            "pdf_path": row['pdf_path'],
            "page_number": row['page_number'],
            "text": row['text']
        }
        for row in result
    ]

    return jsonify(results=results)

if __name__ == '__main__':
    app.run(debug=True)
