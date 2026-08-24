import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import EmptyGraph from '../../../src/Pages/EmptyGraph/EmptyGraph';
import { renderWithProviders } from '../../utils/test-utils';
import api from '../../../src/api/axios';
import {
  createTestUser,
  createTestComponent,
  createTestRelationship,
} from '../../fixtures/factories';

vi.mock('../../../src/api/axios');

// Mock cytoscape since it requires native canvas in browser
vi.mock('react-cytoscapejs', () => ({
  default: function MockCytoscape() {
    return <div data-testid="mock-cytoscape-canvas">Cytoscape Graph View</div>;
  },
}));

describe('Graph Explorer & Interactive Architecture Graph', () => {
  const mockUser = createTestUser();
  const mockComponents = [
    createTestComponent({ _id: 'c1', name: 'Order-Service', type: 'backend' }),
    createTestComponent({ _id: 'c2', name: 'Payment-Gateway', type: 'api-gateway' }),
  ];
  const mockRelationships = [
    createTestRelationship({ _id: 'r1', sourceId: 'c1', targetId: 'c2' }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially and then displays graph canvas and inspector', async () => {
    api.get.mockImplementation((url) => {
      if (url.includes('/components')) {
        return Promise.resolve({ data: { components: mockComponents } });
      }
      if (url.includes('/relationships')) {
        return Promise.resolve({ data: { relationships: mockRelationships } });
      }
      return Promise.reject(new Error('Not found'));
    });

    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/projects/:projectId/graph"
          element={<EmptyGraph />}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/projects/prj-1/graph'],
        user: mockUser,
      }
    );

    await waitFor(() => {
      expect(screen.getByTestId('mock-cytoscape-canvas')).toBeInTheDocument();
      expect(screen.getByText('Explore')).toBeInTheDocument();
      expect(screen.getByText('Edit Mode')).toBeInTheDocument();
    });
  });

  it('toggles between Explore Mode and Edit Mode with banner indicators', async () => {
    const user = userEvent.setup();
    api.get.mockImplementation((url) => {
      if (url.includes('/components')) return Promise.resolve({ data: { components: mockComponents } });
      if (url.includes('/relationships')) return Promise.resolve({ data: { relationships: mockRelationships } });
      return Promise.reject(new Error('Not found'));
    });

    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/projects/:projectId/graph"
          element={<EmptyGraph />}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/projects/prj-1/graph'],
        user: mockUser,
      }
    );

    await waitFor(() => {
      expect(screen.getByText('Edit Mode')).toBeInTheDocument();
    });

    // Switch to Edit mode
    const editModeBtn = screen.getByRole('button', { name: /edit mode/i });
    await user.click(editModeBtn);

    await waitFor(() => {
      expect(screen.getByText(/edit mode active/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /done editing/i })).toBeInTheDocument();
    });

    // Switch back
    const doneBtn = screen.getByRole('button', { name: /done editing/i });
    await user.click(doneBtn);

    await waitFor(() => {
      expect(screen.queryByText(/edit mode active/i)).not.toBeInTheDocument();
    });
  });

  it('displays empty state when project has 0 components', async () => {
    api.get.mockImplementation((url) => {
      if (url.includes('/components')) return Promise.resolve({ data: { components: [] } });
      if (url.includes('/relationships')) return Promise.resolve({ data: { relationships: [] } });
      return Promise.reject(new Error('Not found'));
    });

    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/projects/:projectId/graph"
          element={<EmptyGraph />}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/projects/prj-1/graph'],
        user: mockUser,
      }
    );

    await waitFor(() => {
      expect(screen.queryByTestId('mock-cytoscape-canvas')).not.toBeInTheDocument();
    });
  });
});
