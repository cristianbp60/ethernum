


#[system]
mod config_systems {
    use eternum::alias::ID;

    use eternum::models::config::{
        LaborCostResources, LaborCostAmount, LaborConfig,CapacityConfig, 
        RoadConfig, SpeedConfig, TravelConfig, WeightConfig,WorldConfig,
    };

    use eternum::systems::config::interface::{
        IWorldConfig, IWeightConfig, ILaborConfig, ITransportConfig, 
        IHyperstructureConfig
    };

    use eternum::constants::{
        WORLD_CONFIG_ID, LABOR_CONFIG_ID, TRANSPORT_CONFIG_ID, ROAD_CONFIG_ID
    };

    use eternum::models::hyperstructure::HyperStructure;
    use eternum::models::resources::ResourceCost;
    use eternum::models::position::{Position, Coord};
    



    #[external(v0)]
    impl WorldConfigImpl of IWorldConfig<ContractState> {
        fn set_world_config(
            self: @ContractState, 
            world: IWorldDispatcher, 
            realm_l2_contract: starknet::ContractAddress
        ) {
            set!(
                world,
                (WorldConfig {
                    config_id: WORLD_CONFIG_ID,
                    realm_l2_contract
                })
            );
        }
    }



    #[external(v0)]
    impl WeightConfigImpl of IWeightConfig<ContractState> {
        fn set_weight_config(
            self: @ContractState, 
            world: IWorldDispatcher, 
            entity_type: u128, 
            weight_gram: u128
        ) {
            set!(
                world,
                (WeightConfig {
                    config_id: WORLD_CONFIG_ID,
                    weight_config_id: entity_type,
                    entity_type,
                    weight_gram,
                })
            );
        }
    }




    #[external(v0)]
    impl LaborConfigImpl of ILaborConfig<ContractState> {
        fn set_labor_cost_resources(
            self: @ContractState, 
            world: IWorldDispatcher, 
            resource_type_labor: felt252, 
            resource_types_packed: u128, 
            resource_types_count: u8
        ) {
            // set cost of creating labor for resource id 1 
            // to only resource id 1 cost
            set!(
                world,
                (LaborCostResources {
                    resource_type_labor, 
                    resource_types_packed, 
                    resource_types_count
                })
            );
        }


        fn set_labor_cost_amount(
            self: @ContractState, 
            world: IWorldDispatcher, 
            resource_type_labor: felt252, 
            resource_type_cost: felt252, 
            resource_type_value: u128
        ) {
            set!(
                world,
                (LaborCostAmount {
                    resource_type_labor, 
                    resource_type_cost, 
                    value: resource_type_value
                })
            );
        }


        fn set_labor_config(
            self: @ContractState, 
            world: IWorldDispatcher, 
            base_labor_units: u64, 
            base_resources_per_cycle: u128, 
            base_food_per_cycle: u128
        ) {
            // set labor config
            set!(
                world,
                (LaborConfig {
                    config_id: LABOR_CONFIG_ID,
                    base_labor_units,
                    base_resources_per_cycle,
                    base_food_per_cycle
                })
            );
        }

    }




    #[external(v0)]
    impl TransportConfigImpl of ITransportConfig<ContractState> {
        fn set_road_config(
            self: @ContractState, 
            world: IWorldDispatcher, 
            fee_resource_type: u8, 
            fee_amount: u128, 
            speed_up_by: u64
        ) {
            set!(
                world,
                (RoadConfig {
                    config_id: ROAD_CONFIG_ID,
                    fee_resource_type,
                    fee_amount,
                    speed_up_by
                })
            );
        }


        fn set_speed_config(
            self: @ContractState, 
            world: IWorldDispatcher, 
            entity_type: u128, 
            sec_per_km: u16
        ) {
            set!(
                world,
                (SpeedConfig {
                    config_id: WORLD_CONFIG_ID,
                    speed_config_id: entity_type,
                    entity_type,
                    sec_per_km,
                })
            );
        }


        fn set_travel_config(
            self: @ContractState, 
            world: IWorldDispatcher, 
            free_transport_per_city: u128
        ) {

            set!(
                world,
                (TravelConfig {
                    config_id: TRANSPORT_CONFIG_ID,
                    free_transport_per_city
                })
            );

        }
    }



    #[external(v0)]
    impl HyperstructureConfigImpl of IHyperstructureConfig<ContractState> {

        fn create_hyperstructure(
            self: @ContractState,
            world: IWorldDispatcher,
            hyperstructure_type: u8,
            ref initialization_resources: Span<(u8, u128)>,
            ref construction_resources: Span<(u8, u128)>,
            coord: Coord
        ) -> ID {

        
            let initialization_resource_count = initialization_resources.len();
            assert(initialization_resource_count > 0, 'resources must not be empty');

            let construction_resource_count = construction_resources.len();
            assert(construction_resource_count > 0, 'resources must not be empty');

            // create initialization resource cost components
            let initialization_resource_id: ID = world.uuid().into();
            let mut index = 0;
            loop {
                match initialization_resources.pop_front() {
                    Option::Some((resource_type, resource_amount)) => {
                        assert(*resource_amount > 0, 'amount must not be 0');

                        set!(world, (
                            ResourceCost {
                                entity_id: initialization_resource_id,
                                index,
                                resource_type: *resource_type,
                                amount: *resource_amount
                            }
                        ));

                        index += 1;
                    },
                    Option::None => {break;}
                };
            };


            // create construction resource cost components
            let construction_resource_id: ID = world.uuid().into();
            let mut index = 0;
            loop {
                match construction_resources.pop_front() {
                    Option::Some((resource_type, resource_amount)) => {
                        assert(*resource_amount > 0, 'amount must not be 0');

                        set!(world, (
                            ResourceCost {
                                entity_id: construction_resource_id,
                                index,
                                resource_type: *resource_type,
                                amount: *resource_amount
                            }
                        ));

                        index += 1;
                    },
                    Option::None => {break;}
                };
            };


            let hyperstructure_id: ID = world.uuid().into();

            set!(world, (
                HyperStructure {
                    entity_id: hyperstructure_id,
                    hyperstructure_type,
                    initialization_resource_id,
                    initialization_resource_count,
                    construction_resource_id,
                    construction_resource_count,
                    initialized_at: 0,
                    completed_at: 0,
                    coord_x: coord.x,
                    coord_y: coord.y
                }
            ));  

            hyperstructure_id 
                
        }

    }
}




// #[cfg(test)]
// mod hyperstructure_tests {

//     use eternum::models::hyperstructure::HyperStructure;
//     use eternum::models::resources::ResourceCost;
//     use eternum::models::position::{Position, Coord};
//     use eternum::constants::ResourceTypes;
    
//     use eternum::utils::testing::spawn_eternum;
    
//     use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

//     use starknet::contract_address_const;

//     use core::array::ArrayTrait;
//     use core::serde::Serde;

//     #[test]
//     #[available_gas(3000000000000)]  
//     fn test_define_hyperstructure() {
//         let world = spawn_eternum();

//         starknet::testing::set_contract_address(
//             contract_address_const::<'entity'>()
//         );

//         let hyperstructure_type = 1_u8;
//         let initialization_resources = array![
//             (ResourceTypes::STONE, 10_u8), // 10 stone
//             (ResourceTypes::WOOD, 13_u8)  // 13 wood
//         ];
//         let construction_resources = array![
//             (ResourceTypes::STONE, 40_u8), // 40 stone
//             (ResourceTypes::WOOD, 50_u8)  // 50 wood
//         ];
//         let hyperstructure_coord = Coord{ x:20, y:30 };


//         let mut calldata = array![];
//         Serde::serialize(@hyperstructure_type, ref calldata);
//         Serde::serialize(@initialization_resources, ref calldata); 
//         Serde::serialize(@construction_resources, ref calldata); 
//         Serde::serialize(@hyperstructure_coord, ref calldata);
//         let result = world.execute('DefineHyperStructure', calldata);
//         let hyperstructure_id = *result[0];


//         let hyperstructure = get!(world, hyperstructure_id, HyperStructure);
//         assert(hyperstructure.hyperstructure_type == hyperstructure_type, 
//                 'wrong hyperstructure_type value'
//         );
//         assert(hyperstructure.initialized_at == 0, 'wrong initialized_at value');
//         assert(hyperstructure.completed_at == 0, 'wrong completed_at value');
//         assert(hyperstructure.initialization_resource_count == 2, 'wrong resource count');
//         assert(hyperstructure.construction_resource_count == 2, 'wrong resource count');

//         let hyperstructure = get!(world, hyperstructure_id, HyperStructure);

//         let hyperstructure_initialization_stone_cost = get!(world, (hyperstructure.initialization_resource_id, 0), ResourceCost);
//         assert(hyperstructure_initialization_stone_cost.amount == 10, 'wrong amount value');
//         assert(hyperstructure_initialization_stone_cost.resource_type == ResourceTypes::STONE, 
//                 'wrong resource_type value'
//         );


//         let hyperstructure_initialization_wood_cost = get!(world, (hyperstructure.initialization_resource_id, 1), ResourceCost);
//         assert(hyperstructure_initialization_wood_cost.amount == 13, 'wrong amount value');
//         assert(hyperstructure_initialization_wood_cost.resource_type == ResourceTypes::WOOD, 
//                 'wrong resource_type value'
//         );

//         let hyperstructure_construction_stone_cost = get!(world, (hyperstructure.construction_resource_id, 0), ResourceCost);
//         assert(hyperstructure_construction_stone_cost.amount == 40, 'wrong amount value');
//         assert(hyperstructure_construction_stone_cost.resource_type == ResourceTypes::STONE, 
//                 'wrong resource_type value'
//         );


//         let hyperstructure_construction_wood_cost = get!(world, (hyperstructure.construction_resource_id, 1), ResourceCost);
//         assert(hyperstructure_construction_wood_cost.amount == 50, 'wrong amount value');
//         assert(hyperstructure_construction_wood_cost.resource_type == ResourceTypes::WOOD, 
//                 'wrong resource_type value'
//         );


//         assert(hyperstructure.coord_x == hyperstructure_coord.x, 'wrong x value');
//         assert(hyperstructure.coord_y == hyperstructure_coord.y, 'wrong y value');
//     }

// }
