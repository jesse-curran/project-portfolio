from fetch_weekly import fetch_data

from linear_reg_model import train_model

from predict import make_predictions, load_model, prepare_new_data

from visualize import plot_predictions, load_data

import time

def main():
    # Constants
    API_KEY = '8HXNN2FZ1WX5CDIZ'
    STOCK_SYMBOL = 'AAPL'
    LAST_N_WEEKS = 3

    # Step 1: Fetch weekly data
    print("Fetching weekly data...")
    weekly_data = fetch_data(STOCK_SYMBOL, API_KEY, LAST_N_WEEKS)
    weekly_data.to_csv('weekly_stock_data.csv')
    print("Weekly data fetched and saved to weekly_stock_data.csv")
    time.sleep(0.5)

    # Step 2: Train the linear regression model (assuming train_model handles data loading internally)
    print("Training linear regression model...")
    train_model()
    print("Linear regression model trained and saved")
    time.sleep(0.5)

    # Step 3: Make predictions using the trained model
    print("Making predictions...")
    model = load_model('stock_price_model.pkl')
    new_data_df = fetch_data(STOCK_SYMBOL, API_KEY, LAST_N_WEEKS)
    previous_close = new_data_df.iloc[0]['Close']
    X_new = prepare_new_data(new_data_df, previous_close)
    predictions = make_predictions(model, X_new)
    new_data_df['Predicted Close'] = predictions
    new_data_df.to_csv('weekly_stock_data_with_predictions.csv')
    print("Predictions made and saved to weekly_stock_data_with_predictions.csv")
    time.sleep(0.5)

    # Step 4: Visualize the predictions
    print("Visualizing predictions...")
    data = load_data('weekly_stock_data_with_predictions.csv')
    plot_predictions(data)
    print("Predictions visualized")

if __name__ == '__main__':
    main()



