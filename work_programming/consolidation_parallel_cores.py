import pandas as pd
import os
import time
import datetime
from joblib import Parallel, delayed

start = time.time()

paths = pd.read_csv("Path.csv")
user_name_str = 'jesse.curran'

df_lis = []

def process_file(row):
    folder = row["Path"][17:]
    entity = row["Path"].split("\\")[3][:4]
    file = f'{entity} Budget Metadata Review.xlsx'
    # Create the full path
    p = os.path.join('C:', os.sep, 'Users', user_name_str, 'Providence St. Joseph Health', '2025 Budget - Documents', folder, file)
    #df = pd.read_excel(p, sheet_name="Update Log")
    try:
        df = pd.read_excel(p, sheet_name="6. New Cost Centers", skiprows=range(5))
        #print("Sheet read successfully!")
    except FileNotFoundError:
        print(f"The {file} was not found. Please check the file path {p}.")
    except ValueError as e:
        print(f"ValueError: {e}. File: {file}, Path: {p}")
        #print("This error may occur if the 'Update Log' sheet does not exist. Please check the sheet name.")
    except Exception as e:
        print(f"An error occurred: {e}")
        
    df["Path"] = p[17:].split("\\")[-1]
    return df
    
    
df_lis = Parallel(n_jobs=-1, verbose=10)(delayed(process_file)(row) for _, row in paths.iterrows())
    
cons_df = pd.concat(df_lis)

S_File = 'Admin\PBI\LOADS\Consolidated_New_CC.csv'
s_path = os.path.join('C:', os.sep, 'Users', user_name_str, 'Providence St. Joseph Health', '2025 Budget - Documents', S_File)
cons_df.to_csv(s_path, index=False)

stop = time.time()

file = open(fr'C:\Users\{user_name_str}\Providence St. Joseph Health\2025 Budget - Documents\Test\Consolidation_Scripts\running_log.txt', 'a')

file.write(f'{datetime.datetime.now()} - The UPDATE LOG script ran in {(stop - start):.02f}\n')

file.close()
