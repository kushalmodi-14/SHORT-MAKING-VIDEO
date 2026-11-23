import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface InfoCardProps {
  category_tag?: string;
  headline?: string;
  points?: string[];
  source_text?: string;
  accent_color?: string;
  duration_sec?: number;
}

export const defaultInfoCardProps: InfoCardProps = {
  category_tag: 'GOLD RATE TODAY',
  headline: 'Gold Prices Just Hit a New Record High',
  points: [
    '24K Gold climbed ₹850 per 10g in morning trade',
    'Global central banks continue aggressive bullion purchases',
    'Analysts expect volatility ahead of upcoming Fed policy',
  ],
  source_text: 'MCX India · Daily Market Update',
  accent_color: '#F59E0B',
  duration_sec: 30,
};

export const InfoCard: React.FC<InfoCardProps> = ({
  category_tag = defaultInfoCardProps.category_tag,
  headline = defaultInfoCardProps.headline,
  points = defaultInfoCardProps.points || [],
  source_text = defaultInfoCardProps.source_text,
  accent_color = defaultInfoCardProps.accent_color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animations
  const headerSpring = spring({ frame, fps, config: { damping: 14 } });
  const headerOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at 50% 20%, #1e1b4b 0%, #09090b 70%, #030712 100%)',
        color: '#FFFFFF',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '120px 80px 100px 80px',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header section */}
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${(1 - headerSpring) * -30}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Category Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '12px 28px',
            borderRadius: '9999px',
            backgroundColor: `${accent_color}22`,
            border: `2px solid ${accent_color}88`,
            color: accent_color,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 40,
            boxShadow: `0 0 25px ${accent_color}33`,
          }}
        >
          {category_tag}
        </div>

        {/* Big Bold Headline */}
        <h1
          style={{
            fontSize: 58,
            fontWeight: 900,
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
            margin: 0,
            maxWidth: 920,
            color: '#F8FAFC',
            textShadow: '0 4px 30px rgba(0,0,0,0.8)',
          }}
        >
          {headline}
        </h1>
      </div>

      {/* Center Bullet Points */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
          margin: '60px 0',
          width: '100%',
        }}
      >
        {points.map((pt, idx) => {
          // Stagger each point by 18 frames (~600ms at 30fps)
          const delay = 25 + idx * 18;
          const pointFrame = Math.max(0, frame - delay);
          const spr = spring({ frame: pointFrame, fps, config: { damping: 15, mass: 0.8 } });
          const opacity = interpolate(pointFrame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
          const translateY = (1 - spr) * 40;

          return (
            <div
              key={idx}
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 28,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 24,
                padding: '32px 36px',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              }}
            >
              {/* Number Badge */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  minWidth: 56,
                  borderRadius: 16,
                  backgroundColor: accent_color,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 900,
                  boxShadow: `0 4px 16px ${accent_color}66`,
                }}
              >
                {idx + 1}
              </div>

              {/* Point Text */}
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 600,
                  lineHeight: 1.4,
                  color: '#E2E8F0',
                  marginTop: 4,
                }}
              >
                {pt}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Attribution */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
          opacity: interpolate(frame, [45, 60], [0, 0.8], { extrapolateRight: 'clamp' }),
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: 30,
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 500, color: '#94A3B8', letterSpacing: '0.04em' }}>
          {source_text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
