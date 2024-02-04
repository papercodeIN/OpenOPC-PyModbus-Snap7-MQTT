import sys
from PyQt5.QtWidgets import (
    QApplication, QWidget, QHBoxLayout, QVBoxLayout, QGroupBox,
    QPushButton, QComboBox, QLabel, QLineEdit, QTextEdit,
    QListWidget, QListWidgetItem, QAbstractItemView, QMessageBox, QFileDialog
)
from PyQt5.QtCore import Qt, QDateTime, QTimer
import OpenOPC
import pywintypes
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Float, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import pandas as pd

pywintypes.datetime = pywintypes.TimeType

Base = declarative_base()

class OPCData(Base):
    __tablename__ = 'opc_data'

    id = Column(Integer, primary_key=True)
    tag = Column(String)
    value = Column(Float)
    quality = Column(Integer)
    time = Column(DateTime)

def servers(opc):
    return opc.servers()

class OPCDAToMySQLLogger(QWidget):
    def __init__(self):
        super().__init__()

        self.opc = None
        self.selected_tags = []
        self.retry_count = 0
        self.logging_enabled = False
        self.init_ui()

        # Create SQLAlchemy engine and session
        self.engine = None
        self.session = None

    def init_ui(self):
        # Create widgets
        self.opc_combobox = QComboBox(self)
        self.populate_opc_servers()

        self.connect_button = QPushButton("Connect", self)
        self.connect_button.clicked.connect(self.connect_to_opc_server)

        self.listw_tags = QListWidget(self)
        self.listw_tags.setSelectionMode(QAbstractItemView.MultiSelection)

        self.start_logging_button = QPushButton("Start Logging", self)
        self.start_logging_button.clicked.connect(self.start_logging)

        self.stop_logging_button = QPushButton("Stop Logging", self)
        self.stop_logging_button.clicked.connect(self.stop_logging)

        self.log_textedit = QTextEdit(self)

        # MySQL Database Configuration
        mysql_groupbox = QGroupBox("MySQL Database Configuration:")
        mysql_layout = QVBoxLayout()

        self.mysql_host = QLineEdit(self)
        self.mysql_host.setPlaceholderText("MySQL Host")
        mysql_layout.addWidget(self.mysql_host)

        self.mysql_username = QLineEdit(self)
        self.mysql_username.setPlaceholderText("MySQL Username")
        mysql_layout.addWidget(self.mysql_username)

        self.mysql_password = QLineEdit(self)
        self.mysql_password.setPlaceholderText("MySQL Password")
        self.mysql_password.setEchoMode(QLineEdit.Password)  # Set echo mode for password input
        mysql_layout.addWidget(self.mysql_password)

        self.mysql_db_name = QLineEdit(self)
        self.mysql_db_name.setPlaceholderText("MySQL Database Name")
        mysql_layout.addWidget(self.mysql_db_name)

        self.mysql_table_name = QLineEdit(self)
        self.mysql_table_name.setPlaceholderText("MySQL Table Name")
        mysql_layout.addWidget(self.mysql_table_name)

        mysql_groupbox.setLayout(mysql_layout)

        # Add a button to import tags from a CSV file
        self.import_tags_button = QPushButton("Import Tags from CSV", self)
        self.import_tags_button.clicked.connect(self.import_tags_from_csv)

        # Create layouts
        vertical_layout = QVBoxLayout()

        # OPC Server layout
        opc_layout = QHBoxLayout()
        opc_layout.addWidget(self.opc_combobox)
        opc_layout.addWidget(self.connect_button)

        # Server group
        opc_groupbox = QGroupBox("OPC Server:")
        opc_groupbox.setLayout(opc_layout)

        # Tag list layout
        tag_layout = QVBoxLayout()
        tag_layout.addWidget(QLabel("Select Tags:"))
        tag_layout.addWidget(self.listw_tags)

        # Logging layout
        logging_layout = QVBoxLayout()
        logging_layout.addWidget(QLabel("Logs:"))
        logging_layout.addWidget(self.log_textedit)

        # Buttons layout
        buttons_layout = QHBoxLayout()
        buttons_layout.addWidget(self.start_logging_button)
        buttons_layout.addWidget(self.stop_logging_button)
        buttons_layout.addWidget(self.import_tags_button)

        # Add layouts to the main vertical layout
        vertical_layout.addWidget(opc_groupbox)
        vertical_layout.addLayout(tag_layout)
        vertical_layout.addWidget(mysql_groupbox)
        vertical_layout.addLayout(logging_layout)
        vertical_layout.addLayout(buttons_layout)

        # Set the layout for the main window
        self.setLayout(vertical_layout)

        # Set window properties
        self.setWindowTitle('OPC-DA to MySQL Logger')
        self.setGeometry(100, 100, 600, 400)

    def populate_opc_servers(self):
        opc = OpenOPC.client()
        opc_servers = servers(opc)
        self.opc_combobox.addItems(opc_servers)

    def connect_to_opc_server(self):
        selected_opc_server = self.opc_combobox.currentText()
        max_retries = 3

        for retry in range(1, max_retries + 1):
            try:
                self.opc = OpenOPC.client()
                self.opc.connect(selected_opc_server)
                break
            except Exception as e:
                log_message = f"Error connecting to OPC-DA server {selected_opc_server} (Retry {retry}/{max_retries}): {str(e)}"
                print(log_message)
                self.log_textedit.append(log_message)

                if retry == max_retries:
                    error_message = f"Maximum connection retries reached. Unable to connect to OPC-DA server {selected_opc_server}."
                    QMessageBox.critical(self, "Connection Error", error_message)
                    print(error_message)
                    self.log_textedit.append(error_message)
                    return

                time.sleep(2)

        log_message = f"Connected to OPC-DA server {selected_opc_server}."
        print(log_message)
        self.log_textedit.append(log_message)

        # Populate the tag list with tags from the OPC server
        self.populate_tag_list()

    def populate_tag_list(self):
        self.listw_tags.clear()
        # You can add logic to fetch tags from your OPC server
        # For now, I'll add some sample tags for demonstration
        sample_tags = ["Tag1", "Tag2", "Tag3"]
        for tag in sample_tags:
            item = QListWidgetItem(tag)
            self.listw_tags.addItem(item)

    def start_logging(self):
        # You can implement your data logging logic here
        # For demonstration, I'll log sample data to the database
        self.logging_timer = QTimer(self)
        self.logging_timer.timeout.connect(self.log_data_to_mysql)
        self.logging_timer.start(5000)  # Log data every 5 seconds

    def stop_logging(self):
        if hasattr(self, 'logging_timer'):
            self.logging_timer.stop()

    def import_tags_from_csv(self):
        csv_file, _ = QFileDialog.getOpenFileName(self, "Select CSV File", "", "CSV Files (*.csv);;All Files (*)")

        if not csv_file:
            return

        try:
            # Read tags from the CSV file using Pandas
            tags_df = pd.read_csv(csv_file)
            unique_tags = tags_df['Tag'].unique().tolist()
            self.selected_tags = unique_tags

            # Populate the tag list with tags from the CSV file
            self.populate_tag_list()

            log_message = f"Imported {len(unique_tags)} tags from CSV."
            print(log_message)
            self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_message}")

        except Exception as e:
            log_message = f"Error reading CSV file: {str(e)}"
            print(log_message)
            self.log_textedit.append(log_message)

    def log_data_to_mysql(self):
        selected_items = self.listw_tags.selectedItems()
        selected_tags = [item.text() for item in selected_items]

        # For demonstration, I'll generate sample data
        sample_data = [
            ("Tag1", 10.0, 192, "2023-01-01 12:00:00"),
            ("Tag2", 20.0, 128, "2023-01-01 12:01:00"),
            ("Tag3", 30.0, 0, "2023-01-01 12:02:00"),
        ]

        # Convert sample data to OPCData objects
        opc_data_objects = [
            OPCData(tag=record[0], value=float(record[1]), quality=int(record[2]), time=datetime.strptime(record[3], '%Y-%m-%d %H:%M:%S'))
            for record in sample_data
        ]

        # Create SQLAlchemy engine and session if not already created
        if self.engine is None:
            mysql_config = {
                'host': self.mysql_host.text(),
                'user': self.mysql_username.text(),
                'password': self.mysql_password.text(),
                'database': self.mysql_db_name.text(),
            }

            self.engine = create_engine(f"mysql+mysqlconnector://{mysql_config['user']}:{mysql_config['password']}@{mysql_config['host']}/{mysql_config['database']}", echo=True)
            Base.metadata.create_all(self.engine)
            self.Session = sessionmaker(bind=self.engine)
            self.session = self.Session()

        # Add objects to the database
        self.session.add_all(opc_data_objects)
        self.session.commit()

        log_message = f"{len(opc_data_objects)} No. of Records Logged into MySQL."
        print(log_message)
        self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_message}")

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = OPCDAToMySQLLogger()
    window.show()
    sys.exit(app.exec_())
