import pandas as pd 

jsondf = pd.read_json("climate/climateshapes.json")
climatedf = pd.read_csv("climate/csvs/climate_classification.csv")
mergeddf = pd.merge(jsondf, climatedf, how="left", on="GRIDCODE")
del mergeddf['GRIDCODE']
climcolordf = pd.read_csv("climate/csvs/climate&color.csv")
mergeddf = pd.merge(mergeddf, climcolordf, how="left", on="climate")
mergeddf.to_csv("climateshapes.csv", index=False)

# querying climate for each and every city 
with open('climate/csvs/new_file.csv', 'w', newline="\n") as file:
     """
     1. get row and turn it to a list
     2. append the list with the climate notation
     3. write it to a new csv file
     """
     csvWriter = csv.writer(file)
     csvWriter.writerow(['country', 'name', 'lat', 'lng', 'climate'])
     for index, place in climate_df.sample(n=3).iterrows():  # take out sample(n=3) if we were to write a whole file fr
         getKG = getClimate(place['lng'], place['lat'])
         new_row = place.tolist() + [getKG]
         csvWriter.writerow(new_row)
         print("Finished :))")

# querying rank of coverage area of each climate
koppen_df['rank'] = koppen_df['land cover'].rank()
koppen_df['rank'] = koppen_df['land cover'].rank(ascending=False,numeric_only=True)
koppen_df['rank'] = koppen_df['rank'].map(lambda x: round(x))
koppen_df.sort_values(by=['land cover', 'rank'], ascending=False)
koppen_df.to_csv("clim-stats-ranked.csv", index=False)