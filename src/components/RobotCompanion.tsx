import React from 'react';
import './RobotCompanion.css';

export type RobotState = 'idle' | 'thinking' | 'speaking' | 'resting';

interface RobotCompanionProps {
  state?: RobotState;
  size?: 'sm' | 'md' | 'lg';
  showStage?: boolean;
  className?: string;
  onToggleRest?: () => void;
}

export const RobotCompanion: React.FC<RobotCompanionProps> = ({
  state = 'idle',
  size = 'md',
  showStage = true,
  className = '',
  onToggleRest
}) => {
  const auraClass = 
    state === 'thinking' ? 'aura-analyzing' :
    state === 'speaking' ? 'aura-responding' :
    state === 'resting' ? 'aura-sleeping' :
    'aura-ready';

  const motionClass = `motion-${state}`;

  const imageSrc = 
    state === 'thinking' ? '/assets/robot/robot.png' :
    state === 'resting' ? '/assets/robot/robot.png' :
    state === 'speaking' ? '/assets/robot.png' :
    '/assets/robot/robot.png';

  const sizeStyles = {
    sm: { img: 'w-9 h-9 sm:w-10 sm:h-10', stage: showStage ? 'py-1' : 'py-0' },
    md: { img: 'w-24 h-24 sm:w-28 sm:h-28', stage: 'py-2' },
    lg: { img: 'w-32 h-32 sm:w-36 sm:h-36', stage: 'py-4' }
  }[size];

  return (
    <div className={`robot-companion-container ${className}`}>
      <div className={`living-character-stage ${sizeStyles.stage}`}>
        {/* Soft Radial Ambient Lighting Aura */}
        <div className={`living-aura-backdrop ${auraClass}`} />

        {/* Holographic Pedestal & Floor Ring (shown on medium/large) */}
        {showStage && size !== 'sm' && (
          <>
            <div className="living-pedestal-ring" />
            <div className="living-floor-shadow" />
          </>
        )}

        {/* Robot Figure Foreground Wrapper */}
        <div 
          className={`robot-motion-chassis ${motionClass} cursor-pointer`}
          onClick={onToggleRest}
          title={state === 'resting' ? 'Click to wake robot' : 'Living Robot Assistant Companion'}
        >
          <img
            src={imageSrc}
            alt="Tool Finder Robot Assistant"
            className={`robot-foreground-img ${sizeStyles.img}`}
            loading="eager"
            draggable={false}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/robot.png';
            }}
          />

          {/* Thinking Scanning Beam Overlay */}
          {state === 'thinking' && (
            <div className="scanning-beam-overlay" aria-hidden="true">
              <div className="beam-glow-line" />
            </div>
          )}

          {/* Speaking Equalizer */}
          {state === 'speaking' && (
            <div className="speaking-soundwave-aura" aria-hidden="true">
              <span className="wave-bar wb-1" />
              <span className="wave-bar wb-2" />
              <span className="wave-bar wb-3" />
              <span className="wave-bar wb-4" />
            </div>
          )}

          {/* Sleeping ZZZ Particles */}
          {state === 'resting' && (
            <div className="sleep-zzz-particles" aria-hidden="true">
              <span className="zzz-item z1">z</span>
              <span className="zzz-item z2">Z</span>
              <span className="zzz-item z3">Z</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
