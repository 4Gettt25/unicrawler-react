# tasks.py
from celery import Celery
from search_files import search_query

app = Celery('tasks', broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')

# Add broker connection retry settings to address the warning
app.conf.update(
    broker_connection_retry_on_startup=True)

@app.task
def async_search(query):
    try:
        return search_query(query)
    except Exception as e:
        # handle the exception here
        print(f"An error occurred: {e}")