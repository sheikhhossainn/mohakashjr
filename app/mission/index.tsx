import React from 'react';
import { useRouter } from 'expo-router';
import { MoonLandingMission } from '../../src/components/mission';

export default function MissionIndex() {
  const router = useRouter();

  return (
    <MoonLandingMission
      onExitMission={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(tabs)/mission');
        }
      }}
    />
  );
}
