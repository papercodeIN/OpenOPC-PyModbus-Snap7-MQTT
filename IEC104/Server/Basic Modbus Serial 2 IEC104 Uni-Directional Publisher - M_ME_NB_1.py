from pymodbus.client import ModbusSerialClient
import c104
import time

# Configure Modbus RTU Client
client = ModbusSerialClient(
    method='rtu',
    port='COM2',
    baudrate=9600,
    bytesize=8,
    parity='N',
    stopbits=1,
    timeout=1
)

# IEC 104 Server setup
server = c104.Server(ip="0.0.0.0", port=2404)

# Add a local station
station = server.add_station(common_address=47)

# Create 10 points for the 10 Modbus registers
points = []
for i in range(10):
    point = station.add_point(io_address=i+1, type=c104.Type.M_ME_NB_1, report_ms=1000)  # Using M_ME_NB_1 (scaled value)
    points.append(point)

server.start()

def read_modbus_data():
    """
    Function to read data from Modbus RTU.
    """
    response = client.read_holding_registers(address=0, count=10, slave=1)
    if response.isError():
        print(f"Error reading Modbus data: {response}")
        return None
    print(f"Modbus data read: {response.registers}")  # Debug print to check Modbus data
    return response.registers

def int16_to_scaled(value):
    """
    Convert int16 Modbus value to a scaled integer for IEC 104.
    """
    if value > 32767:
        value -= 65536  # Convert unsigned int16 to signed int16 if needed
    return value  # Direct mapping as a scaled integer

def update_iec104_data(data):
    """
    Function to update IEC 104 data point values.
    """
    for index, value in enumerate(data):
        if index < len(points):
            # Convert int16 to scaled integer for IEC 104
            scaled_value = int16_to_scaled(value)
            print(f"Updating IEC 104 point {index + 1} with value: {scaled_value}")  # Debug print to check updates
            
            # Update the point value using the correct method
            # Assuming that the correct method is directly setting the value
            points[index].value = scaled_value  # This might need adjustment based on library
            print(f"Point {index + 1} updated successfully.")

def main():
    print("Modbus RTU to IEC 104 Converter started. Waiting for connections...")

    # Connect Modbus RTU client
    if not client.connect():
        print("Failed to connect to Modbus client.")
        return

    try:
        while True:
            # Read first 10 holding registers from Modbus
            modbus_data = read_modbus_data()
            if modbus_data:
                # Update IEC 104 data points with the new Modbus data
                update_iec104_data(modbus_data)

            # Add a delay to control polling frequency
            time.sleep(1)
    except KeyboardInterrupt:
        print("Shutting down...")
    finally:
        # Clean up connections
        client.close()
        server.stop()

if __name__ == "__main__":
    main()
