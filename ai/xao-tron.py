import pandas as pd

# Đọc file CSV
file_path = 'predict.csv'  # Thay 'data.csv' bằng đường dẫn đến file của bạn
df = pd.read_csv(file_path)

# Xáo trộn các hàng dữ liệu
df_shuffled = df.sample(frac=1, random_state=42).reset_index(drop=True)

# Lưu lại file CSV sau khi xáo trộn
output_path = 'shuffled_data.csv'  # Thay tên file đầu ra theo ý muốn
df_shuffled.to_csv(output_path, index=False)

print("Đã xáo trộn dữ liệu và lưu vào:", output_path)