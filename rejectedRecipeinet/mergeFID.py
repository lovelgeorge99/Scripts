import pandas as pd

# Load the first CSV file which contains only ids
csv_file_1 = 'output_with_id.csv'
df1 = pd.read_csv(csv_file_1)

# Load the second CSV file which contains ids and fids
csv_file_2 = 'agoraTeamFID.csv'
df2 = pd.read_csv(csv_file_2)

# Merge the two DataFrames on the 'id' column
merged_df = pd.merge(df1, df2, on='id', how='inner')

# Select only the 'id' and 'fid' columns from the merged DataFrame
result_df = merged_df[['id', 'fid']]

# Save the results to a new CSV file
result_csv_file = 'common_ids_with_fids.csv'
result_df.to_csv(result_csv_file, index=False)

print(f'Process completed. Results saved to {result_csv_file}')
