import pandas as pd

# Load the two Excel files
df1 = pd.read_csv('Daily_Accountibility_Matrix_Access\CC_User_Add\Today_Accountability_CC_Output.csv')
df2 = pd.read_csv('Daily_Accountibility_Matrix_Access\CC_User_Add\Yesterday_Accountability_CC_Output.csv')

# Ensure that the dataframes are sorted in the same way
df1.sort_values(by=list(df1.columns), inplace=True)
df2.sort_values(by=list(df2.columns), inplace=True)

df2["rm"] = "rm"

# Find the rows which are different between the dataframes

df1 = df1.drop_duplicates()
df2 = df2.drop_duplicates()

diff = pd.concat([df1,df2]).drop_duplicates(subset=['Division','Region','Entity','Ministry','Permission_Type','User','Full_Path'], keep=False)

#Rename and columns and create output files
diff = diff.rename(columns={"Full_Path": "Path", "User": "Email", "Division": "Division"})
diff = diff.fillna("")
diff[diff['rm'] == ""].loc[:,["Path", "Email", "Division"]].to_csv('Daily_Accountibility_Matrix_Access\CC_User_Add\daily_matrix_add.csv', index=False)
diff[diff['rm'] != ""].loc[:,["Path", "Email", "Division", "rm"]].to_csv('Daily_Accountibility_Matrix_Access\CC_User_Add\daily_matrix_rm.csv', index=False)
