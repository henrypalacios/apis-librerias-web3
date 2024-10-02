/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WS_PROVIDER: string
  // define aquí otras variables de entorno si las tienes
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}