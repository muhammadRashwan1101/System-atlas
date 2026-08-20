import { createContext, useContext } from "react";

export const WizardContext = createContext(null);

export default function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
}
