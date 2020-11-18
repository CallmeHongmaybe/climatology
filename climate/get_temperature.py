import rasterio
from rasterio.windows import Window
import sys
import json

# https://gis.stackexchange.com/questions/223910/using-rasterio-or-gdal-to-stack-multiple-bands-without-using-subprocess-commands

min_dataset = rasterio.open("tmin.tif")
max_dataset = rasterio.open("tmax.tif")

lng, lat = float(sys.argv[1]), float(sys.argv[2])

index = row, col = min_dataset.index(lng, lat)

window = Window(col, row, 1, 1)

# index = row, col = min_dataset.index(150.86681, -33.90596) - green valley 2068 nsw australia
temp_bands = [[
    (min_dataset.read(month + 1, window=window))[0][0],
    (max_dataset.read(month + 1, window=window))[0][0]
] for month in range(12)]

# converting list of tuples into a dictionary

sys.stdout.write(str(temp_bands))

"""
Sydney - (2972, 7944)
HCMC - (1901, 6879)
"""
