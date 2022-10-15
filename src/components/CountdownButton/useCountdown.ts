import { useState, useEffect, useCallback, useRef } from 'react';

export type CountdownStatus = 'idle' | 'counting' | 'completed';

interface Params {
  countdownFrom?: number;
  defaultStatus?: CountdownStatus;
  onCompleted?: () => void;
  onCanceled?: () => void;
  onReset?: () => void;
  onStatusChange?: (newStatus: CountdownStatus) => void;
}

export const useCountdown = ({
  countdownFrom = 5,
  defaultStatus = 'idle',
  onCompleted,
  onCanceled,
  onReset,
  onStatusChange,
}: Params) => {
  // State
  const [status, setStatus] = useState<CountdownStatus>(defaultStatus);
  const [secondsLeft, setSecondsLeft] = useState(countdownFrom);

  // Actions
  const cancel = useCallback(() => {
    setStatus((status) => {
      if (status === 'counting') {
        onCanceled?.();
        return 'idle';
      }
      return status;
    });
  }, [onCanceled]);

  const reset = useCallback(() => {
    setStatus((status) => {
      if (status === 'counting') onCanceled?.();
      if (status === 'completed') onReset?.();
      return 'idle';
    });
  }, [onCanceled, onReset]);

  const begin = useCallback(() => setStatus('counting'), []);

  // For status change callbacks
  const statusRef = useRef(defaultStatus);
  useEffect(() => {
    if (status !== statusRef.current) {
      statusRef.current = status;
      onStatusChange?.(status);
    }
  }, [status]);

  // For counting down
  useEffect(() => {
    if (status === 'counting') {
      const intervalID = setInterval(
        () => setSecondsLeft((seconds) => seconds - 1),
        1000
      );
      return () => {
        clearInterval(intervalID);
        setSecondsLeft(countdownFrom);
      };
    }
  }, [status]);

  // for completing when there are no seconds left to count
  useEffect(() => {
    if (secondsLeft <= 0) {
      setStatus('completed');
      onCompleted?.();
    }
  }, [secondsLeft, onCompleted]);

  return [
    {
      status,
      secondsLeft,
    },
    { begin, cancel, reset },
  ] as const;
};
