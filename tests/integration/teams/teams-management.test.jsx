import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import TeamsManagement from '../../../src/Pages/TeamsManagement/TeamsManagement';
import { renderWithProviders } from '../../utils/test-utils';
import api from '../../../src/api/axios';
import { createTestUser } from '../../fixtures/factories';

vi.mock('../../../src/api/axios');

describe('Teams Management Center Integration Tests', () => {
  const mockUser = createTestUser();

  const mockDbTeams = [
    {
      _id: 'team-1',
      teamCode: 'CORE-01',
      teamName: 'Platform Core',
      status: 'ACTIVE',
      teamLead: {
        _id: 'lead-1',
        firstName: 'Alex',
        lastName: 'Rivera',
        email: 'alex@example.com',
      },
      members: ['user-1', 'user-2'],
      developersCount: 12,
      componentsCount: 24,
      projectsCount: 8,
      docCoverage: 92,
      updatedAt: '2026-08-28T00:00:00.000Z',
    },
    {
      _id: 'team-2',
      teamCode: 'SEC-09',
      teamName: 'Security Ops',
      status: 'REVIEW',
      teamLead: {
        _id: 'lead-2',
        firstName: 'Marcus',
        lastName: 'Thorne',
        email: 'marcus@example.com',
      },
      members: ['user-3'],
      developersCount: 6,
      componentsCount: 12,
      projectsCount: 4,
      docCoverage: 45,
      updatedAt: '2026-08-28T00:00:00.000Z',
    },
    {
      _id: 'team-3',
      teamCode: 'LEGACY-05',
      teamName: 'Legacy APIs',
      status: 'SUSPENDED',
      teamLead: {
        _id: 'lead-3',
        firstName: 'Tomás',
        lastName: 'Garcia',
        email: 'tomas@example.com',
      },
      members: [],
      developersCount: 0,
      componentsCount: 15,
      projectsCount: 1,
      docCoverage: 100,
      updatedAt: '2026-08-27T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({ data: { success: true, data: mockDbTeams } });
    api.put.mockResolvedValue({ data: { success: true, msg: 'Team updated successfully' } });
  });

  it('renders teams list from database with accurate status and metadata', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/workspaces/:workspaceId/teams" element={<TeamsManagement />} />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/teams'],
        user: mockUser,
      }
    );

    expect(screen.getByText(/teams management/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Platform Core')).toBeInTheDocument();
      expect(screen.getByText('Security Ops')).toBeInTheDocument();
      expect(screen.getByText('Legacy APIs')).toBeInTheDocument();
    });

    // Check status badges
    expect(screen.getByText('CORE-01')).toBeInTheDocument();
    expect(screen.getByText('SEC-09')).toBeInTheDocument();
    expect(screen.getByText('LEGACY-05')).toBeInTheDocument();

    // Check lead names and metrics
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
    expect(screen.getByText('12 Developers')).toBeInTheDocument();
    expect(screen.getByText('24 Components')).toBeInTheDocument();
    expect(screen.getByText('8 Projects')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
  });

  it('supports updating team status (ACTIVE -> REVIEW -> SUSPENDED)', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Routes>
        <Route path="/workspaces/:workspaceId/teams" element={<TeamsManagement />} />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/teams'],
        user: mockUser,
      }
    );

    await waitFor(() => {
      expect(screen.getByText('Platform Core')).toBeInTheDocument();
    });

    // Find and click status dropdown button on the first team card
    const statusBtns = screen.getAllByRole('button', { name: /active/i });
    await user.click(statusBtns[0]);

    // Click SUSPENDED option in the popup menu
    const suspendOptions = screen.getAllByRole('button', { name: /suspended/i });
    await user.click(suspendOptions[0]);

    expect(api.put).toHaveBeenCalledWith('/teams/team-1', { status: 'SUSPENDED' });
  });

  it('toggles between Grid view and Table view', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Routes>
        <Route path="/workspaces/:workspaceId/teams" element={<TeamsManagement />} />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/teams'],
        user: mockUser,
      }
    );

    await waitFor(() => {
      expect(screen.getByText('Platform Core')).toBeInTheDocument();
    });

    // Switch to Table View
    const tableToggleBtn = screen.getByTitle('Table View');
    await user.click(tableToggleBtn);

    // Verify table headers are rendered
    expect(screen.getByText('Team Code')).toBeInTheDocument();
    expect(screen.getByText('Team Name')).toBeInTheDocument();
    expect(screen.getByText('Doc Coverage')).toBeInTheDocument();
  });
});
