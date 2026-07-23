"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash2, Undo2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

type ImageUploadFieldProps = {
  id: string;
  name: string;
  label: string;
  defaultImageUrl?: string;
  removeName?: string;
  required?: boolean;
};

export function ImageUploadField({
  id,
  name,
  label,
  defaultImageUrl,
  removeName,
  required = false,
}: ImageUploadFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState(defaultImageUrl ?? "");
  const [removeExisting, setRemoveExisting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    const handleReset = () => {
      setPreviewUrl(defaultImageUrl ?? "");
      setRemoveExisting(false);
      setError("");
    };

    form?.addEventListener("reset", handleReset);
    return () => form?.removeEventListener("reset", handleReset);
  }, [defaultImageUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError("");

    if (!file) {
      setPreviewUrl(removeExisting ? "" : (defaultImageUrl ?? ""));
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setError("Yalnızca JPG, PNG veya WebP görselleri seçebilirsiniz.");
      event.target.value = "";
      setPreviewUrl(removeExisting ? "" : (defaultImageUrl ?? ""));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Görsel dosyası en fazla 5 MB olabilir.");
      event.target.value = "";
      setPreviewUrl(removeExisting ? "" : (defaultImageUrl ?? ""));
      return;
    }

    setRemoveExisting(false);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function clearSelection() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setPreviewUrl(defaultImageUrl ?? "");
    setError("");
  }

  function removeSavedImage() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setPreviewUrl("");
    setRemoveExisting(true);
    setError("");
  }

  function undoSavedImageRemoval() {
    setPreviewUrl(defaultImageUrl ?? "");
    setRemoveExisting(false);
    setError("");
  }

  const hasNewSelection = previewUrl.startsWith("blob:");
  const isShowingSavedImage = Boolean(
    defaultImageUrl && previewUrl === defaultImageUrl && !removeExisting,
  );

  return (
    <div ref={containerRef} className="space-y-3">
      <label
        htmlFor={id}
        className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-50"
      >
        {label}
      </label>

      {removeName ? (
        <input
          type="hidden"
          name={removeName}
          value={removeExisting ? "true" : "false"}
        />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-[9rem_1fr] sm:items-center">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-primary-200 bg-primary-50 dark:border-white/15 dark:bg-white/[0.06]">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Seçilen görselin önizlemesi"
              fill
              unoptimized
              sizes="144px"
              className="object-cover"
            />
          ) : (
            <ImagePlus
              className="size-7 text-primary-400 dark:text-primary-200"
              aria-hidden="true"
            />
          )}
        </div>

        <div>
          <input
            ref={inputRef}
            id={id}
            name={name}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleChange}
            required={required && !defaultImageUrl}
            className="block w-full cursor-pointer rounded-xl border border-primary-100 bg-white text-sm text-primary-700 file:mr-4 file:border-0 file:bg-primary-950 file:px-4 file:py-3 file:font-semibold file:text-white hover:file:bg-primary-800 dark:border-white/15 dark:bg-primary-950 dark:text-primary-100"
          />
          <p className="mt-2 text-xs leading-5 text-primary-500 dark:text-primary-200">
            JPG, PNG veya WebP · en fazla 5 MB
          </p>
          {hasNewSelection ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={clearSelection}
            >
              <X aria-hidden="true" />
              Seçimi temizle
            </Button>
          ) : null}
          {isShowingSavedImage && removeName ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-300 dark:hover:bg-red-500/10 dark:hover:text-red-200"
              onClick={removeSavedImage}
            >
              <Trash2 aria-hidden="true" />
              Mevcut görseli kaldır
            </Button>
          ) : null}
          {removeExisting ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium text-amber-700 dark:text-amber-200">
                Görsel, değişiklikler kaydedildiğinde silinecek.
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-lg"
                onClick={undoSavedImageRemoval}
              >
                <Undo2 aria-hidden="true" />
                Geri al
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {error ? (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
