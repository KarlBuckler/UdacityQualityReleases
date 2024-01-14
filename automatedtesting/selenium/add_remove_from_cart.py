# #!/usr/bin/env python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
import datetime

def timestamp():
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return (ts + '\t')


def add_all_product(driver):

    print(timestamp() +"Get all product by css selector")
    products_count = len(driver.find_elements(By.CSS_SELECTOR, "div.inventory_item"))
    print(timestamp() +"Product count: " + str(products_count))

    print(timestamp() +"Add products to shopping cart")
    numbOfProduct = 0
    while (numbOfProduct < products_count):
        productName = driver.find_element(By.CSS_SELECTOR, "a[id='item_" + str(numbOfProduct) + "_title_link'] > div.inventory_item_name").text
        productName = productName.replace(" ", "-").lower()
        print(timestamp()+"Add product:" + productName)
        driver.find_element(By.ID, "add-to-cart-" + productName).click()
        numbOfProduct = numbOfProduct + 1

    print(timestamp() +"Product added: " + str(numbOfProduct))
    print(timestamp() +"Click on shopping cart icon")
    driver.find_element(By.CSS_SELECTOR, "a.shopping_cart_link").click()

    print(timestamp() +"Find and count product in shopping cart")
    product_added = len(driver.find_elements(By.CLASS_NAME, "cart_item"))
    assert product_added == numbOfProduct

    print(timestamp() +"Added all products successfully.")

def remove_product_from_cart(driver):

    print(timestamp() +"Find all item to remove from shopping cart")
    products_count = len(driver.find_elements(By.CLASS_NAME, "cart_item"))
    print(timestamp() +"Product count: " + str(products_count))

    numbOfProduct = 0
    while (numbOfProduct < products_count):
        productName = driver.find_element(By.CSS_SELECTOR, "a[id='item_" + str(numbOfProduct) + "_title_link'] > div.inventory_item_name").text
        productName = productName.replace(" ", "-").lower()
        print(timestamp() +"Remove product:" + productName)
        driver.find_element(By.ID, "remove-" + productName).click()
        numbOfProduct = numbOfProduct + 1

    print(timestamp() +"Product removed: " + str(numbOfProduct))
    products_exitst = len(driver.find_elements(By.CLASS_NAME, "cart_item"))
    print(timestamp() +"Products existed in cart " + str(products_exitst))
    assert products_exitst == 0
    print(timestamp() +"Removed all products successfully.")