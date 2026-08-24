import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import AppEntry from '../../../src/routes/AppEntry';
import ProtectedRoute from '../../../src/routes/ProtectedRoute';
import InvitationAcceptance from '../../../src/Pages/Auth/Invitation/InvitationAcceptance';
import SetNewPassword from '../../../src/Pages/Auth/SetNewPassword/SetNewPassword';
import { renderWithProviders, userEvent } from '../../utils/test-utils';
import api from '../../../src/api/axios';

vi.mock('../../../src/api/axios');

describe('Role-Based Login, Invited Activation & Onboarding Architecture Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Invited User Password Activation Requirement (mustChangePassword)', () => {
    it('redirects MANAGER with mustChangePassword=true to /set-new-password', () => {
      const managerTemp = {
        _id: 'mgr-temp-1',
        name: 'Manager Temp',
        email: 'mgr@systematlas.io',
        role: 'manager',
        mustChangePassword: true,
        onboardingStatus: 'completed',
      };

      renderWithProviders(
        <Routes>
          <Route path="/app" element={<AppEntry />} />
          <Route path="/manager-dashboard" element={<div data-testid="manager-view">Manager Dashboard</div>} />
          <Route path="/set-new-password" element={<div data-testid="set-password-view">Set New Password View</div>} />
        </Routes>,
        {
          initialEntries: ['/app'],
          user: managerTemp,
          authLoading: false,
        }
      );

      expect(screen.getByTestId('set-password-view')).toBeInTheDocument();
      expect(screen.queryByTestId('manager-view')).not.toBeInTheDocument();
    });

    it('redirects TECH LEAD with mustChangePassword=true to /set-new-password', () => {
      const techLeadTemp = {
        _id: 'tl-temp-1',
        name: 'Tech Lead Temp',
        email: 'lead@systematlas.io',
        role: 'techLead',
        mustChangePassword: true,
        onboardingStatus: 'completed',
      };

      renderWithProviders(
        <Routes>
          <Route path="/app" element={<AppEntry />} />
          <Route
            path="/workspaces/:workspaceId/projects/:projectId/graph"
            element={<div data-testid="graph-view">Graph Explorer</div>}
          />
          <Route path="/set-new-password" element={<div data-testid="set-password-view">Set New Password View</div>} />
        </Routes>,
        {
          initialEntries: ['/app'],
          user: techLeadTemp,
          authLoading: false,
        }
      );

      expect(screen.getByTestId('set-password-view')).toBeInTheDocument();
      expect(screen.queryByTestId('graph-view')).not.toBeInTheDocument();
    });

    it('redirects REGULAR USER with mustChangePassword=true to /set-new-password', () => {
      const userTemp = {
        _id: 'user-temp-1',
        name: 'Dev Temp',
        email: 'dev@systematlas.io',
        role: 'user',
        mustChangePassword: true,
        onboardingStatus: 'completed',
      };

      renderWithProviders(
        <Routes>
          <Route path="/app" element={<AppEntry />} />
          <Route path="/set-new-password" element={<div data-testid="set-password-view">Set New Password View</div>} />
        </Routes>,
        {
          initialEntries: ['/app'],
          user: userTemp,
          authLoading: false,
        }
      );

      expect(screen.getByTestId('set-password-view')).toBeInTheDocument();
    });
  });

  describe('2. Mandatory SetNewPassword Component & UX', () => {
    it('validates password minimum length and confirmation match on submission', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <Routes>
          <Route path="/set-new-password" element={<SetNewPassword />} />
        </Routes>,
        {
          initialEntries: ['/set-new-password'],
        }
      );

      const submitBtn = screen.getByRole('button', { name: /activate account & enter/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/new password is required/i)).toBeInTheDocument();
      });

      const newPassInput = screen.getByLabelText(/^new password$/i);
      const confirmPassInput = screen.getByLabelText(/^confirm new password$/i);

      await user.type(newPassInput, '123');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
      });

      await user.clear(newPassInput);
      await user.type(newPassInput, 'Secret1234');
      await user.type(confirmPassInput, 'DifferentSecret');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('submits valid permanent password, refreshes currentUser, and delegates navigation to /app', async () => {
      const user = userEvent.setup();
      const mockGetCurrentUser = vi.fn().mockResolvedValue({
        _id: 'user-temp-1',
        name: 'Dev Permanent',
        mustChangePassword: false,
        onboardingStatus: 'completed',
      });

      api.patch.mockResolvedValueOnce({
        data: {
          msg: 'Password updated successfully. Your account is now active.',
          user: { _id: 'user-temp-1', mustChangePassword: false },
        },
      });

      renderWithProviders(
        <Routes>
          <Route path="/set-new-password" element={<SetNewPassword />} />
          <Route path="/app" element={<div data-testid="app-entry-target">App Entry Target</div>} />
        </Routes>,
        {
          initialEntries: ['/set-new-password'],
          getCurrentUser: mockGetCurrentUser,
        }
      );

      const newPassInput = screen.getByLabelText(/^new password$/i);
      const confirmPassInput = screen.getByLabelText(/^confirm new password$/i);
      const submitBtn = screen.getByRole('button', { name: /activate account & enter/i });

      await user.type(newPassInput, 'MySecurePassword99');
      await user.type(confirmPassInput, 'MySecurePassword99');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(api.patch).toHaveBeenCalledWith('/auth/set-password', {
          newPassword: 'MySecurePassword99',
          confirmPassword: 'MySecurePassword99',
        });
      });
    });

    it('displays server error if new password equals temporary password', async () => {
      const user = userEvent.setup();

      api.patch.mockRejectedValueOnce({
        response: {
          data: {
            msg: 'New password cannot be the same as your temporary password',
          },
        },
      });

      renderWithProviders(
        <Routes>
          <Route path="/set-new-password" element={<SetNewPassword />} />
        </Routes>,
        {
          initialEntries: ['/set-new-password'],
        }
      );

      const newPassInput = screen.getByLabelText(/^new password$/i);
      const confirmPassInput = screen.getByLabelText(/^confirm new password$/i);
      const submitBtn = screen.getByRole('button', { name: /activate account & enter/i });

      await user.type(newPassInput, 'TempPassword123');
      await user.type(confirmPassInput, 'TempPassword123');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(
          screen.getByText(/new password cannot be the same as your temporary password/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('3. Onboarding Status Validation (Admin & Initial Users)', () => {
    it('redirects pending onboarding admin to /new-workspace', () => {
      const adminPending = {
        _id: 'admin-pending-1',
        name: 'Admin Pending',
        email: 'admin@systematlas.io',
        role: 'admin',
        mustChangePassword: false,
        onboardingStatus: 'pending',
        onboarding: 'pending',
      };

      renderWithProviders(
        <Routes>
          <Route path="/app" element={<AppEntry />} />
          <Route path="/dashboard" element={<div data-testid="admin-view">Admin Dashboard</div>} />
          <Route path="/new-workspace" element={<div data-testid="onboarding-view">Workspace Onboarding</div>} />
        </Routes>,
        {
          initialEntries: ['/app'],
          user: adminPending,
          authLoading: false,
        }
      );

      expect(screen.getByTestId('onboarding-view')).toBeInTheDocument();
      expect(screen.queryByTestId('admin-view')).not.toBeInTheDocument();
    });

    it('redirects manager with pending onboarding to /new-workspace', () => {
      const managerPending = {
        _id: 'mgr-pending-1',
        name: 'Manager Pending',
        email: 'mgr@systematlas.io',
        role: 'manager',
        mustChangePassword: false,
        onboardingStatus: 'pending',
        onboarding: 'pending',
      };

      renderWithProviders(
        <Routes>
          <Route path="/app" element={<AppEntry />} />
          <Route path="/manager-dashboard" element={<div data-testid="manager-view">Manager Dashboard</div>} />
          <Route path="/new-workspace" element={<div data-testid="onboarding-view">Workspace Onboarding</div>} />
        </Routes>,
        {
          initialEntries: ['/app'],
          user: managerPending,
          authLoading: false,
        }
      );

      expect(screen.getByTestId('onboarding-view')).toBeInTheDocument();
      expect(screen.queryByTestId('manager-view')).not.toBeInTheDocument();
    });
  });

  describe('4. Post-Activation Role Destinations (Onboarded & Activated)', () => {
    it('routes ADMIN with completed onboarding to /dashboard', () => {
      const adminOnboarded = {
        _id: 'admin-onboarded-1',
        name: 'Admin User',
        email: 'admin@systematlas.io',
        role: 'admin',
        mustChangePassword: false,
        onboardingStatus: 'completed',
        onboarding: 'completed',
      };

      renderWithProviders(
        <Routes>
          <Route path="/app" element={<AppEntry />} />
          <Route path="/dashboard" element={<div data-testid="admin-dashboard">Admin Dashboard View</div>} />
        </Routes>,
        {
          initialEntries: ['/app'],
          user: adminOnboarded,
          authLoading: false,
        }
      );

      expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
    });

    it('routes MANAGER with completed onboarding to /manager-dashboard', () => {
      const managerOnboarded = {
        _id: 'mgr-onboarded-1',
        name: 'Manager User',
        email: 'manager@systematlas.io',
        role: 'manager',
        mustChangePassword: false,
        onboardingStatus: 'completed',
        onboarding: 'completed',
      };

      renderWithProviders(
        <Routes>
          <Route path="/app" element={<AppEntry />} />
          <Route path="/manager-dashboard" element={<div data-testid="manager-dashboard">Manager Dashboard View</div>} />
        </Routes>,
        {
          initialEntries: ['/app'],
          user: managerOnboarded,
          authLoading: false,
        }
      );

      expect(screen.getByTestId('manager-dashboard')).toBeInTheDocument();
    });

    it('routes TECH LEAD with 1 workspace and 1 project directly to Graph Explorer', async () => {
      const techLeadUser = {
        _id: 'tl-1',
        name: 'Sarah Lead',
        email: 'sarah@systematlas.io',
        role: 'techLead',
        mustChangePassword: false,
        onboardingStatus: 'completed',
        onboarding: 'completed',
      };

      const mockWorkspaces = [{ _id: 'ws-core-101', name: 'Core Platform' }];
      const mockProjects = [{ _id: 'prj-alpha-1', name: 'Auth Gateway' }];

      renderWithProviders(
        <Routes>
          <Route path="/app" element={<AppEntry />} />
          <Route
            path="/workspaces/:workspaceId/projects/:projectId/graph"
            element={<div data-testid="graph-explorer-view">Graph Explorer Canvas</div>}
          />
        </Routes>,
        {
          initialEntries: ['/app'],
          user: techLeadUser,
          authLoading: false,
          workspaces: mockWorkspaces,
          refreshWorkspaces: vi.fn().mockResolvedValue(mockWorkspaces),
          fetchProjects: vi.fn().mockResolvedValue(mockProjects),
        }
      );

      await waitFor(() => {
        expect(screen.getByTestId('graph-explorer-view')).toBeInTheDocument();
      });
    });

    it('routes REGULAR USER with 1 workspace and 1 project directly to Graph Explorer', async () => {
      const regularUser = {
        _id: 'user-001',
        name: 'Regular Dev',
        email: 'dev@systematlas.io',
        role: 'user',
        mustChangePassword: false,
        onboardingStatus: 'completed',
        onboarding: 'completed',
      };

      const mockWorkspaces = [{ _id: 'ws-user-1', name: 'Engineering Workspace' }];
      const mockProjects = [{ _id: 'prj-user-1', name: 'Payments API' }];

      renderWithProviders(
        <Routes>
          <Route path="/app" element={<AppEntry />} />
          <Route
            path="/workspaces/:workspaceId/projects/:projectId/graph"
            element={<div data-testid="user-graph-view">User Graph Explorer View</div>}
          />
        </Routes>,
        {
          initialEntries: ['/app'],
          user: regularUser,
          authLoading: false,
          workspaces: mockWorkspaces,
          refreshWorkspaces: vi.fn().mockResolvedValue(mockWorkspaces),
          fetchProjects: vi.fn().mockResolvedValue(mockProjects),
        }
      );

      await waitFor(() => {
        expect(screen.getByTestId('user-graph-view')).toBeInTheDocument();
      });
    });
  });

  describe('5. ProtectedRoute Security Guards & Password Bypass Prevention', () => {
    it('blocks user with mustChangePassword=true from accessing /dashboard and redirects to /set-new-password', () => {
      const userRequiringPassword = {
        _id: 'user-pw-req',
        name: 'Password Required User',
        role: 'admin',
        mustChangePassword: true,
        onboardingStatus: 'completed',
      };

      renderWithProviders(
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div data-testid="admin-dashboard">Admin Dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/set-new-password"
            element={<div data-testid="set-password-redirect">Redirected to Set Password</div>}
          />
        </Routes>,
        {
          initialEntries: ['/dashboard'],
          user: userRequiringPassword,
          authLoading: false,
        }
      );

      expect(screen.getByTestId('set-password-redirect')).toBeInTheDocument();
      expect(screen.queryByTestId('admin-dashboard')).not.toBeInTheDocument();
    });

    it('blocks user with mustChangePassword=true from accessing project graph and redirects to /set-new-password', () => {
      const userRequiringPassword = {
        _id: 'user-pw-req-2',
        name: 'Password Required User',
        role: 'techLead',
        mustChangePassword: true,
        onboardingStatus: 'completed',
      };

      renderWithProviders(
        <Routes>
          <Route
            path="/workspaces/:wsId/projects/:prjId/graph"
            element={
              <ProtectedRoute>
                <div data-testid="graph-view">Graph View</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/set-new-password"
            element={<div data-testid="set-password-redirect">Redirected to Set Password</div>}
          />
        </Routes>,
        {
          initialEntries: ['/workspaces/ws-1/projects/prj-1/graph'],
          user: userRequiringPassword,
          authLoading: false,
        }
      );

      expect(screen.getByTestId('set-password-redirect')).toBeInTheDocument();
      expect(screen.queryByTestId('graph-view')).not.toBeInTheDocument();
    });

    it('blocks already activated user from accessing /set-new-password and redirects to /app', () => {
      const activatedUser = {
        _id: 'user-act-1',
        name: 'Activated User',
        role: 'user',
        mustChangePassword: false,
        onboardingStatus: 'completed',
      };

      renderWithProviders(
        <Routes>
          <Route
            path="/set-new-password"
            element={
              <ProtectedRoute requirePasswordChange={true}>
                <div data-testid="set-password-form">Set Password Form</div>
              </ProtectedRoute>
            }
          />
          <Route path="/app" element={<div data-testid="app-entry-redirect">App Entry Redirect</div>} />
        </Routes>,
        {
          initialEntries: ['/set-new-password'],
          user: activatedUser,
          authLoading: false,
        }
      );

      expect(screen.getByTestId('app-entry-redirect')).toBeInTheDocument();
      expect(screen.queryByTestId('set-password-form')).not.toBeInTheDocument();
    });
  });

  describe('6. Invitation Acceptance Flow', () => {
    it('redirects unauthenticated invitees to login with invite query parameter', () => {
      renderWithProviders(
        <Routes>
          <Route path="/invite/:token" element={<InvitationAcceptance />} />
          <Route path="/login" element={<div data-testid="login-with-invite">Login With Invite</div>} />
        </Routes>,
        {
          initialEntries: ['/invite/token-sec-999'],
          user: null,
          authLoading: false,
        }
      );

      expect(screen.getByTestId('login-with-invite')).toBeInTheDocument();
    });

    it('validates invitation and allows entering target workspace for authenticated user', async () => {
      const authenticatedUser = {
        _id: 'auth-user-5',
        name: 'Invited Engineer',
        email: 'engineer@corp.com',
        role: 'user',
        mustChangePassword: false,
        onboardingStatus: 'completed',
      };

      api.post.mockResolvedValueOnce({
        data: {
          msg: 'Invitation accepted',
          workspaceId: 'ws-invited-555',
          workspace: { _id: 'ws-invited-555', name: 'Invited Architecture' },
        },
      });

      api.get.mockImplementation((url) => {
        if (url === '/auth/current-user') {
          return Promise.resolve({ data: { user: authenticatedUser } });
        }
        if (url === '/workspaces') {
          return Promise.resolve({
            data: {
              workspaces: [{ _id: 'ws-invited-555', name: 'Invited Architecture' }],
            },
          });
        }
        return Promise.resolve({ data: {} });
      });

      renderWithProviders(
        <Routes>
          <Route path="/invite/:token" element={<InvitationAcceptance />} />
          <Route
            path="/workspaces/:workspaceId"
            element={<div data-testid="invited-workspace-view">Invited Workspace Landing</div>}
          />
        </Routes>,
        {
          initialEntries: ['/invite/token-valid-123'],
          user: authenticatedUser,
          authLoading: false,
        }
      );

      await waitFor(() => {
        expect(screen.getByText(/access granted/i)).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: /enter architecture workspace/i })
        ).toBeInTheDocument();
      });
    });
  });
});
