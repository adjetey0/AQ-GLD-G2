/*
 * ESP32 Wi-Fi Sensor Client for AQ-GLD-G2
 * 
 * Instructions:
 * 1. Install "ArduinoJson" library (by Benoit Blanchon) via Arduino Library Manager.
 * 2. Update SSID, PASSWORD, and SERVER_IP below to match your setup.
 * 3. Make sure an account with the specified email and password exists in MongoDB.
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Wi-Fi Credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend API URL (Replace with your server's local IP or domain name)
const char* serverIp = "192.168.1.100"; 
const int serverPort = 3000;

// Device Login Credentials
const char* deviceEmail = "esp32@device.com";
const char* devicePassword = "ESP32_Secure_Password_123!";


// Pin Definitions for MQ Sensors (Analog Inputs)
const int PIN_MQ2 = 34; // Analog pin for MQ2 (Smoke / LPG)
const int PIN_MQ5 = 35; // Analog pin for MQ5 (Natural Gas)
const int PIN_MQ7 = 32; // Analog pin for MQ7 (Carbon Monoxide)

// Global Token Storage
String jwtToken = "";
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 5000; // Send telemetry every 5 seconds

// Function Prototypes
bool loginToBackend();
void sendSensorData();

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Initialize analog pins
  pinMode(PIN_MQ2, INPUT);
  pinMode(PIN_MQ5, INPUT);
  pinMode(PIN_MQ7, INPUT);

  // Connect to Wi-Fi
  Serial.println("\nConnecting to Wi-Fi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi Connected!");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());

  // Perform initial authentication login
  while (!loginToBackend()) {
    Serial.println("Login failed. Retrying in 5 seconds...");
    delay(5000);
  }
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    if (millis() - lastSendTime >= sendInterval) {
      lastSendTime = millis();
      sendSensorData();
    }
  } else {
    Serial.println("Wi-Fi disconnected! Attempting reconnect...");
    WiFi.reconnect();
    delay(2000);
  }
}

/**
 * Authenticates ESP32 with the backend /auth/login endpoint
 */
bool loginToBackend() {
  HTTPClient http;
  String loginUrl = "http://" + String(serverIp) + ":" + String(serverPort) + "/auth/login";

  Serial.println("Logging into backend: " + loginUrl);
  http.begin(loginUrl);
  http.addHeader("Content-Type", "application/json");

  // Create JSON login payload
  StaticJsonDocument<200> doc;
  doc["email"] = deviceEmail;
  doc["password"] = devicePassword;
  String jsonBody;
  serializeJson(doc, jsonBody);

  int httpCode = http.POST(jsonBody);

  if (httpCode == HTTP_CODE_OK) {
    String response = http.getString();
    StaticJsonDocument<512> resDoc;
    DeserializationError error = deserializeJson(resDoc, response);

    if (!error) {
      const char* token = resDoc["token"];
      jwtToken = String(token);
      Serial.println("Login Successful! JWT Token acquired.");
      http.end();
      return true;
    } else {
      Serial.println("Failed to parse JSON response");
    }
  } else {
    Serial.printf("Login HTTP POST failed, error code: %d\n", httpCode);
    String response = http.getString();
    Serial.println("Response: " + response);
  }

  http.end();
  return false;
}

/**
 * Reads sensor pins and posts data to /sensor endpoint with Bearer Auth Token
 */
void sendSensorData() {
  if (jwtToken.length() == 0) {
    Serial.println("No token available. Logging in first...");
    if (!loginToBackend()) return;
  }

  // Read analog values from MQ sensors
  int mq2Val = analogRead(PIN_MQ2);
  int mq5Val = analogRead(PIN_MQ5);
  int mq7Val = analogRead(PIN_MQ7);

  HTTPClient http;
  String sensorUrl = "http://" + String(serverIp) + ":" + String(serverPort) + "/sensor";

  http.begin(sensorUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + jwtToken); // Attach JWT token

  // Construct sensor JSON payload
  StaticJsonDocument<200> doc;
  doc["mq2"] = mq2Val;
  doc["mq5"] = mq5Val;
  doc["mq7"] = mq7Val;
  doc["deviceId"] = "ESP32_AQ_GLD_G2";

  String jsonBody;
  serializeJson(doc, jsonBody);

  int httpCode = http.POST(jsonBody);

  if (httpCode == HTTP_CODE_OK || httpCode == 201) {
    Serial.printf("Sensor Data Sent Successfully! HTTP %d | MQ2: %d, MQ5: %d, MQ7: %d\n", httpCode, mq2Val, mq5Val, mq7Val);
  } else if (httpCode == 401 || httpCode == 400) {
    Serial.println("Token expired or invalid (HTTP 401). Re-authenticating...");
    loginToBackend();
  } else {
    Serial.printf("Error sending sensor data. HTTP Code: %d\n", httpCode);
  }

  http.end();
}
