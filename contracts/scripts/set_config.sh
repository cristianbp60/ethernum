#!/bin/bash

source ./scripts/contracts.sh

export RESOURCE_PRECSION=1000

export RESOURCE_AMOUNT_PER_TICK=1000
export FOOD_PER_TICK=10000
export DONKEYS_PER_TICK=10
export KNIGHTS_PER_TICK=2
export CROSSBOWMEN_PER_TICK=2
export PALADIN_PER_TICK=2

export MAX_MOVE_PER_TICK=3
export TICK_INTERVAL_IN_SECONDS=900

export EXPLORATION_WHEAT_BURN_AMOUNT=300000
export EXPLORATION_FISH_BURN_AMOUNT=150000
export EXPLORATION_REWARD_RESOURCE_AMOUNT=20000


## set bank config
commands+=(
    # owner cost in lords
    # lp fees
    "sozo execute $CONFIG_SYSTEMS set_bank_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata 100000,0"
)

## set tick config
commands+=(
    # max_moves_per_tick = 3
    # tick_interval_in_seconds = 900
    "sozo execute $CONFIG_SYSTEMS set_tick_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $MAX_MOVE_PER_TICK,$TICK_INTERVAL_IN_SECONDS"
)

## set exploration config
commands+=(
    # wheat_burn_amount = 300000
    # fish_burn_amount = 150000
    # reward_resource_amount = 20000
    "sozo execute $CONFIG_SYSTEMS set_exploration_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $EXPLORATION_WHEAT_BURN_AMOUNT,$EXPLORATION_FISH_BURN_AMOUNT,$EXPLORATION_REWARD_RESOURCE_AMOUNT"
)

commands+=(
    ### WORLD ###
    # realm_l2_contract
    "sozo execute $CONFIG_SYSTEMS set_world_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $DOJO_ACCOUNT_ADDRESS,0"

    # ### SPEED ###
    # # entity type FREE_TRANSPORT_ENTITY_TYPE = 256
    # # 360 sec per km = 10km/h
    "sozo execute $CONFIG_SYSTEMS set_speed_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata 256,360"

    # ### TRAVEL ###
    # # free transport per city = 10 (for testing);
    "sozo execute $CONFIG_SYSTEMS set_travel_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata 10"

    # ### CAPACITY ###
    # # entity type FREE_TRANSPORT_ENTITY_TYPE = 256
    # # 100000 gr = 100 kg
    "sozo execute $CONFIG_SYSTEMS set_capacity_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata 256,$((100000 * $RESOURCE_PRECSION))"

    # ### ROAD ###
    # # 10 wheat, fish, stone and wood per road usage
    # # speed up transit by 2x = 2
    "sozo execute $CONFIG_SYSTEMS set_road_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata 4,1,10000,2,10000,254,10000,255,10000,2"
)


### WEIGHT ###
# Loop for resource types 1 to 28
for resource_type in {1..28}
do
    commands+=(
        # 1kg/1000 g per resource unit (resource precision = 1000)
        "sozo execute $CONFIG_SYSTEMS set_weight_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $resource_type,1000"
    )
done

commands+=(
    # Resource type 253
    # 1 gr per unit
    "sozo execute $CONFIG_SYSTEMS set_weight_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata 253,1"
    # Resource type 254
    # 0.1 kg/ 100 gr per unit
    "sozo execute $CONFIG_SYSTEMS set_weight_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata 254,100"
    # Resource type 255
    # 0.1 kg/ 100 gr per unit
    "sozo execute $CONFIG_SYSTEMS set_weight_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata 255,100"
)



commands+=(
    # resourceId: 1
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $WOOD,$RESOURCE_AMOUNT_PER_TICK,2,$STONE,150,$COAL,160"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $STONE,$RESOURCE_AMOUNT_PER_TICK,2,$WOOD,250,$COAL,190"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $COAL,$RESOURCE_AMOUNT_PER_TICK,2,$STONE,210,$COPPER,140"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $COPPER,$RESOURCE_AMOUNT_PER_TICK,2,$COAL,290,$OBSIDIAN,170"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $OBSIDIAN,$RESOURCE_AMOUNT_PER_TICK,2,$COPPER,240,$SILVER,160"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $SILVER,$RESOURCE_AMOUNT_PER_TICK,2,$OBSIDIAN,250,$IRONWOOD,140"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $IRONWOOD,$RESOURCE_AMOUNT_PER_TICK,2,$SILVER,300,$COLDIRON,160"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $COLDIRON,$RESOURCE_AMOUNT_PER_TICK,2,$IRONWOOD,250,$GOLD,190"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $GOLD,$RESOURCE_AMOUNT_PER_TICK,2,$COLDIRON,210,$HARTWOOD,130"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $HARTWOOD,$RESOURCE_AMOUNT_PER_TICK,2,$GOLD,310,$DIAMONDS,100"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $DIAMONDS,$RESOURCE_AMOUNT_PER_TICK,2,$HARTWOOD,400,$SAPPHIRE,160"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $SAPPHIRE,$RESOURCE_AMOUNT_PER_TICK,2,$DIAMONDS,240,$RUBY,190"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $RUBY,$RESOURCE_AMOUNT_PER_TICK,2,$SAPPHIRE,210,$DEEPCRYSTAL,200"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $DEEPCRYSTAL,$RESOURCE_AMOUNT_PER_TICK,2,$RUBY,200,$IGNIUM,140"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $IGNIUM,$RESOURCE_AMOUNT_PER_TICK,2,$DEEPCRYSTAL,280,$ETHEREALSILICA,190"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $ETHEREALSILICA,$RESOURCE_AMOUNT_PER_TICK,2,$IGNIUM,210,$TRUEICE,170"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $TRUEICE,$RESOURCE_AMOUNT_PER_TICK,2,$ETHEREALSILICA,230,$TWILIGHTQUARTZ,160"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $TWILIGHTQUARTZ,$RESOURCE_AMOUNT_PER_TICK,2,$TRUEICE,250,$ALCHEMICALSILVER,170"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $ALCHEMICALSILVER,$RESOURCE_AMOUNT_PER_TICK,2,$TWILIGHTQUARTZ,240,$ADAMANTINE,120"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $ADAMANTINE,$RESOURCE_AMOUNT_PER_TICK,2,$ALCHEMICALSILVER,340,$MITHRAL,130"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $MITHRAL,$RESOURCE_AMOUNT_PER_TICK,2,$ADAMANTINE,300,$DRAGONHIDE,120"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $DRAGONHIDE,$RESOURCE_AMOUNT_PER_TICK,2,$MITHRAL,320,$WOOD,43610"

    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $DONKEY,$DONKEYS_PER_TICK,1,$WHEAT,250"

    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $KNIGHT,$KNIGHTS_PER_TICK,3,$WHEAT,250,$SILVER,10,$IRONWOOD,25"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $CROSSBOWMEN,$CROSSBOWMEN_PER_TICK,3,$WHEAT,250,$SILVER,10,$COLDIRON,25"  
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $PALADIN,$PALADIN_PER_TICK,3,$WHEAT,250,$SILVER,10,$GOLD,25"

    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $WHEAT,$FOOD_PER_TICK,0"
    "sozo execute $CONFIG_SYSTEMS set_production_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata $FISH,$FOOD_PER_TICK,0"
)


# Initialize variables
mode=""
delay=0

# Function to show usage
usage() {
    echo "Usage: $0 --mode [prod|dev] [--interval delay]"
    echo "  --mode: Specify the environment mode (prod or dev)."
    echo "  --interval: Specify a delay in seconds between each command."
    exit 1
}

# Check if at least one argument is provided
if [ $# -eq 0 ]; then
    usage
fi

# Parse command-line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --mode)
            if [ -n "$2" ] && [ ${2:0:1} != "-" ]; then
                mode=$2
                shift 2
            else
                echo "Error: --mode requires an argument (prod or dev)."
                usage
            fi
            ;;
        --interval)
            if [ -n "$2" ] && [ ${2:0:1} != "-" ]; then
                delay=$2
                shift 2
            else
                echo "Error: --interval requires a numeric argument."
                usage
            fi
            ;;
        *)
            usage
            ;;
    esac
done

# Validate mode
if [ "$mode" != "prod" ] && [ "$mode" != "dev" ]; then
    echo "Error: Invalid mode specified. Please use prod or dev."
    usage
fi

# Initialize commands based on mode
if [[ "$mode" == "prod" ]]; then
    commands+=(
        "sozo execute $CONFIG_SYSTEMS set_mint_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata 25,1,378000,2,297049,3,288908,4,199213,5,167029,6,131226,7,88866,8,72133,9,68892,10,44772,11,22612,12,18618,13,18015,14,18015,15,12965,16,12211,17,10477,18,8367,19,7010,20,4146,21,2789,22,1734,249,200000,254,12474000,255,4158000"
    )
else
    # commands+=(
    #     "sozo execute $CONFIG_SYSTEMS set_mint_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata 25,1,0,2,0,3,0,4,0,5,0,6,0,7,0,8,0,9,0,10,0,11,0,12,0,13,0,14,0,15,0,16,0,17,0,18,0,19,0,20,0,21,0,22,0,253,0,254,0,255,0"
    # )
    commands+=(
        "sozo execute $CONFIG_SYSTEMS set_mint_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata 29,1,200000,2,200000,3,200000,4,200000,5,200000,6,200000,7,200000,8,200000,9,200000,10,200000,11,200000,12,200000,13,200000,14,200000,15,200000,16,200000,17,200000,18,200000,19,200000,20,200000,21,200000,22,200000,249,200000,250,200000,251,200000,252,200000,253,200000,254,200000,255,200000"
        # set donkey speed at highest for dev
        # 1 sec per km
        "sozo execute $CONFIG_SYSTEMS set_speed_config --account-address $DOJO_ACCOUNT_ADDRESS --calldata 256,1"
    )
fi

for cmd in "${commands[@]}"; do
    echo "Executing command: $cmd"
    output=$(eval "$cmd")
    echo "Output:"
    echo "$output"
    echo "--------------------------------------"

    if [ $(echo "$delay > 0" | bc -l) -eq 1 ]; then
        echo "Sleeping for $delay seconds..."
        sleep $delay
    fi
done

./scripts/set_writer.sh --interval $delay