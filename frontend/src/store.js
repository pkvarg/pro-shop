import {
  combineReducers,
  configureStore,
  applyMiddleware,
} from '@reduxjs/toolkit'
import thunk from 'redux-thunk' // I still add this for my reference so I know thunk middleware is added
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  productListReducer,
  productDetailsReducer,
} from './reducers/productReducers'

const reducer = combineReducers({
  productList: productListReducer,
  productDetail: productDetailsReducer,
})

const initialState = {}
const middleware = [thunk]

const store = configureStore({
  reducer,
  initialState,
  middleware: middleware,
})

export default store
