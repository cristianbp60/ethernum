// External imports

use cubit::f128::types::fixed::{Fixed, FixedTrait};

// Constants

const SCALING_FACTOR: u128 = 10000;

#[derive(Model, Copy, Drop, Serde)]
struct Market {
    #[key]
    bank_entity_id: u128,
    #[key]
    resource_type: u8,
    lords_amount: u128,
    resource_amount: u128,
}

#[generate_trait]
impl MarketImpl of MarketTrait {
    fn buy(self: @Market, quantity: u128) -> u128 {
        assert(quantity < *self.resource_amount, 'not enough liquidity');
        let (quantity, available, cash) = normalize(quantity, self);
        let k = cash * available;
        let cost = (k / (available - quantity)) - cash;
        cost
    }

    fn sell(self: @Market, quantity: u128) -> u128 {
        let (quantity, available, cash) = normalize(quantity, self);
        let k = cash * available;
        let payout = cash - (k / (available + quantity));
        payout
    }

    // Get normalized reserve cash amount and item quantity
    fn get_reserves(self: @Market) -> (u128, u128) {
        let reserve_quantity: u128 = (*self.resource_amount).into() * SCALING_FACTOR;
        (*self.lords_amount, reserve_quantity)
    }

    // Get the liquidity of the market
    // Use cubit fixed point math library to compute the square root of the product of the reserves
    fn liquidity(self: @Market) -> Fixed {
        // Get normalized reserve cash amount and item quantity
        let (reserve_amount, reserve_quantity) = self.get_reserves();

        // Convert reserve amount to fixed point
        let reserve_amount = FixedTrait::new_unscaled(reserve_amount, false);
        let reserve_quantity = FixedTrait::new_unscaled(reserve_quantity, false);

        // L = sqrt(X * Y)
        (reserve_amount * reserve_quantity).sqrt()
    }

    // Check if the market has liquidity
    fn has_liquidity(self: @Market) -> bool {
        *self.lords_amount > 0 || *self.resource_amount > 0
    }

    // Given some amount of cash, return the equivalent/optimal quantity of items
    // based on the reserves in the market
    fn quote_quantity(self: @Market, amount: u128) -> u128 {
        assert(amount > 0, 'insufficient amount');
        assert(self.has_liquidity(), 'insufficient liquidity');

        // Get normalized reserve cash amount and item quantity
        let (reserve_amount, reserve_quantity) = self.get_reserves();

        // Convert amount to fixed point
        let amount = FixedTrait::new_unscaled(amount, false);

        // Convert reserve amount and quantity to fixed point
        let reserve_amount = FixedTrait::new_unscaled(reserve_amount, false);
        let reserve_quantity = FixedTrait::new_unscaled(reserve_quantity, false);

        // dy = Y * dx / X
        let quantity_optimal = (reserve_quantity * amount) / reserve_amount;

        // Convert from fixed point to u128
        let res: u128 = quantity_optimal.try_into().unwrap();
        res
    }

    // Given some quantity of items, return the equivalent/optimal amount of cash
    // based on the reserves in the market
    fn quote_amount(self: @Market, quantity: u128) -> u128 {
        assert(quantity > 0, 'insufficient quantity');
        assert(self.has_liquidity(), 'insufficient liquidity');

        // Get normalized reserve cash amount and item quantity
        let (reserve_amount, reserve_quantity) = self.get_reserves();

        // Convert reserve amount and quantity to fixed point
        let reserve_amount = FixedTrait::new_unscaled(reserve_amount, false);
        let reserve_quantity = FixedTrait::new_unscaled(reserve_quantity, false);

        // Normalize quantity
        let quantity: u128 = quantity.into() * SCALING_FACTOR;

        // Convert quantity to fixed point
        let quantity = FixedTrait::new_unscaled(quantity, false);

        // dx = X * dy / Y
        let amount_optimal = (reserve_amount * quantity) / reserve_quantity;

        // Convert from fixed point to u128
        amount_optimal.try_into().unwrap()
    }

    // Inner function to add liquidity to the market, computes the optimal amount and quantity
    //
    // Arguments:
    //
    // amount: The amount of cash to add to the market
    // quantity: The quantity of items to add to the market
    //
    // Returns:
    //
    // (amount, quantity): The amount of cash and quantity of items added to the market
    fn add_liquidity_inner(self: @Market, amount: u128, quantity: u128) -> (u128, u128) {
        // If there is no liquidity, then the amount and quantity are the optimal
        if !self.has_liquidity() {
            // Ensure that the amount and quantity are greater than zero
            assert(amount > 0, 'insufficient amount');
            assert(quantity > 0, 'insufficient quantity');
            (amount, quantity)
        } else {
            // Given the amount, get optimal quantity to add to the market
            let quantity_optimal = self.quote_quantity(amount);
            if quantity_optimal <= quantity {
                // Add the given amount and optimal quantity to the market
                (amount, quantity_optimal)
            } else {
                let amount_optimal = self.quote_amount(quantity);
                // Ensure that the optimal amount is less than or equal to the given amount
                assert(amount_optimal <= amount, 'insufficient amount');
                (amount_optimal, quantity)
            }
        }
    }

    // Add liquidity to the market, mints shares for the given amount of liquidity provided
    //
    // Arguments:
    //
    // amount: The amount of cash to add to the market
    // quantity: The quantity of items to add to the market
    //
    // Returns:
    //
    // (amount, quantity, shares): The amount of cash and quantity of items added to the market and the shares minted
    fn add_liquidity(self: @Market, amount: u128, quantity: u128) -> (u128, u128, Fixed) {
        // Compute the amount and quantity to add to the market
        let (amount, quantity) = self.add_liquidity_inner(amount, quantity);
        // Mint shares for the given amount of liquidity provided
        let shares = self.mint_shares(amount, quantity);
        (amount, quantity, shares)
    }

    // Mint shares for the given amount of liquidity provided
    fn mint_shares(self: @Market, amount: u128, quantity: u128) -> Fixed {
        // If there is no liquidity, then mint total shares
        if !self.has_liquidity() {
            let quantity: u128 = quantity.into() * SCALING_FACTOR;
            (FixedTrait::new_unscaled(amount, false) * FixedTrait::new_unscaled(quantity, false))
                .sqrt()
        } else {
            // Convert amount to fixed point
            let amount = FixedTrait::new_unscaled(amount, false);

            // Get normalized reserve cash amount and item quantity
            let (reserve_amount, _) = self.get_reserves();

            // Convert reserve amount to fixed point
            let reserve_amount = FixedTrait::new_unscaled(reserve_amount, false);

            // Get total liquidity
            let liquidity = self.liquidity();

            // Compute the amount of shares to mint
            // S = dx * L/X = dy * L/Y
            (amount * liquidity) / reserve_amount
        }
    }

    // Remove liquidity from the market, return the corresponding amount and quantity payout
    //
    // Arguments:
    //
    // shares: The amount of liquidity shares to remove from the market
    //
    // Returns:
    //
    // (amount, quantity): The amount of cash and quantity of items removed from the market
    fn remove_liquidity(self: @Market, shares: Fixed) -> (u128, u128) {
        // Ensure that the market has liquidity
        let liquidity = self.liquidity();
        assert(shares <= liquidity, 'insufficient liquidity');

        // Get normalized reserve cash amount and item quantity
        let (reserve_amount, reserve_quantity) = self.get_reserves();

        // Convert reserve amount and quantity to fixed point
        let reserve_amount = FixedTrait::new_unscaled(reserve_amount, false);
        let reserve_quantity = FixedTrait::new_unscaled(reserve_quantity, false);

        // Compute the amount and quantity to remove from the market
        // dx = S * X / L
        let amount = (shares * reserve_amount) / liquidity;
        // dy = S * Y / L
        let quantity = (shares * reserve_quantity) / liquidity;

        // Convert amount and quantity both from fixed point to u128 and unscaled u128, respectively
        (amount.try_into().unwrap(), quantity.try_into().unwrap() / SCALING_FACTOR)
    }
}

fn normalize(quantity: u128, market: @Market) -> (u128, u128, u128) {
    let quantity: u128 = quantity.into() * SCALING_FACTOR;
    let available: u128 = (*market.resource_amount).into() * SCALING_FACTOR;
    (quantity, available, *market.lords_amount)
}

#[cfg(test)]
mod tests {
    // Local imports

    use super::{Market, MarketTrait, SCALING_FACTOR};
    use super::{Fixed, FixedTrait};

    // Constants

    const TOLERANCE: u128 = 18446744073709550; // 0.001

    // Helpers

    fn assert_approx_equal(expected: Fixed, actual: Fixed, tolerance: u128) {
        let left_bound = expected - FixedTrait::new(tolerance, false);
        let right_bound = expected + FixedTrait::new(tolerance, false);
        assert(left_bound <= actual && actual <= right_bound, 'Not approx eq');
    }

    #[test]
    #[should_panic(expected: ('not enough liquidity',))]
    fn test_market_not_enough_quantity() {
        let market = Market {
            bank_entity_id: 1,
            resource_type: 1,
            lords_amount: SCALING_FACTOR * 1,
            resource_amount: 1
        }; // pool 1:1
        let _cost = market.buy(10);
    }

    #[test]
    fn test_market_buy() {
        let market = Market {
            bank_entity_id: 1,
            resource_type: 1,
            lords_amount: SCALING_FACTOR * 1,
            resource_amount: 10
        }; // pool 1:10
        let cost = market.buy(5);
        assert(cost == SCALING_FACTOR * 1, 'wrong cost');
    }

    #[test]
    fn test_market_sell() {
        let market = Market {
            bank_entity_id: 1,
            resource_type: 1,
            lords_amount: SCALING_FACTOR * 1,
            resource_amount: 10
        }; // pool 1:10
        let payout = market.sell(5);
        assert(payout == 3334, 'wrong payout');
    }

    #[test]
    fn test_market_add_liquidity_no_initial() {
        // Without initial liquidity
        let market = Market {
            bank_entity_id: 1, resource_type: 1, lords_amount: 0, resource_amount: 0
        };

        // Add liquidity
        let (amount, quantity) = (SCALING_FACTOR * 5, 5); // pool 1:1
        let (amount_add, quantity_add, liquidity_add) = market.add_liquidity(amount, quantity);

        // Assert that the amount and quantity added are the same as the given amount and quantity
        // and that the liquidity shares minted are the same as the entire liquidity
        assert(amount_add == amount, 'wrong cash amount');
        assert(quantity_add == quantity, 'wrong item quantity');

        // Convert amount and quantity to fixed point
        let amount = FixedTrait::new_unscaled(amount, false);
        let quantity: u128 = quantity.into() * SCALING_FACTOR;
        let quantity = FixedTrait::new_unscaled(quantity, false);
        assert(liquidity_add == (amount * quantity).sqrt(), 'wrong liquidity');
    }

    #[test]
    fn test_market_add_liquidity_optimal() {
        // With initial liquidity
        let market = Market {
            bank_entity_id: 1,
            resource_type: 1,
            lords_amount: SCALING_FACTOR * 1,
            resource_amount: 10
        }; // pool 1:10
        let initial_liquidity = market.liquidity();

        // Add liquidity with the same ratio
        let (amount, quantity) = (SCALING_FACTOR * 2, 20); // pool 1:10
        let (amount_add, quantity_add, liquidity_add) = market.add_liquidity(amount, quantity);

        // Assert 
        assert(amount_add == amount, 'wrong cash amount');
        assert(quantity_add == quantity, 'wrong item quantity');

        // Get expected amount and convert to fixed point
        let expected_amount = FixedTrait::new_unscaled(SCALING_FACTOR * 1 + amount, false);
        let expected_quantity: u128 = (10 + quantity).into() * SCALING_FACTOR;
        let expected_quantity = FixedTrait::new_unscaled(expected_quantity, false);

        // Compute the expected liquidity shares
        let expected_liquidity = FixedTrait::sqrt(expected_amount * expected_quantity);
        let final_liquidity = initial_liquidity + liquidity_add;
        assert_approx_equal(expected_liquidity, final_liquidity, TOLERANCE);
    }

    #[test]
    fn test_market_add_liquidity_not_optimal() {
        // With initial liquidity
        let market = Market {
            bank_entity_id: 1,
            resource_type: 1,
            lords_amount: SCALING_FACTOR * 1,
            resource_amount: 10
        }; // pool 1:10
        let initial_liquidity = market.liquidity();

        // Add liquidity without the same ratio
        let (amount, quantity) = (SCALING_FACTOR * 2, 10); // pool 1:5

        let (amount_add, quantity_add, liquidity_add) = market.add_liquidity(amount, quantity);

        // Assert that the amount added is optimal even though the
        // amount originally requested was not
        let amount_optimal = SCALING_FACTOR * 1;
        assert(amount_add == amount_optimal, 'wrong cash amount');
        assert(quantity_add == quantity, 'wrong item quantity');

        // Get expected amount and convert to fixed point
        let expected_amount = FixedTrait::new_unscaled(SCALING_FACTOR * 1 + amount_add, false);
        let expected_quantity: u128 = (10 + quantity).into() * SCALING_FACTOR;
        let expected_quantity = FixedTrait::new_unscaled(expected_quantity, false);

        // Get expecteed liquidity
        let _expected_liquidity = FixedTrait::sqrt(expected_amount * expected_quantity);

        let _final_liquidity = initial_liquidity + liquidity_add;
    // assert_precise(expected_liquidity, final_liquidity.into(), 'wrong liquidity', Option::None(()));
    }

    #[test]
    #[should_panic(expected: ('insufficient amount',))]
    fn test_market_add_liquidity_insufficient_amount() {
        let market = Market {
            bank_entity_id: 1,
            resource_type: 1,
            lords_amount: SCALING_FACTOR * 1,
            resource_amount: 10
        }; // pool 1:10
        // Adding 20 items requires (SCALING_FACTOR * 2) cash amount to maintain the ratio
        // Therefore this should fail
        let (_amount_add, _quantity_add, _liquidity_add) = market
            .add_liquidity(SCALING_FACTOR * 1, 20);
    }

    #[test]
    fn test_market_remove_liquidity() {
        // With initial liquidity
        let market = Market {
            bank_entity_id: 1,
            resource_type: 1,
            lords_amount: SCALING_FACTOR * 2,
            resource_amount: 20
        }; // pool 1:10
        let initial_liquidity = market.liquidity();

        // Remove half of the liquidity
        let two = FixedTrait::new_unscaled(2, false);
        let liquidity_remove = initial_liquidity / two;

        let (amount_remove, quantity_remove) = market.remove_liquidity(liquidity_remove);

        // Assert that the amount and quantity removed are half of the initial amount and quantity
        assert(amount_remove == SCALING_FACTOR * 1, 'wrong cash amount');
        assert(quantity_remove == 10, 'wrong item quantity');

        // Get expected amount and convert to fixed point
        let expected_amount = FixedTrait::new_unscaled(SCALING_FACTOR * 2 - amount_remove, false);
        let expected_quantity: u128 = (20 - quantity_remove).into() * SCALING_FACTOR;
        let expected_quantity = FixedTrait::new_unscaled(expected_quantity, false);

        // Get expecteed liquidity
        let _expected_liquidity = FixedTrait::sqrt(expected_amount * expected_quantity);

        let _final_liquidity = initial_liquidity - liquidity_remove;
    // assert_precise(expected_liquidity, final_liquidity.into(), 'wrong liquidity', Option::None(()));
    }

    #[test]
    #[should_panic(expected: ('insufficient liquidity',))]
    fn test_market_remove_liquidity_no_initial() {
        // Without initial liquidity
        let market = Market {
            bank_entity_id: 1, resource_type: 1, lords_amount: 0, resource_amount: 0
        }; // pool 1:10

        // Remove liquidity
        let one = FixedTrait::new_unscaled(1, false);

        let (_amount_remove, _quantity_remove) = market.remove_liquidity(one);
    }

    #[test]
    #[should_panic(expected: ('insufficient liquidity',))]
    fn test_market_remove_liquidity_more_than_available() {
        // With initial liquidity
        let market = Market {
            bank_entity_id: 1,
            resource_type: 1,
            lords_amount: SCALING_FACTOR * 2,
            resource_amount: 20
        }; // pool 1:10
        let initial_liquidity = market.liquidity();

        // Remove twice of the liquidity
        let two = FixedTrait::new_unscaled(2, false);
        let liquidity_remove = initial_liquidity * two;

        let (_amount_remove, _quantity_remove) = market.remove_liquidity(liquidity_remove);
    }
}
