import { setupServer, type SetupServerApi } from "msw/node";
import { type RequestHandler } from "msw";

let server: SetupServerApi | null = null;
export const mockServer = {
  start(handlers: RequestHandler[]) {
    server = setupServer(...handlers);
    server.listen({ onUnhandledRequest: "bypass" });
    server.resetHandlers();
    return () => {
      server?.close();
    };
  },
  close() {
    server?.close();
    server = null;
  },
};
