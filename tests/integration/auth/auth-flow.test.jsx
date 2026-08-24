import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import Login from '../../../src/Pages/Auth/Login/Login';
import ProtectedRoute from '../../../src/routes/ProtectedRoute';
import AppEntry from '../../../src/routes/AppEntry';
import { renderWithProviders } from '../../utils/test-utils';
import api from '../../../src/api/axios';
import { createTestUser } from '../../fixtures/factories';

vi.mock('../../../src/api/axios');

describe('Authentication & Authorization Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Login Component', () => {
    it('renders login form with organization email and security key fields', () => {
      renderWithProviders(<Login />, { user: null });

      expect(screen.getByLabelText(/organization email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/security key/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /authorize entry/i })
      ).toBeInTheDocument();
    });

    it('shows validation errors when submitting with empty email', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />, { user: null });

      const submitBtn = screen.getByRole('button', { name: /authorize entry/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/please enter your email/i)).toBeInTheDocument();
      });
    });

    it('handles successful login by saving token and refreshing current user', async () => {
      const user = userEvent.setup();
      const mockUser = createTestUser();

      api.post.mockResolvedValueOnce({
        data: {
          token: 'jwt-auth-token-xyz',
          user: mockUser,
        },
      });

      renderWithProviders(
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<div data-testid="app-entry">App Entry</div>} />
        </Routes>,
        {
          initialEntries: ['/login'],
          user: null,
        }
      );

      const emailInput = screen.getByPlaceholderText(/example@email.com/i);
      await user.type(emailInput, 'alex@systematlas.io');

      const submitBtn = screen.getByRole('button', { name: /authorize entry/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/auth/login', expect.objectContaining({
          email: 'alex@systematlas.io',
        }));
      });

      expect(window.localStorage.getItem('token')).toBe('jwt-auth-token-xyz');
    });

    it('displays error message when login fails with invalid credentials', async () => {
      const user = userEvent.setup();
      api.post.mockRejectedValueOnce({
        response: { data: { msg: 'Invalid email or security key' } },
      });

      renderWithProviders(<Login />, { user: null });

      const emailInput = screen.getByPlaceholderText(/example@email.com/i);
      await user.type(emailInput, 'wrong@systematlas.io');

      const submitBtn = screen.getByRole('button', { name: /authorize entry/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/invalid email or security key/i)).toBeInTheDocument();
      });
    });
  });

  describe('ProtectedRoute Route Guard', () => {
    it('redirects unauthenticated user to /login', () => {
      renderWithProviders(
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div data-testid="secret-content">Secret Dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        </Routes>,
        {
          initialEntries: ['/protected'],
          user: null,
          authLoading: false,
        }
      );

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('secret-content')).not.toBeInTheDocument();
    });

    it('renders protected content when user is authenticated', () => {
      renderWithProviders(
        <ProtectedRoute>
          <div data-testid="secret-content">Secret Dashboard</div>
        </ProtectedRoute>,
        {
          user: createTestUser(),
          authLoading: false,
        }
      );

      expect(screen.getByTestId('secret-content')).toBeInTheDocument();
    });

    it('shows loading indicator while checking authentication session', () => {
      renderWithProviders(
        <ProtectedRoute>
          <div>Secret Dashboard</div>
        </ProtectedRoute>,
        {
          user: null,
          authLoading: true,
        }
      );

      expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();
    });
  });

  describe('AppEntry Router', () => {
    it('redirects to /dashboard when user has completed onboarding', () => {
      const onboardedUser = createTestUser({
        user: { onboarding: 'completed' },
      });

      renderWithProviders(
        <Routes>
          <Route path="/app" element={<AppEntry />} />
          <Route path="/dashboard" element={<div data-testid="dashboard-view">Dashboard</div>} />
          <Route path="/new-workspace" element={<div data-testid="new-ws-view">New WS</div>} />
        </Routes>,
        {
          initialEntries: ['/app'],
          user: onboardedUser,
          authLoading: false,
        }
      );

      expect(screen.getByTestId('dashboard-view')).toBeInTheDocument();
      expect(screen.queryByTestId('new-ws-view')).not.toBeInTheDocument();
    });

    it('redirects to /new-workspace when user onboarding is incomplete', () => {
      const pendingUser = createTestUser({
        user: { onboarding: 'pending' },
      });

      renderWithProviders(
        <Routes>
          <Route path="/app" element={<AppEntry />} />
          <Route path="/dashboard" element={<div data-testid="dashboard-view">Dashboard</div>} />
          <Route path="/new-workspace" element={<div data-testid="new-ws-view">New WS</div>} />
        </Routes>,
        {
          initialEntries: ['/app'],
          user: pendingUser,
          authLoading: false,
        }
      );

      expect(screen.getByTestId('new-ws-view')).toBeInTheDocument();
      expect(screen.queryByTestId('dashboard-view')).not.toBeInTheDocument();
    });
  });
});
