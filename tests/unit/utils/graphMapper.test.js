import { describe, it, expect } from 'vitest';
import {
  mapProjectToGraphElements,
  calculateGraphMetrics,
} from '../../../src/utils/graphMapper';
import {
  createTestComponent,
  createTestRelationship,
} from '../../fixtures/factories';

describe('graphMapper Utility', () => {
  it('returns empty array when components array is empty or undefined', () => {
    expect(mapProjectToGraphElements([])).toEqual([]);
    expect(mapProjectToGraphElements(null)).toEqual([]);
    expect(mapProjectToGraphElements(undefined)).toEqual([]);
  });

  it('maps raw component records into Cytoscape node elements with correct metadata', () => {
    const components = [
      createTestComponent({
        _id: 'comp-1',
        name: 'Auth Gateway',
        type: 'api-gateway',
        deploymentEnvironment: 'Production',
        ownerTeam: { teamName: 'Security Team' },
        technologies: ['Node.js', 'Kong'],
        status: 'active',
      }),
      createTestComponent({
        _id: 'comp-2',
        name: 'Users DB',
        type: 'database',
        deploymentEnvironment: 'Staging',
        ownerTeam: 'Database Team',
        technologies: ['PostgreSQL'],
        status: 'inactive',
      }),
    ];

    const elements = mapProjectToGraphElements(components, []);
    expect(elements).toHaveLength(2);

    const node1 = elements.find((el) => el.data.id === 'comp-1');
    expect(node1.group).toBe('nodes');
    expect(node1.data.name).toBe('Auth Gateway');
    expect(node1.data.type).toBe('Api-gateway');
    expect(node1.data.owner).toBe('Security Team');
    expect(node1.data.status).toBe('HEALTHY');
    expect(node1.data.iconType).toBe('hub');

    const node2 = elements.find((el) => el.data.id === 'comp-2');
    expect(node2.data.status).toBe('WARNING');
    expect(node2.data.iconType).toBe('database');
  });

  it('maps standalone relationships into edge elements and prevents duplicates', () => {
    const components = [
      createTestComponent({ _id: 'c1', name: 'Frontend App', type: 'frontend' }),
      createTestComponent({ _id: 'c2', name: 'API Server', type: 'backend' }),
      createTestComponent({ _id: 'c3', name: 'Database', type: 'database' }),
    ];

    const relationships = [
      createTestRelationship({
        _id: 'rel-1',
        sourceId: 'c1',
        targetId: 'c2',
        type: 'calls',
        protocol: 'HTTPS',
      }),
      // Duplicate relationship
      createTestRelationship({
        _id: 'rel-1-dup',
        sourceId: 'c1',
        targetId: 'c2',
        type: 'calls',
        protocol: 'HTTPS',
      }),
      // Valid relationship
      createTestRelationship({
        _id: 'rel-2',
        sourceId: 'c2',
        targetId: 'c3',
        type: 'reads-from',
        protocol: 'SQL',
      }),
      // Relationship pointing to non-existent component (should be discarded)
      createTestRelationship({
        _id: 'rel-ghost',
        sourceId: 'c1',
        targetId: 'non-existent-comp',
        type: 'calls',
      }),
    ];

    const elements = mapProjectToGraphElements(components, relationships);

    const nodes = elements.filter((el) => el.group === 'nodes');
    const edges = elements.filter((el) => el.group === 'edges');

    expect(nodes).toHaveLength(3);
    expect(edges).toHaveLength(2); // 2 unique valid relationships

    // Verify node relationship counts
    const c1Node = nodes.find((n) => n.data.id === 'c1');
    const c2Node = nodes.find((n) => n.data.id === 'c2');
    const c3Node = nodes.find((n) => n.data.id === 'c3');

    expect(c1Node.data.relationshipsCount).toBe(1);
    expect(c2Node.data.relationshipsCount).toBe(2); // c1->c2 and c2->c3
    expect(c3Node.data.relationshipsCount).toBe(1);
  });

  it('calculates graph metrics accurately', () => {
    const components = [
      createTestComponent({
        _id: 'c1',
        type: 'frontend',
        deploymentEnvironment: 'Production',
        ownerTeam: 'UI Team',
      }),
      createTestComponent({
        _id: 'c2',
        type: 'backend',
        deploymentEnvironment: 'Production',
        ownerTeam: 'Platform Team',
      }),
      createTestComponent({
        _id: 'c3',
        type: 'database',
        deploymentEnvironment: 'Staging',
        ownerTeam: 'Platform Team',
      }),
    ];

    const relationships = [
      createTestRelationship({ sourceId: 'c1', targetId: 'c2' }),
      createTestRelationship({ sourceId: 'c2', targetId: 'c3' }),
    ];

    const elements = mapProjectToGraphElements(components, relationships);
    const metrics = calculateGraphMetrics(elements);

    expect(metrics.totalComponents).toBe(3);
    expect(metrics.totalRelationships).toBe(2);
    expect(metrics.totalTeams).toBe(2); // UI Team, Platform Team
    expect(metrics.typeCounts).toEqual({
      Frontend: 1,
      Backend: 1,
      Database: 1,
    });
    expect(metrics.envCounts).toEqual({
      Production: 2,
      Staging: 1,
    });
  });
});
