import sys
import os
import csv
import logging
from datetime import datetime
from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton, QTextEdit
from opcua import Client
from configparser import ConfigParser

class OPCUAClient:
    def __init__(self, config_path):
        self.config = ConfigParser()
        self.config.read(config_path)
        self.server_url = self.config.get('OPCUA', 'server_url')
        self.tags = self.config.get('OPCUA', 'tags').split(',')
        self.log_folder = self.config.get('Logging', 'log_folder')
        self.data_folder = self.config.get('Logging', 'data_folder')
        self.log_file_path = os.path.join(self.log_folder, f'{datetime.now().strftime("%Y-%m-%d")}.log')

        logging.basicConfig(filename=self.log_file_path, level=logging.INFO, format='%(asctime)s - %(levelname)s: %(message)s')

        self.client = Client(self.server_url)
        self.csv_writer = None

    def start_logging(self):
        try:
            self.client.connect()
            logging.info('Connected to OPC UA server')

            while True:
                data = [self.client.get_node(tag).get_value() for tag in self.tags]

                if not os.path.exists(self.data_folder):
                    os.makedirs(self.data_folder)

                csv_file_path = os.path.join(self.data_folder, f'{datetime.now():%d-%m-%Y %H%M}.csv')

                if self.csv_writer is None:
                    self.csv_writer = csv.writer(open(csv_file_path, 'w', newline=''))
                    self.csv_writer.writerow(['Timestamp'] + self.tags)

                self.csv_writer.writerow([datetime.now()] + data)

                # Wait for 15 minutes before the next read
                QApplication.processEvents()
                QApp.processEvents()
                QApplication.processEvents()
                time.sleep(900)

        except Exception as e:
            logging.error(f'Error during OPC UA communication: {e}')

    def stop_logging(self):
        if self.client:
            self.client.disconnect()
            logging.info('Disconnected from OPC UA server')

        if self.csv_writer:
            self.csv_writer.close()

class DataLoggerApp(QWidget):
    def __init__(self):
        super().__init__()

        self.opcua_client = None

        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout()

        self.text_edit = QTextEdit()
        layout.addWidget(self.text_edit)

        start_button = QPushButton('Start Data Logging')
        start_button.clicked.connect(self.start_logging)
        layout.addWidget(start_button)

        stop_button = QPushButton('Stop Data Logging')
        stop_button.clicked.connect(self.stop_logging)
        layout.addWidget(stop_button)

        copy_button = QPushButton('Copy Logs to Clipboard')
        copy_button.clicked.connect(self.copy_logs)
        layout.addWidget(copy_button)

        clear_button = QPushButton('Clear Logs')
        clear_button.clicked.connect(self.clear_logs)
        layout.addWidget(clear_button)

        exit_button = QPushButton('Exit')
        exit_button.clicked.connect(self.exit_app)
        layout.addWidget(exit_button)

        self.setLayout(layout)

    def start_logging(self):
        self.opcua_client = OPCUAClient('config.ini')
        self.opcua_client.start_logging()

    def stop_logging(self):
        if self.opcua_client:
            self.opcua_client.stop_logging()

    def copy_logs(self):
        logs = self.opcua_client.log_file_path if self.opcua_client else 'No logs available'
        self.text_edit.setPlainText(logs)

    def clear_logs(self):
        self.text_edit.clear()

    def exit_app(self):
        if self.opcua_client:
            self.opcua_client.stop_logging()
        sys.exit()

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = DataLoggerApp()
    window.show()
    sys.exit(app.exec_())
