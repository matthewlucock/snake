import * as preact from 'preact'
import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'preact/hooks'
import clsx from 'clsx'

import { Game } from './game'

import { TitleScreen } from './components/main-screen/title-screen'
import { GameOverScreen } from './components/main-screen/game-over-screen'
import { GameBar } from './components/game-bar'

import 'ress'
import styles from './main.scss'

const HIGH_SCORE_STORAGE_KEY = 'high-score'

const App: preact.FunctionComponent = () => {
  const [playing, setPlaying] = useState<boolean>(false)
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(0)
  const [originalHighScore, setOriginalHighScore] = useState<number>(0)

  const gameContainer = useRef<HTMLDivElement>()
  const game = useRef<Game | null>(null)

  /**
   * Game control
   */

  const play = useCallback((): void => {
    setScore(0)
    setOriginalHighScore(highScore)
    setGameOver(false)
    setPlaying(true)
  }, [highScore])

  const onTargetReached = useCallback((): void => setScore(score => score + 1), [])
  const onGameOver = useCallback((): void => {
    setGameOver(true)
    setPlaying(false)
  }, [])

  useLayoutEffect(() => {
    if (!playing) return

    if (game.current !== null) game.current.destroy()
    game.current = new Game(gameContainer.current)

    game.current.emitter.on('target-reached', onTargetReached)
    game.current.emitter.on('game-over', onGameOver)

    game.current.init()
  }, [playing])

  /**
   * High score
   */

  useLayoutEffect(() => {
    const rawScore = localStorage.getItem(HIGH_SCORE_STORAGE_KEY)
    if (rawScore === null) return

    const score = Number.parseInt(rawScore)
    if (Number.isNaN(score) || score < 0) return

    setHighScore(score)
    setOriginalHighScore(score)
  }, [])

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem(HIGH_SCORE_STORAGE_KEY, score.toString())
    }
  }, [score])

  const clearHighScore = useCallback((): void => {
    setHighScore(0)
    localStorage.setItem(HIGH_SCORE_STORAGE_KEY, '0')
  }, [])

  /**
   * Component
   */

  const clearGameOver = useCallback((): void => {
    setGameOver(false)
  }, [])

  const highScoreBeaten = highScore > originalHighScore

  return (
    <preact.Fragment>
      <div className={clsx(styles.mainScreen, !playing && styles.visible)}>
        {gameOver ? (
          <GameOverScreen
            score={score}
            highScore={highScore}
            highScoreBeaten={highScoreBeaten}
            play={play}
            clearGameOver={clearGameOver}
          />
        ) : <TitleScreen highScore={highScore} clearHighScore={clearHighScore} play={play} />}
      </div>

      <div className={styles.gameWrapper}>
        <GameBar
          score={score}
          originalHighScore={originalHighScore}
          highScoreBeaten={highScore > originalHighScore}
        />

        <div ref={gameContainer} className={styles.gameContainer} />
      </div>
    </preact.Fragment>
  )
}

preact.render(<App />, document.body)
