import requests

API_KEY = 'L3W6N203NC5X6TAT'
STOCK_SYMBOL = 'AAPL'
url = f'https://www.alphavantage.co/query?function=OVERVIEW&symbol={STOCK_SYMBOL}&apikey={API_KEY}'
r = requests.get(url)
data = r.json()

print(data)


