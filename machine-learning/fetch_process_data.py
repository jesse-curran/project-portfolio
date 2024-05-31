import requests
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

API_KEY = 'H5VNSQGZ16FCNA0V' # my api key
STOCK_SYMBOL = 'AAPL'
URL = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol={STOCK_SYMBOL}&apikey={API_KEY}&datatype=csv'

def fetch_data(url):
    response = requests.get(url)
    data = response.content.decode('utf-8')
    df = pd.read_csv(pd.compat.StringIO(data))
    return df

def preprocess_data(df):
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values('timestamp')
    scaler = MinMaxScaler(feature_range=(0, 1))
    df[['adjusted_close']] = scaler.fit_transform(df[['adjusted_close']])
    return df, scaler

df = fetch_data(URL)
df, scaler = preprocess_data(df)
print(df.head())
