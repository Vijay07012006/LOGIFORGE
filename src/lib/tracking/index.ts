import { SIMULATED_TRACKING_FIXTURES } from '@/data/tracking';
import type { SimulatedShipment } from '@/types/template';

export function lookupSimulatedShipment(query: string): SimulatedShipment | null {
  const normalized = query.trim().toUpperCase();
  if (!normalized) return null;

  return SIMULATED_TRACKING_FIXTURES[normalized] || null;
}

export function getSampleTrackingNumbers(): string[] {
  return Object.keys(SIMULATED_TRACKING_FIXTURES);
}

export function getAllSimulatedShipments(): SimulatedShipment[] {
  return Object.values(SIMULATED_TRACKING_FIXTURES);
}
