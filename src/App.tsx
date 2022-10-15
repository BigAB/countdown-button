import { useState, useRef, ElementRef, ComponentPropsWithoutRef } from 'react';

import { SpinningLogo, CountdownButton } from './components';
import './style.css';

type CountdownStatus = Parameters<
  Required<ComponentPropsWithoutRef<typeof CountdownButton>>['onStatusChange']
>[0];

export function App() {
  const [splodin, setSplodin] = useState(false);
  const [status, setStatus] = useState<CountdownStatus>('idle');

  const countdownButtonRef = useRef<ElementRef<typeof CountdownButton>>(null);

  const handleCountdownComplete = () => setSplodin(true);
  const handleCountdownCancel = () => countdownButtonRef.current?.cancel();
  const handleAnimationEnd = () => {
    setSplodin(false);
    if (status === 'completed') {
      countdownButtonRef.current?.reset();
    }
  };

  return (
    <>
      <SpinningLogo
        className={splodin ? 'splode' : ''}
        onAnimationEnd={handleAnimationEnd}
      />

      <CountdownButton
        ref={countdownButtonRef}
        renderComplete="Lift off!"
        onCompleted={handleCountdownComplete}
        onStatusChange={setStatus}
      >
        Proceed to Launch
      </CountdownButton>

      <button
        style={{
          transform: 'scale(0.6)',
          marginLeft: 'auto',
          visibility: status === 'counting' ? 'visible' : 'hidden',
        }}
        onClick={handleCountdownCancel}
      >
        Cancel Countdown
      </button>
    </>
  );
}
