import fetch from "cross-fetch";

const gURL = (url: string, baseURL: string) => baseURL + url;

export interface ClientResponse<T> {
  data?: T;
  error?: string;
  response?: Response;
}

class FetchError extends Error {
  response: Response | undefined;
  body: Record<string, string> | undefined;
}

const parseBody = async <T>(response: Response): Promise<ClientResponse<T>> => {
  try {
    return {
      data: await response.json(),
      response,
    };
  } catch (e) {
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
    baseURL = "",
    autoHandler,
    ...opt
  } = options;
  const headers: Record<string, string> = {
    "Content-Type":
      opt.body &&
      (opt.body instanceof FormData || opt.body instanceof URLSearchParams)
        ? "application/x-www-form-urlencoded"
        : "application/json",
  };
  if (
    opt.body &&
    opt.body instanceof FormData &&
    originalHeaders["Content-Type"] !== "multipart/form-data"
  ) {
    opt.body = new URLSearchParams(
      opt.body as unknown as Record<string, string>,
    );
  }

  const finallyHeaders = {
    ...headers,
    ...originalHeaders,
  };

  if (originalHeaders["Content-Type"] === "multipart/form-data") {
    delete finallyHeaders["Content-Type"];
  }

  const requestURL = gURL(
    url,
    process.env.NODE_ENV === "test" ? "http://localhost" : baseURL,
  );

  return fetch(requestURL, {
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

      if (response?.status === 401) {
        return { error: "Unauthorized", response };
      }

      const errorText: string =
        body?.message ||
        (error as FetchError).message ||
        response?.statusText ||
        "error";

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
        response,
      };
    });
};

request.post = <T>(
  url: string,
  option: Omit<RequestOptions, "body"> & {
    data?: Record<string, unknown> | FormData | URLSearchParams | unknown[];
  } = {},
) => {
  const { data, ...restOption } = option;
  return request<T>(url, {
    method: "POST",
    ...restOption,
    ...(data
      ? {
          body:
            data instanceof FormData || data instanceof URLSearchParams
              ? data
              : JSON.stringify(data),
        }
      : {}),
  });
};

request.put = <T>(
  url: string,
  option: Omit<RequestOptions, "body"> & {
    data?: Record<string, unknown> | FormData | URLSearchParams | unknown[];
  } = {},
) => {
  const { data, ...restOption } = option;
  return request<T>(url, {
    method: "PUT",
    ...restOption,
    ...(data
      ? {
          body:
            data instanceof FormData || data instanceof URLSearchParams
              ? data
              : JSON.stringify(data),
        }
      : {}),
  });
};

request.delete = <T>(url: string, option: Omit<RequestOptions, "body"> = {}) =>
  request<T>(url, {
    method: "DELETE",
    ...option,
  });

request.get = <T>(
  url: string,
  option: Omit<RequestOptions, "body"> & {
    params?: Record<string, string>;
  } = {},
) => {
  const { params, ...restOptions } = option;
  return request<T>(
    `${url}${params ? `?${new URLSearchParams(params).toString()}` : ""}`,
    {
      method: "GET",
      ...restOptions,
    },
  );
};

export default request;
