import pandas as pd 

jsondf = pd.read_json("climate/climateshapes.json")
climatedf = pd.read_csv("climate/csvs/climate_classification.csv")
mergeddf = pd.merge(jsondf, climatedf, how="left", on="GRIDCODE")
del mergeddf['GRIDCODE']
climcolordf = pd.read_csv("climate/csvs/climate&color.csv")
mergeddf = pd.merge(mergeddf, climcolordf, how="left", on="climate")
mergeddf.to_csv("climateshapes.csv", index=False)