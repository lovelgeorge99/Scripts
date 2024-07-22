# Read the project names file
op_projects_path = 'opProjects.txt'
with open(op_projects_path, 'r', encoding='utf-8') as file:
    op_projects = {line.strip() for line in file}

# Read the final-holders.txt file

allProjects=[]
final_holders_path = 'final-badgeholders.txt'
with open(final_holders_path, 'r', encoding='utf-8') as file:
    final_holders = file.readlines()

for index, line in enumerate(final_holders):
    project_name = line.strip().split('|')[0].strip()
    allProjects.append(project_name)
# Filter out projects that are not in the opProjects list
# 

c=0
for i in allProjects:
    c+=1
    if(i not in op_projects):
        print(i,c)
