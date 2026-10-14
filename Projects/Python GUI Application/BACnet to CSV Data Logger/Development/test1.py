import sys
from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QLabel, QPushButton, QComboBox, QTextEdit, QListWidget, QListWidgetItem, QRadioButton
from PyQt5.QtCore import QTimer
from PyQt5.QtWidgets import QHBoxLayout

import BAC0
import time
import os
import csv
import datetime
import sqlite3

class BACnetLoggerApp(QWidget):
    def __init__(self):
        super().__init__()

        self.bacnet = BAC0.connect()
        self.bacnet.discover()

        if not self.bacnet.devices:
            print("No BACnet devices found. Exiting.")
            sys.exit()

        self.device = self.bacnet.devices[0]
        self.bac0_device = self.get_bac0_device(self.device, self.bacnet)

        self.current_date = datetime.datetime.now().strftime('%d-%m-%Y')
        self.csv_filename = None  # No filename initially
        self.db_filename = None  # No database filename initially

        self.logging_started = False  # Added flag to track logging status

        self.init_ui()

    def init_ui(self):
        self.setWindowTitle('BACnet Logger')
        self.setGeometry(100, 100, 600, 600)  # Adjust the size and position of the window

        self.csv_label = QLabel("File/DB: No file created")
        self.device_combo = QComboBox()
        self.device_combo.addItems([device[0] for device in self.bacnet.devices])

        self.log_text = QTextEdit()
        self.log_text.setReadOnly(True)

        self.point_list = QListWidget()
        self.point_list.setSelectionMode(QListWidget.MultiSelection)
        self.populate_point_list()

        self.start_button = QPushButton('Start Logging')
        self.stop_button = QPushButton('Stop Logging')
        self.close_button = QPushButton('Close')

        self.csv_radio = QRadioButton('CSV')
        self.sqlite_radio = QRadioButton('SQLite')

        self.start_button.clicked.connect(self.start_logging)
        self.stop_button.clicked.connect(self.stop_logging)
        self.close_button.clicked.connect(self.close_app)

        button_layout = QHBoxLayout()
        button_layout.addWidget(self.start_button)
        button_layout.addWidget(self.stop_button)
        button_layout.addWidget(self.close_button)

        radio_layout = QHBoxLayout()
        radio_layout.addWidget(self.csv_radio)
        radio_layout.addWidget(self.sqlite_radio)

        main_layout = QVBoxLayout()
        main_layout.addWidget(self.csv_label)
        main_layout.addWidget(self.device_combo)
        main_layout.addWidget(self.log_text)
        main_layout.addWidget(self.point_list)
        main_layout.addLayout(button_layout)
        main_layout.addLayout(radio_layout)

        self.setLayout(main_layout)

        self.timer = QTimer(self)
        self.timer.timeout.connect(self.log_data)
        self.timer.start(4000)

        self.show()

    def get_bac0_device(self, device, network):
        name, vendor, address, device_id = device
        return BAC0.device(address, device_id, network, poll=0, object_list=None)

    def start_logging(self):
        timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        self.log_text.clear()
        self.log_text.append(f"Logging started at {timestamp}")
        self.create_log_destination()
        self.logging_started = True
        self.update_ui()
        self.log_data()

    def update_ui(self):
        # Enable or disable UI elements based on logging status
        self.point_list.setEnabled(not self.logging_started)
        self.start_button.setEnabled(not self.logging_started)
        self.stop_button.setEnabled(self.logging_started)
        self.csv_radio.setEnabled(not self.logging_started)
        self.sqlite_radio.setEnabled(not self.logging_started)

    def stop_logging(self):
        timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        self.log_text.append(f"Logging stopped at {timestamp}")
        self.timer.stop()
        self.logging_started = False
        self.update_ui()

    def create_log_destination(self):
        selected_points = [item.text() for item in self.point_list.selectedItems()]

        if not selected_points:
            print("No points selected. Please select at least one point.")
            return

        if self.csv_radio.isChecked():
            self.create_csv_file(selected_points)
        elif self.sqlite_radio.isChecked():
            self.create_sqlite_database(selected_points)

    def create_csv_file(self, selected_points):
        self.current_date = datetime.datetime.now().strftime('%d-%m-%Y')
        self.csv_filename = f"{self.current_date}.csv"
        self.csv_label.setText(f'File: {self.csv_filename}')

        with open(self.csv_filename, 'w', newline='') as csv_file:
            csv_writer = csv.writer(csv_file)
            csv_writer.writerow(['TimeStamp'] + selected_points)

    def create_sqlite_database(self, selected_points):
        self.current_date = datetime.datetime.now().strftime('%d-%m-%Y')
        self.db_filename = f"{self.current_date}.db"
        self.csv_label.setText(f'DB: {self.db_filename}')

        with sqlite3.connect(self.db_filename) as conn:
            cursor = conn.cursor()
            # Replace dots with underscores in column names
            selected_points_underscored = [point.replace('.', '_') for point in selected_points]
            # Create the table with modified column names
            cursor.execute(f"CREATE TABLE IF NOT EXISTS data (TimeStamp TEXT, {', '.join([f'{point} REAL' for point in selected_points_underscored])})")
            conn.commit()


    def log_data(self):
        
        # Disable
        def blockPrint():
            sys.stdout = open(os.devnull, 'w')

        # Restore
        def enablePrint():
            sys.stdout = sys.__stdout__

        if self.logging_started:
            selected_points = [item.text() for item in self.point_list.selectedItems()]

            if not selected_points:
                print("No points selected. Please select at least one point.")
                return

            blockPrint()
            print(self.bac0_device.points)
            enablePrint()

            current_values = [point.lastValue for point in self.bac0_device.points if point.properties.name in selected_points]
            data_to_log = [datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')] + current_values
            print("Logging data:", data_to_log)

            if self.csv_filename:
                self.log_data_csv(data_to_log)

            if self.db_filename:
                self.log_data_sqlite(data_to_log)

    def log_data_csv(self, data_to_log):
        try:
            with open(self.csv_filename, 'a', newline='') as csv_file:
                csv_writer = csv.writer(csv_file)
                csv_writer.writerow(data_to_log)
        except Exception as e:
            print(f"An error occurred while logging to CSV: {e}")

    def log_data_sqlite(self, data_to_log):
        try:
            with sqlite3.connect(self.db_filename) as conn:
                cursor = conn.cursor()
                cursor.execute(f"INSERT INTO data VALUES ({', '.join(['?'] * len(data_to_log))})", data_to_log)
                conn.commit()
        except Exception as e:
            print(f"An error occurred while logging to SQLite: {e}")

    def populate_point_list(self):
        for point in self.bac0_device.points:
            item = QListWidgetItem(point.properties.name)
            self.point_list.addItem(item)

    def close_app(self):
        self.timer.stop()
        self.close()


if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = BACnetLoggerApp()
    sys.exit(app.exec_())
