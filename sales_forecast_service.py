from flask import Flask, request, jsonify
import pandas as pd
from prophet import Prophet

app = Flask(__name__)

@app.route('/forecast', methods=['POST'])
def forecast():
    try:
        data = request.get_json()
        if not data or not isinstance(data, list):
            return jsonify({"error": "Invalid data"}), 400

        df = pd.DataFrame(data)  # [{month: '2025-09', revenue: 10500000}, ...]
        df.rename(columns={'month': 'ds', 'revenue': 'y'}, inplace=True)
        df['ds'] = pd.to_datetime(df['ds'])

        # Train model
        model = Prophet()
        model.fit(df)

        # Predict next 3 months
        
        last_date = df['ds'].max()

# Tạo future cho 3 tháng kế tiếp, bắt đầu sau tháng cuối cùng
        future_start = pd.date_range(start=last_date + pd.offsets.MonthBegin(1), periods=3, freq='MS')
        future = pd.DataFrame({'ds': future_start})
        forecast = model.predict(future)

        result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(3)
        result['ds'] = result['ds'].dt.strftime('%Y-%m')

        return jsonify(result.to_dict(orient='records'))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
