
#include <SPI.h>
#include <LoRa.h>
#include <DHT.h>
#include <BH1750.h>
 #include <Wire.h>
#define DHTPIN 5        // dht22  
DHT dht(DHTPIN, DHT22);
#define relay1 7         // máy bơm
#define relay2 8 
#define ss 10
#define rst 9
#define dio0 2



BH1750 lightMeter; 
String LoRaMessage = "";
String message;
int counter = 0;
const int led = 3;
const int AirValue = 550;  // 530 -> 290
const int WaterValue = 285;  
const int SensorPin = A0; // cảm biến đo độ ẩm đất
int soilMoistureValue = 0;
int soilmoisturepercent = 0;
int voltPin = A7;
int test = 1;
float correctionfactor = .5;
float voltage = 0;
float vout = 0;
float R1=27000.0;
float R2=7160.0;


void setup() 
{
    Serial.begin(9600);
    dht.begin();
    Wire.begin();
    lightMeter.begin(); 
    pinMode(relay1, OUTPUT);
   // digitalWrite(Relay1, HIGH);
    pinMode(relay2, OUTPUT);
    //digitalWrite(Relay2, HIGH);
    pinMode(led, OUTPUT);
    while (!Serial);
    Serial.println("LoRa Sender");
    LoRa.setPins(ss, rst, dio0);
    if (!LoRa.begin(433E6)) 
   {
    Serial.println("Starting LoRa failed!");
    delay(100);
    while (1);
  }
  LoRa.setSyncWord(0xF3);     
   LoRa.setSpreadingFactor(8);        // ranges from 0-0xFF, default 0x34, see API docs
  Serial.println("LoRa init succeeded.");
}
 
  void loop() 
{
  int pos1;
  
  soilMoistureValue = analogRead(SensorPin);  
  soilmoisturepercent = map(soilMoistureValue, AirValue, WaterValue, 0, 100);
  float lux = lightMeter.readLightLevel();
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  //pin
  int volt = analogRead(voltPin);
  float vout = (volt * 5.0 ) / 1024.0 ;
  float voltage = vout / ( R2/(R1 + R2)) ;
  float voltage1 = voltage + correctionfactor;
  int percentage = 0;

  if (voltage1 < 6) {
    percentage = 0;
  } else {
    percentage = ((voltage1 - 6) / (8.4 - 6)) * 100;
  } 
  int packetSize = LoRa.parsePacket();
if (packetSize)
{      
  //if(packetSize==0) return;
  
  digitalWrite(led,HIGH);
  digitalWrite(relay1, HIGH);
  delay(5000);
  if(soilmoisturepercent > 40 && soilmoisturepercent <= 100)
  {
    digitalWrite(led,LOW);
    digitalWrite(relay1, LOW);
  }
  

  /*String incoming= LoRa.readString();
  Serial.print(incoming);
        while (LoRa.available()) {
          Serial.print((char)LoRa.read());
        }
  //Serial.println("Message: " + incoming);
  Serial.println("RSSI: " + String(LoRa.packetRssi()));
  //Serial.print("DATASIZE: ");
  //Serial.print (packetSize);
   pos1 = incoming.indexOf('=');
   message = incoming.substring(0, pos1);
   Serial.print(F("Message = "));
    Serial.println( message);
  Serial.println();*/
  delay(50);
}

  else //if ( packetSize == 0)
  {
    if (isnan(h) || isnan(t)) 
    {
    Serial.println("Failed to read from DHT sensor!");
    return;
    }
    Serial.print("Soil Moisture Value Analog: ");
    Serial.println(soilMoistureValue);
    
    Serial.print("Soil Moisture: ");
    Serial.print(soilmoisturepercent);
    Serial.println("%");
    
    Serial.print("Temperature: ");
    Serial.print(t);
    Serial.println("°C");
    
    Serial.print("Humidity: ");
    Serial.print(h);
    Serial.println("%");
    
    
    Serial.print("Light Sensor: ");
    Serial.print(lux);
    Serial.println(" lx");
   
    Serial.print("Voltage: ");
    Serial.print(voltage1);
    Serial.println(" V");

    Serial.print("Percentage PIN: ");
    Serial.print(percentage);
    Serial.println(" %");

    Serial.print("Sending packet: ");
    Serial.println(counter);
    Serial.println();

    
      if (soilmoisturepercent >= 0 && soilmoisturepercent <= 40)
    {
      Serial.println("Plants need water...");
      digitalWrite(relay1, HIGH);
      Serial.println("Motor is ON");
      delay(200);
      //WidgetLED PumpLed(V5);
      //PumpLed.on();
      }
    else if (soilmoisturepercent > 40 && soilmoisturepercent <= 100)
    {
      Serial.println("Soil Moisture level looks good...");
      digitalWrite(relay1, LOW);
       digitalWrite(led,LOW);
      Serial.println("Motor is OFF");
      delay(200);
      //WidgetLED PumpLed(V5);
      //PumpLed.off();
    }
        if (lux < 50.0)
        {
     
        digitalWrite(relay2, HIGH);
        Serial.println("Light is ON");
        delay(200);
        //WidgetLED PumpLed(V5);
        //PumpLed.on();
        }
      else //if (lux >= 50)
      {
        digitalWrite(relay2, LOW);
        Serial.println("Light is OFF");
        delay(200);
        //WidgetLED PumpLed(V5);
        //PumpLed.off();
      }
    //onReceive(LoRa.parsePacket());
      LoRaMessage = String(counter) +"   /" + String(soilMoistureValue) + " &" + String(soilmoisturepercent)+ " @" + String(t) + " $" + String(h) + " #" +String(lux) + " ^"+String(voltage1) + " )" + String(percentage)  ;
        
        // send packet
        LoRa.beginPacket();
        LoRa.print(LoRaMessage);
        LoRa.endPacket();
    
       counter++;
        //Serial.print("with RSSI ");
         // Serial.println(LoRa.packetRssi());
            //Serial.println(val);  
          //delay(1000);*/
        delay(200);
  }
      //delay(200);
}

/*void onReceive(int packetSize) {
  if (packetSize == 0) return;          // if there's no packet, return

  // read packet header bytes:
  String incoming = "";
 
  while (LoRa.available()) {
    incoming += (char)LoRa.read();
  }
 
  Serial.println("Message: " + incoming);
  Serial.println("RSSI: " + String(LoRa.packetRssi()));
  Serial.println();
  delay(200);
}*/