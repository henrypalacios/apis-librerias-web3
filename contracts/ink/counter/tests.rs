#![cfg(test)]
use ink_lang as ink;

#[cfg(test)]
mod tests {
    use super::counter::Counter;

    #[ink::test]
    fn default_works() {
        let counter = Counter::default();
        assert_eq!(counter.get(), 0);
    }

    #[ink::test]
    fn new_works() {
        let counter = Counter::new(42);
        assert_eq!(counter.get(), 42);
    }

    #[ink::test]
    fn increment_works() {
        let mut counter = Counter::new(0);
        counter.inc();
        assert_eq!(counter.get(), 1);
    }

    #[ink::test]
    fn decrement_works() {
        let mut counter = Counter::new(1);
        counter.dec();
        assert_eq!(counter.get(), 0);
    }

    #[ink::test]
    fn reset_works() {
        let mut counter = Counter::new(42);
        counter.reset();
        assert_eq!(counter.get(), 0);
    }

    #[ink::test]
    fn increment_overflow_works() {
        let mut counter = Counter::new(u32::MAX);
        counter.inc();
        assert_eq!(counter.get(), u32::MAX);
    }

    #[ink::test]
    fn decrement_underflow_works() {
        let mut counter = Counter::new(0);
        counter.dec();
        assert_eq!(counter.get(), 0);
    }
}

#[cfg(all(test, feature = "e2e-tests"))]
mod e2e_tests {
    use ink_e2e::build_message;

    type E2EResult<T> = std::result::Result<T, Box<dyn std::error::Error>>;

    #[ink_e2e::test]
    async fn e2e_increment(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
        // Dado: Un contrato Counter desplegado
        let constructor = CounterRef::default();
        let contract_id = client
            .instantiate("counter", &ink_e2e::alice(), constructor, 0, None)
            .await
            .expect("instantiate failed")
            .account_id;

        // Cuando: Llamamos a la función increment
        let increment = build_message::<CounterRef>(contract_id.clone())
            .call(|counter| counter.inc());
        client.call(&ink_e2e::alice(), increment, 0, None).await?;

        // Entonces: El valor del contador debe ser 1
        let get = build_message::<CounterRef>(contract_id.clone())
            .call(|counter| counter.get());
        let get_result = client.call_dry_run(&ink_e2e::alice(), &get, 0, None).await;
        assert_eq!(get_result.return_value(), 1);

        Ok(())
    }

    #[ink_e2e::test]
    async fn e2e_decrement(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
        // Dado: Un contrato Counter desplegado con valor inicial 1
        let constructor = CounterRef::new(1);
        let contract_id = client
            .instantiate("counter", &ink_e2e::alice(), constructor, 0, None)
            .await
            .expect("instantiate failed")
            .account_id;

        // Cuando: Llamamos a la función decrement
        let decrement = build_message::<CounterRef>(contract_id.clone())
            .call(|counter| counter.dec());
        client.call(&ink_e2e::alice(), decrement, 0, None).await?;

        // Entonces: El valor del contador debe ser 0
        let get = build_message::<CounterRef>(contract_id.clone())
            .call(|counter| counter.get());
        let get_result = client.call_dry_run(&ink_e2e::alice(), &get, 0, None).await;
        assert_eq!(get_result.return_value(), 0);

        Ok(())
    }

    #[ink_e2e::test]
    async fn e2e_reset(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
        // Dado: Un contrato Counter desplegado con valor inicial 42
        let constructor = CounterRef::new(42);
        let contract_id = client
            .instantiate("counter", &ink_e2e::alice(), constructor, 0, None)
            .await
            .expect("instantiate failed")
            .account_id;

        // Cuando: Llamamos a la función reset
        let reset = build_message::<CounterRef>(contract_id.clone())
            .call(|counter| counter.reset());
        client.call(&ink_e2e::alice(), reset, 0, None).await?;

        // Entonces: El valor del contador debe ser 0
        let get = build_message::<CounterRef>(contract_id.clone())
            .call(|counter| counter.get());
        let get_result = client.call_dry_run(&ink_e2e::alice(), &get, 0, None).await;
        assert_eq!(get_result.return_value(), 0);

        Ok(())
    }
}