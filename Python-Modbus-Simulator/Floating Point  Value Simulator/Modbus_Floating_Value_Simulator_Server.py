from pymodbus.constants import Endian
from pymodbus.payload import BinaryPayloadBuilder
from pymodbus.client.sync import ModbusTcpClient
import socket
from pyModbusTCP.server import ModbusServer
import time
import random
import os

os.system("cls")
server_port = 502

server = ModbusServer(socket.gethostbyname(socket.gethostname()),server_port,no_block=True)
server.start()


print(
"""

Modbus TCP Slave/Server Simululator,
For Floating Point Values.

Support this program by donation via PayPal

Author:
Email : eng.innovativ@gmail.com
Github : papercodeIN
PayPal : https://www.paypal.me/pylin23

""")

print("-"*60)
print(f"[+]Info : Modbus TCP Server is Online at IP : {socket.gethostbyname(socket.gethostname())} & PORT : {server_port} ")

print("-"*60)
print("[+]Warning : This Software is Only Use to Simulate Folating Point Values.")


print("-"*60)
HR_Start_Add = input(" > Starting Add. of Holding Register (Don't Enter Odd Number)   : ")
HR_to_Write  = input(" > No. of Holding Register to Simulate (Don't Enter Odd Number) : ")
refresh_time = input(" > Holding Register Update Interval (Seconds)                   : ")
Max_ =         input(" > Maximum Value for Simulation (Integer)                       : ")

client = ModbusTcpClient(socket.gethostbyname(socket.gethostname()))

def random_float(low, high):
    return random.random()*(high-low) + low

print("-"*60)
print(f"[+]Info : Updating HR from [{int(HR_Start_Add)} to {int(HR_Start_Add)+int(HR_to_Write)-1}]")
print("[+]Info : Press 'Ctrl+C' to Stop Simulation.")

try:

    while client.connect():
        for i in range(int(HR_Start_Add),int(HR_to_Write)):
            if i % 2 == 0:
                try:
                    builder = BinaryPayloadBuilder(byteorder = Endian.Big, wordorder=Endian.Little)
                    builder.add_32bit_float(random_float(5,int(Max_)))
                    payload = builder.build()
                    client.write_registers(i,payload,skip_encode=True)
                except:
                    print("[-]Error : Connection Break")
            else:
                pass
        time.sleep(int(refresh_time))

except KeyboardInterrupt:
    server.stop()
    print("-"*60)
    print("[+]Info : Putting Modbus TCP Server Offline.")
    pass