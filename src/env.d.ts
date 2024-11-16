/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly WORDPRESS_API_URL: string;
  readonly WORDPRESS_AUTH_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}