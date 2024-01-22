/* Autogenerated file. Do not edit manually. */

import { defineComponent, Type as RecsType, World } from "@dojoengine/recs";

export function defineContractComponents(world: World) {
  return {
    Age: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, born_at: RecsType.Number },
        {
          metadata: {
            name: "Age",
            types: ["u128", "u64"],
            customTypes: [],
          },
        },
      );
    })(),
    Bank: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, exists: RecsType.Boolean },
        {
          metadata: {
            name: "Bank",
            types: ["u128", "bool"],
            customTypes: [],
          },
        },
      );
    })(),
    BankAuction: (() => {
      return defineComponent(
        world,
        {
          bank_id: RecsType.BigInt,
          bank_gives_resource_type: RecsType.Number,
          bank_swap_resource_cost_index: RecsType.Number,
          decay_constant_mag: RecsType.BigInt,
          decay_constant_sign: RecsType.Boolean,
          per_time_unit: RecsType.BigInt,
          start_time: RecsType.Number,
          sold: RecsType.BigInt,
          price_update_interval: RecsType.BigInt,
        },
        {
          metadata: {
            name: "BankAuction",
            types: ["u128", "u8", "u32", "u128", "bool", "u128", "u64", "u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    BankSwapResourceCost: (() => {
      return defineComponent(
        world,
        {
          bank_gives_resource_type: RecsType.Number,
          index: RecsType.Number,
          resource_cost_id: RecsType.BigInt,
          resource_cost_count: RecsType.Number,
        },
        {
          metadata: {
            name: "BankSwapResourceCost",
            types: ["u8", "u32", "u128", "u32"],
            customTypes: [],
          },
        },
      );
    })(),
    Capacity: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, weight_gram: RecsType.BigInt },
        {
          metadata: {
            name: "Capacity",
            types: ["u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    CaravanMembers: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, key: RecsType.BigInt, count: RecsType.Number },
        {
          metadata: {
            name: "CaravanMembers",
            types: ["u128", "u128", "u32"],
            customTypes: [],
          },
        },
      );
    })(),
    Attack: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, value: RecsType.BigInt },
        {
          metadata: {
            name: "Attack",
            types: ["u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    Defence: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, value: RecsType.BigInt },
        {
          metadata: {
            name: "Defence",
            types: ["u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    Health: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, value: RecsType.BigInt },
        {
          metadata: {
            name: "Health",
            types: ["u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    TownWatch: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, town_watch_id: RecsType.BigInt },
        {
          metadata: {
            name: "TownWatch",
            types: ["u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    AttackConfig: (() => {
      return defineComponent(
        world,
        { entity_type: RecsType.BigInt, max_value: RecsType.BigInt },
        {
          metadata: {
            name: "AttackConfig",
            types: ["u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    BuildingConfig: (() => {
      return defineComponent(
        world,
        { config_id: RecsType.BigInt, base_sqm: RecsType.BigInt, workhut_cost: RecsType.BigInt },
        {
          metadata: {
            name: "BuildingConfig",
            types: ["u128", "u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    BuildingCost: (() => {
      return defineComponent(
        world,
        {
          config_id: RecsType.BigInt,
          building_cost_config_id: RecsType.BigInt,
          resource_type: RecsType.BigInt,
          cost: RecsType.BigInt,
        },
        {
          metadata: {
            name: "BuildingCost",
            types: ["u128", "u128", "felt252", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    BuildingTypeConfig: (() => {
      return defineComponent(
        world,
        {
          config_id: RecsType.BigInt,
          building_type_config_id: RecsType.BigInt,
          id: RecsType.BigInt,
          sqm: RecsType.BigInt,
          resource_types_packed: RecsType.BigInt,
          resource_types_count: RecsType.Number,
        },
        {
          metadata: {
            name: "BuildingTypeConfig",
            types: ["u128", "u128", "felt252", "u128", "u256", "u8"],
            customTypes: [],
          },
        },
      );
    })(),
    CapacityConfig: (() => {
      return defineComponent(
        world,
        {
          config_id: RecsType.BigInt,
          carry_capacity_config_id: RecsType.BigInt,
          entity_type: RecsType.BigInt,
          weight_gram: RecsType.BigInt,
        },
        {
          metadata: {
            name: "CapacityConfig",
            types: ["u128", "u128", "u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    CombatConfig: (() => {
      return defineComponent(
        world,
        {
          config_id: RecsType.BigInt,
          stealing_trial_count: RecsType.Number,
          wheat_burn_per_soldier: RecsType.BigInt,
          fish_burn_per_soldier: RecsType.BigInt,
        },
        {
          metadata: {
            name: "CombatConfig",
            types: ["u128", "u32", "u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    DefenceConfig: (() => {
      return defineComponent(
        world,
        { entity_type: RecsType.BigInt, max_value: RecsType.BigInt },
        {
          metadata: {
            name: "DefenceConfig",
            types: ["u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    HealthConfig: (() => {
      return defineComponent(
        world,
        {
          entity_type: RecsType.BigInt,
          resource_cost_id: RecsType.BigInt,
          resource_cost_count: RecsType.Number,
          max_value: RecsType.BigInt,
        },
        {
          metadata: {
            name: "HealthConfig",
            types: ["u128", "u128", "u32", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    LaborConfig: (() => {
      return defineComponent(
        world,
        {
          config_id: RecsType.BigInt,
          base_labor_units: RecsType.Number,
          base_resources_per_cycle: RecsType.BigInt,
          base_food_per_cycle: RecsType.BigInt,
        },
        {
          metadata: {
            name: "LaborConfig",
            types: ["u128", "u64", "u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    LaborCostAmount: (() => {
      return defineComponent(
        world,
        { resource_type_labor: RecsType.BigInt, resource_type_cost: RecsType.BigInt, value: RecsType.BigInt },
        {
          metadata: {
            name: "LaborCostAmount",
            types: ["felt252", "felt252", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    LaborCostResources: (() => {
      return defineComponent(
        world,
        {
          resource_type_labor: RecsType.BigInt,
          resource_types_packed: RecsType.BigInt,
          resource_types_count: RecsType.Number,
        },
        {
          metadata: {
            name: "LaborCostResources",
            types: ["felt252", "u128", "u8"],
            customTypes: [],
          },
        },
      );
    })(),
    LevelingConfig: (() => {
      return defineComponent(
        world,
        {
          config_id: RecsType.BigInt,
          decay_interval: RecsType.Number,
          max_level: RecsType.Number,
          decay_scaled: RecsType.BigInt,
          cost_percentage_scaled: RecsType.BigInt,
          base_multiplier: RecsType.BigInt,
          wheat_base_amount: RecsType.BigInt,
          fish_base_amount: RecsType.BigInt,
          resource_1_cost_id: RecsType.BigInt,
          resource_1_cost_count: RecsType.Number,
          resource_2_cost_id: RecsType.BigInt,
          resource_2_cost_count: RecsType.Number,
          resource_3_cost_id: RecsType.BigInt,
          resource_3_cost_count: RecsType.Number,
        },
        {
          metadata: {
            name: "LevelingConfig",
            types: [
              "u128",
              "u64",
              "u64",
              "u128",
              "u128",
              "u128",
              "u128",
              "u128",
              "u128",
              "u32",
              "u128",
              "u32",
              "u128",
              "u32",
            ],
            customTypes: [],
          },
        },
      );
    })(),
    RoadConfig: (() => {
      return defineComponent(
        world,
        {
          config_id: RecsType.BigInt,
          fee_resource_type: RecsType.Number,
          fee_amount: RecsType.BigInt,
          speed_up_by: RecsType.Number,
        },
        {
          metadata: {
            name: "RoadConfig",
            types: ["u128", "u8", "u128", "u64"],
            customTypes: [],
          },
        },
      );
    })(),
    SoldierConfig: (() => {
      return defineComponent(
        world,
        {
          config_id: RecsType.BigInt,
          resource_cost_id: RecsType.BigInt,
          resource_cost_count: RecsType.Number,
          wheat_burn_per_soldier: RecsType.BigInt,
          fish_burn_per_soldier: RecsType.BigInt,
        },
        {
          metadata: {
            name: "SoldierConfig",
            types: ["u128", "u128", "u32", "u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    SpeedConfig: (() => {
      return defineComponent(
        world,
        {
          config_id: RecsType.BigInt,
          speed_config_id: RecsType.BigInt,
          entity_type: RecsType.BigInt,
          sec_per_km: RecsType.Number,
        },
        {
          metadata: {
            name: "SpeedConfig",
            types: ["u128", "u128", "u128", "u16"],
            customTypes: [],
          },
        },
      );
    })(),
    TravelConfig: (() => {
      return defineComponent(
        world,
        { config_id: RecsType.BigInt, free_transport_per_city: RecsType.BigInt },
        {
          metadata: {
            name: "TravelConfig",
            types: ["u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    WeightConfig: (() => {
      return defineComponent(
        world,
        {
          config_id: RecsType.BigInt,
          weight_config_id: RecsType.BigInt,
          entity_type: RecsType.BigInt,
          weight_gram: RecsType.BigInt,
        },
        {
          metadata: {
            name: "WeightConfig",
            types: ["u128", "u128", "u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    WorldConfig: (() => {
      return defineComponent(
        world,
        { config_id: RecsType.BigInt, admin_address: RecsType.BigInt, realm_l2_contract: RecsType.BigInt },
        {
          metadata: {
            name: "WorldConfig",
            types: ["u128", "contractaddress", "contractaddress"],
            customTypes: [],
          },
        },
      );
    })(),
    HyperStructure: (() => {
      return defineComponent(
        world,
        {
          entity_id: RecsType.BigInt,
          hyperstructure_type: RecsType.Number,
          controlling_order: RecsType.Number,
          completed: RecsType.Boolean,
          completion_cost_id: RecsType.BigInt,
          completion_resource_count: RecsType.Number,
        },
        {
          metadata: {
            name: "HyperStructure",
            types: ["u128", "u8", "u8", "bool", "u128", "u32"],
            customTypes: [],
          },
        },
      );
    })(),
    Inventory: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, items_key: RecsType.BigInt, items_count: RecsType.BigInt },
        {
          metadata: {
            name: "Inventory",
            types: ["u128", "felt252", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    Labor: (() => {
      return defineComponent(
        world,
        {
          entity_id: RecsType.BigInt,
          resource_type: RecsType.Number,
          balance: RecsType.Number,
          last_harvest: RecsType.Number,
          multiplier: RecsType.Number,
        },
        {
          metadata: {
            name: "Labor",
            types: ["u128", "u8", "u64", "u64", "u64"],
            customTypes: [],
          },
        },
      );
    })(),
    LaborAuction: (() => {
      return defineComponent(
        world,
        {
          zone: RecsType.Number,
          decay_constant_mag: RecsType.BigInt,
          decay_constant_sign: RecsType.Boolean,
          per_time_unit: RecsType.BigInt,
          start_time: RecsType.Number,
          sold: RecsType.BigInt,
          price_update_interval: RecsType.BigInt,
        },
        {
          metadata: {
            name: "LaborAuction",
            types: ["u8", "u128", "bool", "u128", "u64", "u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    Level: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, level: RecsType.Number, valid_until: RecsType.Number },
        {
          metadata: {
            name: "Level",
            types: ["u128", "u64", "u64"],
            customTypes: [],
          },
        },
      );
    })(),
    EntityMetadata: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, entity_type: RecsType.BigInt },
        {
          metadata: {
            name: "EntityMetadata",
            types: ["u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    ForeignKey: (() => {
      return defineComponent(
        world,
        { foreign_key: RecsType.BigInt, entity_id: RecsType.BigInt },
        {
          metadata: {
            name: "ForeignKey",
            types: ["felt252", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    ArrivalTime: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, arrives_at: RecsType.Number },
        {
          metadata: {
            name: "ArrivalTime",
            types: ["u128", "u64"],
            customTypes: [],
          },
        },
      );
    })(),
    Movable: (() => {
      return defineComponent(
        world,
        {
          entity_id: RecsType.BigInt,
          sec_per_km: RecsType.Number,
          blocked: RecsType.Boolean,
          round_trip: RecsType.Boolean,
          intermediate_coord_x: RecsType.Number,
          intermediate_coord_y: RecsType.Number,
        },
        {
          metadata: {
            name: "Movable",
            types: ["u128", "u16", "bool", "bool", "u32", "u32"],
            customTypes: [],
          },
        },
      );
    })(),
    AddressName: (() => {
      return defineComponent(
        world,
        { address: RecsType.BigInt, name: RecsType.BigInt },
        {
          metadata: {
            name: "AddressName",
            types: ["felt252", "felt252"],
            customTypes: [],
          },
        },
      );
    })(),
    EntityOwner: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, entity_owner_id: RecsType.BigInt },
        {
          metadata: {
            name: "EntityOwner",
            types: ["u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    Owner: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, address: RecsType.BigInt },
        {
          metadata: {
            name: "Owner",
            types: ["u128", "contractaddress"],
            customTypes: [],
          },
        },
      );
    })(),
    Position: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, x: RecsType.Number, y: RecsType.Number },
        {
          metadata: {
            name: "Position",
            types: ["u128", "u32", "u32"],
            customTypes: [],
          },
        },
      );
    })(),
    Quantity: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, value: RecsType.BigInt },
        {
          metadata: {
            name: "Quantity",
            types: ["u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    QuantityTracker: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, count: RecsType.BigInt },
        {
          metadata: {
            name: "QuantityTracker",
            types: ["felt252", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    Realm: (() => {
      return defineComponent(
        world,
        {
          entity_id: RecsType.BigInt,
          realm_id: RecsType.BigInt,
          resource_types_packed: RecsType.BigInt,
          resource_types_count: RecsType.Number,
          cities: RecsType.Number,
          harbors: RecsType.Number,
          rivers: RecsType.Number,
          regions: RecsType.Number,
          wonder: RecsType.Number,
          order: RecsType.Number,
          order_hyperstructure_id: RecsType.BigInt,
        },
        {
          metadata: {
            name: "Realm",
            types: ["u128", "u128", "u128", "u8", "u8", "u8", "u8", "u8", "u8", "u8", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    DetachedResource: (() => {
      return defineComponent(
        world,
        {
          entity_id: RecsType.BigInt,
          index: RecsType.Number,
          resource_type: RecsType.Number,
          resource_amount: RecsType.BigInt,
        },
        {
          metadata: {
            name: "DetachedResource",
            types: ["u128", "u32", "u8", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    Resource: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, resource_type: RecsType.Number, balance: RecsType.BigInt },
        {
          metadata: {
            name: "Resource",
            types: ["u128", "u8", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    ResourceAllowance: (() => {
      return defineComponent(
        world,
        {
          owner_entity_id: RecsType.BigInt,
          approved_entity_id: RecsType.BigInt,
          resource_type: RecsType.Number,
          amount: RecsType.BigInt,
        },
        {
          metadata: {
            name: "ResourceAllowance",
            types: ["u128", "u128", "u8", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    ResourceChest: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, locked_until: RecsType.Number, resources_count: RecsType.Number },
        {
          metadata: {
            name: "ResourceChest",
            types: ["u128", "u64", "u32"],
            customTypes: [],
          },
        },
      );
    })(),
    ResourceCost: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, index: RecsType.Number, resource_type: RecsType.Number, amount: RecsType.BigInt },
        {
          metadata: {
            name: "ResourceCost",
            types: ["u128", "u32", "u8", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    Road: (() => {
      return defineComponent(
        world,
        {
          start_coord_x: RecsType.Number,
          start_coord_y: RecsType.Number,
          end_coord_x: RecsType.Number,
          end_coord_y: RecsType.Number,
          usage_count: RecsType.Number,
        },
        {
          metadata: {
            name: "Road",
            types: ["u32", "u32", "u32", "u32", "u32"],
            customTypes: [],
          },
        },
      );
    })(),
    Status: (() => {
      return defineComponent(
        world,
        { trade_id: RecsType.BigInt, value: RecsType.BigInt },
        {
          metadata: {
            name: "Status",
            types: ["u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    Trade: (() => {
      return defineComponent(
        world,
        {
          trade_id: RecsType.BigInt,
          maker_id: RecsType.BigInt,
          maker_resource_chest_id: RecsType.BigInt,
          maker_transport_id: RecsType.BigInt,
          taker_id: RecsType.BigInt,
          taker_resource_chest_id: RecsType.BigInt,
          taker_transport_id: RecsType.BigInt,
          expires_at: RecsType.Number,
        },
        {
          metadata: {
            name: "Trade",
            types: ["u128", "u128", "u128", "u128", "u128", "u128", "u128", "u64"],
            customTypes: [],
          },
        },
      );
    })(),
    Weight: (() => {
      return defineComponent(
        world,
        { entity_id: RecsType.BigInt, value: RecsType.BigInt },
        {
          metadata: {
            name: "Weight",
            types: ["u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    Orders: (() => {
      return defineComponent(
        world,
        { order_id: RecsType.BigInt, hyperstructure_count: RecsType.BigInt },
        {
          metadata: {
            name: "Orders",
            types: ["u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
  };
}
