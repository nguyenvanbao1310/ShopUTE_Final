from flask import Flask, request, jsonify
import pandas as pd
from datetime import datetime
import logging
import sys

# Cấu hình logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Enable CORS manually
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/inventory-forecast', methods=['POST', 'GET', 'OPTIONS'])
def inventory_forecast():
    try:
        logger.info("📥 Received request to /inventory-forecast")
        
        if request.method == 'GET':
            return jsonify({
                "message": "Flask Inventory Forecast API is running!",
                "port": 5002,
                "usage": "Send POST request with sales data"
            })
        
        if request.method == 'OPTIONS':
            return jsonify({"status": "OK"})
            
        data = request.get_json()
        logger.info(f"📊 Received {len(data)} months of data")

        if not data or not isinstance(data, list):
            return jsonify({"error": "Invalid data - expected list"}), 400

        # Chuẩn bị dữ liệu
        df = pd.DataFrame(data)
        df.rename(columns={'month': 'ds', 'sold': 'y'}, inplace=True)
        df['ds'] = pd.to_datetime(df['ds'])
        
        # Lấy stock hiện tại
        current_stock = df.iloc[-1]['stock'] if 'stock' in df.columns else 100
        logger.info(f"📦 Current stock: {current_stock}, Data points: {len(df)}")

        # Xử lý dữ liệu ít điểm
        if len(df) < 3:
            logger.warning("⚠️ Using enhanced simple forecast for limited data")
            results = enhanced_simple_forecast(df, current_stock)
        else:
            logger.info("✅ Using smart forecast for sufficient data")
            results = smart_forecast(df, current_stock)

        logger.info(f"📤 Forecast results: {results}")
        return jsonify(results)

    except Exception as e:
        logger.error(f"❌ Error: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

def enhanced_simple_forecast(df, current_stock):
    """Dự đoán thông minh cho dữ liệu ít"""
    df_sorted = df.sort_values('ds')
    
    # Tính toán các chỉ số
    avg_sales = df_sorted['y'].mean()
    max_sales = df_sorted['y'].max()
    min_sales = df_sorted['y'].min()
    
    # Xác định trend cơ bản
    if len(df_sorted) >= 2:
        first_sales = df_sorted.iloc[0]['y']
        last_sales = df_sorted.iloc[-1]['y']
        trend = (last_sales - first_sales) / first_sales if first_sales > 0 else 0
    else:
        trend = 0.05
    
    # Giới hạn trend hợp lý
    trend = max(-0.3, min(0.3, trend))
    
    results = []
    remaining_stock = float(current_stock)
    
    # Tạo các tháng tiếp theo
    last_date = df_sorted['ds'].max()
    
    for i in range(1, 4):
        next_month = last_date + pd.DateOffset(months=i)
        
        # Dự đoán bán hàng
        predicted_sales = avg_sales * (1 + trend * i)
        random_factor = 0.8 + (0.4 * (i / 3))
        predicted_sales *= random_factor
        
        # Đảm bảo trong ngưỡng hợp lý
        predicted_sales = max(min_sales * 0.5, min(max_sales * 1.5, predicted_sales))
        predicted_sales = max(0.1, predicted_sales)
        
        remaining_stock -= predicted_sales
        
        results.append({
            'month': next_month.strftime('%Y-%m'),
            'predicted_sold': round(float(predicted_sales), 2),
            'predicted_stock': round(float(remaining_stock), 2)
        })
    
    return results

def smart_forecast(df, current_stock):
    """Dự đoán cho dữ liệu đủ nhiều"""
    try:
        from prophet import Prophet
        
        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=False,
            daily_seasonality=False,
            changepoint_prior_scale=0.05
        )
        model.fit(df)
        
        # Dự đoán 3 tháng tới
        last_date = df['ds'].max()
        future_dates = pd.date_range(
            start=last_date + pd.offsets.MonthBegin(1), 
            periods=3, 
            freq='MS'
        )
        future = pd.DataFrame({'ds': future_dates})
        forecast = model.predict(future)
        
        results = []
        remaining_stock = float(current_stock)
        
        for i, row in forecast.iterrows():
            predicted_sales = max(0, float(row['yhat']))
            remaining_stock -= predicted_sales
            
            results.append({
                'month': row['ds'].strftime('%Y-%m'),
                'predicted_sold': round(predicted_sales, 2),
                'predicted_stock': round(remaining_stock, 2)
            })
        
        return results
        
    except ImportError:
        logger.warning("Prophet not available, using enhanced simple forecast")
        return enhanced_simple_forecast(df, current_stock)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "OK", 
        "message": "Flask Inventory Forecast API is running",
        "port": 5002,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/test', methods=['GET'])
def test_route():
    return jsonify({"message": "Test route works!", "version": "1.0"})

if __name__ == '__main__':
    logger.info("🚀 Starting Flask server on port 5002...")
    app.run(host='0.0.0.0', port=5002, debug=True)