export default function(redux, nextState, Component) {
    Component = Component && Component.WrappedComponent || Component

    if (!Component || !Component.fillStore ) { return; }

    if(Component.storeName) {
    	if(redux.getState()[Component.storeName].get('isLoad')) {
    		return
    	}
    }
    
    return Component.fillStore(redux, nextState)
}
