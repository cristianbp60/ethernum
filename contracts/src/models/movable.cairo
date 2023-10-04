// speed seconds per km
#[derive(Model, Copy, Drop, Serde)]
struct Movable {
    #[key]
    entity_id: u128,
    sec_per_km: u16,
    blocked: bool,
}

// DISCUSS: separated from the Movable component because
// we want to attach an ArrivalTime to the trading order
// without having to attach a Movable component to the order
#[derive(Model, Copy, Drop, Serde)]
struct ArrivalTime {
    #[key]
    entity_id: u128,
    arrives_at: u64,
}
