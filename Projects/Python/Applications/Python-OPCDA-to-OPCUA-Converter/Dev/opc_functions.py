import OpenOPC
import pywintypes
import pandas as pd
import time as t

from opcua import ua, uamethod, Server
from opcua.server.user_manager import UserManager
import socket
pywintypes.datetime=pywintypes.TimeType

def start_da():
    return OpenOPC.client()


def servers_da(opc):
    return opc.servers()


def connect_da(opc, server):
    try:
        opc.connect(server)
        info = dict(opc.info())
        if info['OPC Server'] == server:
            connected = True
        else:
            connected = False
    except Exception:
        connected = False
    return connected

def _tag_management(opc, OPC_Tags):
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

def tags_da(opc):
    return sorted(_tag_management(opc, (list(set([ x for x in (opc.list(recursive=True) + opc.list(flat=True)) if "#" not in x ])))))


def read_da(opc, tags):
    results = opc.read(tags)
    return demux_results_da(results)

def _disconn_opc_da(opc):
    try:
        opc.close()
        return True, f"[+]Info : {t.ctime(t.time())} : Disconnected from OPC-DA Server."
    except:
        return False, f"[+]Info : {t.ctime(t.time())} : Unable to Disconnect from OPC-DA Server."

def demux_results_da(results):
    tags = [tag for tag, value, status, time in results]
    values = [value for tag, value, status, time in results]
    statuses = [status for tag, value, status, time in results]
    times = [time for tag, value, status, time in results]
    return tags, values, statuses, times



users_db = {"Admin" : "Admin@123"}
server_ip_address = socket.gethostbyname(socket.gethostname())

def user_manager(isession, username, password):
    isession.user = UserManager.User
    return username in users_db and password == users_db[username]  



def setup_ua(port, tags_r, tags_w):
    global server

    variable_nodes_r = []
    variable_nodes_w = []

    server = Server()
    server.set_endpoint("opc.tcp://{ip}:{prt}".format(ip=server_ip_address,prt=str(port)))
    server.set_server_name("Python OPC-UA Server")
    idx = server.register_namespace("OPCUA_SERVER")

    uri = "urn:opcua:python:server"
    server.set_application_uri(uri)

    # server.set_security_policy([
    #                                 # ua.SecurityPolicyType.NoSecurity,
    #                                 # ua.SecurityPolicyType.Basic128Rsa15_Sign,
    #                                 # ua.SecurityPolicyType.Basic128Rsa15_SignAndEncrypt,
    #                                 ua.SecurityPolicyType.Basic256Sha256_Sign,
    #                                 # ua.SecurityPolicyType.Basic256Sha256_SignAndEncrypt
    #                             ])

    policyIDs = ["Username"]
    server.set_security_IDs(policyIDs)
    server.user_manager.set_user_manager(user_manager)


    objects = server.get_objects_node()
    myobj_r = objects.add_object(idx, "Readable")
    myobj_w = objects.add_object(idx, "Writable")


    for row in range(0,len(tags_r)): 

        # If you want Numeric ID of varibales
        V_Name_r = myobj_r.add_variable(idx ,tags_r[row],0)
        
        # If you want string ID of varibales
        # V_Name_r = myobj_r.add_variable(NodeId(f"0:{tags_r[row]}",idx) ,tags_r[row],0,ua.VariantType.Float)

        print(f"[+]Info : Adding Varibale to OPC-UA Server {row}/{len(tags_r)}")
        
        variable_nodes_r.append(str(V_Name_r))
        V_Name_r.set_read_only()

    for row in range(0,len(tags_w)): 
        
        # If you want Numeric ID of varibales
        V_Name_w = myobj_w.add_variable(idx ,tags_w[row],0)

        # If you want string ID of varibales
        # V_Name_r = myobj_r.add_variable(NodeId(f"0:{tags_r[row]}",idx) ,tags_r[row],0,ua.VariantType.Float)        
        
        print(f"[+]Info : Adding Varibale to OPC-UA Server {row}/{len(tags_w)}")
        
        variable_nodes_w.append(str(V_Name_w))
        V_Name_w.set_writable()

    print("[+]Info : All Variable is Added to Server.")

    objects = server.get_objects_node()

    # par_var = objects.get_children()[1]

    server_var_r = objects.get_children()[1].get_children()
    print(server_var_r)

    server_var_w = objects.get_children()[2].get_children()
    print(server_var_w)

    # server.start()
    # print(server_var)
    serever_status, log, link = start_ua_server(port)

    # print (variable_nodes_w) 
    return variable_nodes_r, variable_nodes_w, server_var_r, server_var_w, link

def start_ua_server(port):
    global server
    try:
        server.start()
        link = "opc.tcp://{ip}:{prt}".format(ip=server_ip_address,prt=str(port))
        return True, f"[+]Info : {t.ctime(t.time())} : OPC-UA Server Start", link
    except:
        link = ""
        return False, f"[-]Error : {t.ctime(t.time())} : OPC-UA Server is Unable to Start", link

def stop_ua_server():
    global server
    try:
        server.stop()
        return True, f"[+]Info : {t.ctime(t.time())} : OPC-UA Server is Stop."
    except:
        return False, f"[-]Error : {t.ctime(t.time())} : OPC-UA Server is Unable to Stops"

def _write(server_var,DF):
    try:
        for i in range (0,len(DF)): 
            server_var[i].set_data_value(DF["VAR_VALUE"][i])
        return True, f"[+]Info : {t.ctime(t.time())} : {len(DF)} No. of Variables Updated to OPC-UA Server"
    except:
        return False , f"[+]Error : {t.ctime(t.time())} : Unable to Update Varibale to OPC-UA Server"




def get_da_value(opc, w_varibales, current_da_value):

    # print("Varibales read lenght : " , len(w_varibales))

    for name,value,quality,time in opc.read(w_varibales):
        current_da_value.append(value)
    # print("Current DA Value : " , len(current_da_value))

def update_ua(opc, w_varibales, ua_server_var, current_da_value, previous_da_value):  
    print("[+]Info :  Inside Update UA")

    get_da_value(opc, w_varibales, current_da_value)

    if previous_da_value != current_da_value:
        previous_da_value = current_da_value[:]

        print(len(previous_da_value))
        for i in range(0,len(previous_da_value)):
            print(i)
            ua_server_var[i].set_data_value(previous_da_value[i])

    current_da_value.clear()      

def update_da(opc, server, w_varibales, DF, previous_ua_value):
    print("[+]Info :  Inside Update DA")

    for i in range(0,len(w_varibales)):
        node_id = DF.loc[DF['VAR_NAME'] == w_varibales[i] , 'VAR_NODE_ID'].values[0]
        print(node_id)
        if previous_ua_value[i] != server.get_node(node_id).get_value() :
            previous_ua_value[i] = server.get_node(node_id).get_value()
            opc.write((w_varibales[i], previous_ua_value[i]))

def da_ua_sync(server, opc, w_varibales, ua_server_var, DF, current_da_value, previous_da_value, previous_ua_value):
    update_da(opc, server, w_varibales, DF, previous_ua_value)
    update_ua(opc, w_varibales, ua_server_var, current_da_value, previous_da_value)
