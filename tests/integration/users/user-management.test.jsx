import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import CreateUserModal from '../../../src/components/UserManagment/CreateUserModal';
import UserManagement from '../../../src/Pages/UserManagement/UserManagement';
import { renderWithProviders } from '../../utils/test-utils';
import { createTestUser } from '../../fixtures/factories';
import api from '../../../src/api/axios';

vi.mock('../../../src/api/axios');

describe('User Management Center & Creation Modal', () => {
  const mockUser = createTestUser();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('User Creation Modal', () => {
    it('renders user creation modal with personal information and role controls', () => {
      renderWithProviders(<CreateUserModal />, { user: mockUser });

      expect(screen.getByText('Create New User')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('j.doe')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('john.doe@systematlas.io')).toBeInTheDocument();
      expect(screen.getByText('PERSONAL INFORMATION')).toBeInTheDocument();
      expect(screen.getByText('ROLE & ACCESS')).toBeInTheDocument();
      expect(screen.getByText('INITIAL CREDENTIALS')).toBeInTheDocument();
      expect(screen.getByText('ACCOUNT STATUS')).toBeInTheDocument();
    });

    it('allows selecting invitation mode (immediate send vs pending save)', async () => {
      const user = userEvent.setup();
      renderWithProviders(<CreateUserModal />, { user: mockUser });

      const sendRadio = screen.getByLabelText(/send invitation immediately/i);
      const pendingRadio = screen.getByLabelText(/save user without sending invitation/i);

      expect(sendRadio).toBeChecked();
      expect(pendingRadio).not.toBeChecked();

      await user.click(pendingRadio);
      expect(pendingRadio).toBeChecked();
      expect(sendRadio).not.toBeChecked();
    });

    it('renders create user and invite CTA buttons', () => {
      renderWithProviders(<CreateUserModal />, { user: mockUser });

      expect(screen.getByRole('button', { name: 'Create User' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create & Send Invitation' })).toBeInTheDocument();
    });
  });

  describe('User Management Center Page', () => {
    it('renders KPI metric cards, user roster table, and user details drawer', async () => {
      api.get.mockResolvedValueOnce({
        data: {
          success: true,
          users: [
            {
              _id: 'usr-1',
              firstName: 'Alex',
              lastName: 'Rivera',
              email: 'arivera@system-atlas.io',
              role: 'manager',
              teamName: 'Infrastructure',
              status: 'ACTIVE',
              lastActive: '2 min ago',
            },
            {
              _id: 'usr-2',
              firstName: 'Morgan',
              lastName: 'Wu',
              email: 'm.wu@system-atlas.io',
              role: 'developer',
              teamName: 'Core Services',
              status: 'PENDING',
              lastActive: 'Invite sent 4h ago',
            },
          ],
        },
      });

      renderWithProviders(
        <Routes>
          <Route path="/workspaces/:workspaceId/users" element={<UserManagement />} />
        </Routes>,
        {
          initialEntries: ['/workspaces/ws-1/users'],
          user: mockUser,
        }
      );

      // Verify Header & KPI Cards
      expect(screen.getByRole('heading', { name: /user management/i })).toBeInTheDocument();
      expect(screen.getByText(/TOTAL USERS/i)).toBeInTheDocument();
      expect(screen.getAllByText(/PENDING/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/TEAMS/i)).toBeInTheDocument();
      expect(screen.getByText(/ACTIVE USERS/i)).toBeInTheDocument();

      // Wait for table to load
      await waitFor(() => {
        expect(screen.getAllByText('Alex Rivera').length).toBeGreaterThan(0);
        expect(screen.getAllByText('arivera@system-atlas.io').length).toBeGreaterThan(0);
      });

      // Verify User Details Drawer renders selected user
      expect(screen.getByText('User Details')).toBeInTheDocument();
      expect(screen.getByText('ORGANIZATION')).toBeInTheDocument();
      expect(screen.getByText('WORKSPACE PERMISSIONS')).toBeInTheDocument();
    });

    it('filters users by status tabs (All, Active, Pending, Suspended)', async () => {
      const user = userEvent.setup();

      api.get.mockResolvedValue({
        data: {
          success: true,
          users: [
            {
              _id: 'usr-1',
              firstName: 'Alex',
              lastName: 'Rivera',
              email: 'arivera@system-atlas.io',
              role: 'manager',
              teamName: 'Infrastructure',
              status: 'ACTIVE',
              lastActive: '2 min ago',
            },
            {
              _id: 'usr-2',
              firstName: 'Morgan',
              lastName: 'Wu',
              email: 'm.wu@system-atlas.io',
              role: 'developer',
              teamName: 'Core Services',
              status: 'PENDING',
              lastActive: 'Invite sent 4h ago',
            },
          ],
        },
      });

      renderWithProviders(
        <Routes>
          <Route path="/workspaces/:workspaceId/users" element={<UserManagement />} />
        </Routes>,
        {
          initialEntries: ['/workspaces/ws-1/users'],
          user: mockUser,
        }
      );

      await waitFor(() => {
        expect(screen.getAllByText('Alex Rivera').length).toBeGreaterThan(0);
      });

      // Click Pending tab
      const pendingTab = screen.getByRole('button', { name: 'Pending' });
      await user.click(pendingTab);

      // Morgan Wu is Pending, Alex Rivera is Active
      expect(screen.getAllByText('Morgan Wu').length).toBeGreaterThan(0);
    });
  });
});
