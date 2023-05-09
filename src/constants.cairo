// Config ID to fetch world config
const WORLD_CONFIG_ID: felt252 = 999999999999999999;
const BUILDING_CONFIG_ID: felt252 = 999999999999999998;
const LABOR_CONFIG_ID: felt252 = 999999999999999997;

// 8 bits
const RESOURCE_IDS_PACKED_SIZE: usize = 8_usize;

// prime 
const PRIME: felt252 = 3618502788666131213697322783095070105623107215331596699973092056135872020480;

mod ResourceIds {
    const WOOD: u8 = 1;
    const STONE: u8 = 2;
    const COAL: u8 = 3;
    const COPPER: u8 = 4;
    const OBSIDIAN: u8 = 5;
    const SILVER: u8 = 6;
    const IRONWOOD: u8 = 7;
    const COLD_IRON: u8 = 8;
    const GOLD: u8 = 9;
    const HARTWOOD: u8 = 10;
    const DIAMONDS: u8 = 11;
    const SAPPHIRE: u8 = 12;
    const RUBY: u8 = 13;
    const DEEP_CRYSTAL: u8 = 14;
    const IGNIUM: u8 = 15;
    const ETHEREAL_SILICA: u8 = 16;
    const TRUE_ICE: u8 = 17;
    const TWILIGHT_QUARTZ: u8 = 18;
    const ALCHEMICAL_SILVER: u8 = 19;
    const ADAMANTINE: u8 = 20;
    const MITHRAL: u8 = 21;
    const DRAGONHIDE: u8 = 22;
    const DESERT_GLASS: u8 = 23;
    const DIVINE_CLOTH: u8 = 24;
    const CURIOUS_SPORE: u8 = 25;
    const UNREFINED_ORE: u8 = 26;
    const SUNKEN_SHEKEL: u8 = 27;
    const DEMONHIDE: u8 = 28;
    const WHEAT: u128 = 10000;
    const FISH: u128 = 10001;
}


// problem1: no implementation of the PartialEq trait for enums
// problem2: match of enum need to use all arms for now
// enum ResourceIds {
//     Wood: (),
//     Stone: (),
//     Coal: (),
//     Copper: (),
//     Obsidian: (),
//     Silver: (),
//     Ironwood: (),
//     ColdIron: (),
//     Gold: (),
//     Hartwood: (),
//     Diamonds: (),
//     Sapphire: (),
//     Ruby: (),
//     DeepCrystal: (),
//     Ignium: (),
//     EtherealSilica: (),
//     TrueIce: (),
//     TwilightQuartz: (),
//     AlchemicalSilver: (),
//     Adamantine: (),
//     Mithral: (),
//     Dragonhide: (),
//     DesertGlass: (),
//     DivineCloth: (),
//     CuriousSpore: (),
//     UnrefinedOre: (),
//     SunkenShekel: (),
//     Demonhide: (),
//     Wheat: (),
//     Fish: (),
// }

enum BuildingIds {
    HOUSE: u8,
    STORE_HOUSE: u8,
    GRANARY: u8,
    FARM: u8,
    FISHING_VILLAGE: u8,
    BARACKS: u8,
    MAGE_TOWER: u8,
    ARCHER_TOWER: u8,
    CASTLE: u8,
}
