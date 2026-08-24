import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateUserModal from '../../../src/components/UserManagment/CreateUserModal';
import { renderWithProviders } from '../../utils/test-utils';
import { createTestUser } from '../../fixtures/factories';

describe('User Management & User Creation Modal', () => {
  const mockUser = createTestUser();

  it('renders user creation modal with personal information and role controls', () => {
    renderWithProviders(<CreateUserModal />, { user: mockUser });

    expect(screen.getByText('Create New User')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('shahd khairy')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('shahd_khairy')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('shahd@gmail.com')).toBeInTheDocument();
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
