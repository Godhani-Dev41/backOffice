import { CustomError } from "./../types/helpers";
/**
 * A wrapper around the browser `fetch` API:
 * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 */

async function handleHttpResponse(response: Response) {
  const contentType = response.headers.get("content-type");

  const responseBody = contentType.includes("application/json") ? await response.json() : await response.text();

  /**
   * Handle a success response.
   * Anything which isn't between 200-300 HTTP status will throw an error.
   */
  if (response.status >= 200 && response.status < 300) {
    return responseBody;
  }

  const errorMsg = responseBody.error || response.statusText || response.status;
  const error: CustomError = new Error(errorMsg);

  error.meta = {
    body: responseBody,
    message: responseBody.error,
    statusCode: response.status,
    statusText: response.statusText,
  };

  throw error;
}

/**
 * @example
 * network.get('users/123');
 * network.get('users/123', { mode: 'no-cors' });
 * network.get('http://jsonplaceholder.typicode.com/users');
 */
async function get(path: string, options = {}) {
  const response = await fetch(path, {
    method: "GET",
    ...options,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("id_token")}`,
    },
  });

  return handleHttpResponse(response);
}

/**
 * @example
 * network.post('users', { name: 'Frodo' });
 *
 * @example
 * network.post('users/123/setName', 'Frodo', {
 *   headers: {
 *     'Content-Type': 'text/plain'
 *   }
 * });
 */
async function post(path: string, data: unknown, headers = {}, options = {}) {
  const response: Response = await fetch(path, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("id_token")}`,
      ...headers,
    },
    ...options,
  });

  return handleHttpResponse(response);
}

async function put(path: string, data: unknown, headers = {}, options = {}) {
  const response: Response = await fetch(path, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("id_token")}`,
      ...headers,
    },
    ...options,
  });

  return handleHttpResponse(response);
}

async function deleteMethod(path: string, data: unknown, headers = {}, options = {}) {
  const response: Response = await fetch(path, {
    method: "DELETE",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("id_token")}`,
      ...headers,
    },
    ...options,
  });

  return handleHttpResponse(response);
}

export const network = { get, post, put, deleteMethod };
