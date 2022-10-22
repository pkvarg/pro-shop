import { combineReducers, configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk' // I still add this for my reference so I know thunk middleware is added
import { composeWithDevTools } from 'redux-devtools-extension'
import { productListReducer } from './reducers/productReducers'

const reducer = combineReducers({
  productList: productListReducer,
})

const store = configureStore({
  reducer: {},
  preloadedState: {},
  middleware: [thunk],
})

export default store
