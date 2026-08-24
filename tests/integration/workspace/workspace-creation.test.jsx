import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import WorkspaceCreation from '../../../src/Pages/CreateWorkspace/CreateWorkspace';
import { renderWithProviders } from '../../utils/test-utils';
import api from '../../../src/api/axios';
import { createTestUser } from '../../fixtures/factories';

vi.mock('../../../src/api/axios');

describe('Workspace Creation Flow', () => {
  const mockUser = createTestUser();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders workspace creation form with owner details', () => {
    renderWithProviders(<WorkspaceCreation />, { user: mockUser });

    expect(screen.getByRole('heading', { name: /create workspace/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/workspace name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(mockUser.user.name)).toBeInTheDocument();
  });

  it('validates minimum length constraints on name and description', async () => {
    const user = userEvent.setup();
    renderWithProviders(<WorkspaceCreation />, { user: mockUser });

    const nameInput = screen.getByLabelText(/workspace name/i);
    const descInput = screen.getByLabelText(/description/i);
    const submitBtn = screen.getByRole('button', { name: /create workspace/i });

    await user.type(nameInput, 'ab');
    await user.type(descInput, 'short desc');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/workspace name must be at least 3 characters/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/description must be at least 20 characters/i)
      ).toBeInTheDocument();
    });
  });

  it('submits workspace form and navigates to new-project setup route', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValueOnce({
      data: {
        workspace: { _id: 'ws-new-888', name: 'Global Payments' },
      },
    });

    renderWithProviders(
      <Routes>
        <Route path="/new-workspace" element={<WorkspaceCreation />} />
        <Route
          path="/workspaces/:workspaceId/new-project"
          element={<div data-testid="new-project-view">New Project View</div>}
        />
      </Routes>,
      {
        initialEntries: ['/new-workspace'],
        user: mockUser,
      }
    );

    const nameInput = screen.getByLabelText(/workspace name/i);
    const descInput = screen.getByLabelText(/description/i);
    const submitBtn = screen.getByRole('button', { name: /create workspace/i });

    await user.type(nameInput, 'Global Payments Division');
    await user.type(
      descInput,
      'Architectural boundary for global banking, payment pipelines, and microservices.'
    );
    await user.click(submitBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/workspaces', {
        name: 'Global Payments Division',
        description:
          'Architectural boundary for global banking, payment pipelines, and microservices.',
      });
      expect(screen.getByTestId('new-project-view')).toBeInTheDocument();
    });
  });
});
