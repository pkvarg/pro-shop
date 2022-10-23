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
import { cartReducer } from './reducers/cartReducers'

const reducer = combineReducers({
  productList: productListReducer,
  productDetail: productDetailsReducer,
  cart: cartReducer,
})

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : []
// const initialState = {
//   cart: { cartItems: 'hello' },
// }
const middleware = [thunk]

const store = configureStore({
  reducer,
  initialState: {
    cart: {
      cartItems: cartItemsFromStorage,
    },
  },
  middleware: middleware,
})

export default store
