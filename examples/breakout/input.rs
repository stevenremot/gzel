pub enum Key {
    Left,
    Right,
    Up,
}

pub fn get_key_from_hw(hw_key: u8) -> Option<Key> {
    match hw_key {
        0 => Some(Key::Left),
        1 => Some(Key::Right),
        2 => Some(Key::Up),
        _ => None
    }
}
