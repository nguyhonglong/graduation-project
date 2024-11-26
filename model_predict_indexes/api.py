import torch
import pandas as pd
fromastapi import FastAPI, HTTPException
rom pydantic import BaseModel
rom typing import List, Dict
mport numpy as np
rom datetime import datetime, timedelta
rom fastapi.responses import FileResponse
mport matplotlib.pyplot as plt
# ... existing imports and functions (load_saved_model, prepare_scaler, predict_next_5_days) ...
# Initialize FastAPI app
pp = FastAPI(title="Time Series Prediction API")
# Define input/output models
lass PredictionInput(BaseModel):
   historical_data: List[List[float]]
class PredictionOutput(BaseModel):
   predictions: List[Dict[str, float]]
   visualization_path: str
# Load model and scaler at startup
odel = None
caler = None
eature_names = ['Hydrogen', 'Oxygen', 'Methane', 'CO', 'CO2', 
               'Ethylene', 'Ethane', 'Acetylene', 'H2O']
@app.on_event("startup")
sync def startup_event():
   global model, scaler
   # Load historical data
   historical_data = load_data()
   # Prepare scaler
   scaler = prepare_scaler(historical_data)
   # Load the saved model
   model = load_saved_model('best_model.pth')
@app.post("/predict", response_model=PredictionOutput)
sync def predict(input_data: PredictionInput):
   try:
       # Convert input data to numpy array
       last_30_days = np.array(input_data.historical_data)
       
       if last_30_days.shape != (30, 9):
           raise HTTPException(
               status_code=400, 
               detail="Input must contain exactly 30 days of data with 9 features each"
           )
        # Make predictions
       predictions = predict_next_5_days(model, scaler, last_30_days)
       
       # Create visualization
       visualization_path = create_visualization(last_30_days, predictions)
       
       # Format predictions as list of dictionaries
       predictions_list = []
       for day in range(5):
           prediction_dict = {
               feature: float(predictions[day, i]) 
               for i, feature in enumerate(feature_names)
           }
           predictions_list.append(prediction_dict)
        return PredictionOutput(
           predictions=predictions_list,
           visualization_path=visualization_path
       )
    except Exception as e:
       raise HTTPException(status_code=500, detail=str(e))
def create_visualization(historical_data, predictions):
   """Create and save visualization plot"""
   # Generate dates
   current_date = datetime.now().date()
   dates = [current_date - timedelta(days=29-i) for i in range(30)]
   future_dates = [current_date + timedelta(days=i+1) for i in range(5)]
   
   plt.figure(figsize=(15, 8))
   
   for i, feature in enumerate(feature_names):
       plt.subplot(3, 3, i+1)
       
       # Plot historical data
       plt.plot(dates, historical_data[:, i], 'b-', label='Historical')
       
       # Plot predictions
       all_dates = dates + future_dates
       all_values = historical_data[:, i].tolist() + predictions[:, i].tolist()
       plt.plot(all_dates, all_values, 'r--', label='Predicted')
       
       plt.title(feature)
       plt.xlabel('Date')
       plt.ylabel('Value')
       plt.legend()
       plt.grid(True)
       plt.xticks(rotation=45)
   
   plt.tight_layout()
   
   # Save plot
   visualization_path = 'predictions_visualization.png'
   plt.savefig(visualization_path)
   plt.close()
   
   return visualization_path
@app.get("/visualization/{filename}")
sync def get_visualization(filename: str):
   return FileResponse(filename)