import sys
from PyQt5.QtWidgets import (
    QHBoxLayout, QDockWidget, QStatusBar, QApplication, QVBoxLayout, QPushButton,
    QMainWindow, QRadioButton, QLabel, QLineEdit, QGroupBox, QTextEdit, QAbstractItemView,
    QComboBox, QListWidget, QSpinBox, QDialogButtonBox, QFormLayout, QMenu, QWidget
)
from PyQt5.QtCore import QTimer, Qt, QRegExp
from PyQt5.QtGui import QRegExpValidator
import opcda
import datetime as t


class MainWindow(QMainWindow):
    def __init__(self, opc=None):
        super(MainWindow, self).__init__()

        self.opc = opc

        self.setWindowTitle('OPC DA Datalogger')

        self.configuration = Configuration(self, opc)
        self.configuration_dock = QDockWidget("OPC-DA Configuration", self)
        self.configuration_dock.setWidget(self.configuration)
        self.configuration_dock.setFeatures(QDockWidget.NoDockWidgetFeatures)
        self.addDockWidget(Qt.LeftDockWidgetArea, self.configuration_dock)

        self.db_config_area = LoggingArea(self)
        self.db_config_dock = QDockWidget("DB Configuration", self)
        self.db_config_dock.setWidget(self.db_config_area)
        self.db_config_dock.setFeatures(QDockWidget.NoDockWidgetFeatures)
        self.addDockWidget(Qt.RightDockWidgetArea, self.db_config_dock)

        self.logging_area = System_Logs(self)
        self.logging_dock = QDockWidget("System Logs", self)
        self.logging_dock.setWidget(self.logging_area)
        self.logging_dock.setFeatures(QDockWidget.NoDockWidgetFeatures)
        self.addDockWidget(Qt.BottomDockWidgetArea, self.logging_dock)

        self.statusbar = QStatusBar(self)
        self.setStatusBar(self.statusbar)

        # >
        self.stop_logging_timer = QTimer(self)
        self.stop_logging_timer.timeout.connect(self._stop_logging_after_duration)
        # < 

        self.resize(900, 600)

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

        try:
            if self._SQLite_Check:
                # print("[+]Info : SQLite Check")
                self.callback = self._logging_callback_SQLite

            if self._MS_SQL_Check:
                # print("[+]Info : MSSQL Checked")
                self.callback = self._logging_callback_MSSQL

            if self._CSV_Check:
                # print("[+]Info : CSV Check")
                self.callback = self._logging_callback_CSV

            self.statusbar.showMessage("Ready to Start Logging", 5000)

        except Exception as e:
            self.statusbar.showMessage(f"Error While Setting Up Logging: {e}", 10000)

        finally:
            try:
                self.logging_timer = QTimer(self)
                self.logging_timer.timeout.connect(self.callback)
                self.statusbar.showMessage("Ready to Start Logging", 5000)
            except Exception as e:
                self.logging_area.te_logging.append(f"[-]Error : {t.datetime.now()} : {e}")
                self.statusbar.showMessage("Multiple Logging Option Not Supported", 10000)

    def _start_logging(self):
        try:
            self.logging_timer.start(int(self.db_config_area.DB_Logging_Options.lo_rate.text()) * 1000)
            self.logging_area.te_logging.append(f"[+]Info : {t.datetime.now()} : Logging Start")
            self.statusbar.showMessage("Logging Start", 5000)

            # > 
            # Start the timer for stopping logging after 20 minutes (1200000 milliseconds)
            self.stop_logging_timer.start(1200000)
            # < 

        except Exception as e:
            self.logging_area.te_logging.append(f"[-]Error : {t.datetime.now()} : {e}")
            self.statusbar.showMessage("! Please Enter Data Logging Rate !", 5000)
    
    # >
    def _stop_logging_after_duration(self):
        try:
            self._stop_logging()
            self.stop_logging_timer.stop()
            self.logging_area.te_logging.append(f"[+]Info : {t.datetime.now()} : Logging Stop (After 20 minutes)")
            self.statusbar.showMessage("Logging Stop (After 20 minutes)", 5000)
        except Exception as e:
            self.logging_area.te_logging.append(f"[-]Error : {t.datetime.now()} : {e}")
            self.statusbar.showMessage("Error stopping logging", 5000)    
    # < 
    
    def _logging_callback_SQLite(self):
        #print("[+]Info : In Callback SQLite")
        try:
            line = opcda.read_SQLite(self.opc, self.tags, self._SQLite_DB_Name, self._SQLite_TB_Name)
            self.logging_area.te_logging.append(line)
        except Exception as e:
            self.logging_area.te_logging.append(f"[-]Error : OPC-DA Server is Offline: {e}")

    def _logging_callback_CSV(self):
        # print("[+]Info : In Callback CSV")
        line = opcda.read_CSV(self.opc, self.tags, self._CSV_File_Name, self._CSV_File_Path)
        self.logging_area.te_logging.append(line)

    def _logging_callback_MSSQL(self):
        # print("[+]Info : In Callback MSSQL")
        line = opcda.read_MSSQL(self.opc, self.tags, self._MSSQL_Server_Name, self._MSSQL_DB_Name, self._MSSQL_TB_Name)
        self.logging_area.te_logging.append(line)
    
    def _stop_logging(self):
        self.logging_timer.stop()
        # > 
        self.stop_logging_timer.stop()
        # < 
        self.logging_area.te_logging.append(f"[+]Info : {t.datetime.now()} : Logging Stop")
        self.statusbar.showMessage("Logging Stop", 5000)

class Configuration(QWidget):
    def __init__(self, parent=None, opc=None):
        super(Configuration, self).__init__()
        self.layout = QVBoxLayout(self)
        self.tag_selection = TagSelection(self, opc)
        self.server = Server(self, opc, self.tag_selection)
        self.layout.addWidget(self.server)
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
        servers = opcda.servers(self.opc)
        self.combobox_server.clear()
        self.combobox_server.addItems(servers)

    def _connect(self):
        server = self.combobox_server.currentText()
        connected = opcda.connect(self.opc, server)
        if connected:
            self.parent().parent().parent().statusbar.showMessage(f"Connected With {server} OPC-DA Server", 3000)
            if self.tag_selection:
                self.parent().parent().parent().statusbar.showMessage("Working ...", 10000)
                self.tag_selection._refresh()


class TagSelection(QGroupBox):
    def __init__(self, parent=None, opc=None):
        super(TagSelection, self).__init__()

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

        self.setLayout(self.layout)

    def selected_tags(self):
        return [item.text() for item in self.listw_tags.selectedItems()]

    def _refresh(self):
        self.tags_all = opcda.tags(self.opc)
        self.listw_tags.clear()
        self.listw_tags.addItems(self.tags_all)
        self.parent().parent().parent().statusbar.showMessage("Tags Refreshed", 5000)

    def _select_all(self):
        self.listw_tags.selectAll()
        self.parent().parent().parent().statusbar.showMessage("All Tags Selected", 5000)

    def _select_none(self):
        self.listw_tags.clearSelection()
        self.parent().parent().parent().statusbar.showMessage("No Tags Selected", 5000)


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

        self.hbox_separator_2 = QHBoxLayout(self)
        self.SQLite_Check = QRadioButton("SQLite DB")
        self.SQLite_Check.clicked.connect(self.SQLite_Configurator_dialog)
        self.hbox_separator_2.addWidget(self.SQLite_Check)
        self.layout.addLayout(self.hbox_separator_2)

        self.hbox_separator_3 = QHBoxLayout(self)
        self.MSSQL_Check = QRadioButton("Microsoft SQL")
        self.MSSQL_Check.clicked.connect(self.MS_SQL_Configurator_dialog)
        self.hbox_separator_3.addWidget(self.MSSQL_Check)
        self.layout.addLayout(self.hbox_separator_3)

        self.hbox_separator_5 = QHBoxLayout(self)
        self.CSV_Check = QRadioButton("CSV")
        self.CSV_Check.clicked.connect(self.CSV_Configurator_dialog)
        self.hbox_separator_5.addWidget(self.CSV_Check)
        self.layout.addLayout(self.hbox_separator_5)

        self.SQLite_Logging_Options = SQLiteLoggingConfigurator(self)
        self.layout.addWidget(self.SQLite_Logging_Options)

        self.MSSQL_Logging_Options = MSSQLLoggingConfigurator(self)
        self.layout.addWidget(self.MSSQL_Logging_Options)

        self.CSV_Logging_Options = CSVLoggingConfigurator(self)
        self.layout.addWidget(self.CSV_Logging_Options)

        self.SQLite_Logging_Options.hide()
        self.MSSQL_Logging_Options.hide()
        self.CSV_Logging_Options.hide()

        self.setLayout(self.layout)

    def CSV_Configurator_dialog(self):
        self.CSV_Logging_Options.show()
        self.SQLite_Logging_Options.hide()
        self.MSSQL_Logging_Options.hide()
        # print("CSV_Configurator_dialog")

    def MS_SQL_Configurator_dialog(self):
        self.MSSQL_Logging_Options.show()
        self.CSV_Logging_Options.hide()
        self.SQLite_Logging_Options.hide()
        # print("MS_SQL_Configurator_dialog")

    def SQLite_Configurator_dialog(self):
        self.SQLite_Logging_Options.show()
        self.MSSQL_Logging_Options.hide()
        self.CSV_Logging_Options.hide()
        # print("SQLite_Configurator_dialog")


class SQLiteLoggingConfigurator(QGroupBox):
    def __init__(self, parent=None):
        super(SQLiteLoggingConfigurator, self).__init__()

        self.setTitle('Logging Options')
        self.layout = QVBoxLayout(self)

        self.SQLite_DB_Name = QLabel('SQLite DB Name:', self)
        self.layout.addWidget(self.SQLite_DB_Name)
        self.SQLite_DBname = QLineEdit(self)
        self.layout.addWidget(self.SQLite_DBname)

        self.SQLite_Table_Name = QLabel('SQLite Table Name:', self)
        self.layout.addWidget(self.SQLite_Table_Name)
        self.SQLite_Tablename = QLineEdit(self)
        self.layout.addWidget(self.SQLite_Tablename)

        self.setLayout(self.layout)


class MSSQLLoggingConfigurator(QGroupBox):
    def __init__(self, parent=None):
        super(MSSQLLoggingConfigurator, self).__init__()

        self.setTitle('Logging Options')
        self.layout = QVBoxLayout(self)

        self.MSSQL_Server_Name = QLabel('MSSQL Server Name:', self)
        self.layout.addWidget(self.MSSQL_Server_Name)
        self.MSSQL_Servername = QLineEdit(self)
        self.layout.addWidget(self.MSSQL_Servername)

        self.MSSQL_DB_Name = QLabel('MSSQL DB Name:', self)
        self.layout.addWidget(self.MSSQL_DB_Name)
        self.MSSQL_DBname = QLineEdit(self)
        self.layout.addWidget(self.MSSQL_DBname)

        self.MSSQL_Table_Name = QLabel('MSSQL Table Name:', self)
        self.layout.addWidget(self.MSSQL_Table_Name)
        self.MSSQL_Tablename = QLineEdit(self)
        self.layout.addWidget(self.MSSQL_Tablename)

        self.setLayout(self.layout)


class CSVLoggingConfigurator(QGroupBox):
    def __init__(self, parent=None):
        super(CSVLoggingConfigurator, self).__init__()

        self.setTitle('Logging Options')
        self.layout = QVBoxLayout(self)

        self.CSV_Name = QLabel('CSV File Name:', self)
        self.layout.addWidget(self.CSV_Name)
        self.CSVname = QLineEdit(self)
        self.layout.addWidget(self.CSVname)

        self.CSV_File_Path = QLabel('CSV File Path:', self)
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
        self.button_clipboard.clicked.connect(self._copy_to_clipboard)  # Fixed typo here
        self.hbox_buttons_bottom.addWidget(self.button_clipboard)

        self.layout.addLayout(self.hbox_buttons_bottom)

        self.setLayout(self.layout)

    def _clear_data(self):
        self.te_logging.clear()

    def _copy_to_clipboard(self):  # Fixed typo here
        self.te_logging.selectAll()
        self.te_logging.copy()

def main():
    app = QApplication(sys.argv)
    opc = opcda.start()
    main_window = MainWindow(opc)
    main_window.show()
    # app.exec_()
    sys.exit(app.exec_())    

if __name__ == "__main__":
    main()
