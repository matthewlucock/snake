import { Game } from './game'

import 'ress'
import './static/main.css'

const game = new Game()

const root = document.getElementById('snake')
if (root === null) throw new Error('No root snake element')

root.append(game.canvasElement)

game.start()
