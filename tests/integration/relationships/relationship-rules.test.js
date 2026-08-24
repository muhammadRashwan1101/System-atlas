import { describe, it, expect, vi, beforeEach } from 'vitest';
import graphService from '../../../src/services/graphService';
import { mapProjectToGraphElements } from '../../../src/utils/graphMapper';
import api from '../../../src/api/axios';
import {
  createTestComponent,
  createTestRelationship,
} from '../../fixtures/factories';

vi.mock('../../../src/api/axios');

describe('Relationship CRUD & Domain Integrity Rules', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('enforces required parameters when creating a relationship', async () => {
    await expect(
      graphService.addRelationship('prj-1', { sourceId: '', targetId: 'comp-2' })
    ).rejects.toThrow('Project ID, source ID, and target ID are required.');

    await expect(
      graphService.addRelationship('prj-1', { sourceId: 'comp-1', targetId: '' })
    ).rejects.toThrow('Project ID, source ID, and target ID are required.');
  });

  it('successfully creates relationship and formats payload', async () => {
    const mockCreated = {
      _id: 'rel-100',
      sourceId: 'comp-1',
      targetId: 'comp-2',
      type: 'calls',
      protocol: 'HTTPS',
    };

    api.post.mockResolvedValueOnce({ data: mockCreated });

    const res = await graphService.addRelationship('prj-1', {
      sourceId: 'comp-1',
      targetId: 'comp-2',
      type: 'calls',
      protocol: 'HTTPS',
    });

    expect(res).toEqual(mockCreated);
    expect(api.post).toHaveBeenCalledWith('/projects/prj-1/relationships', {
      sourceId: 'comp-1',
      targetId: 'comp-2',
      type: 'calls',
      protocol: 'HTTPS',
    });
  });

  it('prevents cross-project leakage by ignoring relationships referring to foreign component IDs', () => {
    const projectAComponents = [
      createTestComponent({ _id: 'comp-a1', name: 'Service A1' }),
      createTestComponent({ _id: 'comp-a2', name: 'Service A2' }),
    ];

    const rogueForeignRelationships = [
      createTestRelationship({
        _id: 'rel-valid',
        sourceId: 'comp-a1',
        targetId: 'comp-a2',
      }),
      createTestRelationship({
        _id: 'rel-foreign',
        sourceId: 'comp-a1',
        targetId: 'foreign-project-comp-x',
      }),
    ];

    const elements = mapProjectToGraphElements(
      projectAComponents,
      rogueForeignRelationships
    );

    const edges = elements.filter((el) => el.group === 'edges');
    expect(edges).toHaveLength(1);
    expect(edges[0].data.id).toBe('rel-valid');
  });

  it('handles relationship deletion with proper project scoping', async () => {
    api.delete.mockResolvedValueOnce({ data: { msg: 'Relationship removed' } });

    const res = await graphService.removeRelationship('prj-1', 'rel-100');
    expect(res).toEqual({ msg: 'Relationship removed' });
    expect(api.delete).toHaveBeenCalledWith(
      '/projects/prj-1/relationships/rel-100'
    );
  });
});
