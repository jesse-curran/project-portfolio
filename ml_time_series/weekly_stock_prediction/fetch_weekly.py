import requests
import pandas as pd

def fetch_data(symbol, api_key, last_n_weeks=None):
    """
    Fetch Weekly Stock Adjusted Time Series Data via Alpha Vantage API.
    
    Parameters:
    symbol (str): Stock symbol to fetch data for.
    api_key (str): API key for Alpha Vantage API.
    last_n_weeks (int, optional): Number of recent weeks to fetch. Fetches all data if not specified.
    
    Returns:
    pd.DataFrame: DataFrame containing weekly stock data.
    """
    # Define the Alpha Vantage API endpoint and parameters
    api_url = 'https://www.alphavantage.co/query'
    params = {
        'function': 'TIME_SERIES_WEEKLY_ADJUSTED',
        'symbol': symbol,
        'apikey': api_key
    }

    # Fetch the data from Alpha Vantage API
    response = requests.get(api_url, params=params)
    data = response.json()

    # Check if the data contains the 'Weekly Time Series' key
    if 'Weekly Adjusted Time Series' not in data:
        raise ValueError("Error fetching data. Check the API key and symbol.")

    # Extract weekly time series data
    weekly_data = data.get('Weekly Adjusted Time Series', {})

    # Convert the weekly data to a pandas DataFrame
    df = pd.DataFrame.from_dict(weekly_data, orient='index')
    df.index = pd.to_datetime(df.index)
    df = df.rename(columns={
        '1. open': 'Open',
        '2. high': 'High',
        '3. low': 'Low',
        '4. close': 'Close',
        '5. volume': 'Volume'
    })

    # Convert columns to numeric types
    df = df.apply(pd.to_numeric)

    # If last_n_weeks is specified, return only the last n weeks of data
    if last_n_weeks is not None:
        df = df.head(last_n_weeks).sort_index()

    return df

if __name__ == "__main__":
    API_KEY = 'L3W6N203NC5X6TAT'
    STOCK_SYMBOL = 'AAPL'
    LAST_N_WEEKS = 522  # 10 years of weekly data

    # Fetch data using the fetch_data function
    stock_data_df = fetch_data(STOCK_SYMBOL, API_KEY, LAST_N_WEEKS)

    # Save the DataFrame to a CSV file (optional)
    stock_data_df.to_csv('weekly_stock_data_52.csv')
    
    # Print the DataFrame for debugging purposes
    print(stock_data_df.head())
    print(stock_data_df.tail())

