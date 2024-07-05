import pytest
from flask import Flask
from server import app as flask_app

@pytest.fixture
def app():
    yield flask_app

@pytest.fixture
def client(app):
    return app.test_client()

def test_query_endpoint(client):
    response = client.post('/query', json={'query': 'test search'})
    assert response.status_code == 200
    data = response.get_json()
    assert 'task_id' in data

def test_results_endpoint(client, mocker):
    # Mocking the async_search.AsyncResult to control its behavior
    mock_task = mocker.Mock()
    mock_task.state = 'SUCCESS'
    mock_task.result = ['result1.pdf', 'result2.pdf']
    mocker.patch('server.async_search.AsyncResult', return_value=mock_task)
    
    response = client.get('/results/fake_task_id')
    assert response.status_code == 200
    data = response.get_json()
    assert data['state'] == 'SUCCESS'
    assert 'pdf_results' in data
    assert data['pdf_results'] == ['result1.pdf', 'result2.pdf']

def test_download_file_endpoint(client, mocker):
    # Mocking the send_from_directory to simulate file sending
    mocker.patch('server.send_from_directory', return_value='mocked file content')

    response = client.get('/pdfs/fake_file.pdf')
    assert response.status_code == 200
    assert response.data == b'mocked file content'

    # Test file not found
    mocker.patch('server.send_from_directory', side_effect=FileNotFoundError)
    response = client.get('/pdfs/non_existent_file.pdf')
    assert response.status_code == 404
    data = response.get_json()
    assert 'error' in data
    assert data['error'] == 'File not found'
