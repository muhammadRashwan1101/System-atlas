import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import ComponentsManagement from '../../../src/Pages/ComponentsManagement/ComponentsManagement';
import { renderWithProviders } from '../../utils/test-utils';
import api from '../../../src/api/axios';
import { createTestUser, createTestWorkspace, createTestProject, createTestComponent } from '../../fixtures/factories';

vi.mock('../../../src/api/axios');

describe('Components Management Center', () => {
  const mockUser = createTestUser();
  const mockWorkspace = createTestWorkspace({ _id: 'ws-100', name: 'Cloud Platform' });
  const mockProject = createTestProject({ _id: 'prj-200', name: 'Microservices Mesh' });

  const mockComponents = [
    createTestComponent({
      _id: 'comp-auth',
      name: 'Auth-Service',
      type: 'backend',
      environment: 'Production',
      ownerTeam: 'Security Team',
      technologies: ['Node.js', 'Redis'],
    }),
    createTestComponent({
      _id: 'comp-db',
      name: 'User-Database',
      type: 'database',
      environment: 'Production',
      ownerTeam: 'Database Team',
      technologies: ['PostgreSQL'],
    }),
    createTestComponent({
      _id: 'comp-ui',
      name: 'Web-Dashboard',
      type: 'frontend',
      environment: 'Staging',
      ownerTeam: 'Frontend Team',
      technologies: ['React', 'Vite'],
    }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and displays project components in grid view', async () => {
    api.get.mockResolvedValueOnce({ data: { components: mockComponents } });

    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/projects/:projectId/components"
          element={<ComponentsManagement />}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-100/projects/prj-200/components'],
        user: mockUser,
        workspaces: [mockWorkspace],
        projectsByWorkspace: { 'ws-100': [mockProject] },
      }
    );

    await waitFor(() => {
      expect(screen.getByText('Auth-Service')).toBeInTheDocument();
      expect(screen.getByText('User-Database')).toBeInTheDocument();
      expect(screen.getByText('Web-Dashboard')).toBeInTheDocument();
    });

    expect(api.get).toHaveBeenCalledWith('/projects/prj-200/components');
  });

  it('filters components based on search query', async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValueOnce({ data: { components: mockComponents } });

    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/projects/:projectId/components"
          element={<ComponentsManagement />}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-100/projects/prj-200/components'],
        user: mockUser,
        workspaces: [mockWorkspace],
        projectsByWorkspace: { 'ws-100': [mockProject] },
      }
    );

    await waitFor(() => {
      expect(screen.getByText('Auth-Service')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search architecture\.\.\./i);
    await user.type(searchInput, 'Database');

    await waitFor(() => {
      expect(screen.getByText('User-Database')).toBeInTheDocument();
      expect(screen.queryByText('Auth-Service')).not.toBeInTheDocument();
      expect(screen.queryByText('Web-Dashboard')).not.toBeInTheDocument();
    });
  });

  it('toggles between grid and list views', async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValueOnce({ data: { components: mockComponents } });

    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/projects/:projectId/components"
          element={<ComponentsManagement />}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-100/projects/prj-200/components'],
        user: mockUser,
        workspaces: [mockWorkspace],
        projectsByWorkspace: { 'ws-100': [mockProject] },
      }
    );

    await waitFor(() => {
      expect(screen.getByText('Auth-Service')).toBeInTheDocument();
    });

    // Toggle list view
    const listBtn = screen.getByRole('button', { name: /list view/i });
    await user.click(listBtn);

    // List view table columns
    await waitFor(() => {
      expect(screen.getByText('Component Name & ID')).toBeInTheDocument();
    });
  });
});
