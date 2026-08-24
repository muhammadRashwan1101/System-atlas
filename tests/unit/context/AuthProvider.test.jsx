import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import AuthProvider from '../../../src/context/AuthProvider';
import useAuth from '../../../src/context/AuthContext';
import api from '../../../src/api/axios';
import { createTestUser } from '../../fixtures/factories';

vi.mock('../../../src/api/axios');

describe('AuthProvider & AuthContext', () => {
  const mockUserData = createTestUser();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  it('fetches current user on mount and updates state', async () => {
    api.get.mockResolvedValueOnce({ data: mockUserData });

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUserData);
    expect(api.get).toHaveBeenCalledWith('/auth/current-user');
  });

  it('handles current user failure on mount and sets loading to false', async () => {
    api.get.mockRejectedValueOnce(new Error('Unauthorized'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  it('provides getCurrentUser method to refresh user session', async () => {
    api.get
      .mockResolvedValueOnce({ data: null }) // on mount
      .mockResolvedValueOnce({ data: mockUserData }); // on getCurrentUser

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.getCurrentUser();
    });

    expect(result.current.user).toEqual(mockUserData);
  });
});
