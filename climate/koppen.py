# -*- coding: utf-8 -*-
import geopandas as gpd
import pandas as pd 
from shapely.geometry import Point
import csv
from getClimate import getClimate

# getting all the needed files
koppen_df = pd.read_csv("climate/csvs/climate_classification.csv")
climate_df = pd.read_csv("climate/csvs/c1976_2000.csv", error_bad_lines=False)
# climate_df_by_country = climate_df[climate_df.country.eq(country)] # filter climate dataframe by country

# convert type lat and lng ( strings ) in the dataframe to numeric
lats = pd.to_numeric(climate_df.lat)
lngs = pd.to_numeric(climate_df.lng)

# making a geodataframe from the climate_df and geometry ( just in case )
geometry = [Point(x, y) for x, y in zip(lngs, lats)]
gdf = gpd.GeoDataFrame(climate_df.drop(['lat', 'lng'], axis=1), crs="EPSG:4326", geometry=geometry)

# link shapefile['climate'] with koppen_df['classification'] with gridcode
shapefile = gpd.read_file('climate/spatial data/c1976_2000.shp')

shapefile = pd.merge(shapefile, koppen_df, how="left", on="GRIDCODE")
# https://pandas.pydata.org/pandas-docs/stable/getting_started/intro_tutorials/08_combine_dataframes.html#min-tut-08-combine

# accessing the area of each gridcode/climate
shapefile = shapefile.to_crs({'proj': 'cea'})

# calculating the area of each gridcode
shapefile['area'] = shapefile['geometry'].area

earth_area = 157433089.65788296  # according to CEA projection

# making a loop di doop ( querying climate area (sq.km and % )  )
listOfClimates = set(shapefile.climate)

with open('climate/csvs/clim-stats.csv', 'w', newline="\n") as file:
    csvWriter = csv.writer(file)
    csvWriter.writerow(['climate', 'area', 'land cover (%)'])
    for climate in listOfClimates:
        # land area of a certain climate region ( in percentage )
        landArea = shapefile[(shapefile.climate == climate)].area.sum()
        csvWriter.writerow([] + [climate] + [(landArea / 10**6)] + [(landArea / (10**6 * earth_area) * 100)])

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

"""

Run script: python -u "/Users/quanvihong/Desktop/weatheradvisor2/climate/koppen.py"
Staring REPL: /Users/quanvihong/opt/miniconda3/bin/python
Reading dbf files with https://www.dbfopener.com/

https://datacatalog.worldbank.org/dataset/world-maps-k%C3%B6ppen-geiger-climate-classification

## Helpful links ##
 https://shapely.readthedocs.io/en/latest/manual.html
 https://automating-gis-processes.github.io/2016/Lesson3-point-in-polygon.html

## Coding tidbits ##
 Use the Interactive Window to develop Python Scripts
 - You can create cells on a Python file by typing "#%%"
 - Use "Shift + Enter " to run a cell, the output will be shown in the interactive window

## Data source ##
 Kottek, M., J. Grieser, C. Beck, B. Rudolf, and F. Rubel, 2006: World Map of the Köppen-Geiger climate # classification updated. Meteorol. Z., 15, 259-263. DOI: 10.1127/0941-2948/2006/0130.

"""
