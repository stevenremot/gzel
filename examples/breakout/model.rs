use std::f32;

pub struct Point {
    pub x: f32,
    pub y: f32,
}

pub struct Ball {
    pub position: Point,
    pub direction: Point,
    pub size: Point,
}

pub struct Brick {
    pub position: Point,
    pub alive: bool,
}

impl Brick {
    pub fn is_alive(&self) -> bool {
        self.alive
    }
}

pub struct Pad {
    pub position: Point,
    pub size: Point,
    pub direction_x: f32,
}

enum GamePhase {
    Aiming,
    Playing,
}

pub struct Game {
    pub pad: Pad,
    pub ball: Ball,
    pub bricks: Vec<Brick>,
    phase: GamePhase,
}

// px by ms
const PAD_SPEED: f32 = 0.2;
const BALL_SPEED: f32 = 0.2;
const BOUNCE_BASE: f32 = -f32::consts::PI / 2.;
const BOUNCE_AMPLITUDE: f32 = 0.75 * f32::consts::PI / 2.;
pub const BRICK_WIDTH: f32 = 10.;
pub const BRICK_HEIGHT: f32 = 5.;

pub fn point(x: f32, y: f32) -> Point {
    Point{ x, y }
}

fn create_ball(position: Point) -> Ball{
    Ball {
        position: position,
        direction: Point { x: 0., y: 0. },
        size: Point { x: 5., y: 5. },
    }
}

fn create_pad(position: Point) -> Pad {
    Pad {
        position: position,
        size: Point { x: 30., y: 5. },
        direction_x: 0.,
    }
}

pub fn brick(x: f32, y: f32) -> Brick {
    Brick {
        position: point(x, y),
        alive: true,
    }
}

pub fn create_game(ball_position: Point, pad_position: Point, bricks: Vec<Brick>) -> Game {
    Game {
        ball: create_ball(ball_position),
        pad: create_pad(pad_position),
        bricks,
        phase: GamePhase::Aiming,
    }
}

pub fn start_playing(game: &mut Game) {
    game.phase = GamePhase::Playing;
    game.ball.direction.x = 0.;
    game.ball.direction.y = -1.;
}

pub fn add_pad_direction(game: &mut Game, direction: f32) {
    game.pad.direction_x += direction;
}

pub fn move_pad(game: &mut Game, step: u32) {
    let moved_position: f32 = game.pad.position.x +
        (game.pad.direction_x as f32 * PAD_SPEED * step as f32) as f32;

    if moved_position < 0. {
        game.pad.position.x = 0.;
    } else if moved_position + game.pad.size.x > ::gzel::SCREEN_WIDTH as f32 {
        game.pad.position.x = ::gzel::SCREEN_WIDTH as f32 - game.pad.size.x;
    } else {
        game.pad.position.x = moved_position;
    }
}

fn stick_ball_to_pad(game: &mut Game) {
    let pad_pos = &game.pad.position;
    let pad_size = &game.pad.size;
    let ball_size = &game.ball.size;
    game.ball.position.y = pad_pos.y - 2. - ball_size.y;
    game.ball.position.x = pad_pos.x + (pad_size.x / 2.) - (ball_size.x / 2.);
}

fn move_ball(game: &mut Game, step: u32) {
    let speed = BALL_SPEED * step as f32;
    game.ball.position.x += speed * game.ball.direction.x;
    game.ball.position.y += speed * game.ball.direction.y;

    collide_ball_with_screen(&mut game.ball);
    collide_ball_with_pad(&mut game.ball, &game.pad);
}

fn collide_ball_with_screen(ball: &mut Ball) {
    if ball.position.x < 0. {
        ball.position.x = 0.;
        ball.direction.x = -ball.direction.x;
    }

    if ball.position.x >= ::gzel::SCREEN_WIDTH as f32 - ball.size.x {
        ball.position.x = ::gzel::SCREEN_WIDTH as f32 - ball.size.x;
        ball.direction.x = -ball.direction.x;
    }

    if ball.position.y < 0. {
        ball.position.y = 0.;
        ball.direction.y = -ball.direction.y;
    }

    if ball.position.y >= ::gzel::SCREEN_HEIGHT as f32 - ball.size.y {
        ball.position.y = ::gzel::SCREEN_HEIGHT as f32 - ball.size.y;
        ball.direction.y = -ball.direction.y;
    }
}

fn collide_x(p1: &Point, s1: &Point, p2: &Point, s2: &Point) -> bool {
    let left1 = p1.x;
    let right1 = left1 + s1.x;
    let left2 = p2.x;
    let right2 = left2 + s2.x;

    return left1 <= right2 && right1 >= left2;
}

fn collide_y(p1: &Point, s1: &Point, p2: &Point, s2: &Point) -> bool {
    let top1 = p1.y;
    let bottom1 = top1 + s1.y;
    let top2 = p2.y;
    let bottom2 = top2 + s2.y;

    return top1 <= bottom2 && bottom1 >= top2;
}

fn collide(p1: &Point, s1: &Point, p2: &Point, s2: &Point) -> bool {
    collide_x(p1, s1, p2, s2) && collide_y(p1, s1, p2, s2)
}

fn collide_ball_with_pad(ball: &mut Ball, pad: &Pad) {
    let collides = collide(&ball.position, &ball.size, &pad.position, &pad.size);

    if collides && ball.direction.y >= 0. {
        let ball_center = ball.position.x + ball.size.x / 2.;
        let pad_center = pad.position.x + pad.size.x / 2.;

        let diff = ball_center - pad_center;
        let angle = BOUNCE_BASE + (BOUNCE_AMPLITUDE * diff / (pad.size.x / 2.));

        ball.direction.x = angle.cos();
        ball.direction.y = angle.sin();
    }
}

fn collide_ball_with_brick(ball: &mut Ball, brick: &mut Brick) {
    let brick_size = point(BRICK_WIDTH, BRICK_HEIGHT);

    if collide(&ball.position, &ball.size, &brick.position, &brick_size) {
        brick.alive = false;
        let ball_center_x = ball.position.x + ball.size.x / 2.;
        let ball_rel_center_x = ball_center_x - brick.position.x;

        if ball_rel_center_x >= 0. || ball_rel_center_x <= BRICK_WIDTH {
            ball.direction.y = -ball.direction.y;
        } else {
            ball.direction.x = -ball.direction.x;
        }
    }
}

fn collide_ball_with_bricks(ball: &mut Ball, bricks: &mut Vec<Brick>) {
    for brick in bricks.iter_mut().filter(|brick| brick.is_alive()) {
        collide_ball_with_brick(ball, brick);
    }
}

pub fn update_ball(game: &mut Game, step: u32) {
    match game.phase {
        GamePhase::Aiming => stick_ball_to_pad(game),
        GamePhase::Playing => {
            move_ball(game, step);
            collide_ball_with_bricks(&mut game.ball, &mut game.bricks);
        },
    }
}
