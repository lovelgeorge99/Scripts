import requests
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager


csv_file_path = 'profileID.csv'
df = pd.read_csv(csv_file_path)

# Assuming the CSV file has a column named 'profile_id'
ids = df['profile_id'].tolist()


options = webdriver.ChromeOptions()
options.add_argument('--headless')  # Run in headless mode
driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)

results = []


for id_value in ids:
    # Step 2: Use Selenium to load the second URL
    url_2 = f"https://optimism.easscan.org/attestation/view/{id_value}"
    driver.get(url_2)
    
    # Wait for the page to fully load
    driver.implicitly_wait(10)  # seconds
    
    # Step 3: Extract the second element with the specified class
    try:
        elements = driver.find_elements(By.CLASS_NAME, "DecodedAttestationValue__Output-sc-r2j0qb-3.jbpDTY")
        if len(elements) > 1:
            fid_value=elements[1].text.strip()
            link = elements[6].text.strip()

        else:
            fid_value = 'N/A'
            link= 'N/A'
    except Exception as e:
        fid_value = 'Error: ' + str(e)
    
    # Store the result
    results.append({'ID': id_value, 'FID':fid_value,'LINK': link})

driver.quit()

df = pd.DataFrame(results)
df.to_csv('./link_output.csv', index=False)

# print("Data has been stored in output.csv")