import pytest
from tasks import async_search
from unittest.mock import patch

# Test for success
def test_async_search_success():
    query = "test search"
    expected_results = ["result1.pdf", "result2.pdf"]
    
    with patch('tasks.search_query', return_value=expected_results):
        results = async_search(query)
        assert results == expected_results
        
# Test for exception
def test_async_search_exception():
    query = "test search"
    
    with patch('tasks.search_query', side_effect=Exception("Test exception")):
        results = async_search(query)
        assert results == []

# Test for no results
def test_async_search_no_results():
    query = "no results query"
    expected_results = []
    
    with patch('tasks.search_query', return_value=expected_results):
        results = async_search(query)
        assert results == expected_results
