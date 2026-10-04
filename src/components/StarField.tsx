import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface StarFieldProps {
  count?: number;
}

/**
 * StarField — a static, deterministic sprinkle of stars.
 * No animation: zero cost, safe for reduced-motion, keeps the "space" feel on every screen.
 */
export const StarField: React.FC<StarFieldProps> = ({ count = 36 }) => {
  const stars = useMemo(() => {
    let seed = 7;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    return Array.from({ length: count }, () => ({
      left: `${(rnd() * 100).toFixed(1)}%` as `${number}%`,
      top: `${(rnd() * 100).toFixed(1)}%` as `${number}%`,
      size: rnd() > 0.85 ? 3 : rnd() > 0.5 ? 2 : 1.5,
      opacity: 0.25 + rnd() * 0.5,
    }));
  }, [count]);

  return (
    <View style={styles.layer} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {stars.map((s, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            borderRadius: s.size,
            backgroundColor: Colors.text,
            opacity: s.opacity,
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
  },
});
