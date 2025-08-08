import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignUpForm } from '../SignUpForm';

// Mock the AuthContext
const mockSignUp = vi.fn();
vi.mock('@/lib/contexts/AuthContext', () => ({
  useAuth: () => ({
    signUp: mockSignUp
  })
}));

// Get access to the router mock
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

describe('SignUpForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders sign up form with all required elements', () => {
    render(<SignUpForm />);

    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Create a strong password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });

  it('displays correct placeholder texts', () => {
    render(<SignUpForm />);

    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Create a strong password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
  });

  describe('Form Validation', () => {
    it('shows error for invalid email format', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      });
    });

    it('shows error for password less than 8 characters', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, '1234567');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
      });
    });

    it('shows error for password without uppercase letter', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Password must contain at least one uppercase letter')).toBeInTheDocument();
      });
    });

    it('shows error for password without lowercase letter', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'PASSWORD123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Password must contain at least one lowercase letter')).toBeInTheDocument();
      });
    });

    it('shows error for password without number', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Password must contain at least one number')).toBeInTheDocument();
      });
    });

    it('shows error when passwords do not match', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password456');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
      });
    });

    it('does not show errors for valid input', async () => {
      const user = userEvent.setup();
      mockSignUp.mockResolvedValue({ error: null });
      
      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument();
        expect(screen.queryByText('Password must be at least 8 characters')).not.toBeInTheDocument();
        expect(screen.queryByText("Passwords don't match")).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('calls signUp with correct credentials on valid form submission', async () => {
      const user = userEvent.setup();
      mockSignUp.mockResolvedValue({ error: null });

      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'Password123');
      });
    });

    it('shows success message and redirects after successful sign up', async () => {
      const user = userEvent.setup();
      mockSignUp.mockResolvedValue({ error: null });

      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Account created successfully! Redirecting to ideas...')).toBeInTheDocument();
      });

      // Fast-forward the timer
      vi.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/ideas');
      });
    });

    it('displays error message on sign up failure', async () => {
      const user = userEvent.setup();
      const errorMessage = 'User already registered';
      mockSignUp.mockResolvedValue({ error: { message: errorMessage } });

      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });

      // Ensure the error is displayed in an alert
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('shows loading state during form submission', async () => {
      const user = userEvent.setup();
      // Mock a delayed response
      mockSignUp.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ error: null }), 100)));

      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      await user.click(submitButton);

      // Check loading state immediately after click
      expect(screen.getByText('Creating account...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      // Wait for the async operation to complete and advance timers for success state
      await waitFor(() => {
        expect(screen.queryByText('Creating account...')).not.toBeInTheDocument();
      }, { timeout: 200 });
    });

    it('disables submit button during loading', async () => {
      const user = userEvent.setup();
      mockSignUp.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ error: null }), 100)));

      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();

      // Wait for success state
      await waitFor(() => {
        expect(screen.getByText('Account created successfully! Redirecting to ideas...')).toBeInTheDocument();
      }, { timeout: 200 });

      // Button should still be disabled in success state
      expect(submitButton).toBeDisabled();
    });

    it('resets loading state after error', async () => {
      const user = userEvent.setup();
      mockSignUp.mockResolvedValue({ error: { message: 'Invalid credentials' } });

      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('UI Styling', () => {
    it('applies error styling to input fields with validation errors', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, '123');
      await user.type(confirmPasswordInput, '456');
      await user.click(submitButton);

      await waitFor(() => {
        expect(emailInput).toHaveClass('input-error');
        expect(passwordInput).toHaveClass('input-error');
        expect(confirmPasswordInput).toHaveClass('input-error');
      });
    });

    it('displays loading class on submit button when loading', async () => {
      const user = userEvent.setup();
      mockSignUp.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ error: null }), 100)));

      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      await user.click(submitButton);

      expect(submitButton).toHaveClass('loading');
    });
  });

  describe('Success State', () => {
    it('shows success alert after successful sign up', async () => {
      const user = userEvent.setup();
      mockSignUp.mockResolvedValue({ error: null });

      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        const successAlert = screen.getByRole('alert');
        expect(successAlert).toHaveClass('alert-success');
        expect(screen.getByText('Account created successfully! Redirecting to ideas...')).toBeInTheDocument();
      });
    });

    it('disables form after successful submission', async () => {
      const user = userEvent.setup();
      mockSignUp.mockResolvedValue({ error: null });

      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(screen.getByText('Account created successfully! Redirecting to ideas...')).toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation and Accessibility', () => {
    it('allows form submission with Enter key', async () => {
      const user = userEvent.setup();
      mockSignUp.mockResolvedValue({ error: null });

      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'Password123');
      });
    });

    it('has proper form structure and labels', () => {
      render(<SignUpForm />);

      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your email')).toHaveAttribute('type', 'email');
      expect(screen.getByPlaceholderText('Create a strong password')).toHaveAttribute('type', 'password');
      expect(screen.getByPlaceholderText('Confirm your password')).toHaveAttribute('type', 'password');
    });
  });
});