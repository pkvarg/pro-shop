import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk' // I still add this for my reference so I know thunk middleware is added

const store = configureStore({
  reducer: {},
  preloadedState: {},
  middleware: [thunk],
})

export default store
