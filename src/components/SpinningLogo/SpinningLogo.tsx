import { ComponentPropsWithRef } from 'react'
import logoSVG from './logo.svg'
import styles from './SpinningLogo.module.css'
import cx from 'classnames'

type Props = Omit<ComponentPropsWithRef<'img'>, 'src' | 'alt'>

export const SpinningLogo = (props: Props) => (
  <img
    {...props}
    src={logoSVG}
    className={cx(styles.logo, props.className)}
    alt="logo"
  />
)
