import torch
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import numpy as np
from datetime import datetime, timedelta
import json
from fastapi.responses import FileResponse
from sklearn.preprocessing import StandardScaler
from main1 import TimeSeriesTransformer, load_data
from contextlib import asynccontextmanager
import joblib
from pathlib import Path

def load_saved_model(model_path, input_dim=9):
    """Load the saved model and prepare it for inference"""
    model = TimeSeriesTransformer(input_dim=input_dim)
    # Load the full checkpoint
    checkpoint = torch.load(model_path)
    # Extract just the model state dict
    model.load_state_dict(checkpoint['model_state_dict'])
    model.eval()
    return model

def prepare_scaler(historical_data):
    """Prepare the scaler using historical data"""
    scaler = StandardScaler()
    scaler.fit(historical_data)
    return scaler

def predict_next_5_days(model, scaler, last_30_days):
    """Make predictions for the next 5 days"""
    with torch.no_grad():
        # Normalize the input
        normalized_input = scaler.transform(last_30_days)
        input_seq = torch.FloatTensor(normalized_input).unsqueeze(0)
        
        # Make prediction
        prediction = model(input_seq, training=False)
        prediction = prediction[:, -5:, :]
        
        # Denormalize the prediction
        prediction = scaler.inverse_transform(prediction.squeeze(0))
    return prediction

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for model initialization"""
    # Load model and scaler on startup
    global model, scaler, health_model, life_expectation_model
    historical_data = load_data()
    model = load_saved_model('predict/best_model.pth')
    scaler = prepare_scaler(historical_data)
    # Load XGBoost models
    health_model = joblib.load(Path('health_index/xgboost.joblib'))
    life_expectation_model = joblib.load(Path('life_expectation/xgboost.joblib'))
    yield
    # Clean up resources if needed
    
# Initialize FastAPI app
app = FastAPI(
    title="Time Series Prediction API",
    description="API for predicting gas concentrations for the next 5 days",
    lifespan=lifespan
)

# Define input/output models
class PredictionInput(BaseModel):
    historical_data: List[List[float]]

class PredictionOutput(BaseModel):
    predictions: List[Dict[str, float]]

class HealthIndexOutput(BaseModel):
    health_index: float

class LifeExpectationOutput(BaseModel):
    life_expectation: float

# Global variables for model and scaler
model = None
scaler = None
health_model = None
life_expectation_model = None
feature_names = ['Hydrogen', 'Oxygen', 'Methane', 'CO', 'CO2', 
                'Ethylene', 'Ethane', 'Acetylene', 'H2O']

# Định nghĩa model input mới
class HealthPredictionInput(BaseModel):
    Hydrogen: float
    Oxygen: float
    Methane: float
    CO: float
    CO2: float
    Ethylene: float
    Ethane: float
    Acetylene: float
    H2O: float

    # class Config:
    #     json_schema_extra = {
    #         "example": {
    #             "Hydrogen": 0.14,
    #             "Oxygen": 0.20,
    #             "Methane": 0.06,
    #             "CO": 0.03,
    #             "CO2": 0.08,
    #             "Ethylene": 0.02,
    #             "Ethane": 0.02,
    #             "Acetylene": 0.006,
    #             "H2O": 0.09
    #         }
    #     }

# Định nghĩa model input mới cho life expectation
class LifeExpectationInput(BaseModel):
    Hydrogen: float
    Oxygen: float
    Methane: float
    CO: float
    CO2: float
    Ethylene: float
    Ethane: float
    Acetylene: float
    H2O: float
    Healthy_index: float

    # class Config:
    #     json_schema_extra = {
    #         "example": {
    #             "Hydrogen": 0.14,
    #             "Oxygen": 0.20,
    #             "Methane": 0.06,
    #             "CO": 0.03,
    #             "CO2": 0.08,
    #             "Ethylene": 0.02,
    #             "Ethane": 0.02,
    #             "Acetylene": 0.006,
    #             "H2O": 0.09,
    #             "Healthy_index": 0.85
    #         }
    #     }

@app.post("/predict/", response_model=PredictionOutput)
async def predict(input_data: PredictionInput):
    """Endpoint to make predictions for the next 5 days"""
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
        
        # # Create visualization
        # create_visualization(last_30_days, predictions)
        
        # Format predictions as list of dictionaries
        predictions_list = []
        for day in range(5):
            prediction_dict = {
                feature: float(predictions[day][i])
                for i, feature in enumerate(feature_names)
            }
            predictions_list.append(prediction_dict)

        return PredictionOutput(
            predictions=predictions_list
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict_health/", response_model=HealthIndexOutput)
async def predict_health(input_data: HealthPredictionInput):
    """Endpoint to predict health index from gas concentrations"""
    try:
        # Convert input data to numpy array
        gas_data = np.array([
            input_data.Hydrogen,
            input_data.Oxygen,
            input_data.Methane,
            input_data.CO,
            input_data.CO2,
            input_data.Ethylene,
            input_data.Ethane,
            input_data.Acetylene,
            input_data.H2O
        ])
        
        # Predict health index directly from gas concentrations
        # Reshape gas data for prediction
        gas_input = gas_data.reshape(1, -1)
        
        # Predict health index
        health_prediction = health_model.predict(gas_input)[0]
        
        return HealthIndexOutput(
            health_index=float(health_prediction)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict_life_expectation/", response_model=LifeExpectationOutput)
async def predict_life_expectation(input_data: LifeExpectationInput):
    """Endpoint to predict life expectation from gas concentrations and health index"""
    try:
        # Convert dictionary values to numpy array in correct order
        gas_data = np.array([
            input_data.Hydrogen,
            input_data.Oxygen,
            input_data.Methane,
            input_data.CO,
            input_data.CO2,
            input_data.Ethylene,
            input_data.Ethane,
            input_data.Acetylene,
            input_data.H2O
        ])
        
        # Combine gas concentrations with health index
        combined_input = np.append(gas_data, input_data.Healthy_index).reshape(1, -1)
        
        # Predict life expectation
        life_expectation_prediction = life_expectation_model.predict(combined_input)[0]
        
        return LifeExpectationOutput(
            life_expectation=float(life_expectation_prediction)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def create_visualization(historical_data, predictions):
    """Create and save visualization plot"""
    import matplotlib.pyplot as plt
    
    # Generate dates
    end_date = datetime.now().date()
    dates = pd.date_range(end=end_date, periods=30)
    future_dates = [end_date + timedelta(days=i) for i in range(1, 6)]
    
    plt.figure(figsize=(15, 8))
    
    for i, feature in enumerate(feature_names):
        plt.subplot(3, 3, i+1)
        
        # Plot historical data
        plt.plot(dates, historical_data[:, i], 'b-', label='Historical')
        
        # Plot predictions
        all_dates = dates.tolist() + future_dates
        all_values = historical_data[:, i].tolist() + predictions[:, i].tolist()
        plt.plot(all_dates, all_values, 'r--', label='Predicted')
        
        plt.title(feature)
        plt.xlabel('Date')
        plt.ylabel('Value')
        plt.legend()
        plt.grid(True)
        plt.xticks(rotation=45)
    
    plt.tight_layout()
    plt.savefig('predictions_visualization.png')
    plt.close()

@app.get("/visualization")
async def get_visualization():
    """Endpoint to retrieve the visualization plot"""
    return FileResponse("predictions_visualization.png")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
