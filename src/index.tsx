import * as preact from 'preact'
import { useState, useCallback, useEffect, useLayoutEffect } from 'preact/hooks'
import clsx from 'clsx'

import { GameBar } from './components/game-bar'
import { Game } from './game'

import 'ress'
import styles from './main.scss'

const HIGH_SCORE_STORAGE_KEY = 'high-score'

const App: preact.FunctionComponent = () => {
  const [playing, setPlaying] = useState<boolean>(false)
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(0)
  const [originalHighScore, setOriginalHighScore] = useState<number>(0)
  const [gameKey, setGameKey] = useState<number>(0)

  /**
   * Game control
   */

  const play = useCallback((): void => {
    setGameKey(Math.random())
    setScore(0)
    setOriginalHighScore(highScore)
    setPlaying(true)
  }, [highScore])

  const onTargetReached = useCallback((): void => setScore(score => score + 1), [])
  const onGameOver = useCallback((): void => {
    setGameOver(true)
    setPlaying(false)
  }, [])

  /**
   * High score
   */

  useLayoutEffect(() => {
    const rawScore = localStorage.getItem(HIGH_SCORE_STORAGE_KEY)
    if (rawScore === null) return

    const score = Number.parseInt(rawScore)
    if (Number.isNaN(score) || score < 0) return

    setHighScore(score)
  }, [])

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem(HIGH_SCORE_STORAGE_KEY, score.toString())
    }
  }, [score])

  /**
   * Component
   */

  return (
    <preact.Fragment>
      <div className={clsx(styles.mainScreen, !playing && styles.visible)}>
        <div className={styles.title}>{gameOver ? 'game over' : 'snake'}</div>
        {!gameOver && highScore > 0 && (
          <div>high score: {highScore}</div>
        )}
        <div className={styles.playButton} onClick={play}>play</div>
      </div>

      <div className={styles.gameWrapper}>
        <GameBar
          score={score}
          originalHighScore={originalHighScore}
          highScoreBeaten={highScore > originalHighScore}
        />

        <Game
          key={gameKey}
          onTargetReached={onTargetReached}
          onGameOver={onGameOver}
        />
      </div>
    </preact.Fragment>
  )
}

preact.render(<App />, document.body)
