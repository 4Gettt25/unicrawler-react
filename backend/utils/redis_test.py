import redis

def test_redis_connection():
    r = redis.Redis(host='localhost', port=6379, db=0)
    try:
        r.ping()
        print("Connected to Redis")
    except redis.ConnectionError as e:
        print(f"Redis connection error: {e}")

test_redis_connection()
