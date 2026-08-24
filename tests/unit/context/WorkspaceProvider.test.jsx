import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import WorkspaceProvider from '../../../src/context/WorkspaceProvider';
import useWorkspace from '../../../src/context/WorkspaceContext';
import { AuthContext } from '../../../src/context/AuthContext';
import api from '../../../src/api/axios';
import { createTestUser, createTestWorkspace, createTestProject } from '../../fixtures/factories';

vi.mock('../../../src/api/axios');

describe('WorkspaceProvider & WorkspaceContext', () => {
  const mockUser = createTestUser();
  const mockWorkspaces = [createTestWorkspace({ _id: 'ws-1', name: 'Alpha WS' })];
  const mockProjects = [createTestProject({ _id: 'prj-1', name: 'Alpha Project' })];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createWrapper = (user = mockUser) => {
    return function Wrapper({ children }) {
      return (
        <AuthContext.Provider value={{ user, loading: false, setUser: vi.fn() }}>
          <WorkspaceProvider>{children}</WorkspaceProvider>
        </AuthContext.Provider>
      );
    };
  };

  it('fetches workspaces on mount when user is authenticated', async () => {
    api.get.mockResolvedValueOnce({ data: { workspaces: mockWorkspaces } });

    const { result } = renderHook(() => useWorkspace(), {
      wrapper: createWrapper(mockUser),
    });

    await waitFor(() => {
      expect(result.current.workspaces).toEqual(mockWorkspaces);
    });

    expect(api.get).toHaveBeenCalledWith('/workspaces');
  });

  it('does not load workspaces if user is not authenticated', async () => {
    const { result } = renderHook(() => useWorkspace(), {
      wrapper: createWrapper(null),
    });

    expect(result.current.workspaces).toEqual([]);
    expect(api.get).not.toHaveBeenCalled();
  });

  it('fetchProjects updates projectsByWorkspace for specific workspaceId', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/workspaces') {
        return Promise.resolve({ data: { workspaces: mockWorkspaces } });
      }
      if (url === '/workspaces/ws-1/projects') {
        return Promise.resolve({ data: { projects: mockProjects } });
      }
      return Promise.reject(new Error('Not found'));
    });

    const { result } = renderHook(() => useWorkspace(), {
      wrapper: createWrapper(mockUser),
    });

    let fetched;
    await act(async () => {
      fetched = await result.current.fetchProjects('ws-1');
    });

    expect(fetched).toEqual(mockProjects);
    expect(result.current.projectsByWorkspace['ws-1']).toEqual(mockProjects);
  });

  it('handles workspace fetch errors gracefully without breaking state', async () => {
    api.get.mockRejectedValue(new Error('Network failure'));

    const { result } = renderHook(() => useWorkspace(), {
      wrapper: createWrapper(mockUser),
    });

    await act(async () => {
      const res = await result.current.refreshWorkspaces();
      expect(res).toEqual([]);
    });

    expect(result.current.workspaces).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch accessible workspaces');
  });

  it('handles project fetch errors gracefully by setting empty array for workspace', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/workspaces') return Promise.resolve({ data: [] });
      if (url.includes('/projects')) return Promise.reject(new Error('Server error'));
      return Promise.reject(new Error('Unknown'));
    });

    const { result } = renderHook(() => useWorkspace(), {
      wrapper: createWrapper(mockUser),
    });

    let res;
    await act(async () => {
      res = await result.current.fetchProjects('ws-empty');
    });

    expect(res).toEqual([]);
    expect(result.current.projectsByWorkspace['ws-empty']).toEqual([]);
  });
});
