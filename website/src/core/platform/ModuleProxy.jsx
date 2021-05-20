import React from 'react';
import { app } from '../app';
import { executeAction } from '../module';
import { setStateAction } from '../reducer';
export class ModuleProxy {
    module;
    actions;
    constructor(module, actions) {
        this.module = module;
        this.actions = actions;
    }
    getActions() {
        return this.actions;
    }
    attachLifecycle(ComponentType, config = {}) {
        const moduleName = this.module.name;
        const { initialState } = this.module;
        const lifecycleListener = this.module;
        const actions = this.actions;
        return class extends React.PureComponent {
            static displayName = `ModuleBoundary(${moduleName})`;
            constructor(props) {
                super(props);
                this.initialLifecycle();
            }
            componentDidUpdate(prevProps) {
                const prevLocation = prevProps.location;
                const props = this.props;
                const currentLocation = props.location;
                const currentRouteParams = props.match ? props.match.params : null;
                if (currentLocation && currentRouteParams && prevLocation !== currentLocation && lifecycleListener.onRender.isLifecycle) {
                    app.store.dispatch(actions.onRender(currentRouteParams, currentLocation));
                }
            }
            componentWillUnmount() {
                if (lifecycleListener.onDestroy.isLifecycle) {
                    app.store.dispatch(actions.onDestroy());
                }
                if (!config.retainStateOnLeave) {
                    app.store.dispatch(setStateAction(moduleName, initialState, `@@${moduleName}/@@reset`));
                }
            }
            async initialLifecycle() {
                const props = this.props;
                if (lifecycleListener.onRender.isLifecycle) {
                    if ('match' in props && 'location' in props) {
                        await executeAction(lifecycleListener.onRender.bind(lifecycleListener), props.match.params, props.location);
                    }
                    else {
                        await executeAction(lifecycleListener.onRender.bind(lifecycleListener), {}, app.browserHistory);
                    }
                }
            }
            render() {
                return <ComponentType {...this.props}/>;
            }
        };
    }
}
