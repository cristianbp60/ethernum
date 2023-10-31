#[derive(Model, Copy, Drop, Serde)]
struct Health {
    #[key]
    entity_id: u128,
    value: u128
}

#[derive(Model, Copy, Drop, Serde)]
struct Attack {
    #[key]
    entity_id: u128,
    value: u128
}


#[derive(Model, Copy, Drop, Serde)]
struct Defence {
    #[key]
    entity_id: u128,
    value: u128
}

#[derive(Model, Copy, Drop, Serde)]
struct TownWatch {
    #[key]
    entity_id: u128,
    town_watch_id: u128
}


#[derive(Copy, Drop, Serde)]
enum Duty {
    Attack,
    Defence
}

// #[generate_trait]
// impl AttackImpl of AttackTrait {
//     fn success_probability(self: Attack, defence: u128)  -> u128 {
//         self.value * 100 / (self.value + defence)
//     }
// }