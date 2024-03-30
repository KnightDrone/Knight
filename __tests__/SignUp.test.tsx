import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import SignUp from '../src/app/SignUp'; // Adjust the import path to your SignUp component

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
// Mock navigation and Google auth
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));
jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: jest.fn(),
}));
// Mock promptAsync
const mockPromptAsync = jest.fn();

describe('SignUp Component', () => {
  it('updates email and password fields correctly', () => {
    const { getByPlaceholderText } = render(<SignUp promptAsync={mockPromptAsync} navigation={{}} />);
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('displays password strength and suggestions correctly', () => {
    const { getByPlaceholderText, getByText } = render(<SignUp promptAsync={mockPromptAsync} navigation={{}} />);
    const passwordInput = getByPlaceholderText('Enter your password');
    fireEvent.changeText(passwordInput, 'pass');
    expect(getByText('Password Strength:')).toBeTruthy();
    expect(getByText('Password should be at least 8 characters long')).toBeTruthy();
  });

  it('initiates Google sign-in process on "Continue with Google" button press', async () => {
    const { getByText } = render(<SignUp promptAsync={mockPromptAsync} navigation={{}} />);
    fireEvent.press(getByText('Continue with Google'));
    expect(mockPromptAsync).toHaveBeenCalled();
  });
});

describe('More SignUp Component Tests', () => {
  //it('toggles password visibility when the visibility icon is pressed', () => {
  //  const { getByPlaceholderText, getByTestId } = render(<SignUp promptAsync={mockPromptAsync} navigation={{}} />);
  //  const passwordInput = getByPlaceholderText('Enter your password');
  //  const visibilityToggle = getByTestId('passwordVisibilityToggle'); // Add testID to your visibility toggle component for this to work
  //  // Initial state should be 'password' (hidden)
  //  expect(passwordInput.props.secureTextEntry).toBe(true);
  //  fireEvent.press(visibilityToggle);
  //  // After toggle, password should be visible
  //  expect(passwordInput.props.secureTextEntry).toBe(false);
  //  fireEvent.press(visibilityToggle);
  //  // Toggle back to hidden
  //  expect(passwordInput.props.secureTextEntry).toBe(true);
  //});

  it('calls handleSignUp when the Sign Up button is pressed', () => {
    const mockHandleSignUp = jest.fn();
    SignUp.prototype.handleSignUp = mockHandleSignUp; // Mock the handleSignUp method
    const { getByText } = render(<SignUp promptAsync={mockPromptAsync} navigation={{}} />);
    fireEvent.press(getByText('Sign Up'));
    expect(mockHandleSignUp).toHaveBeenCalled();
  });

  it('navigates to the Login screen after successful sign-up', async () => {
    // Assuming handleSignUp is async and navigates upon success
    const mockNavigation = { navigate: jest.fn() };
    const { getByText } = render(<SignUp promptAsync={mockPromptAsync} navigation={mockNavigation} />);
    // Simulate successful sign-up
    fireEvent.press(getByText('Sign Up'));
    // Wait for any async actions to complete
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Login'); // Adjust 'Login' as needed based on your navigation flow
    });
  });
});

