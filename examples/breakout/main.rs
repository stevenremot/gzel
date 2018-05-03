mod gzel;
mod model;
mod graphics;
mod input;

#[allow(non_upper_case_globals)]
static mut game: Option<model::Game> = None;

#[no_mangle]
pub unsafe extern fn init() {
    let mut bricks: Vec<model::Brick> = Vec::new();
    let brick_gap_x = 5.;
    let brick_gap_y = 5.;
    let brick_area_width = 15. * model::BRICK_WIDTH + 14. * brick_gap_x;
    let brick_area_left = gzel::SCREEN_WIDTH as f32 / 2. - brick_area_width / 2.;
    let brick_area_top = 40.;

    for column in (1..15).rev() {
        for row in (1..7).rev() {
            bricks.push(model::brick(
                brick_area_left + (column as f32) *
                    (model::BRICK_WIDTH + brick_gap_x),
                brick_area_top + (row as f32) *
                    (model::BRICK_HEIGHT + brick_gap_y),
            ))
        }
    }

    game = Some(model::create_game(
        model::point(155., 220.),
        model::point(150., 230.),
        bricks,
    ))
}

#[no_mangle]
pub unsafe extern fn update(step: u32) {
    match game {
        Some(ref mut game_obj) => {
            model::move_pad(game_obj, step);
            model::update_ball(game_obj, step);

            graphics::reset_screen();
            graphics::draw_ball(&game_obj.ball);
            graphics::draw_bricks(&game_obj.bricks);
            graphics::draw_pad(&game_obj.pad);
        },
        None => (),
    }
}

#[no_mangle]
pub unsafe extern fn on_key_press(hw_key: u8) {
    match game {
        Some(ref mut game_obj) => {
            let key = input::get_key_from_hw(hw_key);
            match key {
                Some(input::Key::Left) => model::add_pad_direction(game_obj, -1.),
                Some(input::Key::Right) => model::add_pad_direction(game_obj, 1.),
                Some(input::Key::Up) => model::start_playing(game_obj),
                _ => (),
            }
        },
        None => (),
    }
}

#[no_mangle]
pub unsafe extern fn on_key_release(hw_key: u8) {
    match game {
        Some(ref mut game_obj) => {
            let key = input::get_key_from_hw(hw_key);
            match key {
                Some(input::Key::Left) => model::add_pad_direction(game_obj, 1.),
                Some(input::Key::Right) => model::add_pad_direction(game_obj, -1.),
                _ => ()
            }
        },
        None => ()
    }
}
