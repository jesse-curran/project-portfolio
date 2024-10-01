from flask import Flask, render_template, Response, send_file, request, redirect, url_for
import pandas as pd
import io
import xlsxwriter 
import macro

app = Flask(__name__)

# Load the data from the CSV file
def load_data():
    df = pd.read_csv('macro_data.csv', na_values=['NaN'], keep_default_na=False, encoding='utf-8')
    df = df.drop([1, 1])
    df = df.drop([0,0])
    df = df.rename(columns={'Unnamed: 0': 'DATE'})
    return df

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/faq')
def faq():
    return render_template('faq.html')

@app.route('/filtered_indicators', methods=['POST'])
def filtered_indicators():
    start_date = request.form['start_date']
    end_date = request.form['end_date']
    
    # Filter the data based on the provided dates
    df = load_data()
    df['DATE'] = pd.to_datetime(df['DATE'])
    filtered_df = df[(df['DATE'] >= start_date) & (df['DATE'] <= end_date)]
    
    # Generate the filtered table HTML
    table_html = filtered_df.to_html(index=False, classes='data-table')
    
    # Render the HTML template and pass the table_html
    return render_template('indicators.html', table_html=table_html)

@app.route('/column_select', methods=['POST'])
def column_select():
    selected_columns = request.form.getlist('columns')
    
    # Include 'DATE' column in the selected_columns list
    if 'DATE' not in selected_columns:
        selected_columns.insert(0, 'DATE')
    
    # Filter the data based on the selected columns
    df = load_data()
    filtered_df = df[selected_columns]
    
    # Generate the filtered table HTML
    table_html = filtered_df.to_html(index=False, classes='data-table')
    
    # Render the HTML template and pass the table_html
    return render_template('indicators.html', table_html=table_html, df_columns=df.columns)

@app.route('/indicators')
def indicators():
    df = load_data()
    table_html = df.to_html(index=False, classes='data-table')

    # Pass the DataFrame columns to the template
    return render_template('indicators.html', table_html=table_html, df_columns=df.columns)


@app.route('/download_csv')
def download_csv():
    # Generate the CSV file
    df = load_data()
    csv_data = df.to_csv(index=False)

    # Create a response object that contains the CSV data
    response = Response(
        csv_data,
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment; filename=macro_data.csv'}
    )
    return response

@app.route('/download_excel')
def download_excel():
    # Generate the Excel file
    df = load_data()
    excel_data = io.BytesIO()
    writer = pd.ExcelWriter(excel_data, engine='xlsxwriter')
    df.to_excel(writer, index=False)
    writer.close()

    # Create a response object that contains the Excel data
    response = Response(
        excel_data.getvalue(),
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers={'Content-Disposition': 'attachment; filename=macro_data.xlsx'}
    )
    return response

@app.route('/download_json')
def download_json():
    df = load_data()
    json_data = df.to_json(orient='records')

    response = Response(
        json_data,
        mimetype='application/json',
        headers={'Content-Disposition': 'attachment; filename=macro_data.json'}
    )
    return response


if __name__ == '__main__':
    macro.get_macro_data()
    app.run(debug=True, port=5002)


