import * as preact from 'preact'
import { useRef, useState } from 'preact/hooks'
import clsx from 'clsx'

import styles from './styles.scss'

type Props = Readonly<{
  playing: boolean
  gameOver: boolean
  highScore: number
  clearHighScore: () => void
  play: () => void
}>

export const MainScreen: preact.FunctionComponent<Props> = props => {
  const originalHighScore = useRef<number>(0)
  const [confirm, setConfirm] = useState<boolean>(false)

  const clearHighScore = (): void => {
    if (!confirm) {
      setConfirm(true)
      return
    }

    originalHighScore.current = props.highScore
    props.clearHighScore()
  }

  const showHighScoreContainer = props.highScore > 0 || originalHighScore.current > 0
  const displayedHighScore = props.highScore > 0 ? props.highScore : originalHighScore.current

  return (
    <div className={clsx(styles.container, !props.playing && styles.visible)}>
      <div className={styles.title}>{props.gameOver ? 'game over' : 'snake'}</div>

      {!props.gameOver && showHighScoreContainer && (
        <div
          className={clsx(styles.highScoreContainer, props.highScore > 0 && styles.highScoreExists)}
        >
          <div>high score: {displayedHighScore}</div>
          <div className={styles.clearHighScore} onClick={clearHighScore}>
            {confirm ? 'sure?' : 'clear'}
          </div>
        </div>
      )}

      <div className={styles.playButton} onClick={props.play}>play</div>
    </div>
  )
}
