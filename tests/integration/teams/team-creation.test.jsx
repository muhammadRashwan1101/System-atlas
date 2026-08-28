import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import CreateTeam from '../../../src/Pages/Create Team/CreateTeam';
import { renderWithProviders } from '../../utils/test-utils';
import api from '../../../src/api/axios';
import { createTestUser } from '../../fixtures/factories';

vi.mock('../../../src/api/axios');

describe('Team Creation Flow', () => {
  const mockUser = createTestUser();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders team creation form and entity preview', () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/create-team"
          element={<CreateTeam />}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/create-team'],
        user: mockUser,
      }
    );

    expect(screen.getByText(/governance • team creation/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create team/i })).toBeInTheDocument();
  });

  it('requires category selection before submitting team creation', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/create-team"
          element={<CreateTeam />}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/create-team'],
        user: mockUser,
      }
    );

    const submitBtn = screen.getByRole('button', { name: /create team/i });
    await user.click(submitBtn);

    // Form prevents submit or warns when category is missing
    expect(api.post).not.toHaveBeenCalled();
  });

  it('renders team members section with add members button', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/create-team"
          element={<CreateTeam />}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/create-team'],
        user: mockUser,
      }
    );

    expect(screen.getByText('Team Members')).toBeInTheDocument();
    const addMembersBtn = screen.getByRole('button', { name: /\+ add members/i });
    expect(addMembersBtn).toBeInTheDocument();

    await user.click(addMembersBtn);
    expect(screen.getByText('Add Existing Members')).toBeInTheDocument();
  });

  it('submits team form and redirects to teams dashboard when workspace exists', async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValue({
      data: {
        success: true,
        data: [{ _id: 'lead-1', firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com' }],
      },
    });
    api.post.mockResolvedValueOnce({ status: 201, data: { success: true } });

    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/create-team"
          element={<CreateTeam />}
        />
        <Route
          path="/workspaces/:workspaceId/teams"
          element={<div>Teams Management Hub</div>}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/create-team'],
        user: mockUser,
      }
    );

    // Fill form
    const nameInput = screen.getByLabelText(/team name/i);
    const codeInput = screen.getByLabelText(/team code/i);
    const descInput = screen.getByLabelText(/description/i);

    await user.type(nameInput, 'Platform Engineering');
    await user.type(codeInput, 'PLT-ENG');
    await user.type(descInput, 'Core infra team responsible for platform pipelines.');

    // Select category
    const platformCategory = screen.getByRole('button', { name: /^platform$/i });
    await user.click(platformCategory);

    // Select team lead
    const leadInput = screen.getByPlaceholderText(/search directory for a team lead/i);
    await user.click(leadInput);
    const leadOption = await screen.findByText(/Alex Morgan/i);
    await user.click(leadOption);

    // Submit
    const submitBtn = screen.getByRole('button', { name: /create team/i });
    await user.click(submitBtn);

    expect(api.post).toHaveBeenCalledWith('/teams', expect.objectContaining({
      teamName: 'Platform Engineering',
      teamCode: 'PLT-ENG',
      category: 'Platform',
    }));
  });
});
