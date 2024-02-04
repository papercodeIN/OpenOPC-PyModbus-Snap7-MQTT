import sys
from PyQt5.QtWidgets import QHBoxLayout,QDockWidget,QStatusBar,QApplication,QVBoxLayout,QPushButton,QMainWindow,QCheckBox,QDialog,QDialogButtonBox,QFormLayout,QRadioButton,QMenuBar
from PyQt5.QtWidgets import QMenu,QComboBox,QListWidget,QSpinBox,QGroupBox,QLineEdit,QTextEdit,QLabel,QWidget,QAbstractItemView,QAction,QMessageBox,QFileDialog
from PyQt5.QtCore import QTimer,Qt,QRegExp,QRect
from PyQt5.QtGui import QRegExpValidator
import functions
import os
import datetime as t
import configparser
import ast



class MainWindow(QMainWindow):
    def __init__(self, opc=None):
        super(MainWindow, self).__init__()

        self.opc = opc

        # Below code is use to set the window title name
        self.setWindowTitle('OPC-DA Datalogger by Fusion Automate')

        self.layout = QHBoxLayout(self)

        self.mainMenu = self.menuBar()
        self.fileMenu = self.mainMenu.addMenu('File')

        ''' 
        In file menu I have added one button called Export Config 
        Which is use to Export the data logging configuration in specific format with 'settings.conf' file name on the Desktop
        '''
        self.export_config = QAction('Export Config', self)
        self.export_config.setShortcut('Ctrl+S')
        self.export_config.setStatusTip('Save Current Configuration')
        self.export_config.triggered.connect(self._export_config)
        self.fileMenu.addAction(self.export_config)

        '''
        This is not working as of now
        '''
        # self.import_config = QAction('Import Config', self)
        # self.import_config.setShortcut('Ctrl+O')
        # self.import_config.setStatusTip('Load Configuration')
        # self.import_config.triggered.connect(self._import_config)
        # self.fileMenu.addAction(self.import_config)

        '''
        In file menu I have added one button called Exit
        Once you press this button the application will be closed
        '''
        self.exitButton = QAction('Exit', self)
        self.exitButton.setShortcut('Ctrl+Q')
        self.exitButton.setStatusTip('Exit application')
        self.exitButton.triggered.connect(self.close)
        self.fileMenu.addAction(self.exitButton)

        '''
        OPC-DA Configuration Sub Winow is to
        - Search the aavailable OPCDA Servers
        - Connect with OPC-DA Server
        - Get the Tag List of that OPC-DA Server
        - Select Tags for data logging
        - refresh the tags
        - to select all tags
        - to deselect all selected tags
        Etc...
        '''
        self.configuration = Configuration(self, opc)
        self.configuration_dock = QDockWidget("OPC-DA Configuration", self)
        self.configuration_dock.setWidget(self.configuration)
        self.configuration_dock.setFeatures(QDockWidget.NoDockWidgetFeatures)
        self.addDockWidget(Qt.LeftDockWidgetArea, self.configuration_dock)

        '''
        Data Logging Configuration sub window is for data loggign configuration
        - which includes in which database you want to log the data MSSQL, CSV, SQLITE
        - Interval of Data logging
        - if CSV Data logging then file name and file path
        - if SQLite Data logging then database name and table name
        - if MSSQL Data logging then !!![need to check]
        '''
        self.db_config_area = LoggingArea(self)
        self.db_config_dock = QDockWidget("Data Logging Configuration", self)
        self.db_config_dock.setWidget(self.db_config_area)
        self.db_config_dock.setFeatures(QDockWidget.NoDockWidgetFeatures)
        self.addDockWidget(Qt.RightDockWidgetArea, self.db_config_dock)
        
        '''
        System Logs Section is to print the logs when data is logging into SQL or CSV file
        '''
        self.logging_area = System_Logs(self)
        self.logging_dock = QDockWidget("System Logs", self)
        self.logging_dock.setWidget(self.logging_area)
        self.logging_dock.setFeatures(QDockWidget.NoDockWidgetFeatures)
        self.addDockWidget(Qt.BottomDockWidgetArea, self.logging_dock)
        
        self.statusbar = QStatusBar(self)
        self.setStatusBar(self.statusbar)

        '''
        Software window will initially resized to 900x600 pixels.
        Later on it can be maximized
        '''
        self.setLayout(self.layout)
        self.resize(900, 600)

    ''' 
    Export the current data logging configuration to desktop with file name 'settings.conf'
    '''
    def _export_config(self):
        config = configparser.ConfigParser()
        desktop = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')

        try:

            config['OPC_DA'] = {
                "Server_Name" : server, 
                "Tags" : self.tags}
            
            config['Logging_Options'] = {
                "Logging_Rate" : self.logging_rate,
                "Sqlite_Check" : self._SQLite_Check,
                "MSSQL_Check" : self._MS_SQL_Check,
                "CSV_Chceck" : self._CSV_Check,
                "SQLite_DB_Name" : self._SQLite_DB_Name,
                "SQLite_Table_Name" : self._SQLite_TB_Name,
                "MSSQL_Server_Name" : self._MSSQL_Server_Name,
                "MSSQL_DB_Name" : self._MSSQL_DB_Name,
                "MSSQL_TB_Name" : self._MSSQL_TB_Name,
                "CSV_Name" : self._CSV_File_Name,
                "CSV_Path" : self._CSV_File_Path,
            }

            with open(os.path.join(desktop,'settings.conf'), 'w') as configfile:
                config.write(configfile)
            self.statusbar.showMessage(f"File Save At : {str(os.path.join(desktop,'settings.conf'))} ")
        except Exception as e:
            print(e)
            self.statusbar.showMessage("Error : Unable to Save Config File : Data not Found")

    # def open_config_dialog_box(self):
    #     global config_path
    #     filename = QFileDialog.getOpenFileName()
    #     config_path = filename[0]
    #     return config_path

    # def _import_config(self):
    #     global server

    #     config = configparser.ConfigParser()
    #     config.read(self.open_config_dialog_box())


    #     self.msg=QMessageBox()
    #     self.msg.setIcon(QMessageBox.Information)
    #     self.msg.setWindowTitle("OPC-DA Details")
    #     self.msg.setText("Please Verify Configuration File Detials! \nPress OK to Confirm System Configuration. \nPress Cancal to Go Back.")
    #     self.msg.setDetailedText(f"""OPC-DA Server : {config['OPC_DA']['Server_Name']} 
    #     \nLogging Rate : {config['Logging_Options']['Logging_Rate']} Seconds
    #     \nSQL Logging : {config['Logging_Options']['Sqlite_Check']}
    #     \nMSSQL Logging : {config['Logging_Options']['MSSQL_Check']}
    #     \nCSV Logging : {config['Logging_Options']['CSV_Chceck']}
    #     \nSQLite DB : {config['Logging_Options']['SQLite_DB_Name']}
    #     \nSQLite Table : {config['Logging_Options']['SQLite_Table_Name']}
    #     \nMSSQL Server : {config['Logging_Options']['MSSQL_Server_Name']}
    #     \nMSSQL DB : {config['Logging_Options']['MSSQL_DB_Name']}
    #     \nMSSQL Table : {config['Logging_Options']['MSSQL_TB_Name']}
    #     \nCSV File Name : {config['Logging_Options']['CSV_Name']}
    #     \nCSV File Path : {config['Logging_Options']['CSV_Path']}
        
    #     """)
    #     self.msg.setStandardButtons(QMessageBox.Ok | QMessageBox.Cancel)
    #     return_value = self.msg.exec_()


    #     if return_value == QMessageBox.Ok :
    #         server = config['OPC_DA']['Server_Name']
    #         self.logging_rate = config['Logging_Options']['Logging_Rate']
    #         self.tags = ast.literal_eval(config['OPC_DA']['Tags'])
    #         self._SQLite_Check = bool(config['Logging_Options']['Sqlite_Check'])
    #         self._MS_SQL_Check = bool(config['Logging_Options']['MSSQL_Check'])
    #         self._CSV_Check = bool(config['Logging_Options']['CSV_Chceck'])
    #         self._SQLite_DB_Name = config['Logging_Options']['SQLite_DB_Name']
    #         self._SQLite_TB_Name = config['Logging_Options']['SQLite_Table_Name']
    #         self._MSSQL_Server_Name = config['Logging_Options']['MSSQL_Server_Name']
    #         self._MSSQL_DB_Name = config['Logging_Options']['MSSQL_DB_Name']
    #         self._MSSQL_TB_Name = config['Logging_Options']['MSSQL_TB_Name']
    #         self._CSV_File_Name = config['Logging_Options']['CSV_Name']
    #         self._CSV_File_Path = config['Logging_Options']['CSV_Path']

    #         self.statusbar.showMessage("Config File is Load.",5000)
    #         try:
    #             if self._SQLite_Check == True:
    #                 print("[+]Info : SQLite Check")
    #                 self.logging_timer = QTimer(self)
    #                 self.logging_timer.timeout.connect(self._loogging_callback_SQLite)

    #             if self._MS_SQL_Check == True:
    #                 print("[+]Info : MSSQL Checkd")
    #                 self.logging_timer = QTimer(self)
    #                 self.logging_timer.timeout.connect(self._loogging_callback_MSSQL)

    #             if self._CSV_Check == True:
    #                 print("[+]Info : CSV Check")                    
    #                 self.logging_timer = QTimer(self)
    #                 self.logging_timer.timeout.connect(self._loogging_callback_CSV)                    


    #         except:
    #             self.statusbar.showMessage("Error While Setting Up Logging",10000)

    #         finally:

    #             connected = functions.connect(self.opc, server)
    #             if connected:
    #                 self.statusbar.showMessage(f"Connected With {server} OPC-DA Serevr",3000)
    #             else:
    #                 self.statusbar.showMessage(f"Unable to Connect with {server} OPC-DA Serevr")

    #             self.statusbar.showMessage("Ready to Start Logging",5000)


    #     elif return_value == QMessageBox.Cancel :
    #         print("Error") 

    def _setup_logging(self):

        self._SQLite_Check = self.db_config_area.DB_Logging_Options.SQLite_Check.isChecked()
        self._MS_SQL_Check = self.db_config_area.DB_Logging_Options.MSSQL_Check.isChecked()
        self._CSV_Check = self.db_config_area.DB_Logging_Options.CSV_Check.isChecked()

        self._SQLite_DB_Name = self.db_config_area.DB_Logging_Options.SQLite_Logging_Options.SQLite_DBname.text()
        self._SQLite_TB_Name = self.db_config_area.DB_Logging_Options.SQLite_Logging_Options.SQLite_Tablename.text()

        self._MSSQL_Server_Name = self.db_config_area.DB_Logging_Options.MSSQL_Logging_Options.MSSQL_Servername.text()
        self._MSSQL_DB_Name = self.db_config_area.DB_Logging_Options.MSSQL_Logging_Options.MSSQL_DBname.text()
        self._MSSQL_TB_Name = self.db_config_area.DB_Logging_Options.MSSQL_Logging_Options.MSSQL_Tablename.text()

        self._CSV_File_Name = self.db_config_area.DB_Logging_Options.CSV_Logging_Options.CSVname.text()
        self._CSV_File_Path = self.db_config_area.DB_Logging_Options.CSV_Logging_Options.CSV_Path.text()


        self.tags = self.configuration.tag_selection.selected_tags()

        self.logging_rate = self.db_config_area.DB_Logging_Options.lo_rate.text()

        try:
            if self._SQLite_Check == True:
                print("[+]Info : SQLite Check")
                self.callback = self._loogging_callback_SQLite

            if self._MS_SQL_Check == True:
                print("[+]Info : MSSQL Checkd")
                self.callback = self._loogging_callback_MSSQL


            if self._CSV_Check == True:
                print("[+]Info : CSV Check")                    
                self.callback = self._loogging_callback_CSV

            self.statusbar.showMessage("Ready to Start Logging",5000)


        except:
            self.statusbar.showMessage("Error While Setting Up Logging",10000)

        finally:
            self.logging_timer = QTimer(self)
            self.logging_timer.timeout.connect(self.callback)
            self.statusbar.showMessage("Ready to Start Logging",5000)


    
    def _start_logging(self):
        try:
            self.logging_timer.start(int(self.logging_rate) * 1000)
            self.logging_area.te_logging.append(f"[+]Info : {t.datetime.now()} : Logging Start")
            self.statusbar.showMessage("Logging Start",5000)
        except Exception as e:
            self.logging_area.te_logging.append(f"[-]Error : {t.datetime.now()} : {e}\n")
            self.statusbar.showMessage("! Unable to Start Logging !",5000)


    def _loogging_callback_SQLite(self):
        print("[+]Info : In Callback SQLite")
        try:
            line = functions.read_SQLite(self.opc, self.tags, self._SQLite_DB_Name, self._SQLite_TB_Name)
            self.logging_area.te_logging.append(line)
        except:
            self.logging_area.te_logging.append("[-]Error : OPC-DA Server is Offline")

    def _loogging_callback_CSV(self):
        print("[+]Info : In Callback CSV")
        try:
            line = functions.read_CSV(self.opc, self.tags, self._CSV_File_Name, self._CSV_File_Path)
            self.logging_area.te_logging.append(line)
        except:
            self.logging_area.te_logging.append("[-]Error : OPC-DA Server is Offline")        

    def _loogging_callback_MSSQL(self):
        print("[+]Info : In Callback MSSQL")
        try:
            line = functions.read_MSSQL(self.opc, self.tags, self._MSSQL_Server_Name, self._MSSQL_DB_Name, self._MSSQL_TB_Name)
            self.logging_area.te_logging.append(line)        
        except:
            self.logging_area.te_logging.append("[-]Error : OPC-DA Server is Offline")    

    def _stop_logging(self):
        self.logging_timer.stop()
        self.logging_area.te_logging.append(f"[+]Info : {t.datetime.now()} : Logging Stop")
        self.statusbar.showMessage("Logging Stop",5000)
        self.configuration_dock.setEnabled(True)


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

        self.setTitle('OPC Server Selection')

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
        self.servers = functions.servers(self.opc)
        self.combobox_server.clear()
        self.combobox_server.addItems(self.servers)

    def _connect(self):
        global server
        server = self.combobox_server.currentText()
        connected = functions.connect(self.opc, server)
        if connected:
            self.parent().parent().parent().statusbar.showMessage(f"Connected With {server} OPC-DA Serevr",3000)
            if self.tag_selection:
                self.parent().parent().parent().statusbar.showMessage("Working ...",10000)
                self.tag_selection._refresh()


class TagSelecion(QGroupBox):
    def __init__(self, parent=None, opc=None):
        super(TagSelecion, self).__init__()

        self.opc = opc

        self.setTitle('Tag Selection')

        self.layout = QVBoxLayout(self)

        self.hbox_separator_6 = QHBoxLayout(self)
        self.button_refresh = QPushButton('Refresh', self)
        self.button_refresh.clicked.connect(self._refresh)
        self.hbox_separator_6.addWidget(self.button_refresh)

        self.button_all = QPushButton('Select All', self)
        self.button_all.clicked.connect(self._select_all)
        self.hbox_separator_6.addWidget(self.button_all)

        self.button_none = QPushButton('Select None', self)
        self.button_none.clicked.connect(self._select_none)
        self.hbox_separator_6.addWidget(self.button_none)

        self.layout.addLayout(self.hbox_separator_6)

        self.label = QLabel('Select Tags', self)
        self.layout.addWidget(self.label)

        self.listw_tags = QListWidget(self)
        self.listw_tags.setSelectionMode(QAbstractItemView.MultiSelection)
        self.layout.addWidget(self.listw_tags)

        self.label = QLabel('Add Selected Tags to Group', self)
        self.layout.addWidget(self.label)

        self.hbox_separator_7 = QHBoxLayout(self)
        self._group_1 = QPushButton('Group 1', self)
        # self.button_refresh.clicked.connect(self._refresh)
        self.hbox_separator_7.addWidget(self._group_1)

        self._group_2 = QPushButton('Group 2', self)
        # self.button_refresh.clicked.connect(self._refresh)
        self.hbox_separator_7.addWidget(self._group_2)

        self._group_3 = QPushButton('Group 2', self)
        # self.button_refresh.clicked.connect(self._refresh)
        self.hbox_separator_7.addWidget(self._group_3)

        self.layout.addLayout(self.hbox_separator_7)


        self.setLayout(self.layout)

    def selected_tags(self):
        return [item.text() for item in self.listw_tags.selectedItems()]

    def _refresh(self):
        self.tags_all = functions.tags(self.opc)
        self.listw_tags.clear()
        self.listw_tags.addItems(self.tags_all)
        self.parent().parent().parent().statusbar.showMessage("Tags Refreshed",5000)

    def _select_all(self):
        self.listw_tags.selectAll()
        self.parent().parent().parent().statusbar.showMessage("All Tags Selected",5000)

    def _select_none(self):
        self.listw_tags.clearSelection()
        self.parent().parent().parent().statusbar.showMessage("No Tags Selected",5000)


class LoggingOptions(QGroupBox):
    def __init__(self, parent=None):
        super(LoggingOptions, self).__init__()

        self.setTitle('Logging Method')

        self.layout = QVBoxLayout(self)

        self.hbox_separator_1 = QHBoxLayout(self)
        self.logging_rate = QLabel('Logging Rate (Seconds)', self)
        self.hbox_separator_1.addWidget(self.logging_rate)
        self.lo_rate = QLineEdit(self)
        regex = QRegExp('[0-9]+')
        validator = QRegExpValidator(regex)
        self.lo_rate.setValidator(validator)
        self.hbox_separator_1.addWidget(self.lo_rate)
        self.layout.addLayout(self.hbox_separator_1)

        # Logging Options > Sqlite Configuration
        self.hbox_separator_2 = QHBoxLayout(self)
        self.SQLite_Check = QRadioButton("SQLite DB")
        self.SQLite_Check.clicked.connect(self.SQLite_Configurator_dialog)
        self.hbox_separator_2.addWidget(self.SQLite_Check)
        self.layout.addLayout(self.hbox_separator_2) 

        # Logging Options > Microsoft SQL Configuration
        self.hbox_separator_3 = QHBoxLayout(self)
        self.MSSQL_Check = QRadioButton("Microsoft SQL")
        self.MSSQL_Check.clicked.connect(self.MS_SQL_Configurator_dialog)
        self.hbox_separator_3.addWidget(self.MSSQL_Check)
        self.layout.addLayout(self.hbox_separator_3)

        # Logging Options > MongoDB Configuration
        # self.hbox_separator_4 = QHBoxLayout(self)
        # self.MongoDB_Check = QRadioButton("MongoDB")
        # self.MongoDB_Check.clicked.connect(self.MongoDB_Configurator_dialog)
        # self.hbox_separator_4.addWidget(self.MongoDB_Check)
        # self.layout.addLayout(self.hbox_separator_4)

        # Logging Options > CSV Configuration
        self.hbox_separator_5 = QHBoxLayout(self)
        self.CSV_Check = QRadioButton("CSV")
        self.CSV_Check.clicked.connect(self.CSV_Configurator_dialog)
        self.hbox_separator_5.addWidget(self.CSV_Check)
        self.layout.addLayout(self.hbox_separator_5)

        self.SQLite_Logging_Options = SQLiteLoggingConfiguraotr(self)
        self.layout.addWidget(self.SQLite_Logging_Options)

        self.MSSQL_Logging_Options = MSSQLLoggingConfiguraotr(self)
        self.layout.addWidget(self.MSSQL_Logging_Options)

        self.CSV_Logging_Options = CSVLoggingConfiguraotr(self)
        self.layout.addWidget(self.CSV_Logging_Options)        

        self.SQLite_Logging_Options.hide()
        self.MSSQL_Logging_Options.hide()
        self.CSV_Logging_Options.hide()

        self.setLayout(self.layout)

    def CSV_Configurator_dialog(self):
        self.CSV_Logging_Options.show()
        self.SQLite_Logging_Options.hide()
        self.MSSQL_Logging_Options.hide()        
        print("CSV_COnf")

    # def MongoDB_Configurator_dialog(self):
    #     print("MongoDB_COnf")

    def MS_SQL_Configurator_dialog(self):
        self.MSSQL_Logging_Options.show()
        self.CSV_Logging_Options.hide()     
        self.SQLite_Logging_Options.hide()   
        print("MS_SQL_COnf")

    def SQLite_Configurator_dialog(self):
        self.SQLite_Logging_Options.show()
        self.MSSQL_Logging_Options.hide()
        self.CSV_Logging_Options.hide()        
        print("SQLite_COnf")


class SQLiteLoggingConfiguraotr(QGroupBox):
    def __init__(self, parent=None):
        super(SQLiteLoggingConfiguraotr, self).__init__()

        self.setTitle('Logging Options')

        self.layout = QVBoxLayout(self)

        self.SQLite_DB_Name = QLabel('SQLite DB Name : ', self)
        self.layout.addWidget(self.SQLite_DB_Name)
        self.SQLite_DBname = QLineEdit(self)
        self.layout.addWidget(self.SQLite_DBname)

        self.SQLite_Table_Name = QLabel('SQLite Table Name : ', self)
        self.layout.addWidget(self.SQLite_Table_Name)
        self.SQLite_Tablename = QLineEdit(self)
        self.layout.addWidget(self.SQLite_Tablename)


        self.setLayout(self.layout)


class MSSQLLoggingConfiguraotr(QGroupBox):
    def __init__(self, parent=None):
        super(MSSQLLoggingConfiguraotr, self).__init__()

        self.setTitle('Logging Options')

        self.layout = QVBoxLayout(self)

        self.MSSQL_Server_Name = QLabel('MSSQL Server Name : ', self)
        self.layout.addWidget(self.MSSQL_Server_Name)
        self.MSSQL_Servername = QLineEdit(self)
        self.layout.addWidget(self.MSSQL_Servername)

        self.MSSQL_DB_Name = QLabel('MSSQL DB Name : ', self)
        self.layout.addWidget(self.MSSQL_DB_Name)
        self.MSSQL_DBname = QLineEdit(self)
        self.layout.addWidget(self.MSSQL_DBname)

        self.MSSQL_Table_Name = QLabel('MSSQL Table Name : ', self)
        self.layout.addWidget(self.MSSQL_Table_Name)
        self.MSSQL_Tablename = QLineEdit(self)
        self.layout.addWidget(self.MSSQL_Tablename)

        self.setLayout(self.layout)


class CSVLoggingConfiguraotr(QGroupBox):
    def __init__(self, parent=None):
        super(CSVLoggingConfiguraotr, self).__init__()

        self.setTitle('Logging Options')

        self.layout = QVBoxLayout(self)

        self.CSV_Name = QLabel('CSV File Name : ', self)
        self.layout.addWidget(self.CSV_Name)
        self.CSVname = QLineEdit(self)
        self.layout.addWidget(self.CSVname)

        self.CSV_File_Path = QLabel('CSV File Path : ', self)
        self.layout.addWidget(self.CSV_File_Path)
        self.CSV_Path = QLineEdit(self)
        self.layout.addWidget(self.CSV_Path)

        self.setLayout(self.layout)


class LoggingArea(QWidget):
    def __init__(self, parent=None):
        super(LoggingArea, self).__init__()

        self.layout = QVBoxLayout(self)

        self.DB_Logging_Options = LoggingOptions(self)
        self.layout.addWidget(self.DB_Logging_Options)

        self.hbox_separator_8 = QHBoxLayout(self)
        self.button_setup = QPushButton('Setup Logging', self)
        self.button_setup.clicked.connect(parent._setup_logging)
        self.hbox_separator_8.addWidget(self.button_setup)
        self.button_start = QPushButton('Start Logging', self)
        self.button_start.clicked.connect(parent._start_logging)
        self.hbox_separator_8.addWidget(self.button_start)
        self.button_stop = QPushButton('Stop Logging', self)
        self.button_stop.clicked.connect(parent._stop_logging)
        self.hbox_separator_8.addWidget(self.button_stop)
        self.layout.addLayout(self.hbox_separator_8)

        self.setLayout(self.layout)


class System_Logs(QWidget):
    def __init__(self, parent=None):
        super(System_Logs, self).__init__()

        self.layout = QVBoxLayout(self)

        self.te_logging = QTextEdit(self)
        self.layout.addWidget(self.te_logging)

        self.hbox_buttons_bottom = QHBoxLayout(self)
        self.button_clear = QPushButton('Clear Logs', self)
        self.button_clear.clicked.connect(self._clear_data)
        self.hbox_buttons_bottom.addWidget(self.button_clear)
        self.button_clipboard = QPushButton('Copy Logs to Clipboard', self)
        self.button_clipboard.clicked.connect(self._copy_to_cliboard)
        self.hbox_buttons_bottom.addWidget(self.button_clipboard)

        self.layout.addLayout(self.hbox_buttons_bottom)

        self.setLayout(self.layout)

    def _clear_data(self):
        self.te_logging.clear()

    def _copy_to_cliboard(self):
        self.te_logging.selectAll()
        self.te_logging.copy()


def main():
    app = QApplication(sys.argv)
    opc = functions.start()
    main_window = MainWindow(opc)
    main_window.show()
    app.exec_()


if __name__ == "__main__":
    main()
