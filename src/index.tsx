import 'ress'

import * as preact from 'preact'
import { useState, useRef, useEffect } from 'preact/hooks'
import clsx from 'clsx'

import { Game, getMaximumGridSizeFromContainer } from './game'

import styles from './main.scss'

const App: preact.FunctionComponent = () => {
  const [playing, setPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  const gameContainer = useRef<HTMLDivElement>()
  const game = useRef<Game | undefined>()

  const play = (): void => {
    setScore(0)
    setPlaying(true)
  }

  useEffect(() => {
    if (!playing) return

    if (game.current !== undefined) game.current.destroy()
    game.current = new Game(getMaximumGridSizeFromContainer(gameContainer.current))

    game.current.canvasElement.className = styles.gameCanvas
    gameContainer.current.append(game.current.canvasElement)

    game.current.emitter.on('target-reached', (): void => setScore(score => score + 1))
    game.current.emitter.on('game-over', (): void => {
      setGameOver(true)
      setPlaying(false)
    })

    game.current.init()
  }, [playing])

  return (
    <preact.Fragment>
      <div className={clsx(styles.titleScreen, !playing && styles.visible)}>
        <div className={styles.title}>{gameOver ? 'game over' : 'snake'}</div>
        <div className={styles.playButton} onClick={play}>play</div>
      </div>

      <div className={styles.gameWrapper}>
        <div className={styles.gameBar}>score: {score}</div>
        <div ref={gameContainer} className={styles.gameContainer} />
      </div>
    </preact.Fragment>
  )
}

preact.render(<App />, document.body)
