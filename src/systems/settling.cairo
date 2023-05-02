#[system]
mod Settle {
    use traits::Into;
    use traits::TryInto;
    use debug::PrintTrait;

    use eternum::constants::WORLD_CONFIG_ID;
    use eternum::interfaces::IERC721Dispatcher;
    use eternum::interfaces::IERC721DispatcherTrait;
    use eternum::erc721::erc721::RealmData;
    use eternum::erc721::erc721::Position;
    // use eternum::components::position::Position as PositionComponent;
    use eternum::components::owner::Owner;
    use eternum::components::realm::Realm;
    use eternum::components::config::WorldConfig;

    fn execute(realm_id: felt252) { // get the ERC721 contract
        // get the owner
        let config = commands::<WorldConfig>::entity(WORLD_CONFIG_ID.into());
        let token = config.realm_l2_contract;
        // // TODO: token id = realm id ? 
        let owner = commands::<Owner>::entity((token, realm_id).into());
        let caller = starknet::get_caller_address();
        // TODO: withdraw gas error with assert 
        // assert(owner.address == caller, 'Only owner can settle');
        // get the metadata
        let realm_data: RealmData = IERC721Dispatcher {
            contract_address: token
        }.fetch_realm_data(realm_id);
        let position: Position = IERC721Dispatcher {
            contract_address: token
        }.realm_position(realm_id);
        // create Realm Metadata
        let query: Query = (token, realm_id).into();
        commands::set_entity(
            query,
            (
                Position {
                    x: position.x, y: position.y, 
                    }, Realm {
                    realm_id: realm_id,
                    owner: owner.address,
                    resource_ids_hash: 0,
                    resource_ids_packed_low: realm_data.resource_ids_packed_low,
                    resource_ids_packed_high: realm_data.resource_ids_packed_high,
                    resource_ids_count: realm_data.resource_ids_count,
                    cities: realm_data.cities,
                    harbors: realm_data.harbors,
                    rivers: realm_data.rivers,
                    regions: realm_data.regions,
                    wonder: realm_data.wonder,
                    order: realm_data.order,
                    }, Owner {
                    address: owner.address, 
                }
            )
        );
    }
}

mod tests {
    use starknet::syscalls::deploy_syscall;
    use starknet::testing::set_caller_address;
    use starknet::class_hash::Felt252TryIntoClassHash;
    use core::traits::Into;
    use core::traits::TryInto;
    use array::ArrayTrait;
    use option::OptionTrait;
    use core::result::ResultTrait;
    use debug::PrintTrait;

    use dojo_core::interfaces::IWorldDispatcherTrait;
    use dojo_core::test_utils::spawn_test_world;
    use dojo_core::storage::query::Query;
    use dojo_core::storage::query::QueryTrait;

    use eternum::erc721::erc721::Position;
    use eternum::erc721::erc721::RealmData;
    use eternum::erc721::erc721::ERC721;
    use eternum::interfaces::IERC721Dispatcher;
    use eternum::interfaces::IERC721DispatcherTrait;

    // components
    use eternum::erc721::components::TokenApprovalComponent;
    use eternum::erc721::components::BalanceComponent;
    // use eternum::erc721::components::OwnerComponent;
    use eternum::components::owner::OwnerComponent;
    use eternum::components::realm::RealmComponent;
    use eternum::components::position::PositionComponent;
    use eternum::components::config::WorldConfigComponent;
    // systems
    use eternum::erc721::systems::ERC721ApproveSystem;
    use eternum::erc721::systems::ERC721TransferFromSystem;
    use eternum::erc721::systems::ERC721MintSystem;
    use eternum::systems::settling::SettleSystem;
    use eternum::systems::world_config::WorldConfigSystem;

    #[test]
    #[available_gas(30000000)]
    fn test_settle_realm() {
        // components
        let mut components = array::ArrayTrait::<felt252>::new();
        components.append(TokenApprovalComponent::TEST_CLASS_HASH);
        components.append(BalanceComponent::TEST_CLASS_HASH);
        components.append(OwnerComponent::TEST_CLASS_HASH);
        components.append(RealmComponent::TEST_CLASS_HASH);
        components.append(PositionComponent::TEST_CLASS_HASH);
        components.append(WorldConfigComponent::TEST_CLASS_HASH);
        // systems
        let mut systems = array::ArrayTrait::<felt252>::new();
        systems.append(ERC721ApproveSystem::TEST_CLASS_HASH);
        systems.append(ERC721TransferFromSystem::TEST_CLASS_HASH);
        systems.append(ERC721MintSystem::TEST_CLASS_HASH);
        systems.append(SettleSystem::TEST_CLASS_HASH);
        systems.append(WorldConfigSystem::TEST_CLASS_HASH);

        // deploy executor, world and register components/systems
        let world = spawn_test_world(components, systems);

        let mut constructor_calldata = array::ArrayTrait::<felt252>::new();
        constructor_calldata.append(world.contract_address.into());
        constructor_calldata.append('realm');
        constructor_calldata.append('REALM');
        // deploy ERC721 contract
        let (erc721_address, _) = deploy_syscall(
            ERC721::TEST_CLASS_HASH.try_into().unwrap(), 0, constructor_calldata.span(), false
        ).unwrap();
        let erc721 = IERC721Dispatcher { contract_address: erc721_address };

        starknet::testing::set_caller_address(starknet::contract_address_const::<0x420>());
        let caller = starknet::get_caller_address();

        // mint token
        erc721.mint(caller);

        // set realm data
        let position = Position { x: 10000, y: 10000 };
        erc721.set_realm_data(
            1, u256 { low: 40564819207303341694527483217926, high: 0 }, 'Stolsli'.into(), position
        );

        let realm_data: RealmData = erc721.fetch_realm_data(1);
        assert(realm_data.realm_id == 1, 'Wrong realm id');
        assert(realm_data.resource_ids_packed_low == 770, 'Wrong resource_ids_packed_low');
        assert(realm_data.resource_ids_packed_high == 0, 'Wrong resource_ids_packed_high');
        assert(realm_data.resource_ids_count == 2, 'Wrong resource_ids_count');
        assert(realm_data.cities == 8, 'Wrong cities');
        assert(realm_data.harbors == 17, 'Wrong harbors');
        assert(realm_data.rivers == 26, 'Wrong rivers');
        assert(realm_data.regions == 6, 'Wrong regions');
        assert(realm_data.wonder == 2, 'Wrong wonder');
        assert(realm_data.order == 0, 'Wrong order');
        let position: Position = erc721.realm_position(1);
        assert(position.x == 10000, 'Wrong position x');
        assert(position.y == 10000, 'Wrong position y');

        // set world config
        let mut world_config_call_data = array::ArrayTrait::<felt252>::new();
        world_config_call_data.append(0);
        world_config_call_data.append(0);
        world_config_call_data.append(0);
        world_config_call_data.append(0);
        world_config_call_data.append(0);
        world_config_call_data.append(0);
        world_config_call_data.append(erc721_address.into());

        world.execute('WorldConfig'.into(), world_config_call_data.span());
        // settle
        let mut settle_call_data = array::ArrayTrait::<felt252>::new();
        settle_call_data.append(1);
        world.execute('Settle'.into(), settle_call_data.span());

        // assert settled realm
        let token: felt252 = erc721_address.into();
        let realm_query: Query = (token, 1).into();
        let position = world.entity('Position'.into(), realm_query, 0_u8, 0_usize);
        assert(*position[0] == 10000, 'failed position x');
        assert(*position[1] == 10000, 'failed position y');
        let owner = world.entity('Owner'.into(), realm_query, 0_u8, 0_usize);
        assert(*owner[0] == caller.into(), 'failed owner');
        let s_realm_data = world.entity('Realm'.into(), realm_query, 0_u8, 0_usize);
        assert(*s_realm_data[0] == 1, 'failed realm id');
        assert(*s_realm_data[1] == caller.into(), 'failed realm owner');
        assert(*s_realm_data[2] == 0, 'failed resource_ids_hash');
        assert(*s_realm_data[3] == 770, 'failed resource_ids_packed_low');
        assert(*s_realm_data[4] == 0, 'failed resource_ids_packed_high');
        assert(*s_realm_data[5] == 2, 'failed resource_ids_count');
        assert(*s_realm_data[6] == 8, 'failed cities');
        assert(*s_realm_data[7] == 17, 'failed harbors');
        assert(*s_realm_data[8] == 26, 'failed rivers');
        assert(*s_realm_data[9] == 6, 'failed regions');
        assert(*s_realm_data[10] == 2, 'failed wonder');
        assert(*s_realm_data[11] == 0, 'failed order');
    }
}
