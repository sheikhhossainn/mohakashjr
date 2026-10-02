import React from 'react';
import { NightSkyCanvas } from './NightSkyCanvas';

/**
 * CosmicBackground — Updated to NightSkyCanvas aesthetic for app-wide consistency.
 * Retained for backward-compatibility with existing screens and tests.
 */
export const CosmicBackground: React.FC = () => {
  return <NightSkyCanvas />;
};
