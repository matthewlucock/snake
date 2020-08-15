import * as preact from 'preact'
import { setup as setupGoober } from 'goober'
import { prefix as gooberAutoprefixer } from 'goober-autoprefixer'

import { App } from './app'

import 'ress'
import './static/main.css'

setupGoober(preact.createElement, gooberAutoprefixer)

const root = document.getElementById('snake')
if (root === null) throw new Error('No root element')

preact.render(<App />, root)
