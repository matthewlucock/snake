import * as preact from 'preact'
import { useState, useRef, useEffect } from 'preact/hooks'
import { styled, css } from 'goober'

import { Game, getMaximumGridSizeFromContainer } from './game'

const TRANSITION_DURATION = '.25s'
const MAIN_BACKGROUND = 'hsl(0, 0%, 15%)'
const LIGHTER_BACKGROUND = 'hsl(0, 0%, 25%)'
const LIGHTEST_BACKGROUND = 'hsl(0, 0%, 30%)'
const SNAKE_BACKGROUND = 'hsl(0, 0%, 10%)'
const GAME_BAR_HEIGHT_VH = 10

const Wrapper = styled('div')`
  font-size: 30px;
  font-family: sans-serif;
  font-weight: lighter;
  background: ${MAIN_BACKGROUND};
  color: white;
  user-select: none;
`

type TitleScreenProps = Readonly<{ visible: boolean }>
const TitleScreen = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${MAIN_BACKGROUND};
  visibility: ${({ visible }: TitleScreenProps) => visible ? 'visible' : 'hidden'};
  opacity: ${({ visible }: TitleScreenProps) => visible ? 1 : 0};
  transition-property: visibility, opacity;
  transition-duration: ${TRANSITION_DURATION};
`

const Title = styled('div')`
  font-size: 4em;
  margin-bottom: .5em;
`

const PlayButton = styled('div')`
  padding: .5em 1em;
  border-radius: 2em;
  background: ${LIGHTEST_BACKGROUND};
  cursor: pointer;
  transition-property: background;
  transition-duration: ${TRANSITION_DURATION};

  &:hover {
    background: ${LIGHTER_BACKGROUND};
  }
`

const GameWrapper = styled('div')`
  display: flex;
  flex-direction: column;
`

const GameBar = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${GAME_BAR_HEIGHT_VH}vh;
`

const CanvasStyles = css`
  background: ${SNAKE_BACKGROUND};
`

export const App: preact.FunctionComponent = () => {
  const [playing, setPlaying] = useState(false)
  const [score, setScore] = useState(0)

  const gameContainer = useRef<HTMLDivElement>()
  const game = useRef<Game>()

  useEffect(() => {
    game.current = new Game(getMaximumGridSizeFromContainer(gameContainer.current))

    game.current.canvasElement.className = CanvasStyles
    gameContainer.current.append(game.current.canvasElement)

    game.current.emitter.on('target-reached', (): void => setScore(score => score + 1))

    game.current.init()
  }, [])

  return (
    <Wrapper>
      <TitleScreen visible={!playing}>
        <Title>snake</Title>
        <PlayButton onClick={() => setPlaying(true)}>play</PlayButton>
      </TitleScreen>

      <GameWrapper>
        <GameBar>score: {score}</GameBar>
        <div ref={gameContainer} style={{ height: `${100 - GAME_BAR_HEIGHT_VH}vh` }} />
      </GameWrapper>
    </Wrapper>
  )
}
