import pandas as pd
import requests

# Read the CSV file
df = pd.read_csv('agoraFinal.csv')

# Function to get user details by FID
def get_user_details(fid):
    url = f"https://client.warpcast.com/v2/user-by-fid?fid={fid}"
    response = requests.get(url)
    data = response.json()
    user_details = {
        'custodyAddress': 'N/A',
        'username': 'N/A',
        'displayName': 'N/A'
    }
    if 'result' in data:
        if 'extras' in data['result'] and 'custodyAddress' in data['result']['extras']:
            user_details['custodyAddress'] = data['result']['extras']['custodyAddress']
        if 'user' in data['result']:
            user_details['username'] = data['result']['user'].get('username', 'N/A')
            user_details['displayName'] = data['result']['user'].get('displayName', 'N/A')
    return user_details

# Create a list to store the results
results = []

for index, row in df.iterrows():
    projectID = row['project_id']
    fids = row['team_id'].split(', ')
    for fid in fids:
        user_details = get_user_details(fid)
        results.append({
            'projectID': projectID,
            'FID': fid,
            'custodyAddress': user_details['custodyAddress'],
            'username': user_details['username'],
            'displayName': user_details['displayName']
        })

# Create a new DataFrame with the results
results_df = pd.DataFrame(results)

# Save the results to a new CSV file
results_df.to_csv('output_with_custodyAddress.csv', index=False)

print("Data has been updated and stored in output_with_custodyAddress.csv")
