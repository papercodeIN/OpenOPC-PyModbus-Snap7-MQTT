from pymodbus.constants import Endian
from pymodbus.payload import BinaryPayloadBuilder
from pymodbus.client.sync import ModbusTcpClient
import time
import random
import os
os.system("color")
os.system('cls' if os.name=='nt' else 'clear')

print("-"*60)
print("\033[92m[+]Info : It will Only use to Simulate Float Values.\033[0m")
print("-"*60)

HR_Start_Add = int(input("\033[96m > Starting Add. of HR   (Don't Enter Odd Number) : \033[0m"))
HR_to_Write  = int(input("\033[96m > No. of HR to Simulate (Don't Enter Odd Number) : \033[0m"))*2
refresh_time = int(input("\033[96m > Holding Register Update Interval (Seconds)     : \033[0m"))
ip_add =       input("\033[96m > IP Address of Modbus TCP Server                : \033[0m")
Max_Value =    int(input("\033[96m > Maximum Threshold Value                        : \033[0m"))
Min_Value =    int(input("\033[96m > Minimum Threshold Value                        : \033[0m"))

print("-"*60)

client = ModbusTcpClient(ip_add)

def random_float(low, high):
    return random.random()*(high-low) + low

print(f"\033[92m[+]Info : Updating HR from [{HR_Start_Add} to {HR_Start_Add+HR_to_Write-1}]\033[0m")
print("\033[92m[+]Info : Press 'Ctrl+C' to Stop Simulation.\033[0m")

try:
    while client.connect():
        for i in range(HR_Start_Add,HR_Start_Add+HR_to_Write):
            if i % 2 == 0:
                try:
                    builder = BinaryPayloadBuilder(byteorder = Endian.Big, wordorder=Endian.Little)
                    builder.add_32bit_float(random_float(Min_Value,Max_Value))
                    payload = builder.build()
                    client.write_registers(i,payload,skip_encode=True)
                except:
                    print("\033[91m[+]Error : Unable to Establish a Connection to Modbus TCP Server\033[0m")
                    print("\033[91m----------Closing Client----------\033[0m")
                    break
            else:
                pass
        time.sleep(refresh_time)
except KeyboardInterrupt:
    print("\033[91m[+]Warning : Closing Simulator.\033[0m")
    pass