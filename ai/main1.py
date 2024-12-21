import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

# Read the CSV file
df = pd.read_csv('predict.csv')

# Convert Date column to datetime
df['Date'] = pd.to_datetime(df['Date'])

# Create a figure with multiple subplots
plt.style.use('ggplot')
fig, axes = plt.subplots(2, 2, figsize=(15, 12))
fig.suptitle('Gas Measurements Over Time', fontsize=16)

# Plot 1: Main gases (CO2, Oxigen)
axes[0, 0].plot(df['Date'], df['CO2'], label='CO2', alpha=0.7)
axes[0, 0].plot(df['Date'], df['Oxigen'], label='Oxygen', alpha=0.7)
axes[0, 0].set_title('CO2 and Oxygen Levels')
axes[0, 0].legend()
axes[0, 0].tick_params(axis='x', rotation=45)

# Plot 2: Combustible gases (Hydrogen, Methane, CO)
axes[0, 1].plot(df['Date'], df['Hydrogen'], label='Hydrogen', alpha=0.7)
axes[0, 1].plot(df['Date'], df['Methane'], label='Methane', alpha=0.7)
axes[0, 1].plot(df['Date'], df['CO'], label='CO', alpha=0.7)
axes[0, 1].set_title('Combustible Gases')
axes[0, 1].legend()
axes[0, 1].tick_params(axis='x', rotation=45)

# Plot 3: Hydrocarbons (Ethylene, Ethane, Acethylene)
axes[1, 0].plot(df['Date'], df['Ethylene'], label='Ethylene', alpha=0.7)
axes[1, 0].plot(df['Date'], df['Ethane'], label='Ethane', alpha=0.7)
axes[1, 0].plot(df['Date'], df['Acethylene'], label='Acetylene', alpha=0.7)
axes[1, 0].set_title('Hydrocarbons')
axes[1, 0].legend()
axes[1, 0].tick_params(axis='x', rotation=45)

# Plot 4: Water content
axes[1, 1].plot(df['Date'], df['H2O'], label='H2O', color='blue', alpha=0.7)
axes[1, 1].set_title('Water Content')
axes[1, 1].legend()
axes[1, 1].tick_params(axis='x', rotation=45)

# Adjust layout to prevent overlap
plt.tight_layout()
plt.show()

# Create a correlation heatmap
plt.figure(figsize=(10, 8))
correlation = df.drop('Date', axis=1).corr()
sns.heatmap(correlation, annot=True, cmap='coolwarm', center=0)
plt.title('Correlation Between Gas Measurements')
plt.tight_layout()
plt.show()
