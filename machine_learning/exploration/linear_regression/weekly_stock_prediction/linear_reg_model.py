import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import joblib

def load_data(file_path):
    """
    Load stock data from a CSV file.
    
    Parameters:
    file_path (str): Path to the CSV file containing stock data.
    
    Returns:
    pd.DataFrame: DataFrame containing the stock data.
    """
    return pd.read_csv(file_path, index_col=0, parse_dates=True)

def preprocess_data(df):
    """
    Preprocess the stock data for machine learning.
    
    Parameters:
    df (pd.DataFrame): DataFrame containing the stock data.
    
    Returns:
    pd.DataFrame, pd.Series: Features and target variables for the model.
    """
    df['Previous Close'] = df['Close'].shift(1)
    df = df.dropna()
    X = df[['Previous Close']]
    y = df['Close']
    return X, y

def build_and_train_model(X_train, y_train):
    """
    Build and train the linear regression model.
    
    Parameters:
    X_train (pd.DataFrame): Training features.
    y_train (pd.Series): Training target.
    
    Returns:
    LinearRegression: Trained linear regression model.
    """
    model = LinearRegression()
    model.fit(X_train, y_train)
    return model

def evaluate_model(model, X_test, y_test):
    """
    Evaluate the performance of the model.
    
    Parameters:
    model (LinearRegression): Trained linear regression model.
    X_test (pd.DataFrame): Testing features.
    y_test (pd.Series): Testing target.
    
    Returns:
    float: Mean Squared Error of the model.
    """
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    return mse

def save_model(model, file_path):
    """
    Save the trained model to a file.
    
    Parameters:
    model (LinearRegression): Trained linear regression model.
    file_path (str): Path to save the model.
    """
    joblib.dump(model, file_path)

def train_model():
    # Load data
    file_path = 'weekly_stock_data.csv'
    df = load_data(file_path)
    
    # Preprocess data
    X, y = preprocess_data(df)
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Build and train model
    model = build_and_train_model(X_train, y_train)
    
    # Evaluate model
    mse = evaluate_model(model, X_test, y_test)
    print(f'Mean Squared Error: {mse}')
    
    # Save model
    model_file_path = 'stock_price_model.pkl'
    save_model(model, model_file_path)
    print(f'Model saved to {model_file_path}')
    
if __name__ == "__main__":
    train_model()

