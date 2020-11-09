import * as preact from 'preact'

import styles from './styles.scss'
import Heart from 'assets/heart.svg'

export const DeveloperMessage: preact.FunctionComponent = () => (
  <div className={styles.container}>
    by{' '}
    <a href='https://lucock.com' target='_blank' rel='noreferrer'>@matthewlucock</a>{' '}
    with{' '}
    <Heart className={styles.heart} />
  </div>
)
