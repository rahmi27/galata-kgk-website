import "server-only";

import { del, put } from "@vercel/blob";
import { randomUUID } from "node:crypto";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const imageTypes = {
  "image/jpeg": {
    extension: "jpg",
    matchesSignature(bytes: Uint8Array) {
      return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    },
  },
  "image/png": {
    extension: "png",
    matchesSignature(bytes: Uint8Array) {
      return (
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47 &&
        bytes[4] === 0x0d &&
        bytes[5] === 0x0a &&
        bytes[6] === 0x1a &&
        bytes[7] === 0x0a
      );
    },
  },
  "image/webp": {
    extension: "webp",
    matchesSignature(bytes: Uint8Array) {
      return (
        String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
        String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
      );
    },
  },
} as const;

type ImageType = keyof typeof imageTypes;

type ImageUploadResult =
  | {
      success: true;
      path: string | null;
    }
  | {
      success: false;
      error: string;
    };

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function saveImageUpload(
  value: FormDataEntryValue | null,
  directory: "events" | "team" | "sponsors",
): Promise<ImageUploadResult> {
  if (!(value instanceof File) || value.size === 0) {
    return {
      success: true,
      path: null,
    };
  }

  if (value.size > MAX_IMAGE_SIZE) {
    return {
      success: false,
      error: "Görsel dosyası en fazla 5 MB olabilir.",
    };
  }

  if (!(value.type in imageTypes)) {
    return {
      success: false,
      error: "Yalnızca JPG, PNG veya WebP görselleri yükleyebilirsiniz.",
    };
  }

  const buffer = Buffer.from(await value.arrayBuffer());
  const imageType = imageTypes[value.type as ImageType];

  if (!imageType.matchesSignature(buffer)) {
    return {
      success: false,
      error: "Dosyanın içeriği geçerli bir görsel formatıyla eşleşmiyor.",
    };
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();

  if (!token) {
    return {
      success: false,
      error:
        "Görsel yükleme servisi yapılandırılmamış. Lütfen yöneticiyle iletişime geçin.",
    };
  }

  const safeBaseName = sanitizeFileName(value.name) || "gorsel";
  const uniqueName = `${Date.now()}-${randomUUID().slice(0, 8)}-${safeBaseName}.${imageType.extension}`;

  try {
    const blob = await put(`uploads/${directory}/${uniqueName}`, buffer, {
      access: "public",
      contentType: value.type,
      addRandomSuffix: false,
      token,
    });

    return {
      success: true,
      path: blob.url,
    };
  } catch (error) {
    console.error("Görsel Vercel Blob'a yüklenemedi.", error);

    return {
      success: false,
      error: "Görsel yüklenemedi. Lütfen tekrar deneyin.",
    };
  }
}

export async function deleteUploadedImage(imagePath: string | null) {
  if (!imagePath) {
    return;
  }

  let imageUrl: URL;

  try {
    imageUrl = new URL(imagePath);
  } catch {
    return;
  }

  if (
    imageUrl.protocol !== "https:" ||
    !imageUrl.hostname.endsWith(".blob.vercel-storage.com")
  ) {
    return;
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();

  if (!token) {
    console.error("BLOB_READ_WRITE_TOKEN tanımlı olmadığı için görsel silinemedi.");
    return;
  }

  try {
    await del(imageUrl.href, { token });
  } catch (error) {
    // Blob temizliği veritabanı işlemini başarısız hale getirmemeli.
    console.error("Vercel Blob görseli silinemedi.", error);
  }
}

export { MAX_IMAGE_SIZE };
