import os
import xlwings as xw
import pandas as pd
import time

def write_ex(template_sheet, path):
    """
    details
    """
    # Define the path to the template and the target workbook
    target_path = path

    # Open both workbooks
    target_wb = xw.Book(target_path)

    # Define the sheets from the template and the target workbook
    target_sheet = target_wb.sheets['Instruction']

    # Copy over the sheet instructions in specified cell range

    template_sheet.range('B7:K27').copy(target_sheet.range('B7:K27'))

    # Save and close the target workbook
    target_wb.save()
    target_wb.close()

def main():
    """
    Drive instruction update function write_ex.
    Loops through each file path and updates the instructions.
    """
    # open template instructions, pass into loop to copy/paste
    template_path = 'Template Pre-Budget Workforce Tagging.xlsx'
    template_wb = xw.Book(template_path)
    template_sheet = template_wb.sheets['Instruction']

    # update user name as needed
    user_name_str = 'ahsin.saleem'

    # read path of files to copy/paste
    paths = pd.read_csv("Path.csv")
    paths = paths[paths["Path"].str.contains("Texas")]   
    for index, row in paths.iterrows():
        folder = row["Path"][17:]
        entity = row["Path"].split("\\")[3][:4]
        file = f'{entity} Pre-Budget Workforce Tagging.xlsx'
        p = os.path.join('C:', os.sep, 'Users', user_name_str,
                         'Providence St. Joseph Health', '2025 Budget - Documents', folder, file)
        print(p)
        write_ex(template_sheet, p)

    template_wb.app.quit()

start = time.time()
main()
stop = time.time()
print(f'The program ran in {stop - start:.02f} seconds')
