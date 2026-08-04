const GOOGLE_MAPS_HOSTS = new Set([
  "www.google.com",
  "maps.google.com",
]);

export function getSafeHttpUrl(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (
      (url.protocol !== "http:" && url.protocol !== "https:") ||
      url.username ||
      url.password
    ) {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}

export function isSafeHttpUrl(value: string) {
  return getSafeHttpUrl(value) !== null;
}

export function isAllowedGoogleMapsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && GOOGLE_MAPS_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export function buildGoogleMapsUrls(address: string) {
  const directionsUrl = new URL("https://www.google.com/maps/dir/");
  directionsUrl.searchParams.set("api", "1");
  directionsUrl.searchParams.set("destination", address);

  const embedUrl = new URL("https://www.google.com/maps");
  embedUrl.searchParams.set("q", address);
  embedUrl.searchParams.set("output", "embed");

  if (!isAllowedGoogleMapsUrl(embedUrl.href)) {
    throw new Error("Google Haritalar adresi güvenli biçimde oluşturulamadı.");
  }

  return {
    directionsUrl: directionsUrl.href,
    embedUrl: embedUrl.href,
  };
}
