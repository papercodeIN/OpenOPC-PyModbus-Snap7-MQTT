from pyModbusTCP.server import ModbusServer
import os
os.system("color")
os.system('cls' if os.name=='nt' else 'clear')

server_ip_address = "127.0.0.1"
server_port = 503

print(f"\033[92m[+]Info : IP Address for Modbus Server : {server_ip_address} \033[0m")
server = ModbusServer(server_ip_address,server_port,no_block=True)
server.start()
print(f"\033[92m[+]info : Server is Online on IP : {server_ip_address} and PORT : {server_port} \033[0m")

try:
    while 1:
        pass
except KeyboardInterrupt:
    print("\033[91m[-]Warning : Stopping Modbus TCP Server.\033[0m")
    server.stop()
