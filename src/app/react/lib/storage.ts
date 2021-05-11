/**
 * A wrapper around the browser storage APIs.
 *
 * Why?
 * 1. Graceful SSR support.
 * 2. Built-in Parse/Stringify.
 * 3. Easier testing.
 *
 * Why we must wrap the operations in `try catch`:
 * 1. User can be in private mode or set restricted permissions for storage.
 * 2. User reached storage boundaries.
 * 3. `JSON.parse` or `JSON.stringify` can fail.
 */

const fakeStorage = {
  getItem() {
    return null;
  },
  setItem() {
    // ...
  },
  removeItem() {
    // ...
  },
};

function createStorage(targetStorage: Storage | typeof fakeStorage) {
  return {
    /**
     * Get an item from the target storage.
     */
    getItem(key: string) {
      try {
        return JSON.parse(targetStorage.getItem(key) || '');
      } catch {
        // See the note at the top of the file
        return null;
      }
    },
    /**
     * Set an item in the target storage.
     */
    setItem(key: string, data: unknown) {
      try {
        targetStorage.setItem(key, JSON.stringify(data));
      } catch {
        // See the note at the top of the file
      }
    },
    /**
     * Remove an item from the target storage.
     */
    removeItem(key: string) {
      try {
        targetStorage.removeItem(key);
      } catch {
        // See the note at the top of the file
      }
    },
  };
}

/**
 * NOTE:
 * The eslint-disable comments here are needed to restrict using
 * `sessionStorage` and `localStorage` directly throughout our code.
 */

// eslint-disable-next-line no-restricted-properties
const _sessionStorage = window.sessionStorage || fakeStorage;
// eslint-disable-next-line no-restricted-properties
const _localStorage = window.localStorage || fakeStorage;

export const sessionStorage = createStorage(_sessionStorage);
export const localStorage = createStorage(_localStorage);
