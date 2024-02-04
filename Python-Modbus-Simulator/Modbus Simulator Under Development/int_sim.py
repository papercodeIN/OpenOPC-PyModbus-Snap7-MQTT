from pymodbus.constants import Endian
from pymodbus.payload import BinaryPayloadBuilder
from pymodbus.client.sync import ModbusTcpClient
import time
import random
import os
os.system("color")
os.system('cls' if os.name=='nt' else 'clear')

print("-"*60)
print("\033[92m[+]Info : It will Only use to Simulate INT Values.\033[0m")
print("-"*60)

HR_Start_Add = int(input("\033[96m > Starting Add. of HR                            : \033[0m"))
HR_to_Write  = int(input("\033[96m > No. of HR to Simulate                          : \033[0m"))
refresh_time = int(input("\033[96m > Holding Register Update Interval (Seconds)     : \033[0m"))
ip_add =       input("\033[96m > IP Address of Modbus TCP Server                : \033[0m")
Max_Value =    int(input("\033[96m > Maximum Threshold Value                        : \033[0m"))
Min_Value =    int(input("\033[96m > Minimum Threshold Value                        : \033[0m"))
print("-"*60)

client = ModbusTcpClient(ip_add, port=503)


print(f"\033[92m[+]Info : Updating HR from [{HR_Start_Add} to {HR_Start_Add+HR_to_Write-1}]\033[0m")
print("\033[92m[+]Info : Press 'Ctrl+C' to Stop Simulation.\033[0m")

try:
    while client.connect():
        for i in range(HR_Start_Add,HR_Start_Add+HR_to_Write):
            try:
                client.write_registers(i,random.randint(Min_Value,Max_Value))
            except:
                print("\033[91m[+]Error : Unable to Establish a Connection to Modbus TCP Server\033[0m")
                print("\033[91m----------Closing Client----------\033[0m")
                break
        time.sleep(refresh_time)

except KeyboardInterrupt:
    print("\033[91m[+]Warning : Closing Simulator.\033[0m")
    pass