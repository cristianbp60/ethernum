#[dojo::contract]
mod realm_map {
    use eternum::alias::ID;
    use eternum::models::{
        resources::{Resource, ResourceCost}, owner::Owner, hyperstructure::HyperStructure,
        realm::Realm, order::Orders, position::{Coord, Position, PositionTrait, Direction},
        buildings::{BuildingCategory, Building, BuildingCategoryTrait, BuildingProductionTrait},
        production::{Production, ProductionRateTrait}
    };
    use eternum::systems::inner_hex::interface::IRealmMap;
    use eternum::constants::WORLD_CONFIG_ID;

    #[abi(embed_v0)]
    impl RealmMapImpl of IRealmMap<ContractState> {
        fn create_building(
            self: @TContractState,
            world: IWorldDispatcher,
            realm_id: u128,
            building_coord: Coord,
            building_category: BuildingCategory,
        ) {
            BuildingProductionTrait::create(world, entity_id, building, inner_coord);
        }
        
        fn destroy_building(
            self: @TContractState, world: IWorldDispatcher, entity_id: u128, inner_coord: Coord,
        ) {
            BuildingProductionTrait::remove(world, entity_id, inner_coord);
        }
        fn start_production(
            self: @TContractState, world: IWorldDispatcher, entity_id: u128, resource_type: u8,
        ) {
            let owner = get!(world, entity_id, Owner);

            assert!(
                owner.address == starknet::get_caller_address(), "caller not outer entity owner"
            );

            let mut production: Production = get!(world, (entity_id, resource_type), Production);

            production.activate();

            set!(world, (production));
        }
        fn stop_production(
            self: @TContractState, world: IWorldDispatcher, entity_id: u128, resource_type: u8,
        ) {
            let owner = get!(world, entity_id, Owner);

            assert!(
                owner.address == starknet::get_caller_address(), "caller not outer entity owner"
            );

            let mut production: Production = get!(world, (entity_id, resource_type), Production);

            production.deactivate();

            set!(world, (production));
        }
    }
}
