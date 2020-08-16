import * as preact from 'preact'

import 'ress'

import { App } from './app'

const root = document.getElementById('snake')
if (root === null) throw new Error('No root element')

preact.render(<App />, root)
