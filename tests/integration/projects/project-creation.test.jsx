import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import ProjectCreation from '../../../src/Pages/CreatProject/CreatProject';
import { renderWithProviders } from '../../utils/test-utils';
import api from '../../../src/api/axios';
import { createTestUser } from '../../fixtures/factories';

vi.mock('../../../src/api/axios');

describe('Project Creation Flow', () => {
  const mockUser = createTestUser();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders project creation form with environment and topology options', () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/new-project"
          element={<ProjectCreation />}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/new-project'],
        user: mockUser,
      }
    );

    expect(screen.getByRole('heading', { name: /create project/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. e-commerce platform/i)).toBeInTheDocument();
    expect(screen.getByText('Production Ready')).toBeInTheDocument();
    expect(screen.getByText('Microservices')).toBeInTheDocument();
  });

  it('validates required fields on submission', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/new-project"
          element={<ProjectCreation />}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/new-project'],
        user: mockUser,
      }
    );

    const submitBtn = screen.getByRole('button', { name: /initialize project/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/project name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/manager name is required/i)).toBeInTheDocument();
    });
  });

  it('submits valid project data and redirects to graph explorer', async () => {
    const user = userEvent.setup();
    const mockRefreshProjects = vi.fn();

    api.post.mockResolvedValueOnce({
      data: {
        msg: 'Project initialized successfully',
        project: { _id: 'prj-new-999', name: 'Order Processing Service' },
      },
    });

    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/new-project"
          element={<ProjectCreation />}
        />
        <Route
          path="/workspaces/:workspaceId/projects/:projectId/graph"
          element={<div data-testid="graph-view">Graph View</div>}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/new-project'],
        user: mockUser,
        fetchProjects: mockRefreshProjects,
      }
    );

    const nameInput = screen.getByPlaceholderText(/e\.g\. e-commerce platform/i);
    const descInput = screen.getByPlaceholderText(/brief technical summary\.\.\./i);
    const managerInput = screen.getByPlaceholderText(/name/i);

    await user.type(nameInput, 'Order Processing Service');
    await user.type(descInput, 'Handles order checkout, payment routing, and inventory coordination.');
    await user.type(managerInput, 'Sarah Connor');

    const submitBtn = screen.getByRole('button', { name: /initialize project/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/workspaces/ws-1/projects',
        expect.objectContaining({
          name: 'Order Processing Service',
          managerName: 'Sarah Connor',
          description: 'Handles order checkout, payment routing, and inventory coordination.',
        })
      );
      expect(screen.getByTestId('graph-view')).toBeInTheDocument();
    });
  });
});
