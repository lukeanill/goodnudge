import type { ComponentType } from "react";
import { pricing } from "./pricing";

// Mockups shown inside the open card's two image slots, keyed by principle id.
// A principle without an entry shows the grey placeholder.
export type MockupPair = { dark: ComponentType; good: ComponentType };
export const mockups: Record<number, MockupPair> = { ...pricing };
