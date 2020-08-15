// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.d.ts" />

import * as preact from 'preact'

import { App } from './app'

import 'ress'
import './static/main.css'

const root = document.getElementById('snake')
if (root === null) throw new Error('No root element')

preact.render(<App />, root)
