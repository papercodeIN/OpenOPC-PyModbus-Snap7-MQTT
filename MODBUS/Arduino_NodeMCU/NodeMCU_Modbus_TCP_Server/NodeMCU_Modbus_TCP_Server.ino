#ifdef ESP8266
  #include <ESP8266WiFi.h>     /* WiFi library for ESP8266 */
#else
  #include <WiFi.h>            /* WiFi library for ESP32 */
#endif
#include <ModbusIP_ESP8266.h>  /* modbus protocol library */
#include "DHT.h"             /* DHT11 sensor library */


/******************************** preprocessor directives *******************************/
DHT dht(2,DHT11);    /* D4 of NodeMCU is GPIO14 */

/* the modbus offset register for temperature and humidity of the DHT11 sensor */
const int DHT_HREG = 100;

uint16_t temperature = 0;   /* the temperature value read from DHT sensor */
uint16_t humidity = 0;      /* the humidity value read from DHT sensor */

long myTime;                /* this variable is used for millis function */

/************************************* class objects ************************************/

ModbusIP modbus;

/********************************** initialization code *********************************/
void setup() {
  Serial.begin(115200);

  WiFi.begin("SSID", "PASSWORD");
  while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  
  modbus.server();
  modbus.addHreg(DHT_HREG, temperature);
  modbus.addHreg(DHT_HREG+1, humidity);

  myTime = millis();    /* set my time now */
}
 
/*********************************** application code ***********************************/
void loop() {

  modbus.task();      /* Call once inside loop() - all magic here */

  if (millis() > myTime + 2000)   /* loop for each 1 second */
  {
    myTime = millis();    /* update the new time */

    /* Read the sensor data - temperature and humidity */
    temperature = dht.readTemperature();
    humidity = dht.readHumidity();
    
    if (temperature != 65535 && humidity != 65535) /* @todo: this is a bug in the code */
    {
      /* print the temperature and humidity values on the serial window */
      Serial.print("Temperature is: ");
      Serial.print(temperature);
      Serial.println(" degrees C");
      Serial.print("Humidity is: ");
      Serial.println(humidity);
      Serial.println();
      
      /* save the values in the modbus registers */
      modbus.Hreg(DHT_HREG, temperature);
      modbus.Hreg(DHT_HREG+1, humidity);
    }
  }
}