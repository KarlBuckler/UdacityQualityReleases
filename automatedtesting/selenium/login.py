# #!/usr/bin/env python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
import add_remove_from_cart

# Start the browser and login with standard_user
def login (user, password):
    return