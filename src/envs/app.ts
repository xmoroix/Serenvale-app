/* eslint-disable sort-keys-fix/sort-keys-fix */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_CODE?: string;
    }
  }
}
const isInVercel = process.env.VERCEL === '1';

const vercelUrl = `https://${process.env.VERCEL_URL}`;

const APP_URL = process.env.APP_URL
  ? process.env.APP_URL
  : isInVercel
    ? vercelUrl
    : 'http://localhost:3010';

const ASSISTANT_INDEX_URL = 'https://registry.npmmirror.com/@lobehub/agents-index/v1/files/public';

const PLUGINS_INDEX_URL = 'https://registry.npmmirror.com/@lobehub/plugins-index/v1/files/public';

export const getAppConfig = () => {
  const ACCESS_CODES = process.env.ACCESS_CODE?.split(',').filter(Boolean) || [];

  return {
    // Sentry
    NEXT_PUBLIC_ENABLE_SENTRY: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

    ACCESS_CODES: ACCESS_CODES as any,

    AGENTS_INDEX_URL: !!process.env.AGENTS_INDEX_URL
      ? process.env.AGENTS_INDEX_URL
      : ASSISTANT_INDEX_URL,

    DEFAULT_AGENT_CONFIG: process.env.DEFAULT_AGENT_CONFIG || '',
    SYSTEM_AGENT: process.env.SYSTEM_AGENT,

    PLUGINS_INDEX_URL: !!process.env.PLUGINS_INDEX_URL
      ? process.env.PLUGINS_INDEX_URL
      : PLUGINS_INDEX_URL,

    PLUGIN_SETTINGS: process.env.PLUGIN_SETTINGS,

    VERCEL_EDGE_CONFIG: process.env.VERCEL_EDGE_CONFIG,

    APP_URL,
    MIDDLEWARE_REWRITE_THROUGH_LOCAL: process.env.MIDDLEWARE_REWRITE_THROUGH_LOCAL === '1',
    ENABLE_AUTH_PROTECTION: process.env.ENABLE_AUTH_PROTECTION === '1',

    CUSTOM_FONT_FAMILY: process.env.CUSTOM_FONT_FAMILY,
    CUSTOM_FONT_URL: process.env.CUSTOM_FONT_URL,
    CDN_USE_GLOBAL: process.env.CDN_USE_GLOBAL === '1',

    SSRF_ALLOW_PRIVATE_IP_ADDRESS: process.env.SSRF_ALLOW_PRIVATE_IP_ADDRESS === '1',
    SSRF_ALLOW_IP_ADDRESS_LIST: process.env.SSRF_ALLOW_IP_ADDRESS_LIST,
    MARKET_BASE_URL: process.env.MARKET_BASE_URL,
  };
};

export const appEnv = getAppConfig();
