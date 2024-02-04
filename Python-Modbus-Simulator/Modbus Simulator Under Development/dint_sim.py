from pymodbus.constants import Endian
from pymodbus.payload import BinaryPayloadBuilder
from pymodbus.client.sync import ModbusTcpClient
import time
import random

print("-"*60)
print("[+]Info : It will Only use to Simulate DINT Values.")
print("-"*60)

HR_Start_Add = input(" > Starting Add. of HR   (Don't Enter Odd Number) : ")
HR_to_Write  = input(" > No. of HR to Simulate (Don't Enter Odd Number) : ")
refresh_time = input(" > Holding Register Update Interval (Seconds)     : ")
ip_add =       input(" > IP Address of Modbus TCP Server                : ")

print("-"*60)

client = ModbusTcpClient(ip_add)

def random_float(low, high):
    return random.random()*(high-low) + low

print(f"[+]Info : Updating HR from [{int(HR_Start_Add)} to {int(HR_Start_Add)+int(HR_to_Write)-1}]")
print("[+]Info : Press 'Ctrl+C' to Stop Simulation.")

try:
    while client.connect():
        for i in range(int(HR_Start_Add),int(HR_to_Write)):
            if i % 2 == 0:
                builder = BinaryPayloadBuilder(byteorder = Endian.Big, wordorder=Endian.Little)
                builder.add_32bit_int(random.randint(5,10000))
                payload = builder.build()
                client.write_registers(i,payload,skip_encode=True)
            else:
                pass
        #print(f"[+]Info : Random Float Value Updated [{int(HR_Start_Add)} to {int(HR_Start_Add)+int(HR_to_Write)-1}]")
        time.sleep(int(refresh_time))

except KeyboardInterrupt:
    pass