import * as preact from 'preact'
import { setup as setupGoober } from 'goober'
import { prefix as gooberAutoprefixer } from 'goober-autoprefixer'
import { Provider as ReduxProvider } from 'react-redux'

import { store } from './store'
import { App } from './app'

import 'ress'
import './static/main.css'

setupGoober(preact.createElement, gooberAutoprefixer)

const Root: preact.FunctionComponent = () => (
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
)

const root = document.getElementById('snake')
if (root === null) throw new Error('No root element')

preact.render(<Root />, root)
