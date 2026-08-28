import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import useContextNavigator from '../../../src/hooks/useContextNavigator';
import { WorkspaceContext } from '../../../src/context/WorkspaceContext';
import { AuthContext } from '../../../src/context/AuthContext';
import { createTestWorkspace, createTestProject, createTestUser } from '../../fixtures/factories';

describe('useContextNavigator Hook', () => {
  const mockWorkspaces = [
    createTestWorkspace({ _id: 'ws-101', name: 'Payments Org' }),
    createTestWorkspace({ _id: 'ws-102', name: 'Identity Org' }),
  ];
  const mockProjects = [
    createTestProject({ _id: 'prj-201', name: 'Ledger Service' }),
    createTestProject({ _id: 'prj-202', name: 'Gateway Service' }),
  ];

  let mockFetchProjects;
  let mockRefreshWorkspaces;

  beforeEach(() => {
    mockFetchProjects = vi.fn();
    mockRefreshWorkspaces = vi.fn();
  });

  const createWrapper = (initialPath = '/', workspaceContextVal = {}, userVal = createTestUser()) => {
    return function Wrapper({ children }) {
      return (
        <AuthContext.Provider value={{ user: userVal, loading: false, setUser: vi.fn(), getCurrentUser: vi.fn() }}>
          <MemoryRouter initialEntries={[initialPath]}>
            <WorkspaceContext.Provider
              value={{
                workspaces: mockWorkspaces,
                projectsByWorkspace: {},
                fetchProjects: mockFetchProjects,
                refreshWorkspaces: mockRefreshWorkspaces,
                ...workspaceContextVal,
              }}
            >
              <Routes>
                <Route path="*" element={children} />
              </Routes>
            </WorkspaceContext.Provider>
          </MemoryRouter>
        </AuthContext.Provider>
      );
    };
  };

  it('correctly extracts currentWorkspaceId and currentProjectId from URL params', () => {
    const { result } = renderHook(() => useContextNavigator(), {
      wrapper: createWrapper('/workspaces/ws-999/projects/prj-888/components'),
    });

    expect(result.current.currentWorkspaceId).toBe('ws-999');
    expect(result.current.currentProjectId).toBe('prj-888');
  });

  it('preserves workspaceId when navigating to workspace subpath if in URL', async () => {
    const { result } = renderHook(() => useContextNavigator(), {
      wrapper: createWrapper('/workspaces/ws-101/new-project'),
    });

    await act(async () => {
      await result.current.navigateToWorkspace('create-team');
    });

    expect(result.current.modalState.isOpen).toBe(false);
  });

  it('triggers workspace selector modal when no workspace in URL and >1 available', async () => {
    const { result } = renderHook(() => useContextNavigator(), {
      wrapper: createWrapper('/dashboard', { workspaces: mockWorkspaces }),
    });

    await act(async () => {
      await result.current.navigateToWorkspace();
    });

    expect(result.current.modalState.isOpen).toBe(true);
    expect(result.current.modalState.type).toBe('workspace');
    expect(result.current.modalState.items).toEqual(mockWorkspaces);
  });

  it('opens 3-CTA modal when target workspace has 0 projects', async () => {
    mockFetchProjects.mockResolvedValueOnce([]);

    const singleWs = [createTestWorkspace({ _id: 'ws-empty', name: 'Empty WS' })];
    const { result } = renderHook(() => useContextNavigator(), {
      wrapper: createWrapper('/dashboard', {
        workspaces: singleWs,
        fetchProjects: mockFetchProjects,
      }),
    });

    await act(async () => {
      await result.current.navigateToProject('components');
    });

    expect(result.current.modalState.isOpen).toBe(true);
    expect(result.current.modalState.type).toBe('empty_projects');
    expect(result.current.modalState.title).toBe('No Projects in this Workspace');
  });

  it('marks canCreateProject as false for user role when opening empty projects modal', async () => {
    mockFetchProjects.mockResolvedValueOnce([]);

    const singleWs = [createTestWorkspace({ _id: 'ws-empty', name: 'Empty WS' })];
    const { result } = renderHook(() => useContextNavigator(), {
      wrapper: createWrapper(
        '/dashboard',
        {
          workspaces: singleWs,
          fetchProjects: mockFetchProjects,
        },
        createTestUser({ role: 'user' })
      ),
    });

    await act(async () => {
      await result.current.navigateToProject('components');
    });

    expect(result.current.modalState.isOpen).toBe(true);
    expect(result.current.modalState.type).toBe('empty_projects');
    expect(result.current.modalState.canCreateProject).toBe(false);
  });

  it('opens project selector modal when target workspace has multiple projects', async () => {
    mockFetchProjects.mockResolvedValueOnce(mockProjects);

    const singleWs = [createTestWorkspace({ _id: 'ws-multi', name: 'Multi WS' })];
    const { result } = renderHook(() => useContextNavigator(), {
      wrapper: createWrapper('/dashboard', {
        workspaces: singleWs,
        fetchProjects: mockFetchProjects,
      }),
    });

    await act(async () => {
      await result.current.navigateToProject('components');
    });

    expect(result.current.modalState.isOpen).toBe(true);
    expect(result.current.modalState.type).toBe('project');
    expect(result.current.modalState.items).toEqual(mockProjects);
  });
});
