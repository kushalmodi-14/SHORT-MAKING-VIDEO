import React from 'react';
import { Composition } from 'remotion';
import { shots } from './registry.gen';
import { ShortTemplate, defaultShortProps } from './shots/ShortTemplate';
import { InfoCard, defaultInfoCardProps } from './InfoCard';
import { ChatConversation, defaultChatProps } from './ChatConversation';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="InfoCard"
        component={InfoCard as any}
        defaultProps={defaultInfoCardProps}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ChatConversation"
        component={ChatConversation as any}
        defaultProps={defaultChatProps}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortTemplate"
        component={ShortTemplate as any}
        defaultProps={defaultShortProps}
        durationInFrames={35 * 30}
        fps={30}
        width={1080}
        height={1920}
      />
      {shots
        .filter(({ config }) => config.id !== 'ShortTemplate')
        .map(({ Comp, config }) => (
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
