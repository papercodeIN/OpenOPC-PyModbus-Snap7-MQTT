import sys
from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QLineEdit, QPushButton, QVBoxLayout, QComboBox, QCheckBox
from PyQt5.QtCore import Qt, QTimer
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import BAC0
import datetime

Base = declarative_base()

class BACnetData(Base):
    __tablename__ = 'bacnet_data'
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    point_name = Column(String(255))
    value = Column(Float)

class BACnetLogger(QWidget):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("BACnet Logger")

        # MySQL Database Configuration
        self.mysql_host = QLineEdit(self)
        self.mysql_host.setPlaceholderText("MySQL Host")
        self.mysql_username = QLineEdit(self)
        self.mysql_username.setPlaceholderText("MySQL Username")
        self.mysql_password = QLineEdit(self)
        self.mysql_password.setPlaceholderText("MySQL Password")
        self.mysql_db_name = QLineEdit(self)
        self.mysql_db_name.setPlaceholderText("MySQL Database Name")
        self.mysql_table_name = QLineEdit(self)
        self.mysql_table_name.setPlaceholderText("MySQL Table Name")

        # BACnet Configuration
        self.bacnet_points = QComboBox(self)
        self.bacnet_points.addItems([
            "Temperature.Indoor",
            "Temperature.Water",
            "Temperature.Outdoor",
            "SetPoint.Value",
            "Setpoint.1",
            "Setpoint.2",
            "Setpoint.3",
            "State.Heater",
            "State.Chiller",
            "State",
            "State.VentilationLevel"
        ])
        self.bacnet_points.setDuplicatesEnabled(True)
        self.bacnet_points.setMaxCount(len(self.bacnet_points))

        self.start_button = QPushButton("Start Logging", self)
        self.start_button.clicked.connect(self.start_logging)

        self.stop_button = QPushButton("Stop Logging", self)
        self.stop_button.clicked.connect(self.stop_logging)
        self.stop_button.setEnabled(False)

        # Layout
        layout = QVBoxLayout(self)
        layout.addWidget(self.mysql_host)
        layout.addWidget(self.mysql_username)
        layout.addWidget(self.mysql_password)
        layout.addWidget(self.mysql_db_name)
        layout.addWidget(self.mysql_table_name)
        layout.addWidget(self.bacnet_points)
        layout.addWidget(self.start_button)
        layout.addWidget(self.stop_button)

        self.timer = QTimer(self)
        self.timer.timeout.connect(self.log_data)

        self.bacnet = None
        self.engine = None
        self.Session = None

    def start_logging(self):
        db_url = f"mysql+mysqlconnector://{self.mysql_username.text()}:{self.mysql_password.text()}@{self.mysql_host.text()}/{self.mysql_db_name.text()}"
        self.engine = create_engine(db_url, echo=True)
        Base.metadata.create_all(bind=self.engine)
        self.Session = sessionmaker(bind=self.engine)

        self.bacnet = BAC0.connect()
        self.bacnet.discover()
        self.start_button.setEnabled(False)
        self.stop_button.setEnabled(True)
        self.timer.start(4000)

    def stop_logging(self):
        if self.bacnet:
            self.bacnet.disconnect()

        self.start_button.setEnabled(True)
        self.stop_button.setEnabled(False)
        self.timer.stop()

    def log_data(self):
        session = self.Session()

        try:
            points = self.bacnet.device.points
            selected_point = self.bacnet_points.currentText()

            for point in points:
                if point.properties.name == selected_point:
                    data_point = BACnetData(point_name=point.properties.name, value=point.presentValue)
                    session.add(data_point)
                    session.commit()

        except Exception as e:
            print(f"Error logging data: {e}")

        finally:
            session.close()

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = BACnetLogger()
    window.show()
    sys.exit(app.exec_())
