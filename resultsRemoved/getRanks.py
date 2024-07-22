import pandas as pd


excel_path = 'result.xlsx'
df = pd.read_excel(excel_path)

# Read the text file
txt_path = 'filtered_final_badgeholders.txt'
with open(txt_path, 'r',encoding='utf-8') as file:
    lines = file.readlines()

rankings = {}
for index, line in enumerate(lines):
    project_name = line.strip().split('|')[0].strip()
    print(project_name)
    rankings[project_name] = index + 1  


# Add a new column for rankings in the DataFrame
df['PW Badgeholders Ranking'] = df['Project Name'].map(rankings)

# Save the updated Excel file
output_path = 'result.xlsx'
df.to_excel(output_path, index=False)

