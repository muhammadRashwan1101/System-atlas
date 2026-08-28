import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import ProjectDashboard from '../../../src/Pages/ProjectDashboard/ProjectDashboard';
import ProjectDetails from '../../../src/Pages/ProjectDetails/ProjectDetails';
import { renderWithProviders } from '../../utils/test-utils';
import api from '../../../src/api/axios';
import { createTestUser } from '../../fixtures/factories';

vi.mock('../../../src/api/axios');

describe('Project Management & Overview Pages', () => {
  const mockAdmin = createTestUser({ role: 'admin' });
  const mockUser = createTestUser({ role: 'user' });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Project Dashboard (Global Instance Index)', () => {
    it('renders project cards with status, health score, and filter bar', async () => {
      const mockProjects = [
        {
          _id: 'proj-1',
          name: 'Inference Engine',
          code: 'PROD-01',
          status: 'ACTIVE',
          healthScore: 99.8,
          documentationProgress: 92,
          ownershipProgress: 100,
          nodesCount: 124,
          managerName: 'Sarah K.',
          techLead: 'Alex M.',
          targetEnvironment: 'Production',
        },
        {
          _id: 'proj-2',
          name: 'Auth Middleware',
          code: 'AUTH-04',
          status: 'CRITICAL',
          healthScore: 84.2,
          documentationProgress: 64,
          ownershipProgress: 86,
          nodesCount: 56,
          managerName: 'James P.',
          techLead: 'Maria G.',
          targetEnvironment: 'Staging',
        },
      ];

      api.get.mockResolvedValueOnce({
        data: {
          success: true,
          workspace: { name: 'ai-core-runtime' },
          projects: mockProjects,
        },
      });

      renderWithProviders(
        <Routes>
          <Route
            path="/workspaces/:workspaceId/projects"
            element={<ProjectDashboard />}
          />
        </Routes>,
        {
          initialEntries: ['/workspaces/ws-1/projects'],
          user: mockAdmin,
        }
      );

      // Wait for projects and workspace title to load
      await waitFor(() => {
        expect(screen.getByText(/ai-core-runtime Projects/i)).toBeInTheDocument();
        expect(screen.getByText('Inference Engine')).toBeInTheDocument();
        expect(screen.getByText('Auth Middleware')).toBeInTheDocument();
      });

      // Verify filter bar labels
      expect(screen.getByText(/Status:/i)).toBeInTheDocument();
      expect(screen.getByText(/Env:/i)).toBeInTheDocument();
      expect(screen.getByText(/Manager:/i)).toBeInTheDocument();
      expect(screen.getByText(/Lead:/i)).toBeInTheDocument();

      // Verify Add Project card rendered for admin
      expect(screen.getByText(/Add Project/i)).toBeInTheDocument();
    });

    it('hides Add Project CTA for regular user role', async () => {
      api.get.mockResolvedValueOnce({
        data: {
          success: true,
          workspace: { name: 'ai-core-runtime' },
          projects: [],
        },
      });

      renderWithProviders(
        <Routes>
          <Route
            path="/workspaces/:workspaceId/projects"
            element={<ProjectDashboard />}
          />
        </Routes>,
        {
          initialEntries: ['/workspaces/ws-1/projects'],
          user: mockUser,
        }
      );

      await waitFor(() => {
        expect(screen.getByText(/No projects match your current filters/i)).toBeInTheDocument();
      });

      expect(screen.queryByRole('button', { name: /\+ Create Project/i })).not.toBeInTheDocument();
      expect(screen.queryByText(/Initialize a new infrastructure node/i)).not.toBeInTheDocument();
    });
  });

  describe('Project Details Overview', () => {
    it('renders project header, KPI stat metrics, tech stack, and governance', async () => {
      const mockProject = {
        _id: 'proj-123',
        name: 'Atlas Core API',
        description: 'High-performance gRPC gateway providing unified access.',
        status: 'STABLE',
        targetEnvironment: 'PRODUCTION',
        techLead: 'Erik Magnuson',
        version: 'v4.12.0-rc3',
        stats: {
          components: 12,
          relationships: 48,
          teams: 3,
          docsCoverage: '92%',
          govScore: 94,
        },
        techStack: {
          backend: ['Go', 'gRPC'],
          database: ['PostgreSQL'],
        },
      };

      api.get.mockImplementation((url) => {
        if (url.includes('/components')) {
          return Promise.resolve({ data: { components: [] } });
        }
        return Promise.resolve({ data: { project: mockProject } });
      });

      renderWithProviders(
        <Routes>
          <Route
            path="/workspaces/:workspaceId/projects/:projectId"
            element={<ProjectDetails />}
          />
        </Routes>,
        {
          initialEntries: ['/workspaces/ws-1/projects/proj-123'],
          user: mockAdmin,
        }
      );

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Atlas Core API' })).toBeInTheDocument();
        expect(screen.getByText('STABLE')).toBeInTheDocument();
      });

      // Verify KPI stat cards
      expect(screen.getByText('COMPONENTS')).toBeInTheDocument();
      expect(screen.getByText('RELATIONSHIPS')).toBeInTheDocument();
      expect(screen.getByText('TEAMS')).toBeInTheDocument();
      expect(screen.getByText('DOCS COV.')).toBeInTheDocument();
      expect(screen.getByText('GOV SCORE')).toBeInTheDocument();

      // Verify Technology stack section
      expect(screen.getByText('TECHNOLOGY STACK')).toBeInTheDocument();
      expect(screen.getByText('Go')).toBeInTheDocument();

      // Verify Data Integrity Footer
      expect(screen.getByText(/DATA INTEGRITY: VERIFIED/i)).toBeInTheDocument();
    });
  });
});

