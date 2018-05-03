pub struct Color {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

pub unsafe fn draw_rectangle(x: u16, y: u16, w: u16, h: u16, color: Color) {
    let image_data: Vec<u8> = vec![color.r, color.g, color.b, 255u8]
        .into_iter()
        .cycle()
        .take((w * h * 4) as usize)
        .collect();

    ::gzel::graphics_draw_pixels(x, y, w, h, image_data.as_ptr());
}

pub unsafe fn reset_screen() {
    ::gzel::graphics_fill(0, 0, 0);
}

pub unsafe fn draw_ball(ball: &::model::Ball) {
    draw_rectangle(
        ball.position.x as u16,
        ball.position.y as u16,
        ball.size.x as u16,
        ball.size.y as u16,
        Color {
            r: 255,
            g: 0,
            b: 0
        }
    )
}

pub unsafe fn draw_pad(pad: &::model::Pad) {
    draw_rectangle(
        pad.position.x as u16,
        pad.position.y as u16,
        pad.size.x as u16,
        pad.size.y as u16,
        Color {
            r: 255,
            g: 255,
            b: 255,
        }
    )
}

pub unsafe fn draw_bricks(bricks: &Vec<::model::Brick>) {
    for brick in bricks.iter().filter(|brick| brick.is_alive()) {
        draw_rectangle(
            brick.position.x as u16,
            brick.position.y as u16,
            ::model::BRICK_WIDTH as u16,
            ::model::BRICK_HEIGHT as u16,
            Color {
                r: 255,
                g: 255,
                b: 255
            }
        )
    }
}
