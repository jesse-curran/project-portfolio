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
    }

    # Define the date range for the data
    start_date = "2023-01-01"
    end_date = "2023-12-31"

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

    #merged_data.head()

    output_file_csv = '/Users/jessecurran/my-programs/macroecon_indicators/macro_data.csv'
    merged_data.to_csv(output_file_csv)

    output_file_excel = '/Users/jessecurran/my-programs/macroecon_indicators/macro_data.xlsx'
    merged_data.to_excel(output_file_excel)

    output_file_json = '/Users/jessecurran/my-programs/macroecon_indicators/macro_data.json'
    merged_data.to_json(output_file_json)

    return 


