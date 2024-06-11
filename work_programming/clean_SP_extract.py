import pandas as pd
import os
import openpyxl

# Function to filter internal emails from a dataframe based on filter list
def filter_internal_emails(df, filter_list):
    return df[~df["User/Group"].str.lower().isin(filter_list)]

# Function to load and filter division dataframes
def load_and_filter_divisions(df, divisions, filter_list):
    region = []
    for division in divisions:
        div_df = df[df["Path"].str.contains(division)]
        filtered_div_df = filter_internal_emails(div_df, filter_list)
        region.append(filtered_div_df)
    return region

# Function to save dataframes to an Excel file
def save_to_excel(writer, divisions, region):
    for division, div_df in zip(divisions, region):
        div_df.to_excel(writer, sheet_name=division, index=False)

# Load permissions data
df = pd.read_csv('all_current_matrix_permissions.csv')

# Drop rows with null values
df = df.dropna()

# Define divisions
divisions = ["Central", "HCC", "Managed", "North", "South"]

# Filter internal emails
emails = ""
filter_list = [email.strip().lower() for email in emails.split(";")]

# Load and filter division dataframes
region = load_and_filter_divisions(df, divisions, filter_list)

# Prepare for comparison
try:
    os.remove("matrix_yesterday.xlsx")
except:
    print("Error in deleting yesterday file")

try:
    os.rename("matrix_today.xlsx", "matrix_yesterday.xlsx")
except:
    print("Error in renaming file")

wb = openpyxl.Workbook()
wb.save(filename='matrix_today.xlsx')

# Save the filtered dataframes to Excel
with pd.ExcelWriter('matrix_today.xlsx', engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
    save_to_excel(writer, divisions, region)

# Load yesterday's data for comparison
region_y = [pd.read_excel("matrix_yesterday.xlsx", sheet_name=division) for division in divisions]

# Add a marker column to yesterday's data
for div_df in region_y:
    div_df["rm"] = "rm"

# Combine today's and yesterday's data
combined_list = region + region_y
combined_list = [div_df.drop_duplicates() for div_df in combined_list]
diff_df = pd.concat(combined_list).drop_duplicates(subset=["Permission", "Path", "User/Group"], keep=False)

# Extract division from path and prepare the final dataframe
diff_df["Divisions"] = diff_df["Path"].apply(lambda x: x.split("\\")[1])
team_df = diff_df[diff_df["rm"] != "rm"].loc[:, ["Path", "User/Group", "Divisions"]].drop_duplicates()
diff_df = diff_df[diff_df["rm"] != "rm"].loc[:, ["User/Group", "Divisions", "rm"]].drop_duplicates()
diff_df = diff_df.rename(columns={"User/Group": "Email"})

# Save the final differences to CSV
diff_df.to_csv('daily_matrix_add.csv', index=False)

# Define the path to the directory for saving the team dataframe
dir_path = os.path.join('..\\'*3, 'Admin', 'Accountability Matrix-2025 Ministry Level')
filename_team = '2025_Budget_Scrape.csv'

# Check if the directory exists and save the team dataframe
if not os.path.exists(dir_path):
    print(f"Directory does not exist: {dir_path}")
else:
    team_df.to_csv(os.path.join(dir_path, filename_team), index=False)
