import * as preact from 'preact'
import { styled } from 'goober'
import { useDispatch } from 'react-redux'

import { useSelector, play } from '../store'

type WrapperProps = Readonly<{ visible: boolean }>
const Wrapper = styled('div')<WrapperProps>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  opacity: ${props => props.visible ? 1 : 0};
  transition-property: visibility, opacity;
  transition-duration: .25s;
  background: hsl(0, 0%, 10%);
`

const Title = styled('div')`
  font-size: 4em;
  margin-bottom: .5em;
`

const PlayButton = styled('div')`
  padding: .5em 1em;
  border-radius: 2em;
  background: hsl(0, 0%, 15%);
  cursor: pointer;
  transition: background .25s;

  &:hover {
    background: hsl(0, 0%, 25%);
  }
`

export const TitleScreen: preact.FunctionComponent = () => {
  const playing = useSelector(state => state.playing)
  const dispatch = useDispatch()

  return (
    <Wrapper visible={!playing}>
      <Title>snake</Title>
      <PlayButton onClick={() => dispatch(play())}>play</PlayButton>
    </Wrapper>
  )
}
