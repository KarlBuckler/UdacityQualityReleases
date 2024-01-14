# #!/usr/bin/env python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager

import add_remove_from_cart


# Start the browser and login with standard_user
def login (user, password):
    print ('Starting the browser...')
    # --uncomment when running in Azure DevOps.
    options = ChromeOptions()
    options.add_argument("--headless") 
    driver = webdriver.Chrome(options=options,service=ChromeService(ChromeDriverManager(version='114.0.5735.90').install()))
    # driver = webdriver.Chrome(options=options)
    # driver = webdriver.Chrome()
    print ('Browser started successfully. Navigating to the demo page to login.')
    driver.get('https://www.saucedemo.com/')

    print('Starting login...')
    print('Input username: ' + user +  ' and password: ' + password )
    driver.find_element(By.CSS_SELECTOR, "input[id='user-name']").send_keys(user)
    driver.find_element(By.CSS_SELECTOR, "input[id='password']").send_keys(password)

    print('click login')
    driver.find_element(By.ID, "login-button").click()

    print('find products label')
    products_label =  driver.find_element(By.CSS_SELECTOR, "div[id='header_container'] > .header_secondary_container > .title").text
    assert "Products" in products_label

    print('Login successfully!')
    return driver

print("---------------Run Login Test----------------")
driver = login('standard_user', 'secret_sauce')
print("------------Run Add Products Test------------")
add_remove_from_cart.add_all_product(driver)
print("----------Run Remove Products Test-----------")
add_remove_from_cart.remove_product_from_cart(driver)
print("Testing finish.")