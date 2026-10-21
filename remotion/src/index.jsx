import React from 'react';
import {registerRoot, Composition, AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
const Teste = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 12}});
  const x = interpolate(f, [0, 60], [-300, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#F5F5F7', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{fontFamily: 'sans-serif', fontSize: 120, fontWeight: 800, color: '#0B1F3A', transform: `translateX(${x}px) scale(${0.6 + 0.4 * s})`}}>
        Governo passa<br/><span style={{color: '#B8955A'}}>o tijolo fica</span>
      </div>
    </AbsoluteFill>
  );
};
registerRoot(() => <Composition id="Teste" component={Teste} durationInFrames={60} fps={30} width={1080} height={1920} />);
