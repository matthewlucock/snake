import * as preact from 'preact'
import clsx from 'clsx'

import { LabelledValue } from '../labelled-value'

import styles from './styles.scss'

type Props = Readonly<{
  score: number
  originalHighScore: number
  highScoreBeaten: boolean
}>

export const GameBar: preact.FunctionComponent<Props> = props => {
  return (
    <div className={styles.bar}>
      <LabelledValue label='score'>{props.score}</LabelledValue>

      <div className={clsx(styles.highScore, props.highScoreBeaten && styles.highScoreBeaten)}>
        <LabelledValue label='high score' className={styles.originalHighScore}>
          {props.originalHighScore}
        </LabelledValue>

        {props.highScoreBeaten && (
          <div className={styles.highScoreBeatenMessage}>new high score!</div>
        )}
      </div>
    </div>
  )
}
