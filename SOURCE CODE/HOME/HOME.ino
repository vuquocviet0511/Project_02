
#define USE_NODE_MCU_BOARD


#include <SPI.h>
#include <LoRa.h>
#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <ArduinoJson.h>



//SCK - GPIO 14
//MISO- GPIO 12
//MOSI- GPIO 13


// Thông tin mạng WiFi
const char* ssid = "BMQ";
const char* password = "@12345678";

// Thông tin Firebase
#define FIREBASE_HOST "doan2-2002-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "yHmrzj8YrfOCfybyBJbjMoGdf7l2fw6U6vLO7jR0"


#define ss 15    //D8 - GPIO 15
#define rst 16  //D0  - GPIO 16
#define dio0 4  // EMPTY
const int button = D1;
int messagenum = 0;
String counter;
String soilMoistureValue;
String soilmoisturepercent;
String temperature;
String humidity;
String lux;
String voltage;
String percentage;
String motor = "OFF";
String lamps = "OFF";

FirebaseData firebaseData;
String path = "/";
FirebaseJson json;
void setup() {
  Serial.begin(9600);

  Serial.println("LoRa init succeeded.");

  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());


  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  if (!Firebase.beginStream(firebaseData, path))
  {
    Serial.println("REASON: " + firebaseData.errorReason());
    Serial.println();
  }

  

  pinMode(button, INPUT_PULLUP);
  while (!Serial);

  Serial.println("LoRa Receiver");

  LoRa.setPins(ss, rst, dio0);

    if (!LoRa.begin(433E6)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
  LoRa.setSyncWord(0xF3);    
  LoRa.setSpreadingFactor(8);       // ranges from 0-0xFF, default 0x34, see API docs
  Serial.println("LoRa init succeeded.");
}

void loop() {

  // try to parse packet
  int pos1, pos2, pos3, pos4, pos5, pos6, pos7;
  int packetSize = LoRa.parsePacket();


if (digitalRead(button)==LOW) 
{
  Serial.println("Đã gửi tín hiệu button");
    String b1 = "b1";
     messagenum = messagenum +1;
     String message = "HelloWorld" ;   // send a message
  LoRa.beginPacket();                   
  LoRa.print(message);                 
  LoRa.endPacket(); 
    Serial.println("Sending " + message);
     Serial.println(messagenum);
     Serial.println("RSSI: " + String(LoRa.packetRssi()));
    motor = "ON";
  Serial.println();
    delay(200);
}
else {
  //motor = "OFF";
  if (packetSize)
  {
    Serial.print("DATASIZE: ");
    Serial.print(packetSize);
    Serial.println();
    // received a packet
    Serial.print("Received packet:  ");
    String LoRaData = LoRa.readString();
    Serial.print(LoRaData);
    // read packet
    while (LoRa.available()) {
      Serial.print((char)LoRa.read());
    }
    // print RSSI of packet
    Serial.print("' with RSSI ");
    Serial.println(LoRa.packetRssi());

    pos1 = LoRaData.indexOf('/');
    pos2 = LoRaData.indexOf('&');
    pos3 = LoRaData.indexOf('@');
    pos4 = LoRaData.indexOf('$');
    pos5 = LoRaData.indexOf('#');
    pos6 = LoRaData.indexOf('^');
    pos7 = LoRaData.indexOf(')');
    counter = LoRaData.substring(0, pos1);
    soilMoistureValue = LoRaData.substring(pos1 + 1, pos2);
    soilmoisturepercent = LoRaData.substring(pos2 + 1, pos3);
    temperature = LoRaData.substring(pos3 + 1, pos4);
    humidity = LoRaData.substring(pos4 + 1, pos5);
    lux = LoRaData.substring(pos5 + 1, pos6);
    voltage = LoRaData.substring(pos6 + 1, pos7);
    percentage = LoRaData.substring(pos7 + 1, LoRaData.length());




    Serial.print(F("Packet No = "));
    Serial.println(counter);

    Serial.print(F("Soil Moisture: "));
    Serial.print(soilmoisturepercent);
    Serial.println(F("%"));

    Serial.print(F("Temperature: "));
    Serial.print(temperature);
    Serial.println(F("°C"));

    Serial.print(F("Humidity = "));
    Serial.print(humidity);
    Serial.println(F("%"));

    Serial.print("Soil Moisture Value Analog: ");
    Serial.println(soilMoistureValue);

    Serial.print("Light Sensor value: ");
    Serial.print(lux);
    Serial.println(F(" lx"));

    Serial.print("Voltage PIN: ");
    Serial.print(voltage);
    Serial.println(F(" V"));
    
    Serial.print("Percentage PIN: ");
    Serial.print(percentage);
    Serial.println(F(" %"));
    Serial.println();
  


    if (soilmoisturepercent.toInt() >= 0 && soilmoisturepercent.toInt() <= 40)
    {
      motor = "ON";
      Serial.println("Plants needs water");
      Serial.println("Motor is ON");
      Serial.println();
      delay(200);

    }
    else if (soilmoisturepercent.toInt() > 40 && soilmoisturepercent.toInt() <= 100)
    {
      motor = "OFF";
      Serial.println("Soil Moisture level looks good...");
      Serial.println("Motor is OFF");
      Serial.println();
      delay(200);
    }
    if (lux.toInt() <= 50 )
        {
        lamps = "ON";
        Serial.println("Light is ON");
        delay(200);
        }
      else 
      {
        lamps = "OFF";
        Serial.println("Light is OFF");
        delay(200);
      }
  }

 }
  if (packetSize) {
        // Convert soilmoisturepercent, temperature, and humidity to integer values
        int soilMoisturePercentValue = soilmoisturepercent.toInt();
        int temperatureValue = temperature.toInt();
        int humidityValue = humidity.toInt();
        int luxValue = lux.toInt();

        // Update sensor data on Firebase
        json.clear();
        json.add("soil_moisture_percent", soilMoisturePercentValue);
        json.add("temperature", temperatureValue);
        json.add("humidity", humidityValue);
        json.add("lux", luxValue);

        // Update Soil Moisture, Temperature, Humidity, and Lux data on Firebase
        if (Firebase.updateNode(firebaseData, path + "Sensor/", json)) {
            Serial.println("Sensor data updated successfully!");
        } else {
            Serial.println("Sensor data update failed.");
        }

        // Update battery data on Firebase
        json.clear();
        json.add("voltage", voltage.toFloat());     // Convert voltage to float
        json.add("percentage", percentage.toInt()); // Convert percentage to integer

        // Update Battery data on Firebase
        if (Firebase.updateNode(firebaseData, path + "Battery/", json)) {
            Serial.println("Battery data updated successfully!");
        } else {
            Serial.println("Battery data update failed.");
        }

        // Update motor and lamps status on Firebase
        json.clear();
        json.add("motor_status", motor);
        json.add("lamps_status", lamps);

        // Update Device data on Firebase
        if (Firebase.updateNode(firebaseData, path + "Device/", json)) {
            Serial.println("Device status updated successfully!");
        } else {
            Serial.println("Device status update failed.");
        }
    }
     

}
void sendMessage(String outgoing) {
  LoRa.beginPacket();                   
  LoRa.print(outgoing);                 
  LoRa.endPacket();                    
}