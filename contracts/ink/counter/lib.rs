#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod counter {
    #[ink(storage)]
    pub struct Counter {
        value: u32,
    }

    impl Counter {
        #[ink(constructor)]
        pub fn new(init_value: u32) -> Self {
            Self { value: init_value }
        }

        #[ink(constructor)]
        pub fn default() -> Self {
            Self::new(0)
        }

        #[ink(message)]
        pub fn get(&self) -> u32 {
            self.value
        }

        #[ink(message)]
        pub fn inc(&mut self) {
            self.value = self.value.saturating_add(1);
        }

        #[ink(message)]
        pub fn dec(&mut self) {
            self.value = self.value.saturating_sub(1);
        }

        #[ink(message)]
        pub fn reset(&mut self) {
            self.value = 0;
        }
    }
}