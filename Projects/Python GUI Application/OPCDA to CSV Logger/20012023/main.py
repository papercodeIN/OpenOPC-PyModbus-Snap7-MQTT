import sys
from PyQt5.QtWidgets import (
    QDialog, QApplication, QWidget, QVBoxLayout, QGroupBox, 
    QPushButton, QTextEdit, QHBoxLayout,QLabel, QFormLayout, QLineEdit, QMessageBox  # Add this line for QHBoxLayout
)
from PyQt5.QtCore import QDateTime, QTimer
from PyQt5.QtGui import QClipboard
import OpenOPC
from PyQt5.QtCore import Qt
import pywintypes
import pandas as pd
import os
import configparser
import time
import logging
from logging.handlers import TimedRotatingFileHandler
from datetime import datetime
import pymsteams
pywintypes.datetime = pywintypes.TimeType

# > 
class AuthenticationDialog(QDialog):
    def __init__(self):
        super().__init__()

        self.username_input = QLineEdit(self)
        self.password_input = QLineEdit(self)
        self.password_input.setEchoMode(QLineEdit.Password)

        login_button = QPushButton("Login", self)
        login_button.clicked.connect(self.authenticate)

        layout = QVBoxLayout()
        layout.addWidget(QLabel("Username:"))
        layout.addWidget(self.username_input)
        layout.addWidget(QLabel("Password:"))
        layout.addWidget(self.password_input)
        layout.addWidget(login_button)

        self.setLayout(layout)
        self.setWindowTitle("Login")

    def authenticate(self):
        # Replace the condition below with your actual authentication logic
        if self.username_input.text() == "root" and self.password_input.text() == "toor":
            self.accept()
        else:
            self.reject()
# > 
            
class OPCDAToCsvLogger(QWidget):
    # Configuration Keys
    HOST_KEY = 'opc_da_server'
    FILE_PATH_KEY = 'tag'
    LOGGING_INTERVAL_KEY = 'logging_interval'
    LOGGING_FOLDER_KEY = 'folder'

    def __init__(self):
        super().__init__()

        # Initialize logger attribute
        self.logger = None

        self.opc = None
        self.selected_tags = []
        self.retry_count = 0
        self.config = self.read_config()  # Read configuration from config.ini

        # Setup logging before connecting to OPC server
        self.setup_logging()

        # Create log_textedit before connecting to OPC server
        self.log_textedit = QTextEdit(self)

        # Get Teams webhook link from config.ini
        self.teams_webhook_link = self.config.get('alerts', 'teams_link')  
        
        # Initialize as None initially
        self.current_filename = None  

        # >
        # Authenticate the user before proceeding
        authentication_dialog = AuthenticationDialog()
        result = authentication_dialog.exec_()

        if result != QDialog.Accepted:
            sys.exit()
        # >
            
        # >
        app = QApplication.instance()
        if app is not None:
            app.aboutToQuit.connect(self.close_opc_connection)
        # >
            
        # Automatically connect to OPC-DA server when the application is launched
        self.connect_to_opc_server()

        # Add this attribute in __init__ to track data logging status
        self.logging_enabled = False

        self.init_ui()

    def setup_logging(self):
        log_folder = self.config.get('logging', 'application_log')  # Use application_log from config.ini
        today_date = datetime.today().strftime('%Y-%m-%d')
        log_file = os.path.join(log_folder, f'application_{today_date}.log')  # Include today's date in the log file name

        # Ensure that the log folder exists
        if not os.path.exists(log_folder):
            os.makedirs(log_folder)

        # Create a TimedRotatingFileHandler that creates a new log file every day
        log_handler = TimedRotatingFileHandler(log_file, when="midnight", interval=1, backupCount=7)
        log_handler.setLevel(logging.INFO)

        # Create a formatter and set it for the handler
        log_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        log_handler.setFormatter(log_formatter)

        # Create a logger and add the handler to it
        self.logger = logging.getLogger()
        self.logger.addHandler(log_handler)
        self.logger.setLevel(logging.INFO)

    def close_opc_connection(self):
        if self.opc is not None:
            try:
                self.opc.close()
                self.logger.info("OPC-DA server connection closed.")
            except Exception as e:
                self.logger.error(f"Error closing OPC-DA server connection: {str(e)}")


    def read_config(self):
        config = configparser.ConfigParser()
        config.read('config.ini')
        return config

    def init_ui(self):
        # Display configuration information
        config_info_label = QLabel("Configuration Information:")
        config_info_label.setAlignment(Qt.AlignCenter)

        config_layout = QFormLayout()
        config_layout.addRow("OPC-DA Server:", QLabel(self.config.get(self.HOST_KEY, 'host')))
        # config_layout.addRow("Tag File Path:", QLabel(self.config.get(self.FILE_PATH_KEY, 'file_path')))
        config_layout.addRow("Logging Interval:", QLabel(str(self.config.get('logging', self.LOGGING_INTERVAL_KEY))))

        # Buttons layout above log group box
        buttons_layout = QHBoxLayout()  # Use QHBoxLayout for horizontal alignment
        self.start_logging_button = QPushButton("Start Data Logging", self)
        self.start_logging_button.clicked.connect(self.start_logging)
        buttons_layout.addWidget(self.start_logging_button)

        self.stop_logging_button = QPushButton("Stop Data Logging", self)
        self.stop_logging_button.clicked.connect(self.stop_logging)
        buttons_layout.addWidget(self.stop_logging_button)

        # Logging section
        log_groupbox = QGroupBox("Logs:")
        log_layout = QVBoxLayout()
        log_layout.addWidget(self.log_textedit)
        log_groupbox.setLayout(log_layout)

        # Buttons layout below log group box
        additional_buttons_layout = QHBoxLayout()
        self.copy_logs_button = QPushButton("Copy Logs to Clipboard", self)
        self.copy_logs_button.clicked.connect(self.copy_logs_to_clipboard)
        additional_buttons_layout.addWidget(self.copy_logs_button)

        self.clear_logs_button = QPushButton("Clear Logs", self)
        self.clear_logs_button.clicked.connect(self.clear_logs)
        additional_buttons_layout.addWidget(self.clear_logs_button)

        self.exit_button = QPushButton("Exit", self)
        self.exit_button.clicked.connect(self.close)
        additional_buttons_layout.addWidget(self.exit_button)

        # Add the labels and buttons layouts to the main layout
        main_layout = QVBoxLayout()
        main_layout.addWidget(config_info_label)
        main_layout.addLayout(config_layout)
        main_layout.addLayout(buttons_layout)
        main_layout.addWidget(log_groupbox)
        main_layout.addLayout(additional_buttons_layout)

        # Set the layout for the main window
        self.setLayout(main_layout)

        # Set window properties
        self.setWindowTitle('OPC-DA to CSV Logger')
        self.setGeometry(100, 100, 800, 800)  # Adjusted height for tag list and logs

        # Connect aboutToQuit signal to send_alert_on_exit function
        app = QApplication.instance()
        app.aboutToQuit.connect(self.send_alert_on_exit)

        try:
            # Get logging folder from config.ini
            logging_folder = self.config.get('logging', self.LOGGING_FOLDER_KEY)
            if not os.path.exists(logging_folder):
                os.makedirs(logging_folder)
        except configparser.Error as e:
            self.logger.error(f"Error reading configuration: {e}")

    def connect_to_opc_server(self):
        try:
            selected_opc_server = self.config.get(self.HOST_KEY, 'host')
        except configparser.Error as e:
            self.logger.error(f"Error reading configuration: {e}")
            return

        max_retries = 15  # Set the maximum number of connection retries
        retry_interval = 60  # Set the interval between retries in seconds

        for retry in range(1, max_retries + 1):
            try:
                self.opc = OpenOPC.client()
                self.opc.connect(selected_opc_server)
                self.logger.info(f"{selected_opc_server} server connected.")
                self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {selected_opc_server} server connected.")
                break  # Exit the loop if the connection is successful
            
            except OpenOPC.OPCError as e:
                log_message = f"Error connecting to OPC-DA server {selected_opc_server} (Retry {retry}/{max_retries}): {e}"
                self.logger.error(log_message)
                self.send_alert(log_message)

                if retry == max_retries:
                    error_message = f"Maximum connection retries reached. Unable to connect to OPC-DA server {selected_opc_server}."
                    self.logger.error(error_message)

                    # Send Teams alert on max retries
                    teams_alert_message = f"Failed to connect to OPC-DA server {selected_opc_server} after {max_retries} retries."
                    self.send_alert(teams_alert_message)
                    return

                time.sleep(retry_interval)

        try:
            csv_file_path = self.config.get(self.FILE_PATH_KEY, 'file_path')
            csv_file = os.path.join(csv_file_path)  # Provide the actual CSV filename

            tags_df = pd.read_csv(csv_file)
            unique_tags = tags_df['Tag'].unique().tolist()
            self.selected_tags = unique_tags
            self.logger.info(f"Connected to OPC-DA server {selected_opc_server}.")

        except FileNotFoundError as e:
            self.logger.error(f"Error reading CSV file: {e}")
        except pd.errors.EmptyDataError:
            self.logger.error("CSV file is empty or malformed.")
        except pd.errors.ParserError as e:
            self.logger.error(f"Error parsing CSV file: {e}")

    def start_logging(self):
        # Check if data logging is already running
        if self.logging_enabled:
            log_message = "Data logging is already running."
            self.logger.warning(log_message)
            self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_message}")
            return

        filepath = self.config.get('logging', self.LOGGING_FOLDER_KEY)

        # Validate filepath
        if not filepath.endswith(os.path.sep):
            filepath += os.path.sep

        # Form the filename with the timestamp in the format YYYY-MM-DD HHMM
        filename = f"{datetime.today().strftime('%Y-%m-%d_%H%M')}.csv"
        # Enable data logging
        self.logging_enabled = True

        log_message = f"Started logging OPC data to CSV file: {filename} at {filepath}."
        self.logger.info(log_message)
        # self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_message}")

        # Get the logging interval from the config.ini file
        try:
            logging_interval = int(self.config.get('logging', self.LOGGING_INTERVAL_KEY))
        except (configparser.Error, ValueError) as e:
            logging_interval = 5000  # Default to 5000 milliseconds (5 seconds)

        # print(f"Logging Interval: {logging_interval} milliseconds")    
        self.logger.info(f"Logging Interval: {logging_interval} milliseconds")        

        # Start a timer to periodically log OPC data and check for a new file every 15 minutes
        self.logging_timer = QTimer(self)

        def on_timer_timeout():
            current_time = datetime.now()
            minutes = current_time.minute

            # Form the folder structure based on year, month, and day
            folder_path = os.path.join(
                filepath,
                str(current_time.year),
                # f"{current_time.strftime('%m')}_{current_time.strftime('%B')}",
                f"{current_time.strftime('%m')}",
                f"{current_time.strftime('%d')}"
            )

            # Ensure the folder structure exists, create if not
            os.makedirs(folder_path, exist_ok=True)

            # Check if the current minute is a multiple of 15 (i.e., 0, 15, 30, 45)
            if minutes % 15 == 0:
                # Form the filename with the updated timestamp
                new_filename = f"{current_time.strftime('%Y-%m-%d_%H%M')}.csv"

                # Full path to the new CSV file
                full_filepath = os.path.join(folder_path, new_filename)

                # Log OPC data to the new CSV file
                self.log_data_to_csv(full_filepath, filepath)
                self.current_filename = new_filename  # Update current filename

                log_message = f"Started logging OPC data to CSV file: {filename}"
                self.logger.info(log_message)
                # self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_message}")

            else:
                # Continue logging to the current file
                if self.current_filename is None:
                    # This is the initial case or if the timer is started before the first 15-minute interval
                    self.current_filename = f"{current_time.strftime('%Y-%m-%d_%H%M')}.csv"

                # Full path to the current CSV file
                full_filepath = os.path.join(folder_path, self.current_filename)
                # print(f">>> Full File Path: {full_filepath}")

                self.log_data_to_csv(full_filepath, filepath)

        # Connect the timer to the logic for the subsequent intervals
        self.logging_timer.timeout.connect(on_timer_timeout)

        # Set the timer interval based on the configured logging interval
        self.logging_timer.start(logging_interval)

        # Print timer status for debugging
        # print(f"Timer Status after starting: {self.logging_timer.isActive()}")
        self.logger.info(f"Timer Status after starting: {self.logging_timer.isActive()}")

        # Send alert when logging starts with timestamp
        alert_timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        alert_message = f"Data logging started at {alert_timestamp}. File: {filename}"
        self.logger.info(f"Data logging started at {alert_timestamp}. File: {filename}")
        self.send_alert(alert_message)

        # Disable the exit button
        self.exit_button.setEnabled(False)

    def stop_logging(self):
        # Check if data logging is already stopped
        if not self.logging_enabled:
            log_message = "Data logging is already stopped."
            self.logger.warning(log_message)
            self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_message}")
            return

        # Log the attempt to stop logging
        log_attempt_message = "Attempting to stop logging. Prompting for authentication."
        self.logger.info(log_attempt_message)
        self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_attempt_message}")

        # Prompt user for authentication before stopping logging
        authentication_dialog = AuthenticationDialog()
        result = authentication_dialog.exec_()

        if result == QDialog.Accepted:
            # Stop the logging timer
            if hasattr(self, 'logging_timer'):
                self.logging_timer.stop()

            # Send alert when logging stops with timestamp
            alert_timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            alert_message = f"Data logging stopped at {alert_timestamp}."
            self.send_alert(alert_message)

            log_message = "Stopped logging OPC data to CSV."
            self.logger.info(log_message)
            self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_message}")

            # Disable data logging
            self.logging_enabled = False
            
            # Enable the exit button
            self.exit_button.setEnabled(True)

        else:
            # Authentication failed, notify the user
            QMessageBox.warning(self, "Authentication Failed", "Authentication failed. Please provide valid credentials.")

    # def log_data_to_csv(self, filename, filepath):

    #     try:
    #         if self.opc.ping() == False:
    #             self.logger.error("OPCDA Server is not Connected")
    #             self.logger.info("Reconnecting with OPCDA Server")
    #             self.connect_to_opc_server()
    #         else:
    #             # Read OPC data
    #             selected_tags = self.selected_tags  # Assuming all tags are selected
    #             opc_data = self.opc.read(selected_tags, timeout=30000)
    #             self.logger.info(f"OPCDA Data Read Lenght: {len(opc_data)}")

    #             # Log OPC data to CSV file
    #             log_message = self.csv_append(opc_data, filename, filepath)
    #             self.logger.info(log_message)
    #             # self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_message}")

    #     except Exception as e:
    #         error_message = f"Error logging OPC data to CSV: {str(e)}"
    #         self.logger.error(error_message)
    #         # print(error_message)
    #         # self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {error_message}")

    def log_data_to_csv(self, filename, filepath):
        try:
            # Read OPC data
            selected_tags = self.selected_tags  # Assuming all tags are selected
            opc_data = self.opc.read(selected_tags, timeout=30000)
            self.logger.info(f"OPCDA Data Read Lenght: {len(opc_data)}")

            # Log OPC data to CSV file
            log_message = self.csv_append(opc_data, filename, filepath)
            self.logger.info(log_message)

        except Exception as e:
            error_message = f"Error logging OPC data to CSV: {str(e)}"
            self.logger.error(error_message)

            # Close OPC connection and attempt to reconnect
            self.close_opc_connection()
            self.logger.info("Reconnecting with OPCDA Server")
            self.connect_to_opc_server()

            # # Check if the reconnection is successful
            # if self.opc is None or not self.opc.ping():
            #     reconnect_error_message = "Reconnection attempt failed. OPC-DA server is not connected. Unable to log data to CSV."
            #     self.logger.error(reconnect_error_message)
            #     return reconnect_error_message

            # Retry reading OPC data after successful reconnection
            try:
                opc_data = self.opc.read(selected_tags, timeout=30000)
                self.logger.info(f"OPCDA Data Read Lenght: {len(opc_data)}")

                # Log OPC data to CSV file
                log_message = self.csv_append(opc_data, filename, filepath)
                self.logger.info(log_message)

            except Exception as e:
                final_error_message = f"Error after successful reconnection: {str(e)}"
                self.logger.error(final_error_message)
                return final_error_message

        return None  # Return None if the operation is successful


    # def log_data_to_csv(self, filename, filepath):
    #     try:
    #         # Check if OPC server is connected
    #         if self.opc is None or not self.opc.ping():
    #             # If not connected, attempt to reconnect
    #             self.connect_to_opc_server()
    #             if self.opc is None or not self.opc.ping():
    #                 error_message = "OPC-DA server is not connected. Unable to log data to CSV."
    #                 self.logger.error(error_message)
    #                 return error_message

    #         # Read OPC data
    #         selected_tags = self.selected_tags  # Assuming all tags are selected
    #         opc_data = self.opc.read(selected_tags, timeout=30000)

    #         # Log OPC data to CSV file
    #         log_message = self.csv_append(opc_data, filename, filepath)
    #         self.logger.info(log_message)
    #         # self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_message}")

    #     except Exception as e:
    #         error_message = f"Error logging OPC data to CSV: {str(e)}"
    #         self.logger.error(error_message)
    #         # print(error_message)
    #         # self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {error_message}")

    def send_alert(self, msg):
        try:
            teams_webhook_link = self.config.get('alerts', 'teams_link')
            my_teams_message = pymsteams.connectorcard(teams_webhook_link)
            my_teams_message.text(msg)
            my_teams_message.send()
            self.logger.info(f"Alert sent successfully: {msg}")

        except configparser.Error as e:
            error_message = f"Error reading Teams webhook link from configuration: {e}"
            self.logger.error(error_message)
            print(error_message)

        except Exception as e:
            error_message = f"Error sending alert: {str(e)}"
            self.logger.error(error_message)
            print(error_message)

    def csv_append(self, results, filename, filepath):

        try:
            full_filepath = os.path.join(filepath, filename)

            if os.path.exists(full_filepath):
                # File exists, append to it
                temp_df = pd.DataFrame(results, columns=['Tag', 'Value', 'Quality', 'Time'])
                temp_df.to_csv(full_filepath, mode='a', header=False, index=False)

                log_message = f'{len(temp_df)} No. of Records Logged into CSV.'
                self.logger.info(log_message)

            else:
                # File doesn't exist, create and append
                temp_df = pd.DataFrame(results, columns=['Tag', 'Value', 'Quality', 'Time'])
                temp_df.to_csv(full_filepath, mode='a', header=True, index=False)

                log_message = f'{len(temp_df)} No. of Records Logged into CSV.'
                self.logger.info(log_message)

        except FileNotFoundError as e:
            error_message = f'Error: Unable to Log Records Into CSV - File is OPEN: {e}'
            self.logger.error(error_message)
            return error_message  # Return the error message to handle it in the calling code
        except Exception as e:
            error_message = f'Error: Unable to Log Records Into CSV: {str(e)}'
            self.logger.error(error_message)
            return error_message  # Return the error message to handle it in the calling code

        return f'{len(temp_df)} No. of Records Logged into CSV.'


    def log_error(self, message):
        self.logger.error(message)
        print(f"Error: {message}")
        # self.log_textedit.append(message)

    def log_info(self, message):
        self.logger.info(message)
        # self.log_textedit.append(message)

    def clear_logs(self):
        self.log_textedit.clear()
        log_message = "Cleared logs."
        self.logger.info(log_message)
        # self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_message}")

    def copy_logs_to_clipboard(self):
        logs = self.log_textedit.toPlainText()
        clipboard = QApplication.clipboard()
        clipboard.setText(logs)
        log_message = "Copied logs to clipboard."
        self.logger.info(log_message)
        # self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_message}")

    def send_alert_on_exit(self):
        try:
            # Send alert when the application is about to quit
            alert_message = f"Application exited at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}."
            self.logger.info(alert_message)
            
            # Attempt to send the alert
            self.send_alert(alert_message)

        except Exception as e:
            # Handle exceptions, log the error, and display a message
            error_message = f"Error sending alert on exit: {str(e)}"
            self.logger.error(error_message)
            # print(error_message)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    # app.aboutToQuit.connect(self.close_opc_connection)  # Connect the signal to close_opc_connection method    
    window = OPCDAToCsvLogger()
    window.show()
    sys.exit(app.exec_())