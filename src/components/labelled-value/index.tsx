import * as preact from 'preact'
import clsx from 'clsx'

import styles from './styles.scss'

type Props = Readonly<{
  label: string
  className?: string
}>

export const LabelledValue: preact.FunctionComponent<Props> = props => (
  <div className={clsx(styles.container, props.className)}>
    <div className={styles.label}>{props.label}</div>
    {props.children}
  </div>
)
