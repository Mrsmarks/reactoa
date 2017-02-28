import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import * as rootReducers from '../reducers'
const finalCreateStore = compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

function configureStore(reducers) {
    const combinedReducer = combineReducers({ ...reducers, ...rootReducers })
    const store = finalCreateStore(combinedReducer, {})
    if (module.hot) {
        // module.hot.accept('../reducers', () => {
        //     const nextRootReducer = require('../reducers').default 
        //     store.replaceReducer(nextRootReducer)
        // })
        module.hot.accept()
    }
    return store
}

export default configureStore
