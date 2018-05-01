extern { fn graphics_fill(r: u32, g: u32, b: u32); }

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
