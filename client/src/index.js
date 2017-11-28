import 'typeface-roboto'
import 'isomorphic-fetch'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import './index.css'
import { App } from './App'
import { reducer as rootReducer } from './reducers'
import registerServiceWorker from './registerServiceWorker'

const loggerMiddleware = createLogger()

const store = createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware, loggerMiddleware)
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
