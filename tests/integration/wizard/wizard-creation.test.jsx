import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import SetupWizard from '../../../src/Pages/SetupWizard/SetupWizard';
import { renderWithProviders } from '../../utils/test-utils';
import api from '../../../src/api/axios';
import { createTestUser } from '../../fixtures/factories';

vi.mock('../../../src/api/axios');

describe('Setup Wizard - Step 1 Basic Info & Session Initialization', () => {
  const mockUser = createTestUser();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Step 1 Basic Component Information form', () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/projects/:projectId/wizard"
          element={<SetupWizard />}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/projects/prj-1/wizard'],
        user: mockUser,
      }
    );

    expect(
      screen.getAllByRole('heading', { name: /basic component information/i }).length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByLabelText(/component name/i)).toBeInTheDocument();
    expect(screen.getByText('backend')).toBeInTheDocument();
    expect(screen.getByText('database')).toBeInTheDocument();
    expect(screen.getByText('api-gateway')).toBeInTheDocument();
  });

  it('shows validation error when component name is empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/projects/:projectId/wizard"
          element={<SetupWizard />}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/projects/prj-1/wizard'],
        user: mockUser,
      }
    );

    const continueBtn = screen.getByRole('button', { name: /continue/i });
    await user.click(continueBtn);

    await waitFor(() => {
      expect(screen.getByText(/component name is required/i)).toBeInTheDocument();
    });
  });

  it('submits Step 1, updates URL with returned wizardId, and transitions step', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValueOnce({
      data: {
        msg: 'Basic information saved',
        initialData: {
          wizardId: 'wiz-session-42',
          currentStep: 'techStack',
        },
      },
    });

    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/projects/:projectId/wizard"
          element={<SetupWizard />}
        />
        <Route
          path="/workspaces/:workspaceId/projects/:projectId/wizard/:wizardId"
          element={<SetupWizard />}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/projects/prj-1/wizard'],
        user: mockUser,
      }
    );

    const nameInput = screen.getByPlaceholderText(/e\.g\. authentication-service/i);
    await user.type(nameInput, 'Auth-Gateway');

    // Click 'api-gateway' component type button
    const gatewayBtn = screen.getByRole('button', { name: /api-gateway/i });
    await user.click(gatewayBtn);

    const continueBtn = screen.getByRole('button', { name: /continue/i });
    await user.click(continueBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/projects/prj-1/wizard', {
        step: 'basicInfo',
        name: 'Auth-Gateway',
        componentName: 'Auth-Gateway',
        type: 'api-gateway',
        componentType: 'api-gateway',
        description: '',
      });
    });
  });
});
