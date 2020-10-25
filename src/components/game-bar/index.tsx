import * as preact from 'preact'
import clsx from 'clsx'

import styles from './styles.scss'

type Props = Readonly<{
  score: number
  originalHighScore: number
  highScoreBeaten: boolean
}>

export const GameBar: preact.FunctionComponent<Props> = props => {
  return (
    <div className={styles.bar}>
      <div>score: {props.score}</div>

      <div className={clsx(styles.highScore, props.highScoreBeaten && styles.highScoreBeaten)}>
        <div className={styles.originalHighScore}>high score: {props.originalHighScore}</div>

        {props.highScoreBeaten && (
          <div className={styles.highScoreBeatenMessage}>new high score</div>
        )}
      </div>
    </div>
  )
}
