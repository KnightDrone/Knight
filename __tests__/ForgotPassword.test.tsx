import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ForgotPasswordScreen from '../src/app/ForgotPassword'; // Adjust the import path to your ForgotPasswordScreen component
describe('ForgotPasswordScreen Component', () => {
  it('updates email field correctly', () => {
    const { getByPlaceholderText } = render(<ForgotPasswordScreen />);
    const emailInput = getByPlaceholderText('Email');
    fireEvent.changeText(emailInput, 'test@example.com');
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('displays an error message when attempting to reset password without email', () => {
    const { getByText } = render(<ForgotPasswordScreen />);
    const resetButton = getByText('Reset Password');
    fireEvent.press(resetButton);
    const errorMessage = getByText('Please enter your email'); // Assuming this is the error message
    expect(errorMessage).toBeTruthy();
  });

  it('calls handleForgotPassword when the Reset Password button is pressed', () => {
    // Mock the handleForgotPassword function
    const mockHandleForgotPassword = jest.fn();
    ForgotPasswordScreen.prototype.handleForgotPassword = mockHandleForgotPassword; // This approach depends on how handleForgotPassword is implemented
    const { getByText } = render(<ForgotPasswordScreen />);
    const resetButton = getByText('Reset Password');
    fireEvent.press(resetButton);
    expect(mockHandleForgotPassword).toHaveBeenCalled();
  });
});

describe('More ForgotPassword Component Tests', () => {
  it('informs the user after a successful email submission', async () => {
    // Mock the API call within handleForgotPassword
    const mockApiCall = jest.fn(() => Promise.resolve('Success'));
    
    // Assuming handleForgotPassword uses the mockApiCall
    // You might need to adjust this based on your actual implementation  
    const { getByText, getByPlaceholderText, findByText } = render(<ForgotPasswordScreen />);
    
    const emailInput = getByPlaceholderText('Email');
    fireEvent.changeText(emailInput, 'user@example.com');
    
    fireEvent.press(getByText('Reset Password'));
    
    // Assuming the component shows a success message upon successful API call
    const successMessage = await findByText('Check your email for reset instructions.');
    
    expect(successMessage).toBeTruthy();
    expect(mockApiCall).toHaveBeenCalledWith('user@example.com');
  });

  it('displays an error message if the email is not recognized', async () => {
    // Mock the API call within handleForgotPassword to reject
    const mockApiCall = jest.fn(() => Promise.reject(new Error('User not found')));
    
    // Adjust this based on your actual implementation  
    const { getByText, getByPlaceholderText, findByText } = render(<ForgotPasswordScreen />);
    
    const emailInput = getByPlaceholderText('Email');
    fireEvent.changeText(emailInput, 'unknown@example.com');
    
    fireEvent.press(getByText('Reset Password'));
    
    // Assuming the component shows an error message upon API call failure
    const errorMessage = await findByText('User not found');
    
    expect(errorMessage).toBeTruthy();
    expect(mockApiCall).toHaveBeenCalledWith('unknown@example.com');
  });
});
