// The configured browser baseline already supports Next.js' legacy ES polyfills.
// URL.canParse is newer than that baseline, so keep only this small compatibility
// guard instead of shipping the complete legacy polyfill module to every browser.
if (!("canParse" in URL)) {
  URL.canParse = function canParse(url, base) {
    try {
      new URL(url, base);
      return true;
    } catch {
      return false;
    }
  };
}
