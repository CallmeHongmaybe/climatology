# -*- coding: utf-8 -*-

import pandas as pd 
import geopandas as gpd 
from shapely.geometry import Point
import csv
import itertools

# getting all the needed files
climate_df = pd.read_csv("climate/csvs/cities.csv", error_bad_lines=False)
koppen_df = pd.read_csv("climate/csvs/climate_classification.csv")
# climate_df_by_country = climate_df[climate_df.country.eq(country)] # filter climate dataframe by country

# convert type lat and lng ( strings ) in the dataframe to numeric
lats = pd.to_numeric(climate_df.lat)
lngs = pd.to_numeric(climate_df.lng)

# making a geodataframe from the climate_df and geometry ( just in case )
# geometry = [Point(x, y) for x, y in zip(lngs, lats)]
# gdf = gpd.GeoDataFrame(climate_df.drop(['lat', 'lng'], axis=1), crs="EPSG:4326", geometry=geometry)

# link shapefile['climate'] with koppen_df['classification'] with gridcode
shapefile = gpd.read_file('climate/spatial data/c1976_2000.shp')
shapefile = pd.merge(shapefile, koppen_df, how="left", on="GRIDCODE")
# https://pandas.pydata.org/pandas-docs/stable/getting_started/intro_tutorials/08_combine_dataframes.html#min-tut-08-combine


def getClimate(x, y):
    """
    https://automating-gis-processes.github.io/2016/Lesson3-point-in-polygon.html
    https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.loc.html

    Filter out polygons that consume the point, you can actually query the climate of a given location :)
    Check out Corey Schafer for more videos on Pandas
    """
    try:
        shapeMatch = shapefile.loc[shapefile['geometry'].contains(Point(x, y))]
        getKG = shapeMatch.iloc[0]['Classification']
        return getKG.strip()
    except:
        return "NONE"

print(shapefile.sample(n=5))


# with open('climate/csvs/new_file.txt', 'w', newline="\n") as file:
#     """
#     1. get row and turn it to a list
#     2. append the list with the climate notation 
#     3. write it to a new csv file    
#     """
#     csvWriter = csv.writer(file)
#     csvWriter.writerow(['country', 'name', 'lat', 'lng', 'climate'])
#     for index, place in climate_df.iterrows():
#         getKG = getClimate(place['lng'], place['lat'])
#         new_row = place.tolist() + [getKG]
#         csvWriter.writerow(new_row)
#     print("Finished :))")

"""

Run script: python -u "/Users/quanvihong/Desktop/weatheradvisor2/climate/climate.py"

## Helpful links ##
 https://shapely.readthedocs.io/en/latest/manual.html
 https://automating-gis-processes.github.io/2016/Lesson3-point-in-polygon.html

## Coding tidbits ##
 Use the Interactive Window to develop Python Scripts
 - You can create cells on a Python file by typing "#%%"
 - Use "Shift + Enter " to run a cell, the output will be shown in the interactive window3

## Data source ##
 Kottek, M., J. Grieser, C. Beck, B. Rudolf, and F. Rubel, 2006: World Map of the Köppen-Geiger climate # classification updated. Meteorol. Z., 15, 259-263. DOI: 10.1127/0941-2948/2006/0130.

"""

