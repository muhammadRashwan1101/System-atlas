import { useReducer, useMemo, useCallback } from "react";
import { WizardContext } from "./WizardContext";
import {
  WIZARD_ACTION_TYPES,
  INITIAL_WIZARD_STATE,
  wizardReducer,
} from "./wizardReducer";

export default function WizardProvider({ children, initialValues }) {
  const [state, dispatch] = useReducer(
    wizardReducer,
    initialValues
      ? { ...INITIAL_WIZARD_STATE, ...initialValues }
      : INITIAL_WIZARD_STATE
  );

  const setWizardId = useCallback((wizardId) => {
    dispatch({ type: WIZARD_ACTION_TYPES.SET_WIZARD_ID, payload: wizardId });
  }, []);

  const setCurrentStep = useCallback((step) => {
    dispatch({ type: WIZARD_ACTION_TYPES.SET_CURRENT_STEP, payload: step });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: WIZARD_ACTION_TYPES.NEXT_STEP });
  }, []);

  const prevStep = useCallback(() => {
    dispatch({ type: WIZARD_ACTION_TYPES.PREV_STEP });
  }, []);

  const setStatus = useCallback((status) => {
    dispatch({ type: WIZARD_ACTION_TYPES.SET_STATUS, payload: status });
  }, []);

  const updateData = useCallback((payload) => {
    dispatch({ type: WIZARD_ACTION_TYPES.UPDATE_DATA, payload });
  }, []);

  const updateStepData = useCallback((stepKey, data) => {
    dispatch({
      type: WIZARD_ACTION_TYPES.UPDATE_STEP_DATA,
      payload: { stepKey, data },
    });
  }, []);

  const resetWizard = useCallback((customInitialState) => {
    dispatch({
      type: WIZARD_ACTION_TYPES.RESET_WIZARD,
      payload: customInitialState,
    });
  }, []);

  const initWizard = useCallback((config) => {
    dispatch({
      type: WIZARD_ACTION_TYPES.INIT_WIZARD,
      payload: config,
    });
  }, []);

  const value = useMemo(
    () => ({
      wizardId: state.wizardId,
      currentStep: state.currentStep,
      status: state.status,
      data: state.data,
      setWizardId,
      setCurrentStep,
      nextStep,
      prevStep,
      setStatus,
      updateData,
      updateStepData,
      resetWizard,
      initWizard,
      dispatch,
    }),
    [
      state.wizardId,
      state.currentStep,
      state.status,
      state.data,
      setWizardId,
      setCurrentStep,
      nextStep,
      prevStep,
      setStatus,
      updateData,
      updateStepData,
      resetWizard,
      initWizard,
    ]
  );

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  );
}
