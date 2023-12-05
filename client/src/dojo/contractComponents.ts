/* Autogenerated file. Do not edit manually. */

import { defineComponent, Type as RecsType, World } from "@latticexyz/recs";

export function defineContractComponents(world: World) {
  return {
    Attack: (() => {
      const name = "Attack";
      return defineComponent(
        world,
        {
          value: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    Health: (() => {
      const name = "Health";
      return defineComponent(
        world,
        {
          value: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    Defence: (() => {
      const name = "Defence";
      return defineComponent(
        world,
        {
          value: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    TownWatch: (() => {
      const name = "TownWatch";
      return defineComponent(
        world,
        {
          town_watch_id: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    WorldConfig: (() => {
      const name = "WorldConfig";
      return defineComponent(
        world,
        {
          realm_l2_contract: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    LaborConfig: (() => {
      const name = "LaborConfig";
      return defineComponent(
        world,
        {
          base_labor_units: RecsType.Number,
          base_resources_per_cycle: RecsType.Number,
          base_food_per_cycle: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    TravelConfig: (() => {
      const name = "TravelConfig";
      return defineComponent(
        world,
        {
          free_transport_per_city: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    BuildingConfig: (() => {
      const name = "BuildingConfig";
      return defineComponent(
        world,
        {
          base_sqm: RecsType.Number,
          workhut_cost: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    BuildingCost: (() => {
      const name = "BuildingCost";
      return defineComponent(
        world,
        {
          resource_type: RecsType.Number,
          cost: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    BuildingTypeConfig: (() => {
      const name = "BuildingTypeConfig";
      return defineComponent(
        world,
        {
          id: RecsType.Number,
          sqm: RecsType.Number,
          resource_types_packed: RecsType.NumberArray,
          resource_types_count: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    LaborCostResources: (() => {
      const name = "LaborCostResources";
      return defineComponent(
        world,
        {
          resource_types_packed: RecsType.Number,
          resource_types_count: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    LaborCostAmount: (() => {
      const name = "LaborCostAmount";
      return defineComponent(
        world,
        {
          value: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    CapacityConfig: (() => {
      const name = "CapacityConfig";
      return defineComponent(
        world,
        {
          entity_type: RecsType.Number,
          weight_gram: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    SpeedConfig: (() => {
      const name = "SpeedConfig";
      return defineComponent(
        world,
        {
          entity_type: RecsType.Number,
          sec_per_km: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    WeightConfig: (() => {
      const name = "WeightConfig";
      return defineComponent(
        world,
        {
          entity_type: RecsType.Number,
          weight_gram: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    Weight: (() => {
      const name = "Weight";
      return defineComponent(
        world,
        {
          value: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    Age: (() => {
      const name = "Age";
      return defineComponent(
        world,
        {
          born_at: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    Position: (() => {
      const name = "Position";
      return defineComponent(
        world,
        {
          x: RecsType.Number,
          y: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    Realm: (() => {
      const name = "Realm";
      return defineComponent(
        world,
        {
          realm_id: RecsType.Number,
          resource_types_packed: RecsType.Number,
          resource_types_count: RecsType.Number,
          cities: RecsType.Number,
          harbors: RecsType.Number,
          rivers: RecsType.Number,
          regions: RecsType.Number,
          wonder: RecsType.Number,
          order: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    Resource: (() => {
      const name = "Resource";
      return defineComponent(
        world,
        {
          balance: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    Labor: (() => {
      const name = "Labor";
      return defineComponent(
        world,
        {
          balance: RecsType.Number,
          last_harvest: RecsType.Number,
          multiplier: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    Owner: (() => {
      const name = "Owner";
      return defineComponent(
        world,
        {
          address: RecsType.String,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    EntityOwner: (() => {
      const name = "EntityOwner";
      return defineComponent(
        world,
        {
          entity_owner_id: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    Capacity: (() => {
      const name = "Capacity";
      return defineComponent(
        world,
        {
          weight_gram: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    Movable: (() => {
      const name = "Movable";
      return defineComponent(
        world,
        {
          sec_per_km: RecsType.Number,
          blocked: RecsType.Boolean,
          round_trip: RecsType.Boolean,
          intermediate_coord_x: RecsType.Number,
          intermediate_coord_y: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    Inventory: (() => {
      const name = "Inventory";
      return defineComponent(
        world,
        {
          items_key: RecsType.Number,
          items_count: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    ResourceChest: (() => {
      const name = "ResourceChest";
      return defineComponent(
        world,
        {
          locked_until: RecsType.Number,
          resources_count: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    DetachedResource: (() => {
      const name = "DetachedResource";
      return defineComponent(
        world,
        {
          resource_type: RecsType.Number,
          resource_amount: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    ArrivalTime: (() => {
      const name = "ArrivalTime";
      return defineComponent(
        world,
        {
          arrives_at: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    Quantity: (() => {
      const name = "Quantity";
      return defineComponent(
        world,
        {
          value: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    QuantityTracker: (() => {
      const name = "QuantityTracker";
      return defineComponent(
        world,
        {
          count: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    EntityMetadata: (() => {
      const name = "EntityMetadata";
      return defineComponent(
        world,
        {
          entity_type: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    ForeignKey: (() => {
      const name = "ForeignKey";
      return defineComponent(
        world,
        {
          entity_id: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    CaravanMembers: (() => {
      const name = "CaravanMembers";
      return defineComponent(
        world,
        {
          key: RecsType.Number,
          count: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    Trade: (() => {
      const name = "Trade";
      return defineComponent(
        world,
        {
          trade_id: RecsType.Number,
          maker_id: RecsType.Number,
          maker_resource_chest_id: RecsType.Number,
          maker_transport_id: RecsType.Number,
          taker_id: RecsType.Number,
          taker_resource_chest_id: RecsType.Number,
          taker_transport_id: RecsType.Number,
          expires_at: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    Status: (() => {
      const name = "Status";
      return defineComponent(
        world,
        {
          value: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    Road: (() => {
      const name = "Road";
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
            name: name,
          },
        },
      );
    })(),
    ResourceCost: (() => {
      const name = "ResourceCost";
      return defineComponent(
        world,
        {
          resource_type: RecsType.Number,
          amount: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    HyperStructure: (() => {
      const name = "HyperStructure";
      return defineComponent(
        world,
        {
          hyperstructure_type: RecsType.Number,
          order: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    LaborAuction: (() => {
      const name = "LaborAuction";
      return defineComponent(
        world,
        {
          zone: RecsType.Number,
          decay_constant_mag: RecsType.Number,
          decay_constant_sign: RecsType.Boolean,
          per_time_unit: RecsType.Number,
          start_time: RecsType.Number,
          sold: RecsType.Number,
          price_update_interval: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    Level: (() => {
      const name = "Level";
      return defineComponent(
        world,
        {
          level: RecsType.Number,
          valid_until: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    AddressName: (() => {
      const name = "AddressName";
      return defineComponent(
        world,
        {
          name: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    Bank: (() => {
      const name = "Bank";
      return defineComponent(
        world,
        {
          exists: RecsType.Boolean,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
    BankAuction: (() => {
      const name = "BankAuction";
      return defineComponent(
        world,
        {
          decay_constant_mag: RecsType.Number,
          decay_constant_sign: RecsType.Boolean,
          per_time_unit: RecsType.Number,
          start_time: RecsType.Number,
          sold: RecsType.Number,
          price_update_interval: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        },
      );
    })(),
  };
}
