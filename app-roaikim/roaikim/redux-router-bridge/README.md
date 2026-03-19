# redux-router-bridge

中文文档请看 [readme-ch.md](./readme-ch.md).

A lightweight `history <-> Redux` synchronization bridge for applications that want:

- a real `history` instance as the source of navigation truth
- a stable router snapshot inside Redux
- Redux-driven navigation actions without saga-based router libraries
- compatibility with React Router v7 style applications that reuse the same `history`


## Features

- Two-way sync between `history` and Redux router state
- Duplicate registration protection for the same `history + store`
- Snapshot cloning to isolate Redux state from mutable external references
- Circular reference protection in clone and deep equality logic
- Configurable state comparison: `reference`, `smart`, `deep`
- Optional route-change listener via `onLocationChange`
- Optional snapshot freezing via `freezeSnapshots`
- No saga dependency

## Installation

```bash
npm install redux-router-bridge history redux
```

If you use React Router v7, make sure your router and this bridge share the same `history` instance.

## Quick Start

```ts
import { createBrowserHistory } from "history";
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from "redux";
import {
    createReduxHistory,
    createRouterMiddleware,
    createRouterReducer,
    routerNavigateAction,
    type RouterState,
} from "redux-router-bridge";

const history = createBrowserHistory();

const rootReducer = combineReducers({
    router: createRouterReducer(history),
});

const store = createStore(rootReducer, undefined, applyMiddleware(createRouterMiddleware(history)));

const stopSync = createReduxHistory(history, store, {
    compareStateMode: "smart",
    freezeSnapshots: false,
    onLocationChange: ({ source, action, location, previousLocation }) => {
        console.log("[router-change]", {
            source,
            action,
            from: previousLocation?.pathname ?? null,
            to: location.pathname,
        });
    },
});

store.dispatch(routerNavigateAction("/settings", { state: { from: "dashboard" } }));
store.dispatch(routerNavigateAction("/login", { replace: true }));

void stopSync;
```


```tsx
// Navigate.tsx
export default function () {
    // const dispatch = useDispatch(); // form react-redux
    return (
        <div>
            <button
                onClick={() => {
                    // dispatch(routerNavigateAction("/settings", { state: { from: "dashboard" } }));
                    // dispatch(routerNavigateAction("/login", { replace: true }));
                    store.dispatch(routerNavigateAction("/settings", { state: { from: "dashboard" } }));
                    store.ddispatch(routerNavigateAction("/login", { replace: true }));
                }}
            >
                navigationTo
            </button>
        </div>
    );
}
```

## React Router v7 Notes

This package does not replace React Router. It only bridges `history` and Redux.

The important rule is:

- your router uses one `history` instance
- the bridge uses that exact same `history` instance

If those are different instances, your UI and Redux state can drift apart.

## API

### `createRouterReducer(initialState)`

Creates a router reducer that only accepts `ROUTER_LOCATION_CHANGED` and stores normalized router snapshots.

### `createRouterMiddleware(history)`

Intercepts `ROUTER_NAVIGATE` and converts it to `history.push` / `history.replace`.

### `createReduxHistory(history, store, options?)`

Starts the two-way synchronization layer.

Important behavior:

- writes the initial history snapshot into Redux immediately
- listens to `history.listen` and syncs into Redux
- listens to store updates and optionally drives `history`
- deduplicates repeated setup calls for the same `history + store`
- returns a cleanup function

### `routerLocationAction(update)`

Creates the normalized action used for `history -> Redux` sync.

### `routerNavigateAction(to, options?)`

Creates the navigation intent action used for `Redux -> history` sync.

## `CreateReduxHistoryOptions`

### `selectRouterState`

Custom selector used to read the router slice from the Redux root state.

Default:

```ts
state => state.router
```

### `createLocationChangedAction`

Custom action factory for the `history -> Redux` path.

Default:

```ts
routerLocationAction(update)
```

It must still return a valid `ROUTER_LOCATION_CHANGED` action.

### `equalityFn`

Overrides the full `Location` equality logic.

Use this only when you really need to replace the built-in comparison strategy. In most cases, `compareStateMode` is enough.

### `compareStateMode`

Controls how `location.state` is compared when using the built-in equality logic.

- `reference`: compare state references only
- `smart`: compare references first, then do a shallow comparison for arrays / plain objects
- `deep`: deep-compare supported structured values

Recommended default: `smart`

### `onLocationChange`

Called after a route change has actually taken effect.

The callback receives:

```ts
{
    source: "init" | "history" | "redux";
    action: Action;
    location: Location;
    previousLocation: Location | null;
}
```

### `freezeSnapshots`

Controls whether generated snapshots are shallow-frozen.

- `false`: safer for compatibility when business code mutates router state by mistake
- `true`: stricter, exposes mutation bugs earlier

Important: freezing and cloning are different concerns. Even when `freezeSnapshots` is `false`, the bridge still clones when necessary.

## How It Works

There are two main flows.

### 1. `history -> Redux`

1. `history.listen` receives a route update
2. the bridge creates `routerLocationAction(update)`
3. the router reducer stores a normalized snapshot in Redux
4. `onLocationChange` is called

### 2. `Redux -> history`

1. business code dispatches `routerNavigateAction(...)`
2. middleware converts the action to `history.push` / `history.replace`
3. history changes for real
4. `history.listen` flows the final result back into Redux
5. `onLocationChange` is called

This design keeps `history` as the final source of truth while Redux stores the final effective snapshot.

## Why Cloning Is Required

`history.location` is an external object. If Redux stores it by reference:

- accidental business mutations can corrupt the sync baseline
- equality checks can become unreliable
- Redux DevTools may show route state that no longer matches actual navigation

That is why the bridge clones supported `location.state` shapes.

Supported structured clone targets:

- primitive values
- arrays
- plain objects

Unsupported complex objects are returned as-is:

- `Date`
- `Map`
- `Set`
- class instances
- DOM objects

This is intentional. The bridge avoids inventing copy semantics for complex values.

## Performance Notes

- normalized `RouterState` and `Location` objects are tracked in `WeakSet`
- the same `history + store` pair is deduplicated through `WeakMap`
- `smart` mode avoids recursive deep comparisons by default
- deep comparison has circular-reference protection
- the reducer does not re-clone already-normalized router snapshots

## Build This Package

This package uses [Rslib](https://rslib.rs/).

## More

- Chinese documentation: [readme-ch.md](./readme-ch.md)
