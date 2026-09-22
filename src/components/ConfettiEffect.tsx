import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { Colors } from '../theme/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ConfettiPiece {
  id: number;
  x: number;
  size: number;
  color: string;
  shape: 'rect' | 'circle';
  delay: number;
  duration: number;
  rotateDeg: string;
}

const CONFETTI_COLORS = [
  Colors.gold,
  Colors.cyan,
  Colors.pink,
  Colors.emerald,
  Colors.purple,
  '#FFD123',
  '#38BDF8',
  '#FF7675',
];

export const ConfettiEffect: React.FC<{ active?: boolean }> = ({ active = true }) => {
  if (!active) return null;

  const pieces: ConfettiPiece[] = useRef(
    Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      x: Math.random() * SCREEN_WIDTH,
      size: Math.random() * 8 + 6,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      shape: (i % 2 === 0 ? 'rect' : 'circle') as 'rect' | 'circle',
      delay: Math.random() * 500,
      duration: Math.random() * 1800 + 2200,
      rotateDeg: `${Math.random() * 720 - 360}deg`,
    }))
  ).current;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((piece) => (
        <FallingPiece key={piece.id} piece={piece} />
      ))}
    </View>
  );
};

const FallingPiece: React.FC<{ piece: ConfettiPiece }> = ({ piece }) => {
  const fallAnim = useRef(new Animated.Value(0)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(piece.delay),
        Animated.parallel([
          Animated.timing(fallAnim, {
            toValue: 1,
            duration: piece.duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(swayAnim, {
              toValue: 15,
              duration: piece.duration / 3,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(swayAnim, {
              toValue: -15,
              duration: piece.duration / 3,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(swayAnim, {
              toValue: 0,
              duration: piece.duration / 3,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
        ]),
      ])
    ).start();
  }, []);

  const translateY = fallAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, SCREEN_HEIGHT + 20],
  });

  const opacity = fallAnim.interpolate({
    inputRange: [0, 0.1, 0.85, 1],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left: piece.x,
          width: piece.size,
          height: piece.shape === 'rect' ? piece.size * 1.5 : piece.size,
          borderRadius: piece.shape === 'circle' ? piece.size / 2 : 2,
          backgroundColor: piece.color,
          transform: [{ translateY }, { translateX: swayAnim }, { rotate: piece.rotateDeg }],
          opacity,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: 0,
    zIndex: 9999,
  },
});
