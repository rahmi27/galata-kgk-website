import { siteUrl } from "@/lib/site-metadata";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/;
const INDEXNOW_KEY_PATH = "/indexnow-key.txt";

export function getIndexNowKey() {
  const key = process.env.INDEXNOW_KEY?.trim();

  return key && INDEXNOW_KEY_PATTERN.test(key) ? key : null;
}

export async function notifyIndexNow(paths: string[]) {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const key = getIndexNowKey();

  if (!key) {
    console.warn(
      "IndexNow bildirimi atlandı: INDEXNOW_KEY tanımlı veya geçerli değil.",
    );
    return;
  }

  const urlList = Array.from(
    new Set(
      paths
        .map((path) => new URL(path, siteUrl))
        .filter((url) => url.host === siteUrl.host)
        .map((url) => url.href),
    ),
  );

  if (urlList.length === 0) {
    return;
  }

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host: siteUrl.host,
        key,
        keyLocation: new URL(INDEXNOW_KEY_PATH, siteUrl).href,
        urlList,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });

    if (response.status !== 200 && response.status !== 202) {
      console.error(
        `IndexNow bildirimi kabul edilmedi. HTTP ${response.status}`,
      );
    }
  } catch (error) {
    console.error("IndexNow bildirimi gönderilemedi.", error);
  }
}
