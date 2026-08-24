import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthContext } from '../../src/context/AuthContext';
import { WorkspaceContext } from '../../src/context/WorkspaceContext';
import { WizardContext } from '../../src/context/WizardContext';
import { createTestUser } from '../fixtures/factories';

/**
 * Custom render helper that configures all React context providers & routers.
 */
export function renderWithProviders(
  ui,
  {
    initialEntries = ['/'],
    user = createTestUser(),
    authLoading = false,
    workspaces = [],
    projectsByWorkspace = {},
    loadingWorkspaces = false,
    loadingProjects = false,
    workspaceError = null,
    fetchProjects = vi.fn().mockResolvedValue([]),
    refreshWorkspaces = vi.fn().mockResolvedValue([]),
    wizardState = null,
    routePath = null,
    ...renderOptions
  } = {}
) {
  const authValue = {
    user,
    loading: authLoading,
    setUser: vi.fn(),
    getCurrentUser: vi.fn().mockResolvedValue(user),
  };

  const workspaceValue = {
    workspaces,
    projectsByWorkspace,
    loadingWorkspaces,
    loadingProjects,
    error: workspaceError,
    fetchProjects,
    refreshWorkspaces,
    refreshProjects: fetchProjects,
  };

  function Wrapper({ children }) {
    let content = children;

    if (wizardState) {
      content = (
        <WizardContext.Provider
          value={{
            wizardId: wizardState.wizardId || null,
            currentStep: wizardState.currentStep || 'basicInfo',
            status: wizardState.status || 'in_progress',
            data: wizardState.data || {},
            setWizardId: wizardState.setWizardId || vi.fn(),
            setCurrentStep: wizardState.setCurrentStep || vi.fn(),
            nextStep: wizardState.nextStep || vi.fn(),
            prevStep: wizardState.prevStep || vi.fn(),
            setStatus: wizardState.setStatus || vi.fn(),
            updateData: wizardState.updateData || vi.fn(),
            updateStepData: wizardState.updateStepData || vi.fn(),
            resetWizard: wizardState.resetWizard || vi.fn(),
            initWizard: wizardState.initWizard || vi.fn(),
            dispatch: wizardState.dispatch || vi.fn(),
          }}
        >
          {children}
        </WizardContext.Provider>
      );
    }

    return (
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={initialEntries}>
          <WorkspaceContext.Provider value={workspaceValue}>
            {routePath ? (
              <Routes>
                <Route path={routePath} element={content} />
              </Routes>
            ) : (
              content
            )}
          </WorkspaceContext.Provider>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    authValue,
    workspaceValue,
  };
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
