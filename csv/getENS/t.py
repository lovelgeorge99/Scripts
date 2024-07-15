import pandas as pd
import requests

# Function to fetch ENS name from the address
def get_ens_name(address):
    print(address)
    try:
        url = f'https://api.ensideas.com/ens/resolve/{address}'
        response = requests.get(url)
        response_data = response.json()
        return response_data.get('name', 'No ENS')
    except Exception as e:
        return 'Error'

# Main function to process the Excel file
def process_sheet(input_file_path, output_file_path):
    # Read the Excel file
    df = pd.read_excel(input_file_path)

    # Add a new column for ENS names
    df['ENS Name'] = df['User'].apply(lambda address: get_ens_name(address) if pd.notnull(address) else 'No Address')
   

    # Write the updated DataFrame to a new Excel file
    df.to_excel(output_file_path, index=False)

# Run the script
input_file_path = './data.xlsx'  # Path to your input file
output_file_path = './output.xlsx'  # Path to your output file

process_sheet(input_file_path, output_file_path)
print("Processing complete!")
