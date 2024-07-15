import pandas as pd
import requests
import concurrent.futures

# Function to get ENS name from the address
def get_ens_name(address):
    print(address)
    url = f"https://api.ensideas.com/ens/resolve/{address}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data.get('name', None)
        else:
            return None
    except Exception as e:
        return None

# Read the Excel file
file_path = "data.xlsx"  # Update with your file path
df = pd.read_excel(file_path, sheet_name='data')  # Update sheet name if necessary

# Ensure 'User' column exists
if 'User' not in df.columns:
    raise ValueError("The sheet does not contain a 'User' column with addresses.")

addresses = df['User'].tolist()

# Using ThreadPoolExecutor to handle multiple requests concurrently
with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
    ens_names = list(executor.map(get_ens_name, addresses))

# Add the ENS names to a new column in the dataframe
df['ENS_Name'] = ens_names

# Save the updated dataframe to a new Excel file
output_file_path = "updated_excel_file.xlsx"  # Update with your desired output file path
df.to_excel(output_file_path, index=False)

print(f"ENS names have been resolved and saved to {output_file_path}.")
