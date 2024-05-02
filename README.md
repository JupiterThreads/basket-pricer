
This is a vanilla vite typescript project using pnpm. 

## Setup

If you haven't already got pnpm, install it with npm: 

    npm install -g pnpm

Once pnpm is installed on your system, just install the node modules, pnpm install.

## Running

I have created a script that can be run from the command line to test the BasketPricerService. Just need to run `ts-node-esm src/scripts/test-basket-pricer.ts`. 
You can adjust the baskets, catalogues or offers json from the data folder inside `src/scripts`. Just make sure that you keep to the same schema, otherwise
you will encounter zod validation errors. 

### Testing

To run all tests

    pnpm test

Run a specific test file:

    pnpm test -- BasketPricerService.test.ts

