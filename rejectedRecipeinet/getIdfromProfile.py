import pandas as pd
import requests

# Load the CSV file
csv_file = 'profileID.csv'
df = pd.read_csv(csv_file)

# Assuming your CSV has a column named 'id'
ids = df['id'].tolist()

# Initialize an empty list to store the results
results = []

# Iterate over each ID
for pid in ids:
    # Construct the URL
    url = f'https://round4-api-eas.retrolist.app/projects/{pid}'
    
    # Send a request to the URL
    response = requests.get(url)
    
    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()
        
        # Extract the displayName
        id = data.get('id', 'N/A')
        
        # Append the result to the list
        results.append({'profileID': pid, 'id': id})
    else:
        # Append the result with an error message
        results.append({'profileID': pid, 'id': 'Error fetching data'})

# Create a DataFrame from the results
result_df = pd.DataFrame(results)

# Save the results to a new CSV file
result_df.to_csv('output_with_id.csv', index=False)

print('Process completed. Results saved to output_with_display_names.csv')
