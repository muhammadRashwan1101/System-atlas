import { describe, it, expect, vi, beforeEach } from 'vitest';
import graphService from '../../../src/services/graphService';
import api from '../../../src/api/axios';
import {
  createTestComponent,
  createTestRelationship,
} from '../../fixtures/factories';

vi.mock('../../../src/api/axios');

describe('graphService API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProjectComponents', () => {
    it('throws error when projectId is not provided', async () => {
      await expect(graphService.getProjectComponents('')).rejects.toThrow(
        'Project ID is required to fetch graph components.'
      );
    });

    it('returns components array when successful', async () => {
      const mockComps = [createTestComponent({ _id: 'c1' })];
      api.get.mockResolvedValueOnce({ data: { components: mockComps } });

      const res = await graphService.getProjectComponents('prj-123');
      expect(res).toEqual(mockComps);
      expect(api.get).toHaveBeenCalledWith('/projects/prj-123/components');
    });

    it('returns empty array when backend responds with 404', async () => {
      api.get.mockRejectedValueOnce({ response: { status: 404 } });

      const res = await graphService.getProjectComponents('prj-empty');
      expect(res).toEqual([]);
    });
  });

  describe('getProjectRelationships', () => {
    it('throws error when projectId is missing', async () => {
      await expect(graphService.getProjectRelationships()).rejects.toThrow(
        'Project ID is required to fetch relationships.'
      );
    });

    it('returns relationships array when successful', async () => {
      const mockRels = [createTestRelationship({ _id: 'r1' })];
      api.get.mockResolvedValueOnce({ data: { relationships: mockRels } });

      const res = await graphService.getProjectRelationships('prj-123');
      expect(res).toEqual(mockRels);
      expect(api.get).toHaveBeenCalledWith('/projects/prj-123/relationships');
    });

    it('returns empty array when backend responds with 404', async () => {
      api.get.mockRejectedValueOnce({ response: { status: 404 } });

      const res = await graphService.getProjectRelationships('prj-empty');
      expect(res).toEqual([]);
    });
  });

  describe('getProjectGraph', () => {
    it('fetches both components and relationships concurrently', async () => {
      const mockComps = [createTestComponent({ _id: 'c1' })];
      const mockRels = [createTestRelationship({ _id: 'r1' })];

      api.get.mockImplementation((url) => {
        if (url.includes('/components')) {
          return Promise.resolve({ data: { components: mockComps } });
        }
        if (url.includes('/relationships')) {
          return Promise.resolve({ data: { relationships: mockRels } });
        }
        return Promise.reject(new Error('Unknown'));
      });

      const res = await graphService.getProjectGraph('prj-123');
      expect(res).toEqual({
        components: mockComps,
        relationships: mockRels,
      });
    });
  });

  describe('addRelationship', () => {
    it('throws error if required parameters are missing', async () => {
      await expect(
        graphService.addRelationship('prj-1', { sourceId: 'c1', targetId: '' })
      ).rejects.toThrow('Project ID, source ID, and target ID are required.');
    });

    it('sends POST request with normalized payload and returns response data', async () => {
      const mockCreated = { _id: 'rel-new', sourceId: 'c1', targetId: 'c2' };
      api.post.mockResolvedValueOnce({ data: mockCreated });

      const res = await graphService.addRelationship('prj-1', {
        sourceId: 'c1',
        targetId: 'c2',
        type: 'publishes-to',
        protocol: 'AMQP',
      });

      expect(res).toEqual(mockCreated);
      expect(api.post).toHaveBeenCalledWith('/projects/prj-1/relationships', {
        sourceId: 'c1',
        targetId: 'c2',
        type: 'publishes-to',
        protocol: 'AMQP',
      });
    });
  });

  describe('updateRelationship', () => {
    it('throws error if projectId or relationshipId is missing', async () => {
      await expect(
        graphService.updateRelationship('', 'rel-1', { type: 'calls' })
      ).rejects.toThrow('Project ID and relationship ID are required.');
    });

    it('sends PATCH request and returns response data', async () => {
      const mockUpdated = { _id: 'rel-1', type: 'reads-from', protocol: 'SQL' };
      api.patch.mockResolvedValueOnce({ data: mockUpdated });

      const res = await graphService.updateRelationship('prj-1', 'rel-1', {
        type: 'reads-from',
        protocol: 'SQL',
      });

      expect(res).toEqual(mockUpdated);
      expect(api.patch).toHaveBeenCalledWith(
        '/projects/prj-1/relationships/rel-1',
        {
          type: 'reads-from',
          protocol: 'SQL',
        }
      );
    });
  });

  describe('removeRelationship', () => {
    it('throws error if projectId or relationshipId is missing', async () => {
      await expect(graphService.removeRelationship('prj-1', '')).rejects.toThrow(
        'Project ID and relationship ID are required.'
      );
    });

    it('sends DELETE request and returns response data', async () => {
      api.delete.mockResolvedValueOnce({ data: { success: true } });

      const res = await graphService.removeRelationship('prj-1', 'rel-1');
      expect(res).toEqual({ success: true });
      expect(api.delete).toHaveBeenCalledWith(
        '/projects/prj-1/relationships/rel-1'
      );
    });
  });
});
