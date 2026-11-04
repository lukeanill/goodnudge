import type { ComponentType } from "react";
import { pricing } from "./pricing";
import { choice } from "./choice";
import { risk } from "./risk";
import { social } from "./social";
import { scarcity } from "./scarcity";
import { motivation } from "./motivation";
import { perception } from "./perception";
import { trust } from "./trust";

// Mockups shown inside the open card's two image slots, keyed by principle id.
// A principle without an entry shows the grey placeholder.
export type MockupPair = { dark: ComponentType; good: ComponentType };
export const mockups: Record<number, MockupPair> = { ...pricing, ...choice, ...risk, ...social, ...scarcity, ...motivation, ...perception, ...trust };
