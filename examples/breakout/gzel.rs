extern {
    pub fn graphics_fill(r: u8, g: u8, b: u8);
    pub fn graphics_draw_pixels(x: u16, y: u16, w: u16, h: u16, pixels: *const u8);
}

pub const SCREEN_WIDTH: u16 = 320;
pub const SCREEN_HEIGHT: u16 = 240;
