const gURL = (url: string, baseURL: string) => baseURL + url;

export interface ClientResponse<T> {
  data?: T;
  error?: string;
}

class FetchError extends Error {
  response?: Response;
  body: Record<string, string> | undefined;
}

const parseBody = async <T>(response: Response): Promise<{ data: T }> => {
  try {
    return {
      data: await response.json(),
    };
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- This value always exists
    if (process.env.NODE_ENV === "development") {
      console.log(e);
    }
    const error = new FetchError((e as Error).message);
    error.response = response;
    throw error;
  }
};

interface RequestOptions {
  method?: "POST" | "GET" | "PUT" | "DELETE";
  throwError?: boolean;
  autoHandleError?: boolean;
  autoHandler?: (errorText: string) => void;
  headers?: Record<string, string>;
  body?: string | FormData | URLSearchParams;
  baseURL?: string;
}

const request = <T>(
  url: string,
  options: RequestOptions = {},
): Promise<ClientResponse<T>> => {
  const {
    throwError = false,
    autoHandleError = false,
    headers: originalHeaders = {},
    baseURL = "/",
    autoHandler,
    ...opt
  } = options;
  const headers: Record<string, string> = {
    "Content-Type":
      opt.body &&
      (opt.body instanceof FormData || opt.body instanceof URLSearchParams)
        ? "application/x-www-form-urlencoded"
        : "application/json",
    "ngrok-skip-browser-warning": "123", // needed to skip ngrok browser warning !
  };
  if (
    opt.body &&
    opt.body instanceof FormData &&
    originalHeaders["Content-Type"] !== "multipart/form-data"
  ) {
    const entries = [...opt.body];
    opt.body = new URLSearchParams(entries as string[][]);
  }

  const finallyHeaders = {
    ...headers,
    ...originalHeaders,
  };

  if (originalHeaders["Content-Type"] === "multipart/form-data") {
    delete finallyHeaders["Content-Type"];
  }

  return fetch(gURL(url, baseURL), {
    headers: finallyHeaders,
    ...opt,
  })
    .then(async (response) => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      const error = new FetchError(response.statusText);
      error.response = response;
      try {
        error.body = await response.json();
      } catch {
        // ignore
      }
      throw error;
    })
    .then(parseBody<T>)
    .catch((error: unknown) => {
      const { response, body } = error as FetchError;

      if (response && response.status === 401) {
        return { error: "Unauthorized" };
      }

      const errorText: string =
        ((body?.message ?? (error as FetchError).message) ||
          response?.statusText) ??
        "error";

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- This value always exists
      if (process.env.NODE_ENV === "development") {
        console.error(`Request failed: ${url}`, errorText);
      }

      if (autoHandleError && autoHandler) {
        autoHandler(errorText);
      }

      if (throwError) {
        throw new Error(errorText);
      }

      return {
        error: errorText,
      };
    });
};

request.post = <T>(
  url: string,
  data?: Record<string, unknown> | FormData | URLSearchParams | unknown[],
  option: RequestOptions = {},
) =>
  request<T>(url, {
    method: "POST",
    ...option,
    ...(data
      ? {
          body:
            data instanceof FormData || data instanceof URLSearchParams
              ? data
              : JSON.stringify(data),
        }
      : {}),
  });

request.put = <T>(
  url: string,
  data?: Record<string, unknown> | FormData | URLSearchParams | unknown[],
  option: RequestOptions = {},
) =>
  request<T>(url, {
    method: "PUT",
    ...option,
    ...(data
      ? {
          body:
            data instanceof FormData || data instanceof URLSearchParams
              ? data
              : JSON.stringify(data),
        }
      : {}),
  });

request.delete = <T>(url: string, option: RequestOptions = {}) =>
  request<T>(url, {
    method: "DELETE",
    ...option,
  });

request.get = <T>(
  url: string,
  params?: Record<string, string>,
  option: RequestOptions = {},
) =>
  request<T>(
    `${url}${params ? `?${new URLSearchParams(params).toString()}` : ""}`,
    {
      method: "GET",
      ...option,
    },
  );

export default request;
