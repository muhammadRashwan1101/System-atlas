import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import WorkspaceGateway from '../../../src/Pages/WorkspaceGateway/WorkspaceGateway';
import { renderWithProviders } from '../../utils/test-utils';
import { createTestWorkspace, createTestProject, createTestUser } from '../../fixtures/factories';

describe('Workspace Context & Gateway Navigation', () => {
  const mockWorkspace = createTestWorkspace({ _id: 'ws-777', name: 'Payments Org' });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('automatically redirects into project architecture if workspace has exactly 1 project', async () => {
    const singleProject = createTestProject({ _id: 'prj-only', name: 'Only Project' });
    const mockFetchProjects = vi.fn().mockResolvedValue([singleProject]);

    renderWithProviders(
      <Routes>
        <Route path="/workspaces/:workspaceId" element={<WorkspaceGateway />} />
        <Route
          path="/workspaces/:workspaceId/projects/:projectId/graph"
          element={<div data-testid="graph-page">Graph Page</div>}
        />
        <Route
          path="/workspaces/:workspaceId/projects/:projectId/components"
          element={<div data-testid="graph-page">Graph Page</div>}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-777'],
        workspaces: [mockWorkspace],
        fetchProjects: mockFetchProjects,
      }
    );

    await waitFor(() => {
      expect(screen.getByTestId('graph-page')).toBeInTheDocument();
    });
  });

  it('renders project selection view when workspace contains multiple projects', async () => {
    const project1 = createTestProject({ _id: 'p1', name: 'Ledger Engine' });
    const project2 = createTestProject({ _id: 'p2', name: 'Gateway Engine' });
    const mockFetchProjects = vi.fn().mockResolvedValue([project1, project2]);

    renderWithProviders(
      <Routes>
        <Route path="/workspaces/:workspaceId" element={<WorkspaceGateway />} />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-777'],
        workspaces: [mockWorkspace],
        projectsByWorkspace: { 'ws-777': [project1, project2] },
        fetchProjects: mockFetchProjects,
      }
    );

    await waitFor(() => {
      expect(screen.getByText(/select an architecture project/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Ledger Engine')).toBeInTheDocument();
    expect(screen.getByText('Gateway Engine')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create new project/i })).toBeInTheDocument();
  });

  it('displays empty state with creation CTAs when workspace has 0 projects for admin/lead', async () => {
    const mockFetchProjects = vi.fn().mockResolvedValue([]);

    renderWithProviders(
      <Routes>
        <Route path="/workspaces/:workspaceId" element={<WorkspaceGateway />} />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-777'],
        user: createTestUser({ role: 'admin' }),
        workspaces: [mockWorkspace],
        projectsByWorkspace: { 'ws-777': [] },
        fetchProjects: mockFetchProjects,
      }
    );

    await waitFor(() => {
      expect(screen.getByText(/no projects in this workspace/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /create new project/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /switch workspace/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('displays Check Own Profile CTA instead of Create New Project for user role when workspace has 0 projects', async () => {
    const mockFetchProjects = vi.fn().mockResolvedValue([]);

    renderWithProviders(
      <Routes>
        <Route path="/workspaces/:workspaceId" element={<WorkspaceGateway />} />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-777'],
        user: createTestUser({ role: 'user' }),
        workspaces: [mockWorkspace],
        projectsByWorkspace: { 'ws-777': [] },
        fetchProjects: mockFetchProjects,
      }
    );

    await waitFor(() => {
      expect(screen.getByText(/no projects in this workspace/i)).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: /create new project/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /check own profile/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /switch workspace/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /profile settings/i })).toBeInTheDocument();
  });
});
