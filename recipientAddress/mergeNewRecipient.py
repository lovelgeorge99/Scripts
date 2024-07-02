import pandas as pd

df1 = pd.read_csv('data.csv')  # CSV with user address, badge point, recipient point, amount
df2 = pd.read_csv('agoraRecipients.csv')    # CSV with only user address having recipient point

# Ensure the column names match the example
df1.columns = ['User', 'holderPoints', 'delegatePoints', 'recipientsPoints','badgeholderPoints','holderType','delegateType','holderAmount','delegateAmount']
df2.columns = ['address']

df1['holderType'] = df1['holderType'].fillna('null')
df1['delegateType'] = df1['delegateType'].fillna('null')
# Set recipient points to 1 for addresses in the second CSV
# df1['recipientsPoints'] = df1['User'].apply(lambda x: 1 if x in df2['address'].values else df1.loc[df1['User'] == x, 'recipientsPoints'].values[0])

df1.loc[df1['User'].isin(df2['address']), 'recipientsPoints'] = 1

new_addresses = df2[~df2['address'].isin(df1['User'])]
new_addresses = new_addresses.rename(columns={'address': 'User'})
new_addresses['holderPoints'] = 0
new_addresses['delegatePoints'] = 0
new_addresses['recipientsPoints'] = 1
new_addresses['badgeholderPoints'] = 0
new_addresses['holderType'] = 'null'
new_addresses['delegateType'] = 'null'
new_addresses['holderAmount'] = 0
new_addresses['delegateAmount'] = 0

# Combine the original and new DataFrames
combined_df = pd.concat([df1, new_addresses], ignore_index=True)

# Save the results to a new CSV file
combined_df.to_csv('merged_output.csv', index=False)

print("Data has been merged and stored in merged_output.csv")