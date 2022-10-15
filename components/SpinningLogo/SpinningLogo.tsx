import logoSVG from './logo.svg';
import styles from './SpinningLogo.module.css';
import cx from 'classnames';

export const SpinningLogo = (props) => (
  <img
    {...props}
    src={logoSVG}
    className={cx(styles.logo, props.className)}
    alt="logo"
  />
);
