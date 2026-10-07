import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { AstronautSuitUpGame } from './AstronautSuitUpGame';
import { RocketFuelingStation } from './RocketFuelingStation';
import { CockpitIgnitionDeck } from './CockpitIgnitionDeck';
import { AtmosphericJourney } from './AtmosphericJourney';
import { LunarDescentModule } from './LunarDescentModule';
import { MoonwalkCelebration } from './MoonwalkCelebration';
import { LunarSiteSelector } from './LunarSiteSelector';
import { CargoPackingGame } from './CargoPackingGame';
import { MissionDebriefView } from './MissionDebriefView';
import {
  LunarRegion,
  LUNAR_REGIONS,
} from '../../content/missionData';
import { useAppStore } from '../../state/useAppStore';

export type MissionStage =
  | 'suit_up'
  | 'fueling'
  | 'cockpit_ignition'
  | 'atmospheric_flight'
  | 'lunar_descent'
  | 'moonwalk'
  | 'select_site'
  | 'pack_cargo'
  | 'landing_descent'
  | 'debrief';

interface MoonLandingMissionProps {
  onExitMission?: () => void;
  onMissionComplete?: (earnedXP: number) => void;
  initialStage?: MissionStage;
}

export const MoonLandingMission: React.FC<MoonLandingMissionProps> = ({
  onExitMission,
  onMissionComplete,
  initialStage = 'suit_up',
}) => {
  const [currentStage, setCurrentStage] = useState<MissionStage>(initialStage);
  const [selectedSite, setSelectedSite] = useState<LunarRegion>(LUNAR_REGIONS[0]);
  const [selectedCargoIds, setSelectedCargoIds] = useState<string[]>([
    'primary-oxygen',
    'water-food-rations',
  ]);

  const handleExit = () => {
    if (onExitMission) {
      onExitMission();
    }
  };

  // 1. Stage 1: Spacesuit & Prep Room
  if (currentStage === 'suit_up') {
    return (
      <AstronautSuitUpGame
        onProceed={() => setCurrentStage('fueling')}
        onBackToHub={handleExit}
      />
    );
  }

  // 2. Stage 2: Cryogenic Rocket Fueling Pad
  if (currentStage === 'fueling') {
    return (
      <RocketFuelingStation
        onProceed={() => setCurrentStage('cockpit_ignition')}
        onBackToSuitUp={() => setCurrentStage('suit_up')}
      />
    );
  }

  // 3. Stage 3: Cockpit Flight Deck & Liftoff
  if (currentStage === 'cockpit_ignition') {
    return (
      <CockpitIgnitionDeck
        onProceed={() => setCurrentStage('atmospheric_flight')}
        onBackToFueling={() => setCurrentStage('fueling')}
      />
    );
  }

  // 4. Stage 4: Atmospheric Crossing & ISS Flyby
  if (currentStage === 'atmospheric_flight') {
    return (
      <AtmosphericJourney
        onMissionComplete={() => {
          useAppStore.getState().completeMission('moon');
          onMissionComplete?.(120);
          setCurrentStage('lunar_descent');
        }}
        onBack={() => setCurrentStage('cockpit_ignition')}
      />
    );
  }

  // 5. Stage 5: Trans-Lunar Flight & Descent Simulation
  if (currentStage === 'lunar_descent') {
    return (
      <LunarDescentModule
        onProceed={(site) => {
          useAppStore.getState().completeMission('moon');
          setSelectedSite(site);
          setCurrentStage('moonwalk');
        }}
        onBackToIgnition={() => setCurrentStage('atmospheric_flight')}
      />
    );
  }

  // 6. Stage 6: Moonwalk, Flag & Scientific Discovery
  if (currentStage === 'moonwalk') {
    return (
      <MoonwalkCelebration
        selectedSite={selectedSite}
        onPlayAgain={() => setCurrentStage('suit_up')}
        onExit={() => {
          useAppStore.getState().completeMission('moon');
          onMissionComplete?.(120);
          handleExit();
        }}
      />
    );
  }

  // Backward compatibility handlers for legacy components
  if (currentStage === 'select_site') {
    return (
      <LunarSiteSelector
        initialSiteId={selectedSite.id}
        onConfirmSite={(site) => {
          setSelectedSite(site);
          setCurrentStage('pack_cargo');
        }}
      />
    );
  }

  if (currentStage === 'pack_cargo') {
    return (
      <CargoPackingGame
        selectedSite={selectedSite}
        initialSelectedIds={selectedCargoIds}
        onConfirmPacking={(cargoIds) => {
          setSelectedCargoIds(cargoIds);
          setCurrentStage('lunar_descent');
        }}
        onBackToSiteSelect={() => setCurrentStage('select_site')}
      />
    );
  }

  return (
    <MissionDebriefView
      selectedSite={selectedSite}
      selectedCargoIds={selectedCargoIds}
      onPlayAgain={() => setCurrentStage('suit_up')}
      onExitMission={handleExit}
    />
  );
};
