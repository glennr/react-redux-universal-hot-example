/**
  * Finds and invokes fetchData() or fetchDataDeferred() methods
  * on given components.
  *
  * 1. Ignore undefined routes
  *   Some of the components can be undefined
  *   (passed from renderProps.components).
  *
  * 2. Skip holes in route component chain and
  * only consider components that implement
  * fetchData or fetchDataDeferred
  *
  * 3. Pull out fetch data methods
  *
  * 4. Call fetch data methods and gather promises
  *
  */
export default (components, getState, dispatch, location, params, deferred) => {
  const methodName = deferred ? 'fetchDataDeferred' : 'fetchData';

  return components
    .filter((component) => !!component) // Weed out 'undefined' routes
    .filter((component) => component[methodName]) // only look at ones with a static fetchData() or fetchDataDeferred()
    .map((component) => component[methodName])    // pull out fetch data methods
    .map(fetchData =>
      fetchData(getState, dispatch, location, params));  // call fetch data methods and save promises
};
