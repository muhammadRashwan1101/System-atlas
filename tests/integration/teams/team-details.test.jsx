import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import TeamDetails from '../../../src/Pages/TeamDetails/TeamDetails';
import { renderWithProviders } from '../../utils/test-utils';
import api from '../../../src/api/axios';
import { createTestUser } from '../../fixtures/factories';

vi.mock('../../../src/api/axios');

describe('Team Details View Integration Tests', () => {
  const mockUser = createTestUser();

  const mockTeamData = {
    _id: 'team-plt-422',
    teamCode: 'TEAM-PLT-422',
    teamName: 'Platform Engineering',
    description: 'Core infrastructure and foundational services responsible for CI/CD pipelines, cluster management, and cross-cutting security layers.',
    teamLead: {
      _id: 'lead-1',
      firstName: 'Alex',
      lastName: 'Rivera',
      role: 'admin',
    },
    kpis: {
      componentsOwned: 42,
      projectsOwned: 12,
      criticalPathServices: 12,
      slaAdherence: '99.98%',
    },
    ownershipRegistry: [
      {
        _id: 'c1',
        name: 'Kubernetes Cluster (Production)',
        codeId: 'CLS-PRD-001',
        type: 'cloud-service',
        version: 'v1.28.4',
      },
      {
        _id: 'c2',
        name: 'Auth Service',
        codeId: 'SVC-AUTH-04',
        type: 'auth',
        version: 'OAuth2.0 Compliant',
      },
    ],
    activeProjects: [
      {
        _id: 'p1',
        name: 'Core Mesh Upgrade',
        componentsCount: 8,
        priority: 'High Priority',
        progress: 75,
      },
    ],
    membersList: [
      {
        _id: 'm1',
        name: 'Alex Rivera',
        codeId: 'USR-22910',
        role: 'Architect',
        rank: 'L7',
        projectsCount: 3,
        status: 'ACTIVE',
      },
      {
        _id: 'm2',
        name: 'Jamie Volts',
        codeId: 'USR-38112',
        role: 'Tech Lead',
        rank: 'L6',
        projectsCount: 3,
        status: 'DAY-OFF',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({ data: { success: true, data: mockTeamData } });
    api.post.mockResolvedValue({ data: { success: true, msg: 'Member added successfully' } });
  });

  it('renders team header, operational KPIs, ownership registry, structure tree, and active projects', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/workspaces/:workspaceId/teams/:teamId" element={<TeamDetails />} />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/teams/team-plt-422'],
        user: mockUser,
      }
    );

    await waitFor(() => {
      expect(screen.getByText('Platform Engineering')).toBeInTheDocument();
    });

    // Check KPIs
    expect(screen.getByText('TEAM-PLT-422')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('99.98%')).toBeInTheDocument();

    // Check Ownership Registry
    expect(screen.getByText('Kubernetes Cluster (Production)')).toBeInTheDocument();
    expect(screen.getByText('Auth Service')).toBeInTheDocument();

    // Check Active Projects
    expect(screen.getByText('Core Mesh Upgrade')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders members panel with roster and triggers Add Member modal', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Routes>
        <Route path="/workspaces/:workspaceId/teams/:teamId" element={<TeamDetails />} />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/teams/team-plt-422'],
        user: mockUser,
      }
    );

    await waitFor(() => {
      expect(screen.getByText('Platform Engineering')).toBeInTheDocument();
    });

    // Check Members Panel
    expect(screen.getByText('Members')).toBeInTheDocument();
    expect(screen.getByText('USR-22910')).toBeInTheDocument();
    expect(screen.getByText('USR-38112')).toBeInTheDocument();
    expect(screen.getAllByText(/day-off/i)[0]).toBeInTheDocument();

    // Click Add Member CTA
    const addMemberBtn = screen.getByRole('button', { name: /add a member/i });
    await user.click(addMemberBtn);

    // Verify modal is open
    expect(screen.getByText('Add Existing Members')).toBeInTheDocument();
    expect(screen.getByText(/select users that should become members of this team/i)).toBeInTheDocument();
  });
});
