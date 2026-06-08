/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_OG_DEFAULT_IMAGE?: string;
  readonly VITE_FACEBOOK_URL?: string;
  readonly VITE_INSTAGRAM_URL?: string;
  readonly VITE_OBCINA_URL?: string;
  readonly VITE_USE_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
