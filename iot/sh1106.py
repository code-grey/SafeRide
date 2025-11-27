# MicroPython SH1106 OLED driver
# Works with 1.3" 128x64 OLEDs
from micropython import const
import framebuf

# Register definitions
SET_CONTRAST        = const(0x81)
SET_NORM_INV        = const(0xA6)
SET_DISP            = const(0xAE)
SET_SCAN_DIR        = const(0xC0)
SET_SEG_REMAP       = const(0xA0)
LOW_COL_ADDR        = const(0x00)
HIGH_COL_ADDR       = const(0x10)
SET_PAGE_ADDR       = const(0xB0)

class SH1106(framebuf.FrameBuffer):
    def __init__(self, width, height, external_vcc):
        self.width = width
        self.height = height
        self.external_vcc = external_vcc
        self.pages = self.height // 8
        self.buffer = bytearray(self.pages * self.width)
        super().__init__(self.buffer, self.width, self.height, framebuf.MONO_VLSB)
        self.init_display()

    def init_display(self):
        for cmd in (
            SET_DISP | 0x00, # off
            0x8D, 0x14,      # Charge pump
            SET_SEG_REMAP | 0x01, 
            SET_SCAN_DIR | 0x08,
            SET_CONTRAST, 0xFF,
            SET_DISP | 0x01
        ):
            self.write_cmd(cmd)
        self.fill(0)
        self.show()

    def poweroff(self):
        self.write_cmd(SET_DISP | 0x00)

    def poweron(self):
        self.write_cmd(SET_DISP | 0x01)

    def contrast(self, contrast):
        self.write_cmd(SET_CONTRAST)
        self.write_cmd(contrast)

    def invert(self, invert):
        self.write_cmd(SET_NORM_INV | (invert & 1))

    def show(self):
        for page in range(self.pages):
            self.write_cmd(SET_PAGE_ADDR | page)
            self.write_cmd(LOW_COL_ADDR | 0x02) # Offset 2 for 1.3" OLEDs
            self.write_cmd(HIGH_COL_ADDR | 0x00)
            self.write_data(self.buffer[self.width * page:self.width * page + self.width])

class SH1106_I2C(SH1106):
    def __init__(self, width, height, i2c, addr=0x3c, external_vcc=False):
        self.i2c = i2c
        self.addr = addr
        self.temp = bytearray(2)
        super().__init__(width, height, external_vcc)

    def write_cmd(self, cmd):
        self.temp[0] = 0x80 # Co=1, D/C#=0
        self.temp[1] = cmd
        self.i2c.writeto(self.addr, self.temp)

    def write_data(self, buf):
        self.i2c.writeto(self.addr, b'\x40' + buf)
