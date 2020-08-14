import * as preact from 'preact'
import { useRef, useEffect } from 'preact/hooks'

import { Game } from '../game'

export const GameWrapper: preact.FunctionComponent = () => {
  const wrapper = useRef<HTMLDivElement>()
  const game = useRef<Game>()

  useEffect(() => {
    game.current = new Game()
    wrapper.current.append(game.current.canvasElement)
    game.current.init()
  }, [])

  return (
    <div ref={wrapper} />
  )
}
