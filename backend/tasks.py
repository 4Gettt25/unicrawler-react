# tasks.py
from celery import Celery
from search_files import search_query

app = Celery('tasks', broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')

@app.task
def async_search(query):
    return search_query(query)
