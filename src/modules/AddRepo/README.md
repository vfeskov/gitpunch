This is an isolated module pluggable into a redux app. Intention was to experiment and come up with some isolation of big part of an app that also uses redux, the actual component here doesn't really need redux.

To instantiate it, call `createModule(rootStatePropName, actionPrefix)` from `index.js`.

`rootStatePropName` is a unique property name of the root state, under which the module will store result of its reducers.

`actionPrefix` is a unique prefix that is prepended to every action type the module dispatches.

`createModule(...)` returns an object with `AddRepo` container and `reducerConfig` property, which has to be added to the root reducer of the app.
