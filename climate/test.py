import pandas as pd 
import geopandas as gpd 
from shapely.geometry import Point
import unittest
from climate import shapefile

def getClimate(x, y): 
    """
    https://automating-gis-processes.github.io/2016/Lesson3-point-in-polygon.html
    https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.loc.html
    
    Filter out polygons that consume the point, you can actually query the climate of a given location :)
    """
    shapeMatch = shapefile.loc[shapefile['geometry'].contains(Point(x, y))] 
    getKG = shapeMatch.iloc[0]['Classification']
    return getKG.strip()

class Tester(unittest.TestCase): 
    
    def setUp(self): 
        # declaring class properties like its' a constructor  
        pass

    def test_correctClimate(self):  
        self.assertEqual(getClimate(106.65, 10.775), "Aw") # HCMC 
        self.assertEqual(getClimate(-0.118092, 51.509865), "Cfb") # London
        self.assertEqual(getClimate(133.87, -23.7), "BWh") # Alice Springs  
        self.assertEqual(getClimate(30.308611, 59.937500), "Dfb") # St.Petersburg, RU 
        

if __name__ == '__main__': 
    unittest.main()


"""
Further research on testing:
Unit Testing Basics in Python: https://www.youtube.com/watch?v=6tNS--WetLI 


"""
 