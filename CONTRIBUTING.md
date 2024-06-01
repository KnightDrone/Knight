# Contributing to Our Project

## Getting Started

1. Fork the repository and clone it to your local machine.
2. Install the project dependencies by running `npm install`.
3. Copy the `.env.example` file to a new file named `.env` and fill in your Firebase configuration details.

## Codebase Overview

The main application code is located in the `src/` directory. Here's a brief overview of the important directories and files:

- `src/app/`: Contains the main application components.
- `src/types/`: Contains TypeScript type definitions used throughout the app.
- `src/app/content/`: Contains the Guide components (`Guide1.tsx`, `Guide2.tsx`, etc.) and the `ContentIndex.tsx` which serves as the main entry point for the guides.
- `src/app/AppStack.tsx`: Defines the application's navigation stack.
- `src/app/App.tsx`: The main application component that sets up the navigation stack.

## Testing

Tests are located in the `__tests__/` directory. To run the tests, use the command `npm run test`. To run the tests in watch mode, use `npm run test:watch`. To run a specific test file, use `npm run test <file-name>`. For example, to run the tests in `__tests__/App.test.js`, execute `npm run test App.test.js`.

## Submitting Changes

1. Create a new branch for your changes.
2. Make your changes and commit them with a descriptive commit message.
3. Push your changes to your forked repository.
4. Open a pull request to the main repository.

## Code Style

We use Prettier to enforce a consistent code style.

## Questions

If you have any questions or run into any issues, please open an issue in the GitHub repository.
