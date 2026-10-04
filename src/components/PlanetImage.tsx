import React from 'react';
import Svg, {
  Circle,
  Ellipse,
  Path,
  Rect,
  Defs,
  ClipPath,
  G,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import type { DestinationId } from '../content/spaceDestinations';

interface PlanetImageProps {
  id: DestinationId;
  size?: number;
}

const BODY_R = 38;

/**
 * PlanetImage — vector illustration of the Moon and each planet.
 * Pure SVG, so it works offline and stays sharp at any size.
 */
export const PlanetImage: React.FC<PlanetImageProps> = ({ id, size = 96 }) => {
  const uid = `pl-${id}`;
  const saturn = id === 'saturn';
  const r = saturn ? 26 : BODY_R;

  const colors: Record<DestinationId, [string, string]> = {
    moon: ['#F1F5F9', '#8C97A8'],
    mercury: ['#C9BFB4', '#6E645B'],
    venus: ['#FBE3A1', '#C98B2B'],
    mars: ['#F4A67F', '#A93F27'],
    jupiter: ['#F0D4AA', '#B98756'],
    saturn: ['#F3DDA4', '#C8A55E'],
    uranus: ['#CFF4F4', '#55AEBF'],
    neptune: ['#6F9BFF', '#1F3C93'],
  };
  const [light, dark] = colors[id];

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id={`${uid}-base`} x1="0.15" y1="0.1" x2="0.85" y2="0.95">
          <Stop offset="0" stopColor={light} />
          <Stop offset="1" stopColor={dark} />
        </LinearGradient>
        {/* Sphere shading: lit from the top-left */}
        <RadialGradient id={`${uid}-shade`} cx="0.35" cy="0.3" rx="0.85" ry="0.85">
          <Stop offset="0.45" stopColor="#000000" stopOpacity="0" />
          <Stop offset="1" stopColor="#000000" stopOpacity="0.45" />
        </RadialGradient>
        <ClipPath id={`${uid}-clip`}>
          <Circle cx="50" cy="50" r={r} />
        </ClipPath>
      </Defs>

      {/* Saturn's rings, back half */}
      {saturn && (
        <G rotation={-20} origin="50, 50">
          <Ellipse cx="50" cy="50" rx="47" ry="12" fill="none" stroke="#D9BE86" strokeWidth="5" opacity={0.7} />
          <Ellipse cx="50" cy="50" rx="39" ry="9.5" fill="none" stroke="#B89A62" strokeWidth="2.5" opacity={0.6} />
        </G>
      )}

      {/* Uranus's faint upright rings (it spins on its side) */}
      {id === 'uranus' && (
        <Ellipse cx="50" cy="50" rx="9" ry="46" fill="none" stroke="#DDF7F7" strokeWidth="1.8" opacity={0.55} />
      )}

      <Circle cx="50" cy="50" r={r} fill={`url(#${uid}-base)`} />

      <G clipPath={`url(#${uid}-clip)`}>
        {id === 'moon' && (
          <G>
            <Circle cx="36" cy="38" r="8" fill="#7C8798" opacity={0.45} />
            <Circle cx="62" cy="58" r="10" fill="#7C8798" opacity={0.4} />
            <Circle cx="44" cy="68" r="5" fill="#7C8798" opacity={0.45} />
            <Circle cx="64" cy="34" r="4" fill="#7C8798" opacity={0.4} />
            <Circle cx="30" cy="58" r="3.5" fill="#7C8798" opacity={0.4} />
          </G>
        )}

        {id === 'mercury' && (
          <G>
            <Circle cx="38" cy="40" r="7" fill="#5A5148" opacity={0.45} />
            <Circle cx="60" cy="52" r="9" fill="#5A5148" opacity={0.4} />
            <Circle cx="46" cy="66" r="5" fill="#5A5148" opacity={0.45} />
            <Circle cx="66" cy="34" r="3.5" fill="#5A5148" opacity={0.4} />
            <Circle cx="32" cy="58" r="3" fill="#5A5148" opacity={0.4} />
          </G>
        )}

        {id === 'venus' && (
          <G>
            <Path d="M 8 40 Q 30 30 50 40 T 92 38" stroke="#FFF4D0" strokeWidth="5" fill="none" opacity={0.45} />
            <Path d="M 8 56 Q 30 46 50 56 T 92 54" stroke="#A8691A" strokeWidth="5" fill="none" opacity={0.3} />
            <Path d="M 8 70 Q 30 62 50 70 T 92 68" stroke="#FFF4D0" strokeWidth="4" fill="none" opacity={0.35} />
          </G>
        )}

        {id === 'mars' && (
          <G>
            <Ellipse cx="50" cy="15" rx="18" ry="8" fill="#FFFFFF" opacity={0.9} />
            <Path d="M 30 48 Q 42 42 50 52 Q 40 60 30 56 Z" fill="#7A2B1B" opacity={0.45} />
            <Path d="M 56 60 Q 68 56 72 66 Q 62 72 56 66 Z" fill="#7A2B1B" opacity={0.4} />
            <Circle cx="62" cy="40" r="4" fill="#7A2B1B" opacity={0.35} />
          </G>
        )}

        {id === 'jupiter' && (
          <G>
            <Rect x="10" y="26" width="80" height="7" fill="#B98756" opacity={0.7} />
            <Rect x="10" y="40" width="80" height="9" fill="#9C6A3F" opacity={0.6} />
            <Rect x="10" y="55" width="80" height="6" fill="#F6E4C4" opacity={0.55} />
            <Rect x="10" y="66" width="80" height="8" fill="#B98756" opacity={0.65} />
            <Ellipse cx="62" cy="58" rx="8" ry="5" fill="#C2492F" opacity={0.9} />
          </G>
        )}

        {saturn && (
          <G>
            <Rect x="20" y="38" width="60" height="5" fill="#B89A62" opacity={0.5} />
            <Rect x="20" y="50" width="60" height="6" fill="#FFF0C8" opacity={0.45} />
            <Rect x="20" y="62" width="60" height="4" fill="#B89A62" opacity={0.45} />
          </G>
        )}

        {id === 'uranus' && (
          <Ellipse cx="38" cy="36" rx="14" ry="7" fill="#FFFFFF" opacity={0.25} transform="rotate(-20 38 36)" />
        )}

        {id === 'neptune' && (
          <G>
            <Ellipse cx="42" cy="46" rx="9" ry="5" fill="#12266B" opacity={0.6} />
            <Path d="M 14 62 Q 40 56 70 64" stroke="#E6EEFF" strokeWidth="2.5" fill="none" opacity={0.55} />
            <Path d="M 30 32 Q 50 28 76 34" stroke="#E6EEFF" strokeWidth="2" fill="none" opacity={0.4} />
          </G>
        )}

        {/* Shading over the surface detail */}
        <Circle cx="50" cy="50" r={r} fill={`url(#${uid}-shade)`} />
      </G>

      {/* Saturn's rings, front half */}
      {saturn && (
        <G rotation={-20} origin="50, 50">
          <Path d="M 3 50 A 47 12 0 0 0 97 50" fill="none" stroke="#E5CB94" strokeWidth="5" />
          <Path d="M 11 50 A 39 9.5 0 0 0 89 50" fill="none" stroke="#C4A56C" strokeWidth="2.5" />
        </G>
      )}
    </Svg>
  );
};
