use std::ffi::CString;
use std::os::raw::c_char;

extern {
    fn graphics_fill(r: u16, g: u16, b: u16);
    fn graphics_draw_pixels(x: u16, y: u16, w: u16, h: u16, pixels: *const u8);
}

static NAME: &'static str = env!("CARGO_PKG_NAME");
static VERSION: &'static str = env!("CARGO_PKG_VERSION");

#[no_mangle]
pub extern fn get_name() -> *mut c_char {
    let s = CString::new(NAME).unwrap();
    s.into_raw()
}

#[no_mangle]
pub extern fn get_name_len() -> usize {
    NAME.len()
}

#[no_mangle]
pub extern fn get_version() -> *mut c_char {
    let s = CString::new(VERSION).unwrap();
    s.into_raw()
}

#[no_mangle]
pub extern fn get_version_len() -> usize {
    VERSION.len()
}

#[no_mangle]
pub unsafe extern fn init() {

}

static IMAGE: [u8; 300] = [
    255u8, 255u8, 255u8, 100u8,
    255u8, 255u8, 255u8, 100u8,
    255u8, 255u8, 255u8, 100u8,
    255u8,   0u8,   0u8, 100u8,
    255u8,   0u8,   0u8, 100u8,
    255u8,   0u8,   0u8, 100u8,
    0u8, 255u8,   0u8, 100u8,
    0u8, 255u8,   0u8, 100u8,
    0u8, 255u8,   0u8, 100u8,
    0u8,   0u8, 255u8, 100u8,
    0u8,   0u8, 255u8, 100u8,
    0u8,   0u8, 255u8, 100u8,
    255u8, 255u8,   0u8, 100u8,
    255u8, 255u8,   0u8, 100u8,
    255u8, 255u8,   0u8, 100u8,
    255u8, 255u8, 255u8, 100u8,
    255u8, 255u8, 255u8, 100u8,
    255u8, 255u8, 255u8, 100u8,
    255u8,   0u8,   0u8, 100u8,
    255u8,   0u8,   0u8, 100u8,
    255u8,   0u8,   0u8, 100u8,
    0u8, 255u8,   0u8, 100u8,
    0u8, 255u8,   0u8, 100u8,
    0u8, 255u8,   0u8, 100u8,
    0u8,   0u8, 255u8, 100u8,
    0u8,   0u8, 255u8, 100u8,
    0u8,   0u8, 255u8, 100u8,
    255u8, 255u8,   0u8, 100u8,
    255u8, 255u8,   0u8, 100u8,
    255u8, 255u8,   0u8, 100u8,
    255u8, 255u8, 255u8, 100u8,
    255u8, 255u8, 255u8, 100u8,
    255u8, 255u8, 255u8, 100u8,
    255u8,   0u8,   0u8, 100u8,
    255u8,   0u8,   0u8, 100u8,
    255u8,   0u8,   0u8, 100u8,
    0u8, 255u8,   0u8, 100u8,
    0u8, 255u8,   0u8, 100u8,
    0u8, 255u8,   0u8, 100u8,
    0u8,   0u8, 255u8, 100u8,
    0u8,   0u8, 255u8, 100u8,
    0u8,   0u8, 255u8, 100u8,
    255u8, 255u8,   0u8, 100u8,
    255u8, 255u8,   0u8, 100u8,
    255u8, 255u8,   0u8, 100u8,
    255u8, 255u8, 255u8, 100u8,
    255u8, 255u8, 255u8, 100u8,
    255u8, 255u8, 255u8, 100u8,
    255u8,   0u8,   0u8, 100u8,
    255u8,   0u8,   0u8, 100u8,
    255u8,   0u8,   0u8, 100u8,
    0u8, 255u8,   0u8, 100u8,
    0u8, 255u8,   0u8, 100u8,
    0u8, 255u8,   0u8, 100u8,
    0u8,   0u8, 255u8, 100u8,
    0u8,   0u8, 255u8, 100u8,
    0u8,   0u8, 255u8, 100u8,
    255u8, 255u8,   0u8, 100u8,
    255u8, 255u8,   0u8, 100u8,
    255u8, 255u8,   0u8, 100u8,
    255u8, 255u8, 255u8, 100u8,
    255u8, 255u8, 255u8, 100u8,
    255u8, 255u8, 255u8, 100u8,
    255u8,   0u8,   0u8, 100u8,
    255u8,   0u8,   0u8, 100u8,
    255u8,   0u8,   0u8, 100u8,
    0u8, 255u8,   0u8, 100u8,
    0u8, 255u8,   0u8, 100u8,
    0u8, 255u8,   0u8, 100u8,
    0u8,   0u8, 255u8, 100u8,
    0u8,   0u8, 255u8, 100u8,
    0u8,   0u8, 255u8, 100u8,
    255u8, 255u8,   0u8, 100u8,
    255u8, 255u8,   0u8, 100u8,
    255u8, 255u8,   0u8, 100u8,
];

#[allow(non_upper_case_globals)]
static mut count: u32 = 0;

#[no_mangle]
pub unsafe extern fn update(step: u32) {
    count += step;
    let x: u16 = ((((count as f32 / 500.0).sin() * 100.0) as i16) + 160) as u16;
    graphics_fill(0, 0, 0);
    graphics_draw_pixels(x, 120, 15, 5, &IMAGE as *const u8);
}
