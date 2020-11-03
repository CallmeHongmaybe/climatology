import rasterio
import sys

dataset = rasterio.open(
    "/Users/quanvihong/Desktop/world_clim/tmin/2018-01.tif")

band = dataset.read(1)

x,y = float(sys.argv[1]), float(sys.argv[2])

sys.stdout.write(str(band[dataset.index(x,y)]))
