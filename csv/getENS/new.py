import pandas as pd
import requests
import concurrent.futures

# Function to fetch ENS name from the address
def get_ens_name(address):
    print(address)
    try:
        url = f'https://api.ensideas.com/ens/resolve/{address}'
        response = requests.get(url)  # Set a timeout of 10 seconds
        response.raise_for_status()
        response_data = response.json()
        return address, response_data.get('name', 'No ENS')
    except requests.exceptions.Timeout:
        print(f"Timeout for address {address}")
        return address, 'Timeout'
    except requests.exceptions.RequestException as e:
        print(f"RequestException for address {address}: {e}")
        return address, 'Request Error'
    except Exception as e:
        print(f"Exception for address {address}: {e}")
        return address, 'Error'

# Function to fetch ENS names concurrently
def fetch_ens_names(addresses):
    ens_names = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=100) as executor:
        future_to_address = {executor.submit(get_ens_name, address): address for address in addresses}
        for future in concurrent.futures.as_completed(future_to_address):
            address, ens_name = future.result()
            ens_names[address] = ens_name
    return ens_names

# Main function to process the Excel file
def process_sheet(input_file_path, output_file_path):
    # Read the Excel file
    df = pd.read_excel(input_file_path)

    # Get list of addresses
    addresses = df['User'].dropna().unique()

    # Fetch ENS names concurrently
    ens_names = fetch_ens_names(addresses)

    # Add a new column for ENS names
    df['ENS Name'] = df['User'].apply(lambda address: ens_names.get(address, 'No Address'))

    # Write the updated DataFrame to a new Excel file
    df.to_excel(output_file_path, index=False)

# Run the script
input_file_path = './data.xlsx'  # Path to your input file
output_file_path = './output.xlsx'  # Path to your output file

process_sheet(input_file_path, output_file_path)
print("Processing complete!")
