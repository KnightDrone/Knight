# Testing

Testing is a core aspect of app development as it ensures our product is reliable and bug-free. We have decided to use the following tools for testing as they provide the easiest and most comprehensive testing experience for React Native apps:
- [Jest](https://jestjs.io/) - a testing framework for JavaScript

## Our resources

We are going to be following this guide [link]()
to ensure that we have a smooth testing experience that will allow us to develop our app effectively.

## Setup

### Installation

We will be installing jest and react-testing-library as dev dependencies. To do this, run the following command:
```bash
npm install --save-dev jest
```

### Configuration

We will be creating all our tests in the `__tests__` directory. This is the default directory for Jest tests. We will also be using the `react-testing-library` to test our React components. This library provides a set of utilities that allow us to test our components in a way that is similar to how a user would interact with them.

To run the tests, execute the command `npm run test` in this directory. This will run the tests in the `__tests__` directory.

## Testing

### Snapshot testing

Snapshot testing is a feature of Jest that allows us to capture the output of a component and compare it to a previously saved snapshot. This is useful for ensuring that our components render correctly and do not change unexpectedly.

To create a snapshot test, create a new file in the `__tests__` directory with the name of the component you want to test, followed by `.test.js`. For more information on snapshot testing, refer to the Jest documentation [here](https://jestjs.io/docs/snapshot-testing).





