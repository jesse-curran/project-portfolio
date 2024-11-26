import pandas as pd
import numpy as np
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error, mean_absolute_percentage_error
import matplotlib.pyplot as plt
from datetime import datetime
import itertools
from joblib import Parallel, delayed
import warnings
from statsmodels.tsa.seasonal import seasonal_decompose


warnings.filterwarnings('ignore')

class ForecastingModel:
    def __init__(self, df_train_val, df_test):
        self.df_train_val = df_train_val
        self.df_test = df_test
        
        self.df_train_val['ds'] = pd.to_datetime(self.df_train_val['ds'])
        self.df_train_val['lag'] = self.df_train_val['y'].shift(3)
        self.df_train_val['rolling_3_month_avg'] = self.df_train_val['y'].rolling(window=3).mean()
        self.df_train_val['rolling_3_month_std'] = self.df_train_val['y'].rolling(window=3).std()
        self.df_train_val = self.df_train_val.dropna()
        self.best_params = None

        self.train = self.df_train_val.iloc[:-3]
        self.val = self.df_train_val.iloc[-3:]

    def train_model(self):
        param_grid = {
            'changepoint_prior_scale': [0.001, 0.005, 0.01, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5],
            'seasonality_prior_scale': [0.3, 0.6, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            'changepoint_range': [0.95, 0.8],
            'seasonality_mode': ['additive', 'multiplicative'],
        }

        all_params = [dict(zip(param_grid.keys(), v)) for v in itertools.product(*param_grid.values())]

        def fit_predict_evaluate(params):
            model_prophet = Prophet(
                weekly_seasonality=False, 
                daily_seasonality=False,
                changepoint_prior_scale=params['changepoint_prior_scale'],
                seasonality_prior_scale=params['seasonality_prior_scale'],
                changepoint_range=params['changepoint_range'],
                seasonality_mode=params['seasonality_mode']
            )
            model_prophet.add_regressor('lag')
            model_prophet.add_regressor('rolling_3_month_avg')
            model_prophet.add_regressor('rolling_3_month_std')
            model_prophet.fit(self.train)

            future = model_prophet.make_future_dataframe(periods=3, freq='MS')
            future = future.tail(3)
            future['lag'] = self.val['lag'].values
            future['rolling_3_month_avg'] = self.val['rolling_3_month_avg'].values
            future['rolling_3_month_std'] = self.val['rolling_3_month_std'].values
            forecast = model_prophet.predict(future)

            y_true = self.val['y'].values
            y_pred = forecast['yhat'].values
            temp_mape = mean_absolute_percentage_error(y_true, y_pred) * 100

            return temp_mape

        mape = Parallel(n_jobs=-1)(delayed(fit_predict_evaluate)(params) for params in all_params)

        tuning_results = pd.DataFrame(all_params)
        tuning_results['mape'] = mape
        print(tuning_results)

        best = tuning_results.nsmallest(5, 'mape')
        print(best)

        self.best_params = best.iloc[0].to_dict()

    def test_model(self):
        self.final_model_prophet = Prophet(
            weekly_seasonality=False,
            daily_seasonality=False,
            seasonality_mode=self.best_params['seasonality_mode'],
            changepoint_prior_scale=self.best_params['changepoint_prior_scale'],
            seasonality_prior_scale=self.best_params['seasonality_prior_scale'],
            changepoint_range=self.best_params['changepoint_range'],
            interval_width=0.95
        )

        self.final_model_prophet.add_regressor('lag')
        self.final_model_prophet.add_regressor('rolling_3_month_avg')
        self.final_model_prophet.add_regressor('rolling_3_month_std')

        self.final_model_prophet.fit(self.df_train_val)

        future_final = self.final_model_prophet.make_future_dataframe(periods=3, freq='MS')
        future_final = future_final.tail(3)
        future_final['lag'] = self.df_train_val['lag'].values[-3:]
        future_final['rolling_3_month_avg'] = self.df_train_val['rolling_3_month_avg'].values[-3:]
        future_final['rolling_3_month_std'] = self.df_train_val['rolling_3_month_std'].values[-3:]

        self.final_forecast = self.final_model_prophet.predict(future_final)
        y_true = self.df_test['y'].values
        y_pred = self.final_forecast['yhat'].values
        mae = mean_absolute_error(y_true, y_pred)
        mse = mean_squared_error(y_true, y_pred)
        mape = mean_absolute_percentage_error(y_true, y_pred) * 100
        rmse = np.sqrt(mse)
        print(f'Final Model MAE: {mae:.2f}, MAPE: {mape:.2f}%, MSE: {mse:.2f}, RMSE: {rmse:.2f}')
        print(y_true, y_pred)

    def plot_results(self):
        self.final_model_prophet.plot(self.final_forecast)
        plt.plot(self.df_test['ds'], self.df_test['y'],'ro', markersize=3, label='True Test Data')
        plt.legend()
        plt.show()

        self.final_model_prophet.plot_components(self.final_forecast)
        plt.show()
    
    def prod_forecast(self, final_df):

        final_df['lag'] = final_df['y'].shift(3)
        final_df['rolling_3_month_avg'] = final_df['y'].rolling(window=3).mean()
        final_df['rolling_3_month_std'] = final_df['y'].rolling(window=3).std()
        final_df = final_df.dropna()
        print(f"this is final_df: {final_df}")

        self.prod_model_prophet = Prophet(
        weekly_seasonality=False,
        daily_seasonality=False,
        seasonality_mode=self.best_params['seasonality_mode'],
        changepoint_prior_scale=self.best_params['changepoint_prior_scale'],
        seasonality_prior_scale=self.best_params['seasonality_prior_scale'],
        changepoint_range=self.best_params['changepoint_range'],
        interval_width=0.95
        )

        self.prod_model_prophet.add_regressor('lag')
        self.prod_model_prophet.add_regressor('rolling_3_month_avg')
        self.prod_model_prophet.add_regressor('rolling_3_month_std')

        self.prod_model_prophet.fit(final_df)

        future = self.prod_model_prophet.make_future_dataframe(periods=3, freq='MS')
        future = future.tail(3)
        future['lag'] = final_df['lag'].values[-3:]
        future['rolling_3_month_avg'] = final_df['rolling_3_month_avg'].values[-3:]
        future['rolling_3_month_std'] = final_df['rolling_3_month_std'].values[-3:]

        self.forecast = self.prod_model_prophet.predict(future)

        return self.forecast

    def publish_results(self, target_dir, prod_forecast):
        prod_forecast = prod_forecast[["ds", "yhat"]]
        prod_forecast["yhat"] = prod_forecast["yhat"].astype(int)
        prod_forecast.to_csv(target_dir, index=False)
