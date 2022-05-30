import invariant from 'invariant';
import { Loader, Resource } from './types';
import assertNever from './assertNever';

const enum State {
  PENDING,
  SUCCESS,
  ERROR,
}

/**
 * A generic resource:
 * Given some method to asynchronously load a value - the loader()
 * argument - it allows accessing the state of the resource.
 */
const createResource = <T>(loader: Loader<T>): Resource<T> => {
  let error: unknown = null;
  let promise: Promise<T> | null = null;
  let result: T | null = null;
  let state: State = State.PENDING;

  /**
   * Loads the resource if necessary.
   */
  const load = async () => {
    if (!promise) {
      promise = loader();
      try {
        result = await promise;
        state = State.SUCCESS;
        return result;
      } catch (err) {
        error = err;
        state = State.ERROR;
        throw error;
      }
    }
    return promise;
  };

  /**
   * Returns the result, if available. This can be useful to check if the value
   * is resolved yet.
   */
  const get = () => result;

  /**
   * This is the key method for integrating with React Suspense.
   */
  const read = () => {
    invariant(
      promise,
      'Please start loading the resource with resource.load() before trying to read it with resource.read()',
    );

    switch (state) {
      case State.SUCCESS:
        // Return the data of the resource if available.
        return result as T;
      case State.ERROR:
        // Throw an error if the resource failed to load.
        throw error;
      case State.PENDING:
        // "Suspend" if the resource is still pending (currently implemented as
        // throwing a Promise, though this is subject to change in future versions
        // of React)
        throw promise;
      default:
        return assertNever(state);
    }
  };

  return {
    get,
    load,
    read,
  };
};

export default createResource;
