import sys
import pandas as pd
from PyQt5.QtWidgets import QHBoxLayout,QDockWidget,QStatusBar,QApplication,QVBoxLayout,QPushButton,QComboBox,QListWidget,QGroupBox
from PyQt5.QtWidgets import QLabel,QLineEdit,QTextEdit,QWidget,QAbstractItemView,QMainWindow,QMenu,QCheckBox,QFileDialog,QMenuBar
from PyQt5.QtCore import QTimer,Qt,QRegExp,QCoreApplication
from PyQt5.QtGui import QRegExpValidator
import opc_functions
import threading

DF_R = pd.DataFrame(columns = ['VAR_NAME','VAR_NODE_ID', 'VAR_NAME_2' , 'VAR_VALUE', 'QUALITY', 'TIME'])
DF_W = pd.DataFrame(columns = ['VAR_NAME','VAR_NODE_ID', 'VAR_NAME_2' , 'VAR_VALUE', 'QUALITY', 'TIME'])


class MainWindow(QMainWindow):
    def __init__(self, opc=None, server=None):
        super(MainWindow, self).__init__()

        self.opc = opc
        self.server = server

        self.setWindowTitle('OPC-DA to OPC-UA Converter')

        # self.menuBar = QMenuBar(self)
        # # fileMenu = QMenu("&File", self)
        # fileMenu = self.menuBar.addMenu("&File")
        # editMenu = self.menuBar.addMenu("&Edit")
        # helpMenu = self.menuBar.addMenu("&Help")

        self.layout = QHBoxLayout(self)

        self.configuration = Configuration(self, opc)
        self.configuration_dock = QDockWidget("OPC-DA Configuration", self)
        self.configuration_dock.setWidget(self.configuration)
        self.configuration_dock.setFeatures(QDockWidget.NoDockWidgetFeatures)
        self.addDockWidget(Qt.LeftDockWidgetArea, self.configuration_dock)

        self.ua_config_area = OpcUA_Configuration_Area(self)
        self.ua_config_dock = QDockWidget("OPC-UA Configuration", self)
        self.ua_config_dock.setWidget(self.ua_config_area)
        self.ua_config_dock.setFeatures(QDockWidget.NoDockWidgetFeatures)
        self.addDockWidget(Qt.RightDockWidgetArea, self.ua_config_dock)

        self.logging_area = OpcUAServer_Logs(self)
        self.logging_dock = QDockWidget("System Logs", self)
        self.logging_dock.setWidget(self.logging_area)
        self.logging_dock.setFeatures(QDockWidget.NoDockWidgetFeatures)
        self.addDockWidget(Qt.BottomDockWidgetArea, self.logging_dock)


        self.statusbar = QStatusBar(self)
        self.setStatusBar(self.statusbar)

        self.setLayout(self.layout)
        self.resize(900, 600)
        # self.showMaximized()
        
        self.ua_config_area.endpoint_url.setReadOnly(True)

        # self.logging_timer = QTimer(self)
        # self.logging_timer.timeout.connect(self._loogging_callback)

    def _setup_server(self):
        print("[+]Info : Inside Setup and Start Server.")
        global DF_R

        self.tags_r = self.configuration.tag_selection.selected_tags_r()
        print(f"[+]Info : Tagss Selected Read : {(self.tags_r)}")

        self.tags_w = self.configuration.tag_selection.selected_tags_w()
        print(f"[+]Info : Tagss Selected Write : {(self.tags_w)}")

        self.port = self.ua_config_area.port.text()
        # self.ONN = self.ua_config_area.ONode_Name.text()
        
        self.statusbar.showMessage("Setting UP OPC-UA Server...",10000)

        self.variable_nodes_r, self.variable_nodes_w, self.server_var_r, self.server_var_w, link = opc_functions.setup_ua(self.port, self.tags_r, self.tags_w)
        self.ua_config_area.endpoint_url.setText(link)
        self.configuration_dock.setEnabled(False)

        DF_R['VAR_NAME'] = (self.tags_r)
        DF_R['VAR_NODE_ID'] = (self.variable_nodes_r)

        DF_W['VAR_NAME'] = (self.tags_w)
        DF_W['VAR_NODE_ID'] = (self.variable_nodes_w)

        # self.server_var_w = self.server_var.remove(self.server_var[len(self.variable_nodes_w)])
        # print(self.server_var.remove(self.server_var[len(self.variable_nodes_w)]))

        self.previous_da_value = []
        self.current_da_value = [] 
        self.previous_ua_value = [0] * len(self.tags_w)

        print("Len previous_da_value " , self.previous_da_value)
        print("Len current_da_value " , self.current_da_value)
        print("Len previous_ua_value " , self.previous_ua_value)

        self.logging_timer = QTimer(self)
        self.logging_timer.timeout.connect(self._loogging_callback)

        self.logging_timer.start(int(self.ua_config_area.UD_Rate.text()) * 1000)
        self.statusbar.showMessage("OPC-UA Server is Ready to Start",5000)

    # def _start_server(self):
        
    #     # var_name, values, status, time = opc_functions.read_da(self.opc, self.tags_r)
    #     start_status, log, link = opc_functions.start_ua_server(self.port)

    #     self.ua_config_area.endpoint_url.setText(link)
        
    #     self.configuration_dock.setEnabled(False)

    #     self.logging_area.te_logging.clear()
    #     self.logging_area.te_logging.append(log)

    #     # self.logging_timer.start(int(self.ua_config_area.UD_Rate.text()) * 1000)
    #     self.statusbar.showMessage("OPC-UA Server Start",5000)

    # def _data_thread(self):
    #     print("[+]Info : Inside Data Thread")
    #     write_status, log = opc_functions._write(self.server_var_r, DF_R)
    #     opc_functions.da_ua_sync(self.server, self.opc, self.tags_w, self.server_var_w, DF_W, self.current_da_value, self.previous_da_value, self.previous_ua_value)
    #     self.logging_area.te_logging.append(log)

    def _loogging_callback(self):
        print("[+]Info : Inside Callback")
        global DF_R
        DF_R['VAR_NAME_2'], DF_R['VAR_VALUE'], DF_R['QUALITY'], DF_R['TIME'] = opc_functions.read_da(self.opc, self.tags_r)
        # DF_W['VAR_NAME_2'], DF_W['VAR_VALUE'], DF_W['QUALITY'], DF_W['TIME'] = opc_functions.read_da(self.opc, self.tags_w)
        write_status, log = opc_functions._write(self.server_var_r, DF_R)
        opc_functions.da_ua_sync(self.server, self.opc, self.tags_w, self.server_var_w, DF_W, self.current_da_value, self.previous_da_value, self.previous_ua_value)
        self.logging_area.te_logging.append(log)
        # data_thread = threading.Thread(target=self._data_thread)
        # data_thread.start()
        # data_thread.join()
        
        DF_R.drop(['VAR_NAME_2','VAR_VALUE','QUALITY','TIME'],inplace=True, axis=1)

        

    def _stop_server(self):
        print("[+]Info : Inside Stop Server")
        self.configuration_dock.setEnabled(True)
        self.logging_timer.stop()
        try:
            ua_stop_status, log1 = opc_functions.stop_ua_server()
            da_stop_status, log2 = opc_functions._disconn_opc_da(self.opc)

            if ua_stop_status == True and da_stop_status == True:
                self.logging_area.te_logging.append(log1)
                self.logging_area.te.logging.append(log2)
                self.logging_timer.stop()
                self.statusbar.showMessage("OPC-UA Server Stop",5000)

        except:
            self.statusbar.showMessage("Unable to Stop Process.",5000)
            # self.logging_area.te.logging.append("Unable to Stop Process.")


class Configuration(QWidget):
    def __init__(self, parent=None, opc=None):
        super(Configuration, self).__init__()
        self.layout = QVBoxLayout(self)

        # TagSelection() is inited before Server() but added later (inited)
        self.tag_selection = TagSelecion(self, opc)

        self.server = Server(self, opc, self.tag_selection)
        self.layout.addWidget(self.server)

        # TagSelection() is instanced before Server() but added later (added)
        self.layout.addWidget(self.tag_selection)

        self.setLayout(self.layout)


class Server(QGroupBox):
    def __init__(self, parent=None, opc=None, tag_selection=None):
        super(Server, self).__init__()

        self.opc = opc
        self.tag_selection = tag_selection

        self.setTitle('OPC-DA Server Selection')

        self.layout = QHBoxLayout(self)

        self.button_refresh = QPushButton('Refresh', self)
        self.button_refresh.clicked.connect(self._refresh)
        self.layout.addWidget(self.button_refresh)

        self.combobox_server = QComboBox(self)
        self.layout.addWidget(self.combobox_server)

        self.button_connect = QPushButton('Connect', self)
        self.button_connect.clicked.connect(self._connect)
        self.layout.addWidget(self.button_connect)

        self.setLayout(self.layout)

        self._refresh()

    def _refresh(self):
        servers = opc_functions.servers_da(self.opc)
        self.combobox_server.clear()
        self.combobox_server.addItems(servers)

    def _connect(self):
        self.parent().parent().parent().statusbar.showMessage("Working ...",20000)
        server = self.combobox_server.currentText()
        connected = opc_functions.connect_da(self.opc, server)
        if connected:
            self.parent().parent().parent().statusbar.showMessage(f"Connected With {server} OPC-DA Serevr",5000)
            if self.tag_selection:
                self.tag_selection._refresh()


class TagSelecion(QGroupBox):
    def __init__(self, parent=None, opc=None):
        super(TagSelecion, self).__init__()
        # _translate = QCoreApplication.translate
        
        self.opc = opc

        self.setTitle('Tag Selection')

        self.layout = QVBoxLayout(self)

        # Tag Browse from OPC-DA Server
        # self.browse_server = QCheckBox(self)
        # self.browse_server.setObjectName("From OPC-DA Serevr")
        # # self.browse_server.setText(self, "Dynamic Port")
        # self.layout.addWidget(self.browse_server)

        # self.hbox_buttons_7 = QHBoxLayout(self)
        # self.browse_server = QCheckBox(self)
        # self.browse_server.setObjectName("Import from OPC-DA SerevrV")
        # self.hbox_buttons_7.addWidget(self.browse_server)
        # self._browse_da_label = QLabel('Import from OPC-DA Serevr', self)      
        # self.hbox_buttons_7.addWidget(self._browse_da_label)
        # self.layout.addLayout(self.hbox_buttons_7)

        self.hbox_buttons_6 = QHBoxLayout(self)
        self.browse_csv = QCheckBox("Import from CSV",self)
        self.browse_csv.setObjectName("Import from CSV")
        self.hbox_buttons_6.addWidget(self.browse_csv)
        self._csv_file_browse = QPushButton("Browse", self)
        self._csv_file_browse.clicked.connect(self.select_csv_file)
        self.hbox_buttons_6.addWidget(self._csv_file_browse)
        self.layout.addLayout(self.hbox_buttons_6)

        # # Tag Browse from CSV Server
        # self.browse_csv = QCheckBox(self)
        # self.browse_csv.setObjectName("Import from CSV")
        # self._browse_csv_label = QLabel('Import from CSV', self)
        # self.layout.addWidget(self.browse_csv)


        self.button_refresh = QPushButton('Refresh Tags', self)
        self.button_refresh.clicked.connect(self._refresh)
        self.layout.addWidget(self.button_refresh)

        # self.button_all = QPushButton('Select All Tags', self)
        # self.button_all.clicked.connect(self._select_all)
        # self.layout.addWidget(self.button_all)

        # self.button_none = QPushButton('Select None', self)
        # self.button_none.clicked.connect(self._select_none)
        # self.layout.addWidget(self.button_none)

        self._read_label = QLabel('Select Read-Only Tags', self)
        self.layout.addWidget(self._read_label)

        self.listr_tags = QListWidget(self)
        self.listr_tags.setSelectionMode(QAbstractItemView.MultiSelection)
        self.layout.addWidget(self.listr_tags)

        self._write_label = QLabel('Select Read & Write Tags', self)
        self.layout.addWidget(self._write_label)

        self.listw_tags = QListWidget(self)
        self.listw_tags.setSelectionMode(QAbstractItemView.MultiSelection)
        self.layout.addWidget(self.listw_tags)

        self.setLayout(self.layout)

    def select_csv_file(self):
        self.csv_file_path = QFileDialog.getOpenFileName()
        print(self.csv_file_path)

    def selected_tags_r(self):
        return [item.text() for item in self.listr_tags.selectedItems()]

    def selected_tags_w(self):
        return [item.text() for item in self.listw_tags.selectedItems()]

    def _refresh(self):
        self.tags_all = opc_functions.tags_da(self.opc)
        self.listr_tags.clear()
        self.listw_tags.clear()
        self.listr_tags.addItems(self.tags_all)
        self.listw_tags.addItems(self.tags_all)
        self.parent().parent().parent().statusbar.showMessage("Tags Refreshed",5000)

    def _select_all(self):
        self.listw_tags.selectAll()
        self.parent().parent().parent().statusbar.showMessage("All Tags Selected",5000)

    def _select_none(self):
        self.listw_tags.clearSelection()
        self.parent().parent().parent().statusbar.showMessage("No Tags Selected",5000)

class OpcUA_Configuration_Area(QWidget):
    def __init__(self, parent=None):
        super(OpcUA_Configuration_Area, self).__init__()

        self.layout = QVBoxLayout(self)


        self.hbox_buttons_1 = QHBoxLayout(self)
        self.opcua_port = QLabel('Server Port :         ', self)
        self.hbox_buttons_1.addWidget(self.opcua_port)
        self.port = QLineEdit(self)
        self.port.setPlaceholderText('Port for OPC-UA Server')
        regex = QRegExp('[0-9]+')
        validator = QRegExpValidator(regex)
        self.port.setValidator(validator)
        self.hbox_buttons_1.addWidget(self.port)
        self.layout.addLayout(self.hbox_buttons_1)

        # self.hbox_buttons_top_bottom = QHBoxLayout(self)
        # self.Object_Node_Name = QLabel('Variable Node :     ', self)
        # self.hbox_buttons_top_bottom.addWidget(self.Object_Node_Name)
        # self.ONode_Name = QLineEdit(self)        
        # self.ONode_Name.setPlaceholderText('Enter Variabel Object Node Name')
        # self.hbox_buttons_top_bottom.addWidget(self.ONode_Name)
        # self.layout.addLayout(self.hbox_buttons_top_bottom)


        self.hbox_buttons_2 = QHBoxLayout(self)
        self.ep_url = QLabel('EndPoint URL :      ', self)
        self.hbox_buttons_2.addWidget(self.ep_url)
        self.endpoint_url = QLineEdit(self)       
        self.endpoint_url.setPlaceholderText('OPC-UA Endpoint URL Will Apper Here')
        self.hbox_buttons_2.addWidget(self.endpoint_url)
        self.layout.addLayout(self.hbox_buttons_2)

        self.hbox_buttons_3 = QHBoxLayout(self)
        self.Update_Rate = QLabel('Refresh Rate (S) :', self)
        self.hbox_buttons_3.addWidget(self.Update_Rate)
        self.UD_Rate = QLineEdit(self)       
        self.UD_Rate.setPlaceholderText('OPC-DA to OPC-UA Data Update Rate in Seconds')
        self.hbox_buttons_3.addWidget(self.UD_Rate)
        self.layout.addLayout(self.hbox_buttons_3)

        self.hbox_buttons_4 = QHBoxLayout(self)
        self.button_setup = QPushButton('Setup and Start Server', self)
        self.button_setup.clicked.connect(parent._setup_server)
        self.hbox_buttons_4.addWidget(self.button_setup)
        # self.button_start = QPushButton('Start Server', self)
        # self.button_start.clicked.connect(parent._start_server)
        # self.hbox_buttons_4.addWidget(self.button_start)
        self.button_stop = QPushButton('Stop Server', self)
        self.button_stop.clicked.connect(parent._stop_server)
        self.hbox_buttons_4.addWidget(self.button_stop)
        self.layout.addLayout(self.hbox_buttons_4)

        # self.Server_Logs = OpcUAServer_Logs(self)
        # self.layout.addWidget(self.Server_Logs)

        self.setLayout(self.layout)

class OpcUAServer_Logs(QWidget):
# class OpcUAServer_Logs(QGroupBox):
    def __init__(self, parent=None):
        super(OpcUAServer_Logs, self).__init__()

        # self.setTitle('OPC-UA Server Logs')

        self.layout = QVBoxLayout(self)
        
        self.logs = QLabel('Server Logs', self)
        self.layout.addWidget(self.logs)

        self.te_logging = QTextEdit(self)
        self.layout.addWidget(self.te_logging)

        self.hbox_buttons_5 = QHBoxLayout(self)
        self.button_clear = QPushButton('Clear Logs', self)
        self.button_clear.clicked.connect(self._clear_data)
        self.hbox_buttons_5.addWidget(self.button_clear)
        self.button_clipboard = QPushButton('Copy Logs to Clipboard', self)
        self.button_clipboard.clicked.connect(self._copy_to_clipboard)
        self.hbox_buttons_5.addWidget(self.button_clipboard)
        self.layout.addLayout(self.hbox_buttons_5)

        self.setLayout(self.layout)

    def _clear_data(self):
        # print("Clearing Logs")
        self.parent().parent().parent().statusbar.showMessage("Server Logs Clear",5000)
        self.te_logging.clear()

    def _copy_to_clipboard(self):
        # print("Copying Logs to Clipboard")
        self.parent().parent().parent().statusbar.showMessage("Server Logs Copy to Clipboard",5000)
        self.te_logging.selectAll()
        self.te_logging.copy()


def main():
    app = QApplication(sys.argv)
    opc = opc_functions.start_da()
    main_window = MainWindow(opc)
    main_window.show()
    app.exec_()


if __name__ == "__main__":
    main()


# python -m PyQt5.uic.pyuic opc_functions_2_UA.ui -o test.py -x
# pyinstaller --hiddenimport win32timezone -F DA_UA.py