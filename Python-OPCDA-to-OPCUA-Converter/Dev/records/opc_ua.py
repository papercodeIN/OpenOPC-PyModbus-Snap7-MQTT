import pandas as pd
import time as t
from opcua import ua, uamethod, Server
from opcua.server.user_manager import UserManager
import socket

users_db = {"Admin" : "Admin@123"}
server_ip_address = socket.gethostbyname(socket.gethostname())

def user_manager(isession, username, password):
    isession.user = UserManager.User
    return username in users_db and password == users_db[username]  

# def init():
#     print("[+]Info : Server Init.")
#     server = Server()
#     print(server)
#     return server
# 	# return Server()

def setup_ua(port, object_node, tags_r, tags_w):
    global server

    variable_nodes_r = []
    variable_nodes_w = []

    server = Server()
    server.set_endpoint("opc.tcp://{ip}:{prt}".format(ip=server_ip_address,prt=str(port)))
    # print("Endpoint : opc.tcp://{ip}:{prt}".format(ip=server_ip_address,prt=str(port)))
    server.set_server_name("Python OPC-UA Server")

    policyIDs = ["Username"]
    server.set_security_IDs(policyIDs)
    server.user_manager.set_user_manager(user_manager)     

    idx = server.register_namespace("OPCUA_SERVER")
    objects = server.get_objects_node()
    myobj = objects.add_object(idx, object_node)
    # print(f"MyObject NS and ID : {myobj}")
    # print(f"NameSpace ID : {idx}")

    for row in range(0,len(tags_r)): 
        V_Name_r = myobj.add_variable(idx ,tags_r[row],0,ua.VariantType.Float)
        # print(f"Varibale : {tags[row]} : NameSpace and ID : {V_Name_r}")
        print(f"[+]Info : Adding Varibale to OPC-UA Server {row}/{len(tags_r)}")
        variable_nodes_r.append(str(V_Name_r))
        V_Name_r.set_read_only()

    for row in range(0,len(tags_w)): 
        V_Name_w = myobj.add_variable(idx ,tags_w[row],0,ua.VariantType.Float)
        # print(f"Varibale : {tags[row]} : NameSpace and ID : {V_Name_w}")
        print(f"[+]Info : Adding Varibale to OPC-UA Server {row}/{len(tags_w)}")
        variable_nodes_w.append(str(V_Name_w))
        V_Name_w.set_writable()

    print("[+]Info : All Variable is Added to Server.")
    objects = server.get_objects_node()
    par_var = objects.get_children()[1]
    server_var = par_var.get_children()

    print (variable_nodes_w) 
    return server, myobj, idx, variable_nodes_r, variable_nodes_w, server_var

def start_ua_server(server, port):
    try:
        server.start()
        link = "opc.tcp://{ip}:{prt}".format(ip=server_ip_address,prt=str(port))
        return True, f"[+]Info : {t.ctime(t.time())} : OPC-UA Server Start", link
    except:
        link = ""
        return False, f"[-]Error : {t.ctime(t.time())} : OPC-UA Server is Unable to Start", link

def stop_ua_server(server):
    try:
        server.stop()
        return True, f"[+]Info : {t.ctime(t.time())} : OPC-UA Server is Stop."
    except:
        return False, f"[-]Error : {t.ctime(t.time())} : OPC-UA Server is Unable to Stops"

def _write(server_var,DF):
    try:
        for i in range (0,len(DF)): 
            server_var[i].set_data_value(float(DF["VAR_VALUE"][i]),ua.VariantType.Float)
        return True, f"[+]Info : {t.ctime(t.time())} : {len(DF)} No. of Variables Updated to OPC-UA Server"
    except:
        return False , f"[+]Error : {t.ctime(t.time())} : Unable to Update Varibale to OPC-UA Server"
