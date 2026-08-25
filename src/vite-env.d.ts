/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the authentication API, e.g. http://localhost:8080/api */
  readonly VITE_API_BASE_URL: string;
  /** "true" starts the MSW mock backend in development. */
  readonly VITE_ENABLE_API_MOCKS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
