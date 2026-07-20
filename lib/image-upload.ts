import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const uploadRoot = path.join(process.cwd(), "public", "uploads");

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
  directory: "events" | "team",
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

  const safeBaseName = sanitizeFileName(value.name) || "gorsel";
  const uniqueName = `${Date.now()}-${randomUUID().slice(0, 8)}-${safeBaseName}.${imageType.extension}`;
  const destinationDirectory = path.join(uploadRoot, directory);
  const destinationPath = path.join(destinationDirectory, uniqueName);

  await mkdir(destinationDirectory, {
    recursive: true,
  });
  await writeFile(destinationPath, buffer);

  return {
    success: true,
    path: `/uploads/${directory}/${uniqueName}`,
  };
}

export async function deleteUploadedImage(imagePath: string | null) {
  if (!imagePath?.startsWith("/uploads/")) {
    return;
  }

  const relativePath = imagePath.replace(/^\/uploads\//, "");
  const resolvedPath = path.resolve(uploadRoot, relativePath);
  const resolvedRoot = `${path.resolve(uploadRoot)}${path.sep}`;

  if (!resolvedPath.startsWith(resolvedRoot)) {
    return;
  }

  try {
    await unlink(resolvedPath);
  } catch {
    // Dosya daha önce silinmişse veritabanı işlemini başarısız sayma.
  }
}

export { MAX_IMAGE_SIZE };
