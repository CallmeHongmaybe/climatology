import pandas as pd
import geopandas as gpd
from shapely.geometry import Point
import sys

koppen_df = pd.read_csv("climate/csvs/climate_classification.csv")
shapefile = gpd.read_file('climate/spatial data/c1976_2000.shp')
shapefile = pd.merge(shapefile, koppen_df, how="left", on="GRIDCODE")

lng = float(sys.argv[1])
lat = float(sys.argv[2])

def getClimate(x, y):
    """
    https://automating-gis-processes.github.io/2016/Lesson3-point-in-polygon.html
    https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.loc.html

    Filter out polygons that consume the point, you can actually query the climate of a given location :)
    Check out Corey Schafer for more videos on Pandas
    """
    try:
        shapeMatch = shapefile.loc[shapefile['geometry'].contains(Point(x, y))]
        getKG = shapeMatch.iloc[0]['climate']
        return getKG.strip()
    except:
        return "NONE"


sys.stdout.write(getClimate(lng, lat))
