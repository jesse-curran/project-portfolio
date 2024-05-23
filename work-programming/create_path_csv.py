import os
import pandas as pd

df = pd.read_excel("Python_scripts\Entity Listing_Model Flag.xlsx")

def create_path(directory, folder_name):
    path = os.path.join(directory, folder_name)
    return f"Shared Documents{path[23:]}"
    

directory = f"2025 Budget - Documents"

Region_dic = (df.groupby("Division")["Region"].apply(set)).to_dict()

entity_dic = (df.groupby("Region")["ENTITY DESCRIPTION"].apply(set)).to_dict()
path = []

for divis, regions in Region_dic.items():
    path.append(create_path(directory, divis))
    directory1 = f"2025 Budget - Documents\{divis}"
    for region in regions:
        path.append(create_path(directory1, region))
        directory2 = f"2025 Budget - Documents\{divis}\{region}"
        for entity in entity_dic[region]:
            path.append(create_path(directory2, entity))

# Create a DataFrame from the list of paths
df_paths = pd.DataFrame(path, columns=['Path'])

# Write the DataFrame to a CSV file
df_paths.to_csv("Python_scripts\Path.csv", index=False)
