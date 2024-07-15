import pandas as pd
import requests
import concurrent.futures

# Function to get ENS name from the address
def get_ens_name(address):
    try:
        url = f"https://api.simplehash.com/api/v0/ens/reverse_lookup?wallet_addresses={address}"
        headers = {
            "accept": "application/json",
            "X-API-KEY": ''
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            
            return data[0]['ens'] 
        else:
            return 'No ENS'
    except Exception as e:
        print(f"Error fetching ENS name for {address}: {e}")
        return 'Error'

# Read the Excel file
file_path = "data.xlsx"  # Update with your file path
df = pd.read_excel(file_path, sheet_name='data')  # Update sheet name if necessary

# Ensure 'User' column exists
if 'User' not in df.columns:
    raise ValueError("The sheet does not contain a 'User' column with addresses.")

addresses = df['User'].tolist()

# Process addresses in batches to handle large data efficiently
batch_size = 500  # Adjust batch size as needed
results = []

for i in range(0, len(addresses), batch_size):
    batch = addresses[i:i + batch_size]
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        ens_names_batch = list(executor.map(get_ens_name, batch))
    results.extend(ens_names_batch)
    print(f"Processed batch {i // batch_size + 1} of {len(addresses) // batch_size + 1}")

# Add the ENS names to a new column in the dataframe
df['ENS_Name'] = results

# Save the updated dataframe to a new Excel file
output_file_path = "updated_excel_file_simple.xlsx"  # Update with your desired output file path
df.to_excel(output_file_path, index=False)

print(f"ENS names have been resolved and saved to {output_file_path}.")
