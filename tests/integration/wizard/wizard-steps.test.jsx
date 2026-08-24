import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import TechStack from '../../../src/components/SetupWizard/wizardContent/TechStack';
import WizardNavigation from '../../../src/components/SetupWizard/wizardNavigation/WizardNavigation';
import StepContainer from '../../../src/components/SetupWizard/wizardStepContainer/stepContainer/StepContainer';
import { renderWithProviders } from '../../utils/test-utils';
import api from '../../../src/api/axios';
import { createTestUser } from '../../fixtures/factories';

vi.mock('../../../src/api/axios');

describe('Setup Wizard - Tech Stack & Navigation Steps', () => {
  const mockUser = createTestUser();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TechStack Step', () => {
    it('renders recommended technologies and allows selecting technologies', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <Routes>
          <Route
            path="/workspaces/:workspaceId/projects/:projectId/wizard/:wizardId"
            element={<TechStack />}
          />
        </Routes>,
        {
          initialEntries: ['/workspaces/ws-1/projects/prj-1/wizard/wiz-123'],
          user: mockUser,
          wizardState: {
            wizardId: 'wiz-123',
            currentStep: 'techStack',
            data: {
              basicInfo: { name: 'Payment-API', type: 'backend' },
              techStack: { technologies: [] },
            },
            updateStepData: vi.fn(),
            setCurrentStep: vi.fn(),
          },
        }
      );

      expect(screen.getByRole('heading', { name: /technology stack/i })).toBeInTheDocument();
      expect(screen.getByText('backend')).toBeInTheDocument();

      // Click on a technology option (e.g. Node.js or Express)
      const techOption = screen.getByRole('button', { name: /node\.js/i });
      await user.click(techOption);

      await waitFor(() => {
        expect(screen.getByText(/selected technologies \(1\)/i)).toBeInTheDocument();
      });
    });

    it('submits selected technologies via PATCH', async () => {
      const user = userEvent.setup();
      const mockSetCurrentStep = vi.fn();

      api.patch.mockResolvedValueOnce({
        data: {
          msg: 'Technology stack saved',
          currentWizard: { currentStep: 'ownership' },
        },
      });

      renderWithProviders(
        <Routes>
          <Route
            path="/workspaces/:workspaceId/projects/:projectId/wizard/:wizardId"
            element={
              <div>
                <TechStack />
                <button type="submit" form="wizard-step-form">
                  Continue
                </button>
              </div>
            }
          />
        </Routes>,
        {
          initialEntries: ['/workspaces/ws-1/projects/prj-1/wizard/wiz-123'],
          user: mockUser,
          wizardState: {
            wizardId: 'wiz-123',
            currentStep: 'techStack',
            data: {
              basicInfo: { name: 'Payment-API', type: 'backend' },
              techStack: { technologies: ['Node.js', 'Express'] },
            },
            updateStepData: vi.fn(),
            setCurrentStep: mockSetCurrentStep,
          },
        }
      );

      const submitBtn = screen.getByRole('button', { name: /continue/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(api.patch).toHaveBeenCalledWith(
          '/projects/prj-1/wizard/wiz-123',
          { technologies: ['Node.js', 'Express'] }
        );
        expect(mockSetCurrentStep).toHaveBeenCalledWith('ownership');
      });
    });
  });

  describe('WizardNavigation Component', () => {
    it('hides Back button on first step and shows it on subsequent steps', () => {
      const { rerender } = renderWithProviders(<WizardNavigation />, {
        wizardState: {
          currentStep: 'basicInfo',
          status: 'in_progress',
        },
      });

      expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();

      rerender(
        <WizardNavigation />,
        {
          wizardState: {
            currentStep: 'techStack',
            status: 'in_progress',
          },
        }
      );
    });

    it('displays "Confirm & Create Node" on review step', () => {
      renderWithProviders(<WizardNavigation />, {
        wizardState: {
          currentStep: 'review',
          status: 'in_progress',
        },
      });

      expect(
        screen.getByRole('button', { name: /confirm & create node/i })
      ).toBeInTheDocument();
    });
  });

  describe('StepContainer Component', () => {
    it('renders corresponding step based on currentStep', () => {
      renderWithProviders(<StepContainer />, {
        wizardState: {
          currentStep: 'basicInfo',
          data: {},
        },
      });

      expect(screen.getByText('Basic Component Information')).toBeInTheDocument();
    });
  });
});
