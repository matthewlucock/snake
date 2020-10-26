import * as preact from 'preact'
import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'preact/hooks'

import { Game, getMaximumGridSizeFromContainer } from './game'

import { MainScreen } from './components/main-screen'
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
    game.current = new Game(getMaximumGridSizeFromContainer(gameContainer.current))

    game.current.canvas.element.className = styles.gameCanvas
    gameContainer.current.append(game.current.canvas.element)

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

  return (
    <preact.Fragment>
      <MainScreen
        playing={playing}
        gameOver={gameOver}
        highScore={highScore}
        clearHighScore={clearHighScore}
        play={play}
      />

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
