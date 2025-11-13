import { isOnServerSide } from './env';

export const getPlatform = () => {
  if (isOnServerSide) return 'Node';

  const ua = navigator.userAgent;
  if (ua.indexOf('Mac OS') !== -1) return 'Mac OS';
  if (ua.indexOf('Windows') !== -1) return 'Windows';
  if (ua.indexOf('Linux') !== -1) return 'Linux';
  if (ua.indexOf('Android') !== -1) return 'Android';
  if (ua.indexOf('iOS') !== -1 || ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) return 'iOS';
  return 'Unknown';
};

export const getBrowser = () => {
  if (isOnServerSide) return 'Node';

  const ua = navigator.userAgent;
  if (ua.indexOf('Chrome') !== -1) return 'Chrome';
  if (ua.indexOf('Safari') !== -1) return 'Safari';
  if (ua.indexOf('Firefox') !== -1) return 'Firefox';
  if (ua.indexOf('Edge') !== -1) return 'Edge';
  return 'Unknown';
};

export const browserInfo = {
  browser: getBrowser(),
  isMobile: !isOnServerSide && /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent),
  os: getPlatform(),
};

export const isMacOS = () => getPlatform() === 'Mac OS';

export const isArc = () => {
  if (isOnServerSide) return false;
  return (
    window.matchMedia('(--arc-palette-focus: var(--arc-background-simple-color))').matches ||
    Boolean('arc' in window || 'ArcControl' in window || 'ARCControl' in window) ||
    Boolean(getComputedStyle(document.documentElement).getPropertyValue('--arc-palette-title'))
  );
};

export const isInStandaloneMode = () => {
  if (isOnServerSide) return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as any).standalone === true)
  );
};

export const isSonomaOrLaterSafari = () => {
  if (isOnServerSide) return false;

  // refs: https://github.com/khmyznikov/pwa-install/blob/0904788b9d0e34399846f6cb7dbb5efeabb62c20/src/utils.ts#L24
  const userAgent = navigator.userAgent.toLowerCase();
  if (navigator.maxTouchPoints || !/macintosh/.test(userAgent)) return false;

  // check safari version >= 17
  const version = /version\/(\d{2})\./.exec(userAgent);
  if (!version || !version[1] || !(parseInt(version[1]) >= 17)) return false;

  try {
    // hacky way to detect Sonoma
    const audioCheck = document.createElement('audio').canPlayType('audio/wav; codecs="1"');
    const webGLCheck = new OffscreenCanvas(1, 1).getContext('webgl');
    return Boolean(audioCheck) && Boolean(webGLCheck);
  } catch {
    return false;
  }
};
