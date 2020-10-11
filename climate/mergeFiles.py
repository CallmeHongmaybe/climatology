import pandas as pd 

tmax = pd.read_csv("climate/csvs/tmax.csv", error_bad_lines=False)
tmin = pd.read_csv("climate/csvs/tmin.csv", error_bad_lines=False)
base = pd.read_csv("climate/csvs/city+climates.csv", error_bad_lines=False)

clim_data = pd.merge(tmin,tmax,how="left",on="ID")
complete_table = pd.merge(base,clim_data,how="left",on="ID")

complete_table.to_csv("/Users/quanvihong/Desktop/weatheradvisor2/climate/world_climate.csv", index=False)

# write to a new csv file with iterrows
# 