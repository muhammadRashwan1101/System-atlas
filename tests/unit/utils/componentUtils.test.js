import { describe, it, expect } from 'vitest';
import { getIconType } from '../../../src/components/ComponentsManagement/componentUtils';

describe('componentUtils - getIconType', () => {
  it('maps database keywords to database icon', () => {
    expect(getIconType('database')).toBe('database');
    expect(getIconType('Postgres-DB')).toBe('database');
  });

  it('maps gateway and proxy keywords to hub icon', () => {
    expect(getIconType('api-gateway')).toBe('hub');
    expect(getIconType('reverse-proxy')).toBe('hub');
    expect(getIconType('service-hub')).toBe('hub');
  });

  it('maps frontend and UI keywords to screen icon', () => {
    expect(getIconType('frontend')).toBe('screen');
    expect(getIconType('react-ui')).toBe('screen');
    expect(getIconType('mobile-screen')).toBe('screen');
  });

  it('maps infrastructure and queue keywords to terminal icon', () => {
    expect(getIconType('queue')).toBe('terminal');
    expect(getIconType('worker-node')).toBe('terminal');
    expect(getIconType('infra-agent')).toBe('terminal');
  });

  it('maps payment and card keywords to card icon', () => {
    expect(getIconType('payment-service')).toBe('card');
    expect(getIconType('credit-card-handler')).toBe('card');
  });

  it('falls back to brain icon for unknown or empty types', () => {
    expect(getIconType('')).toBe('brain');
    expect(getIconType(null)).toBe('brain');
    expect(getIconType('ai-service')).toBe('brain');
  });
});
