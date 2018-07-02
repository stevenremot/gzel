use std::ffi::CString;
use std::os::raw::c_char;

extern { fn graphics_fill(r: u32, g: u32, b: u32); }

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
pub unsafe extern fn init() {

}

#[allow(non_upper_case_globals)]
static mut count: u32 = 0;

#[no_mangle]
pub unsafe extern fn update(step: u32) {
    count += step;
    let time: f32 = (count as f32) / 1000.0;
    let red: u32 = (((time.sin() + 1.0) / 2.0) * 255.0) as u32;
    graphics_fill(red, 0, 0);
}
