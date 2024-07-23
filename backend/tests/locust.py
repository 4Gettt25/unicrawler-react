from locust import HttpUser, task, between

class QuickstartUser(HttpUser):
    wait_time = between(1, 2.5)
    base_url = "http://localhost:3000"

    def on_start(self):
        self.login()

    def login(self):
        response = self.client.post(
            url=f"{self.base_url}/login",
            json={"email": "test@test.de", "password": "test123"},
            headers={"Content-Type": "application/json"}
        )
        if response.status_code == 200:
            print("Login successful")
        else:
            print(f"Login failed: {response.status_code}")

    @task
    def chat(self):
        # Assuming that the login sets a session cookie, which is maintained by the client
        response = self.client.post(
            url=f"{self.base_url}/chat",
            json={"message": "Hello, this is a test message."},
            headers={"Content-Type": "application/json"}
        )
        if response.status_code == 200:
            print("Chat message sent successfully")
        else:
            print(f"Failed to send chat message: {response.status_code}")
