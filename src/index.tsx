import * as preact from 'preact'
import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'preact/hooks'
import clsx from 'clsx'

import 'ress'
import styles from './main.scss'

import { getStorageKey } from './util'
import { Game } from './game'
import { TitleScreen } from './components/main-screen/title-screen'
import { GameOverScreen } from './components/main-screen/game-over-screen'
import { GameBar } from './components/game-bar'

import MoonSolid from 'assets/moon-solid.svg'
import MoonRegular from 'assets/moon-regular.svg'

const HIGH_SCORE_STORAGE_KEY = getStorageKey('high-score')
const LIGHT_THEME_STORAGE_KEY = getStorageKey('light-theme')

const App: preact.FunctionComponent = () => {
  const gameContainer = useRef<HTMLDivElement>()
  const game = useRef<Game | null>(null)

  const [playing, setPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [originalHighScore, setOriginalHighScore] = useState(0)

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

    game.current?.destroy()
    game.current = new Game(gameContainer.current)

    game.current.emitter.on('target-reached', onTargetReached)
    game.current.emitter.on('game-over', onGameOver)

    game.current.setLightTheme(lightTheme)
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
   * Theme
   */

  const [lightTheme, setLightTheme] = useState(false)

  useLayoutEffect((): void => {
    const rawLightTheme = localStorage.getItem(LIGHT_THEME_STORAGE_KEY)
    if (rawLightTheme === null) return

    const parsedLightTheme = JSON.parse(rawLightTheme)
    if (typeof parsedLightTheme !== 'boolean') return

    setLightTheme(parsedLightTheme)
  }, [])

  useLayoutEffect((): void => {
    document.documentElement.classList.toggle(styles.lightTheme, lightTheme)
    game.current?.setLightTheme(lightTheme)
    localStorage.setItem(LIGHT_THEME_STORAGE_KEY, JSON.stringify(lightTheme))
  }, [lightTheme])

  const toggleTheme = useCallback((): void => {
    setLightTheme(lightTheme => !lightTheme)
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
      <div className={styles.changeTheme} onClick={toggleTheme}>
        {lightTheme ? <MoonRegular /> : <MoonSolid />}
      </div>

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
