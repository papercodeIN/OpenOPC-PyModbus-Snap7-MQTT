import OpenOPC
import pywintypes
import pandas as pd
pywintypes.datetime=pywintypes.TimeType

opc = OpenOPC.client()

try:
    opc.connect("Schneider-Aut.OFS.2")
    print("[+]Info : Connected")
except Exception:
    print("[+]Info : Unable to Connect")


def _tag_management(OPC_Tags):
    print(f"[+]Info : Total Number of Tags With DDT : {len(OPC_Tags)}")
    for aliases in opc.list():
        try:
            for groups in opc.list(f'{aliases}.*'):
                try:
                    OPC_Tags.remove(aliases + "!" +groups)
                except:
                    pass
        except:
            pass

    print(f"[+]Info : Total Number of Individual Tags : {len(OPC_Tags)}")
    return OPC_Tags

tags =  sorted(_tag_management(list(set([ x for x in (opc.list(recursive=True) + opc.list(flat=True)) if "#" not in x ]))))

for tag in tags:
    try:
        opc.read(tag)
    except Exception as e:
        tags.remove(tag)
        pass

print(f"[+]Info : Total Tag : {len(tags)}")
DF = pd.DataFrame(tags, columns=["Tags"])
DF.to_csv("tags.csv")
print("[+]Info : CSV Saved.")
opc.close()
