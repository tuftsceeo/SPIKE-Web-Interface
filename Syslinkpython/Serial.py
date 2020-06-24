import serial # for serial communication
import time   # for calculating timeouts
import ast    # for converting return values to proper types

import sys, glob # for RPI/Linux to get connected tty devices

class SPIKEPrimeSerial:
    
    # SPIKESerial for doing Serial Communication with the SPIKE Prime
    # - version 1.1 (fixed OpenSerial specification as well as default port)
    #

    ## Written by Ethan Danahy, Tufts University, September 2019
    ## Based on code writen by Chris Rogers, 2019
    #
    # EXAMPLE USE (raw serial):
    #
    # import SPIKEPrimeSerial as SPIKE
    # mySPIKE = SPIKE() # Initialize
    # mySPIKE.OpenSerial() # open a Serial Connection to your SPIKE Prime
    # mySPIKE.SendIt('hub.display.show(hub.Image.HAPPY)') # display HAPPY
    # mySPIKE.SendIt('hub.port.D.device.get()') # get value of sensor on Port D
    # mySPIKE.SendIt('hub.port.A.motor.run_at_speed(100)') # turn on Motor A
    # mySPIKE.SendIt('hub.port.A.motor.brake()') # break Motor A
    # mySPIKE.CloseSerial() # close Serial when done
    #
    # EXAMPLE USE (higher-level):
    #
    # import SPIKEPrimeSerial as SPIKE
    # mySPIKE = SPIKE() # initialize
    # mySPIKE.OpenSerial()
    # mySPIKE.SendCommand('hub.display.show(hub.Image.HAPPY)')
    # val = mySPIKE.GetValue('hub.port.D.device.get()')
    # mySPIKE.CloseSerial()
    
    # note: to open a different device (other than default):
    # mySPIKE = SPIKE()
    # mySPIKE.OpenSerial(port = "/dev/ttyACM1") # specify port
    # or can open multiple devices at the same time (multiple SPIKE Prime bricks):
    # mySPIKE1 = SPIKE()
    # mySPIKE2 = SPIKE()
    # mySPIKE1.OpenSerial(port = "/dev/ttyACM0") # SPIKE Prime on first port
    # mySPIKE2.OpenSerial(port = "/dev/ttyACM1") # SPIKE Prime on second port
    
    ## TO DO/BUGS:
    # - designed for displaying REPL information; need to update to also get
    #   values back (without the REPL data)
    # - if sending a bunch of code that is executed in real time, it times out
    #   without getting the result back
    # - needs a "try/except" block around the serial connection (in case fails)
    
    def __init__(self):
        # status info
        self.connected = False
        self.terminal = ""
        # serial variable
        self.ser = None # this is the serial connection that is opened
        # constants
        self.waitforit_timeout = 0.5 # within WaitForIt function
        self.prompt = ">>>" # matches REPL prompt
        pass

    # this initializes the serial connection
    # - used internally by the connect OpenSerial() function
    # "port" is the device to which you are connecting
    # "bps" is the speed at which the serial connection will be opened
    # "to" is the timeout parameter
    def InitSerial(self, port = "default", bps = 115200, to = 0):
        if port == "default":
            devices = self.ListDevices()
            if len(devices) > 0:
                port = devices[0] # get first device
            else:
                self.connected = False
                return 'NOT CONNECTED (no devices found)', 1 # error = 1
            pass
        try:
            self.ser = serial.Serial(port=port, baudrate=bps, timeout=to) # open serial port
        except:
            self.connected = False
            return 'ERROR CONNECTING (error in serial, port = ' + str(port) + ')', 1 # error = 1
        return self.ser.name, 0 # error = 0 (no error)
    
    # list out potential connected devices
    def ListDevices(self):
        result = []
        # LINUX: devices that start with "ttyACM" plus a number
        ports1 = glob.glob('/dev/ttyACM[0-9]*')
        for port in ports1:
            result.append(port)
        # WINDOWS: devices that start with "COM" plus a number
        ports2 = glob.glob('/dev/COM[0-9]*') 
        for port in ports2:
            result.append(port)
        # MACOS: devices that start with "cu.usbmodem" followed by stuff
        ports3 = glob.glob('/dev/cu.usbmodem*')
        for port in ports3:
            result.append(port)
        ports4 = glob.glob('/dev/*.LEGO*')
        for port in ports4:
            result.append(port)
        return result
    
    # open serial connection
    # silent means no debugging/status info (via Python print)
    # screen_status means if should show connection on SPIKE Prime LED screen
    def OpenSerial(self, port="default", bps = 115200, to = 0, silent=True, screen_status=True):
        name, error = self.InitSerial(port, bps, to)
        if not error:
            # error from InitSerial is 0 (so it worked)
            self.connected = True # internal flag
            if not silent:
                print('Serial Initialized:',name)
            self.WriteSerial('\x03\n') # send a control-C
            reply = self.WaitForIt()
            self.SendIt('import spike')
            reply = self.WaitForIt()
            self.SendIt('hub = spike.PrimeHub()')
            reply = self.WaitForIt()
            if screen_status:
                self.SendIt('hub.light_matrix.show_image(\'HAPPY\')')
            pass
        else:
            # error = 1
            self.connected = False
            if not silent:
                print('Serial Connection Error:',name)
                pass
            pass
        return name

    # close the serial connection
    def CloseSerial(self, silent=True, screen_status=True):
        if screen_status:
            # note: displaying screen status BEFORE closing connection
            self.SendIt('hub.speaker.beep(60, 0.5)')
        self.ser.close()
        self.connected = False # internal flag
        if not silent:
            print('Serial Closed')
        return 'done'

    # write out command (text) via serial port (Low Level)
    def WriteSerial(self, text):
        return self.ser.write(text.encode()) # write a string to serial

    # read reply (string) via serial port (Low Level)
    def ReadSerial(self):
        reply = ''
        if self.ser.in_waiting:
            reply = self.ser.read(self.ser.in_waiting).decode()
        return reply

    # waiting function for after sending, waiting for reply back from device
    def WaitForIt(self):
        doneReading = False # internal function flag
        text = ''
        starttime = time.time() # for timeout
        while not doneReading:
            text = text + self.ReadSerial()
            doneReading = self.prompt in text # test for presence of prompt
            if (time.time() > starttime + self.waitforit_timeout):
                break
            pass
        print(text)
        return text

    # send command (text) via serial port (combo of Write and Read) (Low Level)
    def SendIt(self, text):
        self.WriteSerial(text + '\r\n') # add new line to the end of the command
        reply = self.WaitForIt() # after writing, wait for response
        return reply
    
    def SendCommand(self, command_string, return_val = False):
        reply = self.SendIt(command_string)
        if return_val:
            return reply # want to see the reply
        return # else just return
    
    def GetValue(self, command_string):
        # getting value is same as sending command, but care what comes back
        reply = self.SendCommand(command_string, return_val = True)
        # the reply will contain BOTH the original command (before)
        # and the prompt (after), so we find location of those (reply.find)
        # and take the substring inbetween (the content)
        reply = reply[int(reply.find(command_string)) + int(len(command_string)): reply.find(self.prompt)]
        reply = reply.strip() # eliminate whitespace
        if len(reply) > 0:
            if reply == '[None]':
                return None
            try:
                reply_val = ast.literal_eval(reply) # convert to appropriate type!
                return reply_val
            except:
                return str(reply)
            pass
        return ''
    
