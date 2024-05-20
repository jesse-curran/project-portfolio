import pandas_datareader as pdr
import pandas as pd
import datetime



def get_macro_data():

    today = datetime.date.today()

    # Set your FRED API key
    pdr.fred.FredReader.api_key = "562e4d174454e09b73641aa20a5c0bed"



    # Define the macroeconomic indicators to fetch
    indicators = {
        "GDP": "GDPC1",                         # real GDP 
        "CPI": "CPIAUCSL",                      # CPI all urban
        "Unemployment_Rate": "UNRATE",          # seasonally adjusted
        "Federal_Funds_Rate": "FEDFUNDS",       # effective, not seasonal
        "10Y_Treasury_Yield": "GS10",
        "Healthcare_Expenditure": "W823RC1Q027SBEA",
        "Employment_Healthcare_Industry": "CES6562000001",
        "Pharmaceutical_and_Medicine_Manufacturing": "PCU32543254",
        "Employment_in_Nursing_and_Residential_Care": "CES6562100001",
    }
        
    '''
        ~ Future Nice to Haves Below ~
        
        # Unemployment rate
        "Unemployment_Rate_WA": "WAUR",
        "Unemployment_Rate_MT": "MTUR",
        "Unemployment_Rate_OR": "ORUR",
        "Unemployment_Rate_CA": "CAUR",
        "Unemployment_Rate_AK": "AKUR",
        "Unemployment_Rate_TX": "TXUR",

        # Healthcare expenditure 
        "Healthcare_Expenditure_WA": "WAPCEHLTHCARE",
        "Healthcare_Expenditure_MT": "MTPCEHLTHCARE",
        "Healthcare_Expenditure_OR": "ORPCEHLTHCARE",
        "Healthcare_Expenditure_CA": "CAPCEHLTHCARE",
        "Healthcare_Expenditure_AK": "AKPCEHLTHCARE",
        "Healthcare_Expenditure_TX": "TXPCEHLTHCARE",

        # Employment in healthcare industry
        "Employment_Healthcare_Industry_WA": "",
        "Employment_Healthcare_Industry_MT": "",
        "Employment_Healthcare_Industry_OR": "",
        "Employment_Healthcare_Industry_CA": "",
        "Employment_Healthcare_Industry_AK": "",
        "Employment_Healthcare_Industry_TX": "",
        
    '''


    # Define the date range for the data
    start_date = "2021-01-01"
    end_date = today

    # Fetch the data and store it in a dictionary of DataFrames
    dataframes = {}
    for name, code in indicators.items():
        dataframes[name] = pdr.get_data_fred(code, start_date, end_date)

    # Merge all DataFrames into one using pd.concat
    temp_merged_data = pd.concat(dataframes, axis=1)

    # To get a de-fragmented frame, create a copy
    merged_data = temp_merged_data.copy()

    # Define the processing functions
    def calculate_percentage_change(df, column):
        df[f"{column}_pct_change"] = df[column].pct_change() * 100
        return df

    def calculate_moving_average(df, column, window):
        df[f"{column}_MA{window}"] = df[column].rolling(window=window).mean()
        return df

    def calculate_ytd_change(df, column):
        ytd_change = df[column].groupby(df.index.year).apply(lambda x: (x / x.iloc[0] - 1) * 100).reset_index(level=0, drop=True)
        df[f"{column}_YTD_change"] = ytd_change
        return df


    def calculate_yoy_change(df, column):
        yoy_change = df[column].pct_change(periods=12) * 100
        df[f"{column}_YoY_change"] = yoy_change
        return df

    # Apply processing to the columns
    for column in merged_data.columns:
        # Calculate percentage change
        merged_data = calculate_percentage_change(merged_data, column)

        # Calculate moving averages
        merged_data = calculate_moving_average(merged_data, column, 3)

        # Calculate YTD and YoY changes
        merged_data = calculate_ytd_change(merged_data, column)
        merged_data = calculate_yoy_change(merged_data, column)

    # Fill NaN values with the appropriate method (forward fill or backward fill)
    merged_data = merged_data.fillna(method='ffill').fillna(method='bfill')

    print(merged_data.head())

    output_file_csv = '/Users/jessecurran/CS361/macro-dashboard/macro_data.csv'
    merged_data.to_csv(output_file_csv)

    output_file_excel = '/Users/jessecurran/CS361/macro-dashboard/macro_data.xlsx'
    merged_data.to_excel(output_file_excel)

    output_file_json = '/Users/jessecurran/CS361/macro-dashboard/macro_data.json'
    merged_data.to_json(output_file_json)

    return 


