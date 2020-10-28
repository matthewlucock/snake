import * as preact from 'preact'
import { useRef, useState } from 'preact/hooks'
import clsx from 'clsx'

import styles from './styles.scss'
import { LabelledValue } from '../labelled-value'
import { DeveloperMessage } from '../developer-message'

type Props = Readonly<{
  highScore: number
  clearHighScore: () => void
  play: () => void
}>

export const TitleScreen: preact.FunctionComponent<Props> = props => {
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
    <preact.Fragment>
      <div className={styles.title}>snake</div>

      {showHighScoreContainer && (
        <div
          className={clsx(
            styles.titleScreenHighScoreContainer,
            props.highScore > 0 && styles.highScoreExists
          )}
        >
          <LabelledValue label='high score'>{displayedHighScore}</LabelledValue>
          <div className={styles.titleScreenClearHighScore} onClick={clearHighScore}>
            {confirm ? 'sure?' : 'clear'}
          </div>
        </div>
      )}

      <div className={styles.playButton} onClick={props.play}>play</div>

      <DeveloperMessage />
    </preact.Fragment>
  )
}
