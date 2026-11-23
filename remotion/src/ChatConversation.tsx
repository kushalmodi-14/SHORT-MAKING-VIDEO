import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface ChatMessage {
  sender: string;
  text: string;
}

export interface ChatConversationProps {
  messages?: ChatMessage[];
  persona_left?: string;
  persona_right?: string;
  bubble_left_color?: string;
  bubble_right_color?: string;
  duration_sec?: number;
}

export const defaultChatProps: ChatConversationProps = {
  persona_left: 'AI Expert',
  persona_right: 'You',
  bubble_left_color: '#1E1E2E',
  bubble_right_color: '#7C3AED',
  duration_sec: 30,
  messages: [
    { sender: 'AI Expert', text: 'Did you hear what happened to gold prices today?' },
    { sender: 'You', text: 'No, what happened? Did it spike again?' },
    { sender: 'AI Expert', text: 'It jumped ₹850 in under 2 hours after the MCX open!' },
    { sender: 'You', text: 'Should I buy now or wait for a pullback?' },
    { sender: 'AI Expert', text: 'Watch the ₹76,000 support level before taking new positions.' },
  ],
};

export const ChatConversation: React.FC<ChatConversationProps> = ({
  messages = defaultChatProps.messages || [],
  persona_left = defaultChatProps.persona_left,
  persona_right = defaultChatProps.persona_right,
  bubble_left_color = defaultChatProps.bubble_left_color,
  bubble_right_color = defaultChatProps.bubble_right_color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Each message appears every 24 frames (~800ms)
  const delayStep = 24;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0A',
        color: '#FFFFFF',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '120px 60px 100px 60px',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header / Chat Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '24px 32px',
          backgroundColor: '#18181B',
          borderRadius: 24,
          border: '1px solid #27272A',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            backgroundColor: bubble_right_color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            fontWeight: 800,
          }}
        >
          💬
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#F4F4F5' }}>
            {persona_left} & {persona_right}
          </div>
          <div style={{ fontSize: 20, color: '#10B981', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
            Active now
          </div>
        </div>
      </div>

      {/* Message Flow */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
          margin: '40px 0',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {messages.map((msg, i) => {
          const isRight = msg.sender === persona_right || msg.sender === 'You';
          const msgStart = 15 + i * delayStep;
          const msgFrame = Math.max(0, frame - msgStart);

          if (frame < msgStart - 10) {
            return null; // not yet reached
          }

          // Show typing indicator in the 10 frames preceding the message
          const isTyping = frame >= msgStart - 10 && frame < msgStart;
          if (isTyping) {
            return (
              <div
                key={`typing-${i}`}
                style={{
                  alignSelf: isRight ? 'flex-end' : 'flex-start',
                  backgroundColor: '#1F2937',
                  padding: '16px 24px',
                  borderRadius: 20,
                  display: 'flex',
                  gap: 8,
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#9CA3AF' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#9CA3AF' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#9CA3AF' }} />
              </div>
            );
          }

          const spr = spring({ frame: msgFrame, fps, config: { damping: 14, mass: 0.7 } });
          const opacity = interpolate(msgFrame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
          const scale = interpolate(spr, [0, 1], [0.85, 1]);

          return (
            <div
              key={i}
              style={{
                alignSelf: isRight ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                opacity,
                transform: `scale(${scale})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: isRight ? 'flex-end' : 'flex-start',
              }}
            >
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#71717A',
                  marginBottom: 6,
                  paddingLeft: 4,
                  paddingRight: 4,
                }}
              >
                {msg.sender}
              </span>

              <div
                style={{
                  backgroundColor: isRight ? bubble_right_color : bubble_left_color,
                  color: '#FFFFFF',
                  padding: '24px 32px',
                  borderRadius: 28,
                  borderBottomRightRadius: isRight ? 6 : 28,
                  borderBottomLeftRadius: isRight ? 28 : 6,
                  fontSize: 32,
                  fontWeight: 600,
                  lineHeight: 1.4,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input bar mockup */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '22px 32px',
          backgroundColor: '#18181B',
          borderRadius: 36,
          border: '1px solid #27272A',
        }}
      >
        <span style={{ fontSize: 24, color: '#71717A' }}>Reply to this conversation...</span>
        <span style={{ fontSize: 26, color: bubble_right_color, fontWeight: 700 }}>Send</span>
      </div>
    </AbsoluteFill>
  );
};
