#Simple LED Blinking Program

from machine import Pin
from time import sleep
myLED = Pin('LED',Pin.OUT)
while 1:
    myLED.on()
    sleep(1)
    myLED.off()
    sleep(1)
