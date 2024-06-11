import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib
from fetch_weekly import fetch_data

def load_model(file_path):
    """
    Load the trained model from a file.
    
    Parameters:
    file_path (str): Path to the saved model file.
    
    Returns:
    LinearRegression: Loaded linear regression model.
    """
    return joblib.load(file_path)

def prepare_new_data(new_data, previous_close):
    """
    Prepare the new data for prediction.
    
    Parameters:
    new_data (pd.DataFrame): DataFrame containing the new stock data.
    previous_close (float): Previous closing price before the new data.
    
    Returns:
    pd.DataFrame: Features for the prediction model.
    """
    new_data['Previous Close'] = new_data['Close'].shift(1)
    new_data.iloc[0, new_data.columns.get_loc('Previous Close')] = previous_close
    X_new = new_data[['Previous Close']]
    return X_new

def make_predictions(model, X_new):
    """
    Make predictions using the loaded model.
    
    Parameters:
    model (LinearRegression): Loaded linear regression model.
    X_new (pd.DataFrame): New data features for prediction.
    
    Returns:
    pd.Series: Predicted values.
    """
    return model.predict(X_new)

def main():
    # Path to the saved model
    model_file_path = 'stock_price_model.pkl'
    
    # Load the model
    model = load_model(model_file_path)

    model = load_model('stock_price_model.pkl')
    
    # Load the CSV data and select the last 3 rows (last 3 weeks)
    csv_file_path = 'weekly_stock_data_52.csv'
    data_df = pd.read_csv(csv_file_path)
    new_data_df = data_df.iloc[-3:].copy()
    
    # Previous closing price (before the new data)
    previous_close = new_data_df.iloc[0]['Close']
    
    # Prepare new data
    X_new = prepare_new_data(new_data_df, previous_close)
    
    # Make predictions
    predictions = make_predictions(model, X_new)
    
    # Add predictions to the new data DataFrame
    new_data_df['Predicted Close'] = predictions
    
    # Print the predictions
    print(new_data_df)

    # Save the DataFrame with predictions to a CSV file
    new_data_df.to_csv('weekly_stock_data_with_predictions.csv')

if __name__ == '__main__':
    main()



