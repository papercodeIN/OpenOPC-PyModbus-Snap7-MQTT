import sys
from PyQt5.QtWidgets import (
    QApplication, QWidget, QHBoxLayout, QVBoxLayout, QGroupBox,
    QPushButton, QComboBox, QLabel, QLineEdit, QTextEdit,
    QListWidget, QListWidgetItem, QAbstractItemView, QFileDialog
)
from PyQt5.QtCore import Qt, QMimeData, QTimer, QDateTime
import OpenOPC
import paho.mqtt.client as mqtt
import pywintypes
import pandas as pd
pywintypes.datetime = pywintypes.TimeType


def servers(opc):
    return opc.servers()

class OPCDAToMqttPublisher(QWidget):
    def __init__(self):
        super().__init__()

        self.opc = None
        self.selected_tags = []
        self.mqtt_client = mqtt.Client()
        self.publishing_timer = QTimer(self)

        self.init_ui()

    def init_ui(self):
        # Create widgets
        self.opc_combobox = QComboBox(self)
        self.populate_opc_servers()  # Populate OPC servers when the application is launched

        self.connect_button = QPushButton("Connect", self)
        self.connect_button.clicked.connect(self.connect_to_opc_server)

        self.listw_tags = QListWidget(self)
        self.listw_tags.setSelectionMode(QAbstractItemView.MultiSelection)

        self.mqtt_host_label = QLabel("MQTT Host IP:")
        self.mqtt_host_edit = QLineEdit(self)
        self.mqtt_host_edit.setText("127.0.0.1")  # Default interval is 10 seconds

        self.port_label = QLabel("Port Number:")
        self.port_edit = QLineEdit(self)
        self.port_edit.setText("1883")  # Default interval is 10 seconds

        self.start_publishing_button = QPushButton("Start Publishing", self)
        self.start_publishing_button.clicked.connect(self.start_publishing)

        self.stop_publishing_button = QPushButton("Stop Publishing", self)
        self.stop_publishing_button.clicked.connect(self.stop_publishing)

        self.refresh_button = QPushButton("Refresh", self)
        self.refresh_button.clicked.connect(self.refresh_opc_servers)

        self.copy_logs_button = QPushButton("Copy Logs to Clipboard", self)
        self.copy_logs_button.clicked.connect(self.copy_logs_to_clipboard)

        self.clear_logs_button = QPushButton("Clear Logs", self)
        self.clear_logs_button.clicked.connect(self.clear_logs)

        self.log_textedit = QTextEdit(self)

        self.exit_button = QPushButton("Exit", self)
        self.exit_button.clicked.connect(self.close)

        self.interval_label = QLabel("Publishing Interval (s):")
        self.interval_edit = QLineEdit(self)
        self.interval_edit.setText("10")  # Default interval is 10 seconds

        # Create layouts
        vertical_layout = QVBoxLayout()

        # OPC Server layout
        opc_layout = QHBoxLayout()
        opc_layout.addWidget(self.opc_combobox)
        opc_layout.addWidget(self.connect_button)
        opc_layout.addWidget(self.refresh_button)

        # Server group
        opc_groupbox = QGroupBox("OPC Server:")
        opc_groupbox.setLayout(opc_layout)

        # Tag list layout
        tag_layout = QVBoxLayout()
        tag_layout.addWidget(QLabel("Select Tags:"))
        tag_layout.addWidget(self.listw_tags)

        # MQTT group
        mqtt_groupbox = QGroupBox("MQTT:")
        mqtt_layout = QVBoxLayout()
        mqtt_layout.addWidget(self.mqtt_host_label)
        mqtt_layout.addWidget(self.mqtt_host_edit)
        mqtt_layout.addWidget(self.port_label)
        mqtt_layout.addWidget(self.port_edit)
        mqtt_layout.addWidget(self.interval_label)
        mqtt_layout.addWidget(self.interval_edit)
        mqtt_layout.addWidget(self.start_publishing_button)
        mqtt_layout.addWidget(self.stop_publishing_button)
        mqtt_groupbox.setLayout(mqtt_layout)

        # Publish and Stop Publishing buttons layout
        publish_layout = QHBoxLayout()
        publish_layout.addWidget(self.start_publishing_button)
        publish_layout.addWidget(self.stop_publishing_button)

        # Logging section
        log_groupbox = QGroupBox("Logs:")
        log_layout = QVBoxLayout()
        log_layout.addWidget(self.log_textedit)
        log_groupbox.setLayout(log_layout)

        # Buttons layout
        buttons_layout = QHBoxLayout()
        buttons_layout.addWidget(self.copy_logs_button)
        buttons_layout.addWidget(self.clear_logs_button)
        buttons_layout.addWidget(self.exit_button)

        # Add layouts to the main vertical layout
        vertical_layout.addWidget(opc_groupbox)
        vertical_layout.addLayout(tag_layout)
        vertical_layout.addWidget(mqtt_groupbox)
        vertical_layout.addLayout(publish_layout)
        vertical_layout.addWidget(log_groupbox)
        vertical_layout.addLayout(buttons_layout)

        # Set the layout for the main window
        self.setLayout(vertical_layout)

        # Set window properties
        self.setWindowTitle('OPC-DA to MQTT Publisher')
        self.setGeometry(100, 100, 800, 800)  # Increased height for tag list, logs, and added interval controls

    def populate_opc_servers(self):
        opc = OpenOPC.client()
        opc_servers = servers(opc)
        self.opc_combobox.addItems(opc_servers)

    def connect_to_opc_server(self):
        selected_opc_server = self.opc_combobox.currentText()
        self.opc = OpenOPC.client()
        self.opc.connect(selected_opc_server)

        # Prompt user to select a CSV file
        csv_file, _ = QFileDialog.getOpenFileName(self, "Select CSV File", "", "CSV Files (*.csv);;All Files (*)")

        if not csv_file:
            # User canceled the file selection
            return

        # Read tags from the CSV file using Pandas
        try:
            tags_df = pd.read_csv(csv_file)
            self.selected_tags = tags_df['Tag'].tolist()

            # Automatically select all tags in the list widget
            self.listw_tags.selectAll()

        except Exception as e:
            log_message = f"Error reading CSV file: {str(e)}"
            print(log_message)
            self.log_textedit.append(log_message)
            return

        log_message = f"Connected to OPC-DA server {selected_opc_server}."
        print(log_message)
        self.log_textedit.append(log_message)

        # Populate the tag list with tags from the CSV file
        self.populate_tag_list()

    def refresh_opc_servers(self):
        self.opc_combobox.clear()
        self.populate_opc_servers()
        log_message = "Refreshed OPC servers."
        print(log_message)
        self.log_textedit.append(log_message)

        # Clear selected tags and tag list
        self.selected_tags = []
        self.listw_tags.clear()

    def populate_tag_list(self):
        self.listw_tags.clear()
        for tag in self.selected_tags:
            item = QListWidgetItem(tag)
            self.listw_tags.addItem(item)

    def disable_config_widgets(self):
        # Disable configuration widgets during publishing
        self.opc_combobox.setEnabled(False)
        self.connect_button.setEnabled(False)
        self.refresh_button.setEnabled(False)
        self.listw_tags.setEnabled(False)
        self.mqtt_host_edit.setEnabled(False)
        self.port_edit.setEnabled(False)
        self.interval_edit.setEnabled(False)
        self.start_publishing_button.setEnabled(False)

    def enable_config_widgets(self):
        # Enable configuration widgets when publishing stops
        self.opc_combobox.setEnabled(True)
        self.connect_button.setEnabled(True)
        self.refresh_button.setEnabled(True)
        self.listw_tags.setEnabled(True)
        self.mqtt_host_edit.setEnabled(True)
        self.port_edit.setEnabled(True)
        self.interval_edit.setEnabled(True)
        self.start_publishing_button.setEnabled(True)

    def start_publishing(self):
        interval_seconds = int(self.interval_edit.text())
        self.publishing_timer.timeout.connect(self.publish_data)
        self.publishing_timer.start(interval_seconds * 1000)  # Convert seconds to milliseconds

        # Disable configuration widgets during publishing
        self.disable_config_widgets()

        log_message = f"Started publishing data at an interval of {interval_seconds} seconds."
        print(log_message)
        self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_message}")

    def stop_publishing(self):
        self.publishing_timer.stop()

        # Enable configuration widgets when publishing stops
        self.enable_config_widgets()

        log_message = "Stopped publishing data."
        print(log_message)
        self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_message}")

    def publish_data(self):
        # Get selected tags
        selected_items = self.listw_tags.selectedItems()
        self.selected_tags = [item.text() for item in selected_items]

        # Read OPCDA data
        opc_data = self.opc.read(self.selected_tags)

        # Connect to MQTT broker if not already connected
        if not self.mqtt_client.is_connected():
            mqtt_host = self.mqtt_host_edit.text()
            port_number = int(self.port_edit.text())  # Convert port number to int
            self.mqtt_client.connect(mqtt_host, port_number)
            self.mqtt_client.loop_start()  # Start the MQTT client loop

        # Publish data to MQTT broker
        for tag, value, timestamp, quality in opc_data:
            topic = f"{tag}"
            message = f"{value}"
            self.mqtt_client.publish(topic, message)

        # Log the publishing event
        # log_message = f"Published data to MQTT broker for tags: {', '.join(self.selected_tags)}"
        # print(log_message)
        # self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_message}")

    def on_mqtt_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT broker")
        else:
            print(f"Failed to connect to MQTT broker with code {rc}")

    def on_mqtt_publish(self, client, userdata, mid):
        print("Data published to MQTT broker")

    def copy_logs_to_clipboard(self):
        logs = self.log_textedit.toPlainText()
        mime_data = QMimeData()
        mime_data.setText(logs)
        QApplication.clipboard().setMimeData(mime_data)
        log_message = "Copied logs to clipboard."
        print(log_message)
        self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_message}")


    def clear_logs(self):
        self.log_textedit.clear()
        log_message = "Cleared logs."
        print(log_message)
        self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_message}")

    def keyPressEvent(self, event):
        # Close the application when 'q' or 'ESC' key is pressed
        if event.key() == Qt.Key_Q or event.key() == Qt.Key_Escape:
            self.close()


if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = OPCDAToMqttPublisher()
    window.show()
    sys.exit(app.exec_())
