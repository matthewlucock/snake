import * as preact from 'preact'
import { useState, useRef, useEffect } from 'preact/hooks'
import clsx from 'clsx'

import { Game, getMaximumGridSizeFromContainer } from './game'

import styles from './main.scss'

export const App: preact.FunctionComponent = () => {
  const [playing, setPlaying] = useState(false)
  const [score, setScore] = useState(0)

  const gameContainer = useRef<HTMLDivElement>()
  const game = useRef<Game>()

  useEffect(() => {
    game.current = new Game(getMaximumGridSizeFromContainer(gameContainer.current))

    game.current.canvasElement.className = styles.gameCanvas
    gameContainer.current.append(game.current.canvasElement)

    game.current.emitter.on('target-reached', (): void => setScore(score => score + 1))

    game.current.init()
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={clsx(styles.titleScreen, !playing && styles.visible)}>
        <div className={styles.title}>snake</div>
        <div className={styles.playButton} onClick={() => setPlaying(true)}>play</div>
      </div>

      <div className={styles.gameWrapper}>
        <div className={styles.gameBar}>score: {score}</div>
        <div ref={gameContainer} className={styles.gameContainer} />
      </div>
    </div>
  )
}
