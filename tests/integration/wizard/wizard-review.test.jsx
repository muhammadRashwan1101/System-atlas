import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import WizardReview from '../../../src/components/SetupWizard/wizardContent/WizardReview';
import { renderWithProviders } from '../../utils/test-utils';
import api from '../../../src/api/axios';
import { createTestUser } from '../../fixtures/factories';

vi.mock('../../../src/api/axios');

describe('Setup Wizard - Review Step & Node Finalization', () => {
  const mockUser = createTestUser();
  const mockWizardData = {
    basicInfo: {
      name: 'Auth-Service',
      type: 'backend',
      description: 'Central OAuth2 authentication provider',
    },
    techStack: {
      technologies: ['Node.js', 'Express', 'JWT'],
    },
    ownership: {
      ownerRefCode: 'Security Engineering',
      environment: 'production',
      maintainers: ['sec-lead@atlas.io'],
    },
    documentation: {
      repoURL: 'https://github.com/atlas/auth',
    },
    relationships: [
      {
        targetId: 'comp-db',
        targetName: 'User-DB',
        type: 'reads-from',
        protocol: 'SQL',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders aggregated review information from wizard data', () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/projects/:projectId/wizard/:wizardId"
          element={<WizardReview />}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/projects/prj-1/wizard/wiz-99'],
        user: mockUser,
        wizardState: {
          wizardId: 'wiz-99',
          currentStep: 'review',
          data: mockWizardData,
          setStatus: vi.fn(),
        },
      }
    );

    expect(screen.getAllByText('Auth-Service').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('backend')).toBeInTheDocument();
    expect(screen.getByText('Security Engineering')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('User-DB')).toBeInTheDocument();
    expect(screen.getByText('reads-from')).toBeInTheDocument();
  });

  it('submits confirmation and displays success completion screen', async () => {
    const user = userEvent.setup();
    const mockSetStatus = vi.fn();

    api.patch.mockResolvedValueOnce({
      data: {
        msg: 'Component created successfully!',
        componentId: 'COMP-777',
      },
    });

    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/projects/:projectId/wizard/:wizardId"
          element={
            <div>
              <WizardReview />
              <button type="submit" form="wizard-step-form">
                Confirm & Create Node
              </button>
            </div>
          }
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/projects/prj-1/wizard/wiz-99'],
        user: mockUser,
        wizardState: {
          wizardId: 'wiz-99',
          currentStep: 'review',
          data: mockWizardData,
          setStatus: mockSetStatus,
        },
      }
    );

    const confirmBtn = screen.getByRole('button', { name: /confirm & create node/i });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith(
        '/projects/prj-1/wizard/wiz-99',
        { confirmation: true }
      );
      expect(mockSetStatus).toHaveBeenCalledWith('finished');
      expect(
        screen.getByRole('heading', { name: /component created successfully!/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/ID:/i)).toBeInTheDocument();
      expect(screen.getByText('COMP-777')).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /explore architecture graph/i })
      ).toBeInTheDocument();
    });
  });
});
