import * as preact from 'preact'
import { styled } from 'goober'

import { TitleScreen } from './elements/title-screen'
import { GameWrapper } from './elements/game-wrapper'

const Wrapper = styled('div')`
  font-size: 30px;
  font-family: sans-serif;
  color: white;
  user-select: none;
`

export const App: preact.FunctionComponent = () => {
  return (
    <Wrapper>
      <TitleScreen />
      <GameWrapper />
    </Wrapper>
  )
}
