/**
 * Test entity factories for System Atlas
 */

let idCounter = 1000;
const nextId = (prefix = 'id') => `${prefix}-${++idCounter}`;

export const createTestUser = (overrides = {}) => ({
  _id: nextId('user'),
  name: 'Alex Architect',
  email: 'alex@systematlas.io',
  role: 'Admin',
  level: 'Senior',
  onboarding: 'completed',
  user: {
    _id: 'user-sub-1',
    name: 'Alex Architect',
    email: 'alex@systematlas.io',
    onboarding: 'completed',
  },
  ...overrides,
});

export const createTestWorkspace = (overrides = {}) => ({
  _id: nextId('ws'),
  name: 'Core Platform Workspace',
  description: 'Main production architecture domain and governance boundary',
  owner: 'user-sub-1',
  projects: [],
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createTestProject = (overrides = {}) => ({
  _id: nextId('prj'),
  name: 'Payment Processing Service',
  description: 'High-throughput transactional payment orchestration system',
  managerName: 'Sarah Connor',
  department: 'Platform',
  targetEnvironment: 'production ready',
  systemTopology: 'microservices',
  workspace: 'ws-1001',
  components: [],
  relationships: [],
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createTestComponent = (overrides = {}) => ({
  _id: nextId('comp'),
  name: 'Auth-Service',
  type: 'backend',
  componentType: 'backend',
  description: 'OAuth2 and JWT identity management provider',
  ownerTeam: 'Platform Team',
  deploymentEnvironment: 'Production',
  environment: 'Production',
  technologies: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
  status: 'active',
  relationships: [],
  ...overrides,
});

export const createTestRelationship = (overrides = {}) => ({
  _id: nextId('rel'),
  sourceId: 'comp-1001',
  targetId: 'comp-1002',
  type: 'calls',
  protocol: 'gRPC',
  project: 'prj-1001',
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createTestWizard = (overrides = {}) => ({
  _id: nextId('wiz'),
  currentStep: 'basicInfo',
  status: 'in_progress',
  data: {
    basicInfo: {
      name: 'Notification-Engine',
      type: 'queue',
      description: 'Distributed pub-sub event dispatching system',
    },
    techStack: {
      technologies: ['Kafka', 'Go', 'Docker'],
    },
    ownership: {
      ownerRefCode: 'DevOps Platform',
      environment: 'production',
      maintainers: ['lead@devops.org'],
    },
    relationships: [],
    documentation: {
      repoURL: 'https://github.com/atlas/notifications',
    },
  },
  ...overrides,
});

export const createTestTeam = (overrides = {}) => ({
  _id: nextId('team'),
  teamName: 'Core Platform Engineering',
  teamCode: 'CPE-PLAT',
  description: 'Responsible for infrastructure, core services, and observability',
  category: 'Platform Architecture',
  teamLead: 'user-1001',
  status: 'active',
  members: [],
  responsibilities: [],
  ...overrides,
});
