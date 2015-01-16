from blaze import Table, into
import json

ads = Table('impala://10.1.94.140:21050::memex_sotera_gqt_ads')
expr = ads[['lat', 'lon']]

L = into(list, expr)
d = [{'lat': a, 'lon': b} for a, b in L]

f = open('lat-lons.json', 'w')
f.write(json.dumps(d))
f.close()
