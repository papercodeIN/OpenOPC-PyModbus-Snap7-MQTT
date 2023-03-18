#include <ESP8266WiFi.h>
#include <ModbusIP_ESP8266.h>
#include <DHT.h>

#define DHTPIN 2 // D4 of NodeMCU is GPIO2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
ModbusIP mb;

// Modbus register addresses for temperature and humidity
const int TEMPERATURE_REGISTER_ADDRESS = 0;
const int HUMIDITY_REGISTER_ADDRESS = 1;

void setup() {
  Serial.begin(115200);
  WiFi.begin("SSID", "PASSWORD");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  mb.server();
  mb.addHreg(TEMPERATURE_REGISTER_ADDRESS, 0);
  mb.addHreg(HUMIDITY_REGISTER_ADDRESS, 0);

  dht.begin();
}

void loop() {
  mb.task();

  uint16_t temperature = dht.readTemperature();
  uint16_t humidity = dht.readHumidity();

  if (!isnan(temperature) && !isnan(humidity)) {
    mb.Hreg(TEMPERATURE_REGISTER_ADDRESS, temperature);
    mb.Hreg(HUMIDITY_REGISTER_ADDRESS, humidity);

    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" *C");
    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");
  }

  delay(1000);
}
