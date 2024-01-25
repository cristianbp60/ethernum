#[dojo::contract]
mod buildings_systems {
    use eternum::systems::buildings::interface::IBuildingsSystems;

    //LABOR_CONFIG_ID
    use eternum::constants::BUILDING_CONFIG_ID;

    use eternum::models::owner::{Owner};
    use eternum::models::buildings::{LaborBuilding};
    use eternum::models::config::{LaborBuildingsConfig, LaborBuildingCost};
    use eternum::models::resources::{Resource, ResourceCost};

    #[external(v0)]
    impl BuildingsSystemsImpl of IBuildingsSystems<ContractState> {
        fn create(
            self: @ContractState, world: IWorldDispatcher, realm_entity_id: u128, building_type: u8
        ) {
            // assert owner of the realm
            let owner = get!(world, realm_entity_id, Owner);

            let building = get!(world, (realm_entity_id), LaborBuilding);

            // remove the cost from the realm balance
            let buildings_cost: LaborBuildingCost = get!(
                world, (BUILDING_CONFIG_ID, building_type), LaborBuildingCost
            );
            let mut index = 0;
            loop {
                if index == buildings_cost.resource_cost_count {
                    break;
                }

                let resource_cost = get!(
                    world, (buildings_cost.resource_cost_id, index), ResourceCost
                );
                let mut realm_resource = get!(
                    world, (realm_entity_id, resource_cost.resource_type), Resource
                );

                assert(realm_resource.balance >= resource_cost.amount, 'insufficient resources');

                realm_resource.balance -= resource_cost.amount;
                set!(world, (realm_resource));

                index += 1;
            };

            set!(
                world, LaborBuilding { realm_entity_id, building_type, labor_count: 0, level: 0, }
            );
        }

        fn destroy(self: @ContractState, world: IWorldDispatcher, realm_entity_id: u128) {
            // assert owner of the realm
            let owner = get!(world, realm_entity_id, Owner);

            // remove building to LaborBuilding
            let mut building = get!(world, (realm_entity_id), LaborBuilding);
            assert(building.building_type != 0, 'building does not exist');
            building.building_type = 0;
            building.labor_count = 0;
            building.level = 0;
        }
    }
}
