export const WIZARD_ACTION_TYPES = {
  SET_WIZARD_ID: "SET_WIZARD_ID",
  SET_CURRENT_STEP: "SET_CURRENT_STEP",
  NEXT_STEP: "NEXT_STEP",
  PREV_STEP: "PREV_STEP",
  SET_STATUS: "SET_STATUS",
  UPDATE_DATA: "UPDATE_DATA",
  UPDATE_STEP_DATA: "UPDATE_STEP_DATA",
  RESET_WIZARD: "RESET_WIZARD",
  INIT_WIZARD: "INIT_WIZARD",
};

export const INITIAL_WIZARD_STATE = {
  wizardId: null,
  currentStep: 0,
  status: "in_progress",
  data: {},
};

export const WIZARD_STEPS = [
  "basicInfo",
  "techStack",
  "ownership",
  "relationships",
  "documentation",
  "review",
];

const getStepIndex = (step) => {
  if (typeof step === "number") return step;
  if (!step) return 0;
  if (step === "relationship") return 3;
  const idx = WIZARD_STEPS.indexOf(step);
  return idx !== -1 ? idx : 0;
};

export function wizardReducer(state, action) {
  switch (action.type) {
    case WIZARD_ACTION_TYPES.SET_WIZARD_ID:
      return {
        ...state,
        wizardId: action.payload,
      };

    case WIZARD_ACTION_TYPES.SET_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload,
      };

    case WIZARD_ACTION_TYPES.NEXT_STEP: {
      const currentIdx = getStepIndex(state.currentStep);
      const nextIdx = Math.min(WIZARD_STEPS.length - 1, currentIdx + 1);
      return {
        ...state,
        currentStep:
          typeof state.currentStep === "number"
            ? nextIdx
            : WIZARD_STEPS[nextIdx],
      };
    }

    case WIZARD_ACTION_TYPES.PREV_STEP: {
      const currentIdx = getStepIndex(state.currentStep);
      const prevIdx = Math.max(0, currentIdx - 1);
      return {
        ...state,
        currentStep:
          typeof state.currentStep === "number"
            ? prevIdx
            : WIZARD_STEPS[prevIdx],
      };
    }

    case WIZARD_ACTION_TYPES.SET_STATUS:
      return {
        ...state,
        status: action.payload,
      };

    case WIZARD_ACTION_TYPES.UPDATE_DATA:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
        },
      };

    case WIZARD_ACTION_TYPES.UPDATE_STEP_DATA: {
      const { stepKey, data } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          [stepKey]: {
            ...(state.data[stepKey] || {}),
            ...data,
          },
        },
      };
    }

    case WIZARD_ACTION_TYPES.INIT_WIZARD:
      return {
        ...INITIAL_WIZARD_STATE,
        ...action.payload,
        data: {
          ...INITIAL_WIZARD_STATE.data,
          ...(action.payload?.data || {}),
        },
      };

    case WIZARD_ACTION_TYPES.RESET_WIZARD:
      return action.payload
        ? { ...INITIAL_WIZARD_STATE, ...action.payload }
        : INITIAL_WIZARD_STATE;

    default:
      return state;
  }
}
