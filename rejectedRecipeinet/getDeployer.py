import pandas as pd
import requests

# Input and output file paths
input_file_path = './link_output.csv'  # Replace with your actual input CSV file path
output_file_path = 'deployerAddress.csv'  # Output CSV file path

# Read the input CSV file into a pandas DataFrame
df = pd.read_csv(input_file_path)

# Function to fetch deployer addresses from the JSON data at a given link
def get_deployer_addresses(link):
    try:
        response = requests.get(link)
        data = response.json()
        
        # Extract deployer addresses from the JSON data
        # deployer_addresses = [contract['deployerAddress'] for contract in data.get('contracts', [])]
        deployer_addresses = {contract['deployerAddress'] for contract in data.get('contracts', [])}

        
        # Join the deployer addresses into a single string separated by commas
        deployer_addresses_str = ', '.join(deployer_addresses)
        
        return deployer_addresses_str
    except Exception as e:
        print(f"Failed to fetch data for link {link}: {e}")
        return ''

# Apply the function to each row in the DataFrame
df['Deployer Addresses'] = df['LINK'].apply(get_deployer_addresses)

# Write the updated DataFrame to a new CSV file
df.to_csv(output_file_path, index=False)

print('Deployer addresses have been added and the new CSV is saved as griffLogicWithDeployerAddresses.csv')
