import { describe, it, expect } from 'vitest';
import {
  wizardReducer,
  WIZARD_ACTION_TYPES,
  INITIAL_WIZARD_STATE,
  WIZARD_STEPS,
} from '../../../src/context/wizardReducer';

describe('wizardReducer State Machine', () => {
  it('has correct initial state defaults', () => {
    expect(INITIAL_WIZARD_STATE).toEqual({
      wizardId: null,
      currentStep: 0,
      status: 'in_progress',
      data: {},
    });
    expect(WIZARD_STEPS).toEqual([
      'basicInfo',
      'techStack',
      'ownership',
      'relationships',
      'documentation',
      'review',
    ]);
  });

  it('handles SET_WIZARD_ID', () => {
    const nextState = wizardReducer(INITIAL_WIZARD_STATE, {
      type: WIZARD_ACTION_TYPES.SET_WIZARD_ID,
      payload: 'wiz-999',
    });
    expect(nextState.wizardId).toBe('wiz-999');
  });

  it('handles SET_CURRENT_STEP by step key or number', () => {
    const stateWithKey = wizardReducer(INITIAL_WIZARD_STATE, {
      type: WIZARD_ACTION_TYPES.SET_CURRENT_STEP,
      payload: 'techStack',
    });
    expect(stateWithKey.currentStep).toBe('techStack');

    const stateWithIndex = wizardReducer(INITIAL_WIZARD_STATE, {
      type: WIZARD_ACTION_TYPES.SET_CURRENT_STEP,
      payload: 3,
    });
    expect(stateWithIndex.currentStep).toBe(3);
  });

  it('advances currentStep correctly on NEXT_STEP with numerical steps', () => {
    let state = { ...INITIAL_WIZARD_STATE, currentStep: 0 };
    state = wizardReducer(state, { type: WIZARD_ACTION_TYPES.NEXT_STEP });
    expect(state.currentStep).toBe(1);

    state = wizardReducer(state, { type: WIZARD_ACTION_TYPES.NEXT_STEP });
    expect(state.currentStep).toBe(2);

    // Test capping at the last step
    state.currentStep = WIZARD_STEPS.length - 1;
    state = wizardReducer(state, { type: WIZARD_ACTION_TYPES.NEXT_STEP });
    expect(state.currentStep).toBe(WIZARD_STEPS.length - 1);
  });

  it('advances currentStep correctly on NEXT_STEP with named step keys', () => {
    let state = { ...INITIAL_WIZARD_STATE, currentStep: 'basicInfo' };
    state = wizardReducer(state, { type: WIZARD_ACTION_TYPES.NEXT_STEP });
    expect(state.currentStep).toBe('techStack');

    state = wizardReducer(state, { type: WIZARD_ACTION_TYPES.NEXT_STEP });
    expect(state.currentStep).toBe('ownership');

    // Test capping at review
    state = { ...INITIAL_WIZARD_STATE, currentStep: 'review' };
    state = wizardReducer(state, { type: WIZARD_ACTION_TYPES.NEXT_STEP });
    expect(state.currentStep).toBe('review');
  });

  it('decrements currentStep on PREV_STEP without going below 0 or first step', () => {
    let state = { ...INITIAL_WIZARD_STATE, currentStep: 2 };
    state = wizardReducer(state, { type: WIZARD_ACTION_TYPES.PREV_STEP });
    expect(state.currentStep).toBe(1);

    state = wizardReducer(state, { type: WIZARD_ACTION_TYPES.PREV_STEP });
    expect(state.currentStep).toBe(0);

    // Floor at 0
    state = wizardReducer(state, { type: WIZARD_ACTION_TYPES.PREV_STEP });
    expect(state.currentStep).toBe(0);

    // Named steps
    let namedState = { ...INITIAL_WIZARD_STATE, currentStep: 'ownership' };
    namedState = wizardReducer(namedState, { type: WIZARD_ACTION_TYPES.PREV_STEP });
    expect(namedState.currentStep).toBe('techStack');

    namedState = { ...INITIAL_WIZARD_STATE, currentStep: 'basicInfo' };
    namedState = wizardReducer(namedState, { type: WIZARD_ACTION_TYPES.PREV_STEP });
    expect(namedState.currentStep).toBe('basicInfo');
  });

  it('handles SET_STATUS', () => {
    const state = wizardReducer(INITIAL_WIZARD_STATE, {
      type: WIZARD_ACTION_TYPES.SET_STATUS,
      payload: 'finished',
    });
    expect(state.status).toBe('finished');
  });

  it('handles UPDATE_DATA by merging root data slices', () => {
    const state = wizardReducer(
      { ...INITIAL_WIZARD_STATE, data: { existing: true } },
      {
        type: WIZARD_ACTION_TYPES.UPDATE_DATA,
        payload: { basicInfo: { name: 'Billing-Service' } },
      }
    );
    expect(state.data).toEqual({
      existing: true,
      basicInfo: { name: 'Billing-Service' },
    });
  });

  it('handles UPDATE_STEP_DATA by deeply merging specific step slices', () => {
    let state = {
      ...INITIAL_WIZARD_STATE,
      data: {
        basicInfo: { name: 'Auth-Service', type: 'backend' },
        ownership: { ownerRefCode: 'Security' },
      },
    };

    state = wizardReducer(state, {
      type: WIZARD_ACTION_TYPES.UPDATE_STEP_DATA,
      payload: {
        stepKey: 'basicInfo',
        data: { description: 'Handles authentication' },
      },
    });

    expect(state.data.basicInfo).toEqual({
      name: 'Auth-Service',
      type: 'backend',
      description: 'Handles authentication',
    });
    // Sibling step should remain preserved
    expect(state.data.ownership).toEqual({ ownerRefCode: 'Security' });
  });

  it('handles INIT_WIZARD to hydrate from server payload', () => {
    const serverPayload = {
      wizardId: 'wiz-500',
      currentStep: 'ownership',
      status: 'in_progress',
      data: {
        basicInfo: { name: 'Queue-Worker', type: 'queue' },
      },
    };

    const state = wizardReducer(INITIAL_WIZARD_STATE, {
      type: WIZARD_ACTION_TYPES.INIT_WIZARD,
      payload: serverPayload,
    });

    expect(state.wizardId).toBe('wiz-500');
    expect(state.currentStep).toBe('ownership');
    expect(state.data.basicInfo.name).toBe('Queue-Worker');
  });

  it('handles RESET_WIZARD with and without custom initial state', () => {
    const dirtyState = {
      wizardId: 'wiz-abc',
      currentStep: 'review',
      status: 'finished',
      data: { basicInfo: { name: 'Old' } },
    };

    const resetState = wizardReducer(dirtyState, {
      type: WIZARD_ACTION_TYPES.RESET_WIZARD,
    });
    expect(resetState).toEqual(INITIAL_WIZARD_STATE);

    const customResetState = wizardReducer(dirtyState, {
      type: WIZARD_ACTION_TYPES.RESET_WIZARD,
      payload: { wizardId: 'wiz-custom', currentStep: 'techStack' },
    });
    expect(customResetState.wizardId).toBe('wiz-custom');
    expect(customResetState.currentStep).toBe('techStack');
  });
});
