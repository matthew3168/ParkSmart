import paho.mqtt.client as mqtt
import json
import time
from datetime import datetime
from typing import Dict, List

# ThingSpeak MQTT Configuration
THINGSPEAK_MQTT_HOST = "mqtt3.thingspeak.com"
THINGSPEAK_MQTT_PORT = 1883
THINGSPEAK_CLIENT_ID = "OygzNTM8JSoZPAEYOzIhCT0" 
MQTT_USERNAME = "OygzNTM8JSoZPAEYOzIhCT0" 
MQTT_PASSWORD = "H5dUdOHwKg8p8Ra5nh/gIfXx"  

# Configure channels to monitor
CHANNELS = [
    {"id": "2718325", "name": "Channel 1"},
    {"id": "2716987", "name": "Channel 2"},
    {"id": "2718316", "name": "Channel 3"}
]

class ThingSpeakSubscriber:
    def __init__(self):
        # Create MQTT client instance
        self.client = mqtt.Client(client_id=THINGSPEAK_CLIENT_ID, 
                                clean_session=True, 
                                protocol=mqtt.MQTTv311)
        
        # Set up authentication
        self.client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
        
        # Set up callbacks
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        
        self.connected = False
    
    def on_connect(self, client, userdata, flags, rc):
        """Callback when client connects to the server"""
        if rc == 0:
            print("Successfully connected to ThingSpeak MQTT Broker")
            self.connected = True
            
            # Subscribe to all configured channels
            for channel in CHANNELS:
                topic = f"channels/{channel['id']}/subscribe"
                self.client.subscribe(topic)
                print(f"Subscribed to {channel['name']} (ID: {channel['id']})")
        else:
            print(f"Failed to connect, return code: {rc}")
            connection_codes = {
                1: "Invalid protocol version",
                2: "Invalid client identifier",
                3: "Server unavailable",
                4: "Bad username or password",
                5: "Not authorized"
            }
            if rc in connection_codes:
                print(f"Error: {connection_codes[rc]}")
    
    def on_message(self, client, userdata, message):
        """Callback when a message is received"""
        try:
            # Decode the message payload
            payload = message.payload.decode("utf-8")
            data = json.loads(payload)
            
            # Get channel name from channel ID
            channel_id = message.topic.split('/')[1]
            channel_name = next((ch['name'] for ch in CHANNELS if ch['id'] == channel_id), f"Channel {channel_id}")
            
            # Print formatted message
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"\n[{timestamp}] New data received from {channel_name}:")
            print(f"Channel ID: {channel_id}")
            
            # Print field values if they exist
            for i in range(1, 9):
                field_key = f"field{i}"
                if field_key in data:
                    print(f"Field {i}: {data[field_key]}")
            
            print("-" * 50)
            
        except json.JSONDecodeError:
            print("Error: Could not decode JSON message")
            print(f"Raw payload: {message.payload.decode('utf-8')}")
        except Exception as e:
            print(f"Error processing message: {str(e)}")
    
    def on_disconnect(self, client, userdata, rc):
        """Callback when client disconnects from the server"""
        self.connected = False
        if rc != 0:
            print("Unexpected disconnection. Attempting to reconnect...")
        else:
            print("Successfully disconnected from broker")
    
    def connect(self):
        """Connect to the MQTT broker"""
        try:
            self.client.connect(THINGSPEAK_MQTT_HOST, THINGSPEAK_MQTT_PORT, 60)
            return True
        except Exception as e:
            print(f"Error connecting to broker: {str(e)}")
            return False
    
    def start(self):
        """Start the MQTT client loop"""
        if self.connect():
            try:
                print("Starting MQTT client loop...")
                self.client.loop_start()
                
                # Keep the script running
                while True:
                    if not self.connected:
                        print("Not connected. Attempting to reconnect...")
                        time.sleep(5)
                        if self.connect():
                            continue
                    time.sleep(1)
                    
            except KeyboardInterrupt:
                print("\nStopping MQTT client...")
                self.client.loop_stop()
                self.client.disconnect()
                print("MQTT client stopped")
            except Exception as e:
                print(f"Error in main loop: {str(e)}")
                self.client.loop_stop()
                self.client.disconnect()

def print_startup_banner():
    """Print a startup banner with channel information"""
    print("\n" + "="*50)
    print("ThingSpeak Public MQTT Subscriber")
    print("="*50)
    print("Configured Channels:")
    for channel in CHANNELS:
        print(f"- {channel['name']} (ID: {channel['id']})")
    print("="*50 + "\n")

if __name__ == "__main__":
    print_startup_banner()
    subscriber = ThingSpeakSubscriber()
    subscriber.start()