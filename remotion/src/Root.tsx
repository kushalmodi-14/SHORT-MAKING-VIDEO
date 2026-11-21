import React from 'react';
import { Composition } from 'remotion';
import { shots } from './registry.gen';
import { ShortTemplate, defaultShortProps } from './shots/ShortTemplate';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ShortTemplate"
        component={ShortTemplate as any}
        defaultProps={defaultShortProps}
        durationInFrames={35 * 30}
        fps={30}
        width={1080}
        height={1920}
      />
      {shots.map(({ Comp, config }) => (
        <Composition
          key={config.id}
          id={config.id}
          component={Comp as React.FC}
          durationInFrames={Math.max(1, Math.round(config.durationInSeconds * config.fps))}
          fps={config.fps}
          width={config.width}
          height={config.height}
        />
      ))}
    </>
  );
};
