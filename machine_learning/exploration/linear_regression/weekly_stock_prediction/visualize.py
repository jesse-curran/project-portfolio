import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def load_data(file_path):
    """
    Load stock data from a CSV file.
    
    Parameters:
    file_path (str): Path to the CSV file containing stock data.
    
    Returns:
    pd.DataFrame: DataFrame containing the stock data.
    """
    return pd.read_csv(file_path, index_col=0, parse_dates=True)

def plot_predictions(data):
    """
    Plot actual vs predicted stock prices.
    
    Parameters:
    data (pd.DataFrame): DataFrame containing the stock data with predictions.
    """
    plt.figure(figsize=(12, 6))
    sns.lineplot(data=data, x=data.index, y='Close', label='Actual Close Price')
    sns.lineplot(data=data, x=data.index, y='Predicted Close', label='Predicted Close Price', linestyle='--')
    plt.title('Actual vs Predicted Stock Prices')
    plt.xlabel('Date')
    plt.ylabel('Price')
    plt.legend()
    plt.show()

def main():

    data = load_data('weekly_stock_data_with_predictions.csv')
    # Plot the predictions
    plot_predictions(data)

if __name__ == '__main__':
    main()
