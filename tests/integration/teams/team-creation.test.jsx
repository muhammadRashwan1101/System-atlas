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
});
