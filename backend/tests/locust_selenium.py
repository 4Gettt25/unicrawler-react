from locust import HttpUser, task, between, events
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
import time

class WebUser(HttpUser):
    wait_time = between(1, 2.5)

    def on_start(self):
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Ensure GUI is off
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

        self.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=chrome_options)
        self.driver.get("http://localhost:3000/login")
        self.login()

    def on_stop(self):
        self.driver.quit()

    def login(self):
        email_input = self.driver.find_element(By.NAME, "email")
        password_input = self.driver.find_element(By.NAME, "password")
        
        email_input.send_keys("test@test.de")
        password_input.send_keys("test123")
        password_input.send_keys(Keys.RETURN)

        # Wait for redirection to /chat or for some element that indicates successful login
        time.sleep(5)  # You can improve this with WebDriverWait for a specific condition

    @task
    def chat(self):
        # Ensure you are on the chat page
        self.driver.get("http://localhost:3000/chat")
        
        chat_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='text']")
        send_button = self.driver.find_element(By.CSS_SELECTOR, "button")

        chat_input.send_keys("Hello, this is a test message.")
        send_button.click()

        # Wait for message to appear or for some confirmation
        time.sleep(2)  # You can improve this with WebDriverWait for a specific condition

@events.quitting.add_listener
def on_quitting(environment, **kwargs):
    if environment.shape_class:
        environment.shape_class.quit()
