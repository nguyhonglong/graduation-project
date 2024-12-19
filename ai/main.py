import torch
import torch.nn as nn
import numpy as np
import pandas as pd
from torch.utils.data import Dataset, DataLoader
import math
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
from sklearn.preprocessing import RobustScaler

from scipy.interpolate import interp1d
import random

# Time Series Dataset
class TimeSeriesDataset(Dataset):
    def __init__(self, data, seq_length=30, pred_length=5, augment=True):
        self.data = torch.FloatTensor(data)
        self.seq_length = seq_length
        self.pred_length = pred_length
        self.augment = augment

    def __len__(self):
        return len(self.data) - self.seq_length - self.pred_length + 1

    def augment_timeseries(self, x):
        # Randomly choose augmentation method
        aug_type = random.choice(['jitter', 'scaling', 'magnitude_warp', 'none'])
        
        if aug_type == 'none' or not self.augment:
            return x
            
        if aug_type == 'jitter':
            # Add random noise
            noise_level = 0.01
            noise = torch.randn(x.shape) * noise_level
            return x + noise
            
        elif aug_type == 'scaling':
            # Random scaling
            scaling_factor = random.uniform(0.95, 1.05)
            return x * scaling_factor
            
        elif aug_type == 'magnitude_warp':
            # Magnitude warping
            sigma = 0.2
            knot = random.randint(3, 5)
            orig_steps = np.arange(x.shape[0])
            random_warps = np.random.normal(loc=1.0, scale=sigma, size=(knot+2))
            warp_steps = (np.linspace(0, x.shape[0]-1., num=knot+2))
            warper = interp1d(warp_steps, random_warps, kind='linear')
            warper = warper(orig_steps)
            return x * torch.FloatTensor(warper.reshape(-1, 1))

    def __getitem__(self, idx):
        x = self.data[idx:idx + self.seq_length]
        y = self.data[idx + self.seq_length:idx + self.seq_length + self.pred_length]
        
        if self.augment:
            x = self.augment_timeseries(x)
        
        return x, y

# Transformer Time Series Model
class TimeSeriesTransformer(nn.Module):
    def __init__(self, input_dim, d_model=128, nhead=8, num_layers=3, dropout=0.1):
        super().__init__()
        
        # Correct batch normalization for time series
        self.batch_norm = nn.BatchNorm1d(input_dim)
        
        # Enhanced embedding with correct batch norm
        self.embedding = nn.Sequential(
            nn.Linear(input_dim, d_model),
            nn.LayerNorm(d_model),  # Changed to LayerNorm
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(d_model, d_model),
            nn.LayerNorm(d_model),  # Changed to LayerNorm
            nn.ReLU(),
            nn.Dropout(dropout)
        )
        
        self.positional_encoding = PositionalEncoding(d_model, dropout)
        
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=nhead,
            dim_feedforward=d_model * 4,
            dropout=dropout,
            activation='gelu',
            batch_first=True
        )
        
        self.transformer_encoder = nn.TransformerEncoder(
            encoder_layer,
            num_layers=num_layers,
            norm=nn.LayerNorm(d_model)
        )
        
        # Enhanced decoder with LayerNorm
        self.decoder = nn.Sequential(
            nn.Linear(d_model, d_model // 2),
            nn.LayerNorm(d_model // 2),  # Changed to LayerNorm
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(d_model // 2, input_dim)
        )
        
        self.skip_connection = nn.Linear(input_dim, input_dim)

    def forward(self, src, training=True):
        # Correct batch norm application for time series
        batch_size, seq_len, features = src.shape
        x = src.transpose(1, 2)  # [batch, features, seq_len]
        x = self.batch_norm(x)
        x = x.transpose(1, 2)  # [batch, seq_len, features]
        
        # Skip connection
        skip = self.skip_connection(x)
        
        # Main path
        x = self.embedding(x)
        x = self.positional_encoding(x)
        x = self.transformer_encoder(x)
        x = self.decoder(x)
        
        # Add skip connection
        return x + skip
    
    def _generate_square_subsequent_mask(self, sz):
        mask = (torch.triu(torch.ones(sz, sz)) == 1).transpose(0, 1)
        mask = mask.float().masked_fill(mask == 0, float('-inf')).masked_fill(mask == 1, float(0.0))
        return mask

# Positional Encoding
class PositionalEncoding(nn.Module):
    def __init__(self, d_model, dropout=0.3, max_len=5000):
        super().__init__()
        self.dropout = nn.Dropout(p=dropout)
        self.input_dropout = nn.Dropout(p=dropout/2)  # Additional dropout

        position = torch.arange(max_len).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2) * (-math.log(10000.0) / d_model))
        pe = torch.zeros(max_len, 1, d_model)
        pe[:, 0, 0::2] = torch.sin(position * div_term)
        pe[:, 0, 1::2] = torch.cos(position * div_term)
        self.register_buffer('pe', pe)

    def forward(self, x):
        x = self.input_dropout(x)  # Apply dropout to input
        x = x + self.pe[:x.size(0)]
        return self.dropout(x)

# Training function
def train_model(model, train_loader, val_loader, criterion, optimizer, scheduler, num_epochs):
    best_val_loss = float('inf')
    train_losses = []
    val_losses = []
    
    for epoch in range(num_epochs):
        # Training phase
        model.train()
        total_train_loss = 0
        for batch_x, batch_y in train_loader:
            optimizer.zero_grad()
            output = model(batch_x, training=True)
            
            # Calculate MSE loss
            loss = criterion(output[:, -5:, :], batch_y)
            
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()
            scheduler.step()  # Step the scheduler
            total_train_loss += loss.item()
        
        # Validation phase
        model.eval()
        val_loss = evaluate_model(model, val_loader, criterion)
        
        # Calculate and store losses
        avg_train_loss = total_train_loss/len(train_loader)
        train_losses.append(avg_train_loss)
        val_losses.append(val_loss)
        
        # Save best model
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save({
                'epoch': epoch,
                'model_state_dict': model.state_dict(),
                'optimizer_state_dict': optimizer.state_dict(),
                'train_loss': avg_train_loss,
                'val_loss': val_loss,
            }, 'best_model.pth')
        
        print(f'Epoch {epoch+1}, Train Loss: {avg_train_loss:.6f}, Val Loss: {val_loss:.6f}')
    
    # Plot losses
    plt.figure(figsize=(10, 6))
    plt.plot(train_losses, label='Training Loss')
    plt.plot(val_losses, label='Validation Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.title('Training and Validation Losses')
    plt.legend()
    plt.grid(True)
    plt.savefig('loss_chart.png')
    plt.close()

def evaluate_model(model, val_loader, criterion):
    model.eval()
    total_val_loss = 0
    with torch.no_grad():
        for batch_x, batch_y in val_loader:
            output = model(batch_x)
            loss = criterion(output[:, -5:, :], batch_y)
            total_val_loss += loss.item()
    return total_val_loss / len(val_loader)

# Example usage:
def prepare_data(data, train_ratio=0.8):
    # Add robust scaling
    scaler = RobustScaler()  # More robust to outliers
    normalized_data = scaler.fit_transform(data)
    
    # Split into train and validation sets
    train_size = int(len(normalized_data) * train_ratio)
    train_data = normalized_data[:train_size]
    val_data = normalized_data[train_size:]
    
    # Increase batch size for more stable training
    train_dataset = TimeSeriesDataset(train_data, augment=True)
    val_dataset = TimeSeriesDataset(val_data, augment=False)
    
    train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=64, shuffle=False)
    
    return train_loader, val_loader, scaler

# Load and prepare the data
def load_data():
    # Read the CSV file
    df = pd.read_csv('predict.csv')
    
    # Convert date column to datetime if needed
    df['Date'] = pd.to_datetime(df['Date'])
    
    # Sort by date to ensure temporal order
    df = df.sort_values('Date')
    
    # Drop the Date column for the model input
    features = df.drop('Date', axis=1).values
    
    return features

# Main execution
if __name__ == "__main__":
    # Load the data
    data = load_data()
    
    # Prepare data for training
    train_loader, val_loader, scaler = prepare_data(data)
    
    # Initialize model
    input_dim = 9
    model = TimeSeriesTransformer(input_dim=input_dim)
    
    # Define loss and optimizer
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001, weight_decay=0.01)
    
    # Create scheduler
    scheduler = torch.optim.lr_scheduler.OneCycleLR(
        optimizer,
        max_lr=0.001,
        epochs=50,
        steps_per_epoch=len(train_loader),
        pct_start=0.3,
        anneal_strategy='cos'
    )
    
    # Train the model
    train_model(
        model,
        train_loader,
        val_loader,
        criterion,
        optimizer,
        scheduler,
        num_epochs=50
    )
    
    # Function to make predictions
    def predict_next_5_days(model, last_30_days):
        model.eval()
        with torch.no_grad():
            # Normalize the input
            normalized_input = scaler.transform(last_30_days)
            input_seq = torch.FloatTensor(normalized_input).unsqueeze(0)
            
            # Make prediction
            prediction = model(input_seq)
            prediction = prediction[:, -5:, :]
            
            # Denormalize the prediction
            prediction = scaler.inverse_transform(prediction.squeeze(0))
        return prediction
    
    # Example of making a prediction
    # Get the last 30 days from your data
    last_30_days = data[-30:]
    predicted_values = predict_next_5_days(model, last_30_days)
    print("\nPredicted values for next 5 days:")
    print(predicted_values)
