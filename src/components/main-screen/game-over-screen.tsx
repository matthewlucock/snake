import * as preact from 'preact'

import { LabelledValue } from '../labelled-value'

import styles from './styles.scss'

type Props = Readonly<{
  score: number
  highScore: number
  highScoreBeaten: boolean
  play: () => void
  clearGameOver: () => void
}>

export const GameOverScreen: preact.FunctionComponent<Props> = props => {
  return (
    <preact.Fragment>
      <div className={styles.title}>game over</div>

      <div className={styles.scoreContainer}>
        <LabelledValue label='your score'>{props.score}</LabelledValue>

        <div className={styles.gameOverScreenHighScore}>
          {props.highScoreBeaten ? 'new high score!' : (
            <LabelledValue label='high score'>{props.highScore}</LabelledValue>
          )}
        </div>
      </div>

      <div className={styles.playButton} onClick={props.play}>play again</div>
      <div className={styles.gameOverScreenCancel} onClick={props.clearGameOver}>cancel</div>
    </preact.Fragment>
  )
}
