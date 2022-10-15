import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  ComponentPropsWithoutRef,
  MouseEvent,
  ReactNode,
} from 'react';
import cx from 'classnames';
import { useCountdown } from './useCountdown';
import styles from './CountdownButton.module.css';

const COUNTDOWN_FROM = 5;

interface Props {
  renderComplete?: ReactNode;
  onCompleted?: () => void;
  onCanceled?: () => void;
  onReset?: () => void;
  onStatusChange?: Parameters<typeof useCountdown>[0]['onStatusChange'];
}

interface ImperativeActionsRef {
  cancel: () => void;
  reset: () => void;
}

export const CountdownButton = forwardRef<
  ImperativeActionsRef | undefined,
  Props & ComponentPropsWithoutRef<'button'>
>((props, ref) => {
  const {
    renderComplete = 'Launch',
    onCompleted,
    onCanceled,
    onStatusChange,
    onReset,
    ...buttonProps
  } = props;

  const [{ status, secondsLeft }, { begin, cancel, reset }] = useCountdown({
    countdownFrom: COUNTDOWN_FROM,
    onCompleted,
    onCanceled,
    onReset,
    onStatusChange,
  });

  // Shake Animation
  const buttonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (status === 'counting') {
      const percent =
        Math.ceil(((secondsLeft / COUNTDOWN_FROM) * 100 - 20) / 20) * 20 + 20;
      const shakePx = 5 - (5 * percent) / 100;
      buttonRef.current?.style.setProperty('--shake', `${shakePx}px`);
    } else {
      buttonRef.current?.style.setProperty('--shake', '0');
    }
  }, [status, secondsLeft]);
  // ********

  // allow parent component to call cancel or reset for countdown
  useImperativeHandle(ref, () => ({ cancel, reset }), [cancel, reset]);

  const handleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    buttonProps.onClick?.(ev);
    if (ev.defaultPrevented) return;
    if (status === 'idle') begin();
    if (status === 'counting') cancel();
    if (status === 'completed') reset();
  };

  const buttonChildren =
    status === 'completed'
      ? renderComplete ?? buttonProps.children
      : status === 'counting'
      ? `${secondsLeft}`
      : buttonProps.children;

  return (
    <button
      {...buttonProps}
      onClick={handleClick}
      ref={buttonRef}
      className={cx(buttonProps.className, styles.button, {
        [styles.countingdown]: status === 'counting',
        [styles.launching]: status === 'completed',
      })}
    >
      {buttonChildren}
    </button>
  );
});

CountdownButton.displayName = 'CountdownButton';
