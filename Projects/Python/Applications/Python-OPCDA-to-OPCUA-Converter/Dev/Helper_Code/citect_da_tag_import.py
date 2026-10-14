import OpenOPC
import pywintypes
import pandas as pd
pywintypes.datetime=pywintypes.TimeType

opc = OpenOPC.client()

try:
    opc.connect("SchneiderElectric.SCADA.OpcDaServer.1")
    print("[+]Info : Connected")
except Exception:
    print("[+]Info : Unable to Connect")


tags =  list(set([ x for x in (opc.list(recursive=True) + opc.list(flat=True)) if "#" not in x ]))

print(f"[+]Info : Total no. of Tags : {len(tags)}")

DF = pd.DataFrame(tags, columns=["Tags"])
DF.to_csv("tags.csv")
opc.close()
print("[+]Info : File save as : tags.csv")
