import * as preact from 'preact'
import clsx from 'clsx'

import styles from './styles.scss'

type Props = Readonly<{
  playing: boolean
  gameOver: boolean
  highScore: number
  play: () => void
}>

export const MainScreen: preact.FunctionComponent<Props> = props => (
  <div className={clsx(styles.container, !props.playing && styles.visible)}>
    <div className={styles.title}>{props.gameOver ? 'game over' : 'snake'}</div>
    {!props.gameOver && props.highScore > 0 && (
      <div>high score: {props.highScore}</div>
    )}
    <div className={styles.playButton} onClick={props.play}>play</div>
  </div>
)
