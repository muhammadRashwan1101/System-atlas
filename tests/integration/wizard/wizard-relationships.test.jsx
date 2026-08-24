import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import Relationships from '../../../src/components/SetupWizard/wizardContent/Relationships';
import { renderWithProviders } from '../../utils/test-utils';
import api from '../../../src/api/axios';
import { createTestUser, createTestComponent } from '../../fixtures/factories';

vi.mock('../../../src/api/axios');

describe('Setup Wizard - Relationships Step & Validation', () => {
  const mockUser = createTestUser();
  const mockExistingComps = [
    createTestComponent({ _id: 'comp-10', name: 'Database-Node', type: 'database' }),
    createTestComponent({ _id: 'comp-20', name: 'Cache-Redis', type: 'database' }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads project components and allows adding a relationship connection', async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValueOnce({ data: { components: mockExistingComps } });

    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/projects/:projectId/wizard/:wizardId"
          element={<Relationships />}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/projects/prj-1/wizard/wiz-123'],
        user: mockUser,
        wizardState: {
          wizardId: 'wiz-123',
          currentStep: 'relationships',
          data: {
            basicInfo: { name: 'Payment-API', type: 'backend' },
            relationships: [],
          },
          updateStepData: vi.fn(),
          setCurrentStep: vi.fn(),
        },
      }
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /add relationship/i })
      ).toBeInTheDocument();
    });

    // Open Add Relationship form
    await user.click(screen.getByRole('button', { name: /add relationship/i }));

    expect(screen.getByText(/new relationship connection/i)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /database-node/i })).toBeInTheDocument();

    // Select target node (first combobox)
    const comboboxes = screen.getAllByRole('combobox');
    await user.selectOptions(comboboxes[0], 'comp-10');

    // Click Save Connection
    const saveBtn = screen.getByRole('button', { name: /save connection/i });
    await user.click(saveBtn);

    // Verify relationship is listed
    await waitFor(() => {
      expect(screen.getByText('Database-Node')).toBeInTheDocument();
      expect(screen.getByText('calls')).toBeInTheDocument();
    });
  });

  it('prevents adding duplicate relationships', async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValueOnce({ data: { components: mockExistingComps } });

    renderWithProviders(
      <Routes>
        <Route
          path="/workspaces/:workspaceId/projects/:projectId/wizard/:wizardId"
          element={<Relationships />}
        />
      </Routes>,
      {
        initialEntries: ['/workspaces/ws-1/projects/prj-1/wizard/wiz-123'],
        user: mockUser,
        wizardState: {
          wizardId: 'wiz-123',
          currentStep: 'relationships',
          data: {
            basicInfo: { name: 'Payment-API', type: 'backend' },
            relationships: [
              {
                targetId: 'comp-10',
                targetName: 'Database-Node',
                type: 'calls',
                protocol: 'HTTPS',
              },
            ],
          },
          updateStepData: vi.fn(),
          setCurrentStep: vi.fn(),
        },
      }
    );

    await waitFor(() => {
      expect(screen.getByText('Database-Node')).toBeInTheDocument();
    });

    // Try adding the same connection again
    await user.click(screen.getByRole('button', { name: /add relationship/i }));
    const comboboxes = screen.getAllByRole('combobox');
    await user.selectOptions(comboboxes[0], 'comp-10');

    const saveBtn = screen.getByRole('button', { name: /save connection/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/this exact relationship has already been added/i)
      ).toBeInTheDocument();
    });
  });
});
