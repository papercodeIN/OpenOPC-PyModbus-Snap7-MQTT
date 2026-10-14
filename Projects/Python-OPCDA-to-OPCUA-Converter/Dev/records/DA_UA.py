from PyQt5 import QtCore, QtGui, QtWidgets
import OpenOPC
import pandas as pd
import time as t
from time import sleep
from opcua import ua, uamethod, Server
from opcua.server.user_manager import UserManager
import threading
import socket
import pywintypes # To avoid timeout error
import sys 
pywintypes.datetime=pywintypes.TimeType


opc = OpenOPC.client()
servers = opc.servers()

DF = pd.DataFrame(columns = ['VAR_NAME','VAR_NODE_ID'])
server_ip_address = socket.gethostbyname(socket.gethostname())
Server_Break = 0

users_db = {"Admin" : "Admin@123"}
state_ua_check = []
state_da_check = []
variable_nodes = []


class Ui_OPC_DA_TO_UA(object):
    def setupUi(self, OPC_DA_TO_UA):
        OPC_DA_TO_UA.setObjectName("OPC_DA_TO_UA")
        OPC_DA_TO_UA.resize(532, 206)
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Fixed, QtWidgets.QSizePolicy.Fixed)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(OPC_DA_TO_UA.sizePolicy().hasHeightForWidth())
        OPC_DA_TO_UA.setSizePolicy(sizePolicy)
        OPC_DA_TO_UA.setAutoFillBackground(False)
        self.centralwidget = QtWidgets.QWidget(OPC_DA_TO_UA)
        self.centralwidget.setObjectName("centralwidget")
        self.label = QtWidgets.QLabel(self.centralwidget)
        self.label.setGeometry(QtCore.QRect(10, 5, 121, 23))
        font = QtGui.QFont()
        font.setPointSize(12)
        font.setBold(True)
        font.setWeight(75)
        self.label.setFont(font)
        self.label.setObjectName("label")
        self.OPC_DA_Server_List = QtWidgets.QComboBox(self.centralwidget)
        self.OPC_DA_Server_List.setGeometry(QtCore.QRect(150, 5, 220, 23))
        self.OPC_DA_Server_List.setObjectName("OPC_DA_Server_List")
        self.Select_OPC_DA_Server = QtWidgets.QPushButton(self.centralwidget)
        self.Select_OPC_DA_Server.setGeometry(QtCore.QRect(380, 5, 140, 23))
        self.Select_OPC_DA_Server.setToolTip("")
        self.Select_OPC_DA_Server.setObjectName("Select_OPC_DA_Server")
        self.Select_Aliases = QtWidgets.QPushButton(self.centralwidget)
        self.Select_Aliases.setGeometry(QtCore.QRect(380, 35, 140, 23))
        self.Select_Aliases.setToolTip("")
        self.Select_Aliases.setObjectName("Select_Aliases")
        self.Aliases_List = QtWidgets.QComboBox(self.centralwidget)
        self.Aliases_List.setGeometry(QtCore.QRect(150, 35, 220, 23))
        self.Aliases_List.setObjectName("Aliases_List")
        self.label_2 = QtWidgets.QLabel(self.centralwidget)
        self.label_2.setGeometry(QtCore.QRect(10, 35, 121, 23))
        font = QtGui.QFont()
        font.setPointSize(12)
        font.setBold(True)
        font.setWeight(75)
        self.label_2.setFont(font)
        self.label_2.setObjectName("label_2")
        self.Start_OPC_UA_Server = QtWidgets.QPushButton(self.centralwidget)
        self.Start_OPC_UA_Server.setGeometry(QtCore.QRect(10, 130, 240, 25))
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Fixed, QtWidgets.QSizePolicy.Fixed)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.Start_OPC_UA_Server.sizePolicy().hasHeightForWidth())
        self.Start_OPC_UA_Server.setSizePolicy(sizePolicy)
        font = QtGui.QFont()
        font.setFamily("Calibri")
        font.setPointSize(14)
        font.setBold(True)
        font.setWeight(75)
        self.Start_OPC_UA_Server.setFont(font)
        self.Start_OPC_UA_Server.setObjectName("Start_OPC_UA_Server")
        self.Stop_OPC_UA_Server = QtWidgets.QPushButton(self.centralwidget)
        self.Stop_OPC_UA_Server.setGeometry(QtCore.QRect(280, 130, 240, 25))
        font = QtGui.QFont()
        font.setFamily("Calibri")
        font.setPointSize(14)
        font.setBold(True)
        font.setWeight(75)
        self.Stop_OPC_UA_Server.setFont(font)
        self.Stop_OPC_UA_Server.setObjectName("Stop_OPC_UA_Server")
        self.Port_Label = QtWidgets.QLabel(self.centralwidget)
        self.Port_Label.setGeometry(QtCore.QRect(10, 100, 121, 23))
        font = QtGui.QFont()
        font.setPointSize(12)
        font.setBold(True)
        font.setWeight(75)
        self.Port_Label.setFont(font)
        self.Port_Label.setObjectName("Port_Label")
        self.User_Port = QtWidgets.QLineEdit(self.centralwidget)
        self.User_Port.setGeometry(QtCore.QRect(150, 100, 91, 23))
        self.User_Port.setObjectName("User_Port")
        self.Dynamic_Port = QtWidgets.QCheckBox(self.centralwidget)
        self.Dynamic_Port.setGeometry(QtCore.QRect(250, 100, 141, 23))
        font = QtGui.QFont()
        font.setFamily("Calibri")
        font.setPointSize(12)
        self.Dynamic_Port.setFont(font)
        self.Dynamic_Port.setObjectName("Dynamic_Port")
        self.DefaultPort = QtWidgets.QCheckBox(self.centralwidget)
        self.DefaultPort.setGeometry(QtCore.QRect(390, 100, 141, 23))
        font = QtGui.QFont()
        font.setFamily("Calibri")
        font.setPointSize(12)
        self.DefaultPort.setFont(font)
        self.DefaultPort.setToolTip("")
        self.DefaultPort.setObjectName("DefaultPort")
        self.Object_Node_Name = QtWidgets.QLineEdit(self.centralwidget)
        self.Object_Node_Name.setGeometry(QtCore.QRect(150, 65, 221, 23))
        self.Object_Node_Name.setObjectName("Object_Node_Name")
        self.Port_Label_2 = QtWidgets.QLabel(self.centralwidget)
        self.Port_Label_2.setGeometry(QtCore.QRect(10, 65, 121, 23))
        font = QtGui.QFont()
        font.setPointSize(12)
        font.setBold(True)
        font.setWeight(75)
        self.Port_Label_2.setFont(font)
        self.Port_Label_2.setObjectName("Port_Label_2")
        self.Set_Object_Node = QtWidgets.QPushButton(self.centralwidget)
        self.Set_Object_Node.setGeometry(QtCore.QRect(380, 65, 140, 23))
        self.Set_Object_Node.setToolTip("")
        self.Set_Object_Node.setObjectName("Set_Object_Node")
        OPC_DA_TO_UA.setCentralWidget(self.centralwidget)
        self.menubar = QtWidgets.QMenuBar(OPC_DA_TO_UA)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 532, 21))
        self.menubar.setObjectName("menubar")
        self.menuFile = QtWidgets.QMenu(self.menubar)
        self.menuFile.setObjectName("menuFile")
        self.menuHelp = QtWidgets.QMenu(self.menubar)
        self.menuHelp.setObjectName("menuHelp")
        OPC_DA_TO_UA.setMenuBar(self.menubar)
        self.statusbar = QtWidgets.QStatusBar(OPC_DA_TO_UA)
        self.statusbar.setObjectName("statusbar")
        OPC_DA_TO_UA.setStatusBar(self.statusbar)
        self.About = QtWidgets.QAction(OPC_DA_TO_UA)
        self.About.setObjectName("About")
        self.Exit = QtWidgets.QAction(OPC_DA_TO_UA)
        self.Exit.setObjectName("Exit")
        self.actionAbout = QtWidgets.QAction(OPC_DA_TO_UA)
        self.actionAbout.setObjectName("actionAbout")
        self.Exit_2 = QtWidgets.QAction(OPC_DA_TO_UA)
        self.Exit_2.setObjectName("Exit_2")
        self.actionOPC_UA_Users = QtWidgets.QAction(OPC_DA_TO_UA)
        self.actionOPC_UA_Users.setStatusTip("")
        self.actionOPC_UA_Users.setObjectName("actionOPC_UA_Users")
        self.actionView_OPC_UA_Users = QtWidgets.QAction(OPC_DA_TO_UA)
        self.actionView_OPC_UA_Users.setObjectName("actionView_OPC_UA_Users")
        self.actionStop_OPC_UA_Server = QtWidgets.QAction(OPC_DA_TO_UA)
        self.actionStop_OPC_UA_Server.setObjectName("actionStop_OPC_UA_Server")
        self.actionStart_OPC_UA_Server = QtWidgets.QAction(OPC_DA_TO_UA)
        self.actionStart_OPC_UA_Server.setObjectName("actionStart_OPC_UA_Server")
        self.actionRemove_OPC_UA_Users = QtWidgets.QAction(OPC_DA_TO_UA)
        self.actionRemove_OPC_UA_Users.setObjectName("actionRemove_OPC_UA_Users")
        self.menuFile.addAction(self.actionStart_OPC_UA_Server)
        self.menuFile.addAction(self.actionStop_OPC_UA_Server)
        self.menuFile.addAction(self.actionView_OPC_UA_Users)
        self.menuFile.addSeparator()
        self.menuFile.addAction(self.Exit_2)
        self.menuHelp.addAction(self.actionAbout)
        self.menubar.addAction(self.menuFile.menuAction())
        self.menubar.addAction(self.menuHelp.menuAction())

        self.retranslateUi(OPC_DA_TO_UA)
        QtCore.QMetaObject.connectSlotsByName(OPC_DA_TO_UA)
        self.OPC_DA_Server_List.setToolTip("List of Available OPC-DA Server in System")
        self.Select_OPC_DA_Server.setToolTip("Select OPC-DA Server")
        self.Select_Aliases.setToolTip("Select Aliase from OPC-DA Server")
        self.Aliases_List.setToolTip("List of Available Aliase in Selected OPC-DA Server")
        self.Start_OPC_UA_Server.setToolTip("Start OPC-UA Server")
        self.Stop_OPC_UA_Server.setToolTip("Stop Running OPC-UA Server")
        self.User_Port.setToolTip("Use Other then Predefine Port for OPC-UA Server")
        self.DefaultPort.setToolTip("Use Predefine Port for OPC-UA Server")     


        self.Start_OPC_UA_Server.setEnabled(False)
        self.Stop_OPC_UA_Server.setEnabled(False)

        self.OPC_DA_Server_List.addItems(servers)
        self.Select_OPC_DA_Server.clicked.connect(self.DA_SELECT)
        self.Select_Aliases.clicked.connect(self.ALIASES_SELECT)
        self.Start_OPC_UA_Server.clicked.connect(self.OPC_UA_SERVER)
        self.Set_Object_Node.clicked.connect(self.GET_NODE_NAME)
        self.Stop_OPC_UA_Server.clicked.connect(self.break_server)
        self.Dynamic_Port.stateChanged.connect(self.dynamic_port)
        self.DefaultPort.stateChanged.connect(self.default_port) 
        self.Exit_2.triggered.connect(self.exitApp)

    def retranslateUi(self, OPC_DA_TO_UA):
        _translate = QtCore.QCoreApplication.translate
        OPC_DA_TO_UA.setWindowTitle(_translate("OPC_DA_TO_UA", "OPC-DA to OPC-UA Converter"))
        self.label.setText(_translate("OPC_DA_TO_UA", "OPC DA Server"))
        self.Select_OPC_DA_Server.setText(_translate("OPC_DA_TO_UA", "Select OPC-DA Server"))
        self.Select_Aliases.setText(_translate("OPC_DA_TO_UA", "Set Aliase"))
        self.label_2.setText(_translate("OPC_DA_TO_UA", "Aliases"))
        self.Start_OPC_UA_Server.setText(_translate("OPC_DA_TO_UA", "Start OPC-UA Server"))
        self.Stop_OPC_UA_Server.setText(_translate("OPC_DA_TO_UA", "Stop OPC-UA Server"))
        self.Port_Label.setText(_translate("OPC_DA_TO_UA", "Port"))
        self.Dynamic_Port.setText(_translate("OPC_DA_TO_UA", "Use Dynamic Port"))
        self.DefaultPort.setText(_translate("OPC_DA_TO_UA", "Use Default Port"))
        self.Port_Label_2.setText(_translate("OPC_DA_TO_UA", "Object Node"))
        self.Set_Object_Node.setText(_translate("OPC_DA_TO_UA", "Set Object Node"))
        self.menuFile.setTitle(_translate("OPC_DA_TO_UA", "File"))
        self.menuHelp.setTitle(_translate("OPC_DA_TO_UA", "Help"))
        self.About.setText(_translate("OPC_DA_TO_UA", "About"))
        self.Exit.setText(_translate("OPC_DA_TO_UA", "Exit"))
        self.actionAbout.setText(_translate("OPC_DA_TO_UA", "About"))
        self.Exit_2.setText(_translate("OPC_DA_TO_UA", "Exit"))
        self.actionOPC_UA_Users.setToolTip(_translate("OPC_DA_TO_UA", "OPC-UA Users"))
        self.actionView_OPC_UA_Users.setText(_translate("OPC_DA_TO_UA", "View OPC-UA Users"))
        self.actionStop_OPC_UA_Server.setText(_translate("OPC_DA_TO_UA", "Stop OPC-UA Server"))
        self.actionStart_OPC_UA_Server.setText(_translate("OPC_DA_TO_UA", "Start OPC-UA Server"))


    def DA_SELECT(self):
        self.Aliases_List.clear()
        global OPC_DA_SERVER_NAME
        OPC_DA_SERVER_NAME = self.OPC_DA_Server_List.currentText()
        self.statusbar.showMessage(f"Selected OPC-DA Server is  : {OPC_DA_SERVER_NAME}")
        try: 
            opc.connect(OPC_DA_SERVER_NAME)
            self.Aliases_List.addItems(opc.list())
            self.statusbar.showMessage(f"Connected With {OPC_DA_SERVER_NAME} OPC-DA Server.")
        except : 
            self.statusbar.showMessage(f"Unable to Connect With OPC-DA Server : {OPC_DA_SERVER_NAME}")
            pass

    def ALIASES_SELECT(self):
        global variables,state_ua,state_da
        ALIASE_NAME = self.Aliases_List.currentText()
        self.statusbar.showMessage(f"Selected OPC-DA Server Aliase is  : {ALIASE_NAME}")
        variables = opc.list('{}*'.format(ALIASE_NAME), recursive=True) + opc.list('{}*'.format(ALIASE_NAME), flat=True)
        variables = sorted(list(set([ x for x in variables if "#" not in x ])))
        
        for element in opc.list(f'{ALIASE_NAME}.*'):
            try:
                variables.remove(str(f"PLC!{element}"))
            except:
                pass
        state_ua = [0] * len(variables)
        state_da = [0] * len(variables)

        DF['VAR_NAME'] = variables


    def UA_Server_Setup(self):
        global server,server_var,variable_nodes,myobj

        def user_manager(isession, username, password):
            isession.user = UserManager.User
            return username in users_db and password == users_db[username]  

        try: 

            server = Server()
            server.set_endpoint("opc.tcp://{ip}:{prt}".format(ip=server_ip_address,prt=str(port)))
            server.set_server_name("Python-OPC-UA-Secure-Server")

            policyIDs = ["Username"]
            server.set_security_IDs(policyIDs)
            server.user_manager.set_user_manager(user_manager)            

            idx = server.register_namespace("OPCUA_SERVER")
            objects = server.get_objects_node()
            myobj = objects.add_object(idx, object_node)

            for row in range(0,len(DF)): 
                V_Name = myobj.add_variable(idx ,DF["VAR_NAME"][row],0,ua.VariantType.Float)
                variable_nodes.append(str(V_Name))
                self.statusbar.showMessage(f"Variable Added {row}/{len(DF)}")
                V_Name.set_writable()
            
            DF_1['VAR_NODE_ID'] = variable_nodes
            server.start()

            self.Stop_OPC_UA_Server.setEnabled(True)
            self.Start_OPC_UA_Server.setEnabled(False)
            self.statusbar.showMessage(f"OPC-UA Server is Online at : opc.tcp://{server_ip_address}:{port} ")
            
            objects = server.get_objects_node()
            par_var = objects.get_children()[1]
            server_var = par_var.get_children()

        except Exception as e:
            server.stop()
            self.Start_OPC_UA_Server.setEnabled(True)
            self.statusbar.showMessage("OPC-UA Server is Offline")
            print("""
            Error : 
            {}
            """.format(e))
                    
    def GET_NODE_NAME(self):
        global object_node
        object_node = self.Object_Node_Name.text()
        self.statusbar.showMessage(f"Object Name ' {object_node} ' Added Under the Object Node.")

    def break_server(self):        
        global Server_Break
        if Server_Break == 0:
            Server_Break = 1
            self.Start_OPC_UA_Server.setEnabled(True)
            self.Stop_OPC_UA_Server.setEnabled(False)
            self.statusbar.showMessage("OPC-UA Server is Offline")             
        else:
            pass

    def dynamic_port(self,checked):
        global port
        if checked:
            self.DefaultPort.setEnabled(False)
            if not self.User_Port.text():
                self.User_Port.setEnabled(True)
                self.Start_OPC_UA_Server.setEnabled(False)
            else:
                port = self.User_Port.text()
                self.statusbar.showMessage(f"Port for OPC-UA Serevr is : {port}")
                self.User_Port.setEnabled(False)
                self.Start_OPC_UA_Server.setEnabled(True)
        else:
            self.User_Port.setEnabled(True)
            self.DefaultPort.setEnabled(True)
            self.Start_OPC_UA_Server.setEnabled(False)
            pass

    def default_port(self,checked):
        global port
        if checked:
            port = 4840
            self.statusbar.showMessage(f"Port for OPC-UA Serevr is : {port}")
            self.User_Port.setEnabled(False)
            self.Dynamic_Port.setEnabled(False)
            self.Start_OPC_UA_Server.setEnabled(True)
            
        else:
            self.Start_OPC_UA_Server.setEnabled(False)
            self.User_Port.setEnabled(True)
            self.Dynamic_Port.setEnabled(True)
            pass




    def OPC_UA_SERVER(self):
        global Server_Break,server,object_node,port,user_db,server_var

        # def get_da_value():
        #     global variables,state_ua,state_da,state_ua_check,state_da_check,variable_nodes
        #     for name,value,quality,time in opc.read(variables):
        #         state_da_check.append(value)        

        # def update_ua():  
        #     global variables,state_ua,state_da,state_ua_check,state_da_check,variable_nodes

        #     get_da_value()

        #     if state_da != state_da_check:
        #         state_da = state_da_check[:]
        #         for i in range(0,len(state_da)):
        #             server_var[i].set_data_value(state_da[i],ua.VariantType.Float)
        #     state_da_check.clear()      

        # def update_da():
        #     global variables,state_ua,state_da,state_ua_check,state_da_check,variable_nodes
        #     for i in range(0,len(variables)):
        #         node_id = DF.loc[DF['VAR_NAME'] == variables[i] , 'VAR_NODE_ID'].values[0]
        #         if state_ua[i] != server.get_node(node_id).get_value() :
        #             state_ua[i] = server.get_node(node_id).get_value()
        #             opc.write((variables[i], state_ua[i]))

        def write():
            global Server_Break,server_var

            while 1:
                if Server_Break == 1:
                    opc.close()
                    print("OPC Close Done")
                    server.stop()
                    Server_Break = 0
                    break

                else:    
                    start = t.time()
                    DF_2 = pd.DataFrame(opc.read(variables), columns = ['VAR_NAME_2','VAR_VALUE','QUALITY','TIME'])
                    DF = pd.concat([DF,DF_2], axis=1 )
                    print(f"OPC_DA Read and Load DF Time = {t.time() - start}")

                    # for name, value, quality, time in opc.read(variables): DF.loc[DF['VAR_NAME'] == name , 'VAR_VALUE' ] = value
                    
                    start_2 = t.time()
                    for i in range (0,len(DF)): 
                        server_var[i].set_data_value(float(DF["VAR_VALUE"][i]),ua.VariantType.Float)
                    print(f"OPC-UA Update Time = {t.time() - start_2}")
                    DF.drop(['VAR_NAME_2','VAR_VALUE','QUALITY','TIME'],inplace=True, axis=1)

        # def write():
        #     global Server_Break
        #     while 1:
        #         if Server_Break == 1:
        #             opc.close()
        #             server.stop()
        #             Server_Break = 0
        #             break            
        #         else:
        #             update_ua()
        #             update_da()
        #             sleep(0.25)

        try: 
            self.UA_Server_Setup()

        except Exception as e:
            print("""
            Error : 
            {}
            """.format(e))

        finally:
            main = threading.Thread(target=write())
            main.start()
            main.join()
            # write()

    def exitApp(self):
        global server
        try:
            server.stop()
            opc.close()
            self.break_server()
            sys.exit()
        except:
            opc.close()
            self.break_server()
            sys.exit()            


if __name__ == "__main__":
    app = QtWidgets.QApplication(sys.argv)
    OPC_DA_TO_UA = QtWidgets.QMainWindow()
    ui = Ui_OPC_DA_TO_UA()
    ui.setupUi(OPC_DA_TO_UA)
    OPC_DA_TO_UA.show()
    sys.exit(app.exec_())

# python -m PyQt5.uic.pyuic OPC_DA_2_UA.ui -o test.py -x
# pyinstaller --hiddenimport win32timezone --noconsole DA_UA.py

