# #!/usr/bin/env python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
import add_remove_from_cart
from add_remove_from_cart import timestamp

# Start the browser and login with standard_user
def login (user, password):
    print (timestamp() +'Starting the browser...')
    # --uncomment when running in Azure DevOps.
    options = ChromeOptions()
    options.add_argument("--headless") 
    driver = webdriver.Chrome(options=options)
    print (timestamp() +'Browser started successfully. Navigating to the demo page to login.')
    driver.get('https://www.saucedemo.com/')

    print(timestamp() +'Starting login...')
    print(timestamp() +'Input username: ' + user +  ' and password: ' + password )
    driver.find_element(By.CSS_SELECTOR, "input[id='user-name']").send_keys(user)
    driver.find_element(By.CSS_SELECTOR, "input[id='password']").send_keys(password)

    print(timestamp() +'click login')
    driver.find_element(By.ID, "login-button").click()

    print(timestamp() +'find products label')
    products_label =  driver.find_element(By.CSS_SELECTOR, "div[id='header_container'] > .header_secondary_container > .title").text
    assert "Products" in products_label

    print(timestamp() +'Login successfully!')
    return driver

print(timestamp() +"---------------Run Login Test----------------")
driver = login('standard_user', 'secret_sauce')
print(timestamp() +"------------Run Add Products Test------------")
add_remove_from_cart.add_all_product(driver)
print(timestamp() +"----------Run Remove Products Test-----------")
add_remove_from_cart.remove_product_from_cart(driver)
driver.quit()
print(timestamp() +"Testing finish.")