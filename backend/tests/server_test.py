import unittest
from unittest.mock import patch
from flask import url_for
from server import app

class TestFlaskApi(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch('tasks.async_search.apply_async')
    def test_query_endpoint(self, mock_async_search):
        mock_async_search.return_value = type('obj', (object,), {'id': '12345'})
        response = self.app.post('/query', json={'query': 'test query'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('task_id', response.json)

    @patch('tasks.async_search.apply_async')
    def test_query_endpoint_no_query(self, mock_async_search):
        mock_async_search.return_value = type('obj', (object,), {'id': '12345'})
        response = self.app.post('/query', json={})
        self.assertEqual(response.status_code, 200)
        self.assertIn('task_id', response.json)

    @patch('tasks.async_search.AsyncResult')
    def test_results_endpoint_success(self, mock_AsyncResult):
        mock_task = mock_AsyncResult.return_value
        mock_task.state = 'SUCCESS'
        mock_task.result = ['result1.pdf', 'result2.pdf']
        response = self.app.get('/results/12345')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"pdf_results": mock_task.result, "state": mock_task.state})

    @patch('tasks.async_search.AsyncResult')
    def test_results_endpoint_invalid_task(self, mock_AsyncResult):
        mock_task = mock_AsyncResult.return_value
        mock_task.state = 'PENDING'
        response = self.app.get('/results/invalid_task_id')
        self.assertEqual(response.status_code, 200)
        self.assertIn('state', response.json)

    @patch('os.path.isfile')
    @patch('flask.send_from_directory')
    def test_pdfs_endpoint_valid_file(self, mock_send_from_directory, mock_isfile):
        mock_isfile.return_value = True
        mock_send_from_directory.return_value = 'File content'
        response = self.app.get('/pdfs/test.pdf')
        self.assertEqual(response.status_code, 200)

    @patch('os.path.isfile')
    def test_pdfs_endpoint_invalid_file(self, mock_isfile):
        mock_isfile.return_value = False
        response = self.app.get('/pdfs/invalid.pdf')
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json)

if __name__ == '__main__':
    unittest.main()