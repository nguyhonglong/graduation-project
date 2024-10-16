import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Read the CSV file
df = pd.read_csv('at1a2.csv')

# Convert Timestamp to datetime, handling both formats
def parse_timestamp(ts):
    try:
        return pd.to_datetime(ts, format='%d/%m/%Y %I:%M:%S %p')
    except ValueError:
        return pd.to_datetime(ts, format='%d/%m/%Y %H:%M')

df['Timestamp'] = df['Timestamp'].apply(parse_timestamp)

# Set Timestamp as index
df.set_index('Timestamp', inplace=True)

# ... rest of the code remains unchanged ...