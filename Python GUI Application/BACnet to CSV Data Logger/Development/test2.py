import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout, QLabel, QPushButton, QComboBox, QTextEdit, QListWidget, QListWidgetItem, QRadioButton, QHBoxLayout, QSplitter, QMessageBox, QMenu, QAction
from PyQt5.QtCore import QTimer
import BAC0
import time
import os
import csv
import datetime
import sqlite3


# Disable
def blockPrint():
    sys.stdout = open(os.devnull, 'w')

# Restore
def enablePrint():
    sys.stdout = sys.__stdout__

class BACnetLoggerApp(QMainWindow):
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
    self.point_list = QListWidget()
    self.point_list.setSelectionMode(QListWidget.MultiSelection)
    self.populate_point_list()

    self.log_text = QTextEdit()
    self.log_text.setReadOnly(True)

    self.setWindowTitle('BACnet Logger')
    self.setGeometry(100, 100, 600, 350)  # Adjust the size and position of the window

    self.csv_radio = QRadioButton('Log to CSV')
    self.sqlite_radio = QRadioButton('Log to SQLite')

    self.radio_layout = QHBoxLayout()
    self.radio_layout.addWidget(self.csv_radio)
    self.radio_layout.addWidget(self.sqlite_radio)

    self.csv_label = QLabel("CSV File: No file created")
    self.db_label = QLabel("DB: No database created")

    csv_db_layout = QHBoxLayout()
    csv_db_layout.addWidget(self.csv_label)
    csv_db_layout.addWidget(self.db_label)

    # Create a splitter to make point list and log text horizontal
    splitter = QSplitter()
    splitter.addWidget(self.point_list)
    splitter.addWidget(self.log_text)

    self.device_combo = QComboBox()
    self.device_combo.addItems([device[0] for device in self.bacnet.devices])

    self.start_button = QPushButton('Start Logging')
    self.stop_button = QPushButton('Stop Logging')
    self.close_button = QPushButton('Close')

    self.start_button.clicked.connect(self.start_logging)
    self.stop_button.clicked.connect(self.stop_logging)
    self.close_button.clicked.connect(self.close_app)

    button_layout = QHBoxLayout()
    button_layout.addWidget(self.start_button)
    button_layout.addWidget(self.stop_button)
    button_layout.addWidget(self.close_button)

    main_layout = QVBoxLayout(self)
    main_layout.addLayout(self.radio_layout)
    main_layout.addLayout(csv_db_layout)
    main_layout.addWidget(self.device_combo)
    main_layout.addWidget(splitter)  # Add the splitter instead of point list and log text separately
    main_layout.addLayout(button_layout)

    self.timer = QTimer(self)
    self.timer.timeout.connect(self.log_data)
    self.timer.start(4000)

    self.show()


    def get_bac0_device(self, device, network):
        name, vendor, address, device_id = device
        return BAC0.device(address, device_id, network, poll=0, object_list=None)

    def start_logging(self):
        if not self.csv_radio.isChecked() and not self.sqlite_radio.isChecked():
            self.show_warning("Please select either 'Log to CSV' or 'Log to SQLite'.")
            return

        timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        self.log_text.clear()
        self.log_text.append(f"Logging started at {timestamp}")
        self.create_log_destination()
        self.logging_started = True
        self.update_ui()
        self.log_data()

    def show_warning(self, message):
        msg = QMessageBox()
        msg.setIcon(QMessageBox.Warning)
        msg.setText(message)
        msg.setWindowTitle("Warning")
        msg.exec_()

    def update_ui(self):
        # Enable or disable UI elements based on logging status and options selected
        self.point_list.setEnabled(not self.logging_started)
        self.start_button.setEnabled(not self.logging_started and (self.csv_radio.isChecked() or self.sqlite_radio.isChecked()))
        self.stop_button.setEnabled(self.logging_started)

    def stop_logging(self):
        timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        self.log_text.append(f"Logging stopped at {timestamp}")
        self.timer.stop()
        self.logging_started = False
        self.update_ui()

    def create_log_destination(self):
        if self.csv_radio.isChecked():
            self.create_csv_file()
        elif self.sqlite_radio.isChecked():
            self.create_sqlite_database()

    def create_csv_file(self):
        selected_points = [item.text() for item in self.point_list.selectedItems()]
        if selected_points:
            self.current_date = datetime.datetime.now().strftime('%d-%m-%Y')
            self.csv_filename = f"{self.current_date}.csv"
            self.csv_label.setText(f'CSV File: {self.csv_filename}')

            with open(self.csv_filename, 'w', newline='') as csv_file:
                csv_writer = csv.writer(csv_file)
                csv_writer.writerow(['TimeStamp'] + selected_points)

    def create_sqlite_database(self):
        selected_points = [item.text() for item in self.point_list.selectedItems()]
        if selected_points:
            self.current_date = datetime.datetime.now().strftime('%d-%m-%Y')
            self.db_filename = f"{self.current_date}.db"
            self.db_label.setText(f'DB: {self.db_filename}')

            with sqlite3.connect(self.db_filename) as conn:
                cursor = conn.cursor()
                # Replace dots with underscores in column names
                selected_points_underscored = [point.replace('.', '_') for point in selected_points]
                # Create the table with modified column names
                cursor.execute(
                    f"CREATE TABLE IF NOT EXISTS data (TimeStamp TEXT, {', '.join([f'{point} REAL' for point in selected_points_underscored])})"
                )
                conn.commit()

    def log_data(self):
        try:
            if not self.logging_started:
                return

            if self.csv_radio.isChecked():
                self.log_data_to_csv()
            elif self.sqlite_radio.isChecked():
                self.log_data_to_sqlite()

        except Exception as e:
            print(f"An error occurred: {e}")

    def log_data_to_csv(self):
        if self.csv_filename:
            selected_points = [item.text() for item in self.point_list.selectedItems()]

            if selected_points:

                blockPrint()
                print(self.bac0_device.points)
                enablePrint()
                                
                current_values = [point.lastValue for point in self.bac0_device.points if
                                  point.properties.name in selected_points]
                data_to_log = [datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')] + [value for value in current_values]

                with open(self.csv_filename, 'a', newline='') as csv_file:
                    csv_writer = csv.writer(csv_file)
                    csv_writer.writerow(data_to_log)

    def log_data_to_sqlite(self):
        if self.db_filename:
            selected_points = [item.text() for item in self.point_list.selectedItems()]

            if selected_points:
                selected_points_underscored = [point.replace('.', '_') for point in selected_points]
                with sqlite3.connect(self.db_filename) as conn:
                    cursor = conn.cursor()

                    # Create the table if it doesn't exist
                    cursor.execute(
                        f"CREATE TABLE IF NOT EXISTS data (TimeStamp TEXT, {', '.join([f'{point} REAL' for point in selected_points_underscored])})"
                    )
                    conn.commit()

                    blockPrint()
                    print(self.bac0_device.points)
                    enablePrint()

                    current_values = [point.lastValue for point in self.bac0_device.points if
                                    point.properties.name in selected_points]
                    data_to_log = [datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')] + [value for value in
                                                                                            current_values]

                    # Insert the data into the SQLite database
                    cursor.execute(f"INSERT INTO data VALUES ({', '.join(['?' for _ in data_to_log])})", data_to_log)
                    conn.commit()


    def populate_point_list(self):
        for point in self.bac0_device.points:
            item = QListWidgetItem(point.properties.name)
            self.point_list.addItem(item)

    def close_app(self):
        self.timer.stop()
        self.close()

    def show_about_dialog(self):
        about_text = (
            "Company Name: Fusion Automate\n"
            "Company Number: +91-9974477759\n"
            "Company Email: eng.innovativ@gmail.com\n"
        )
        QMessageBox.about(self, 'About Fusion Automate', about_text)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = BACnetLoggerApp()
    sys.exit(app.exec_())
