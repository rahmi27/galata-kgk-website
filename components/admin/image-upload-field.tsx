"use client";

/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

type ImageUploadFieldProps = {
  id: string;
  name: string;
  label: string;
  defaultImageUrl?: string;
};

export function ImageUploadField({
  id,
  name,
  label,
  defaultImageUrl,
}: ImageUploadFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState(defaultImageUrl ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    const handleReset = () => {
      setPreviewUrl(defaultImageUrl ?? "");
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
      setPreviewUrl(defaultImageUrl ?? "");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setError("Yalnızca JPG, PNG veya WebP görselleri seçebilirsiniz.");
      event.target.value = "";
      setPreviewUrl(defaultImageUrl ?? "");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Görsel dosyası en fazla 5 MB olabilir.");
      event.target.value = "";
      setPreviewUrl(defaultImageUrl ?? "");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
  }

  function clearSelection() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setPreviewUrl(defaultImageUrl ?? "");
    setError("");
  }

  return (
    <div ref={containerRef} className="space-y-3">
      <label
        htmlFor={id}
        className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-50"
      >
        {label}
      </label>

      <div className="grid gap-4 sm:grid-cols-[9rem_1fr] sm:items-center">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-primary-200 bg-primary-50 dark:border-white/15 dark:bg-white/[0.06]">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Seçilen görselin önizlemesi"
              className="absolute inset-0 size-full object-cover"
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
            className="block w-full cursor-pointer rounded-xl border border-primary-100 bg-white text-sm text-primary-700 file:mr-4 file:border-0 file:bg-primary-950 file:px-4 file:py-3 file:font-semibold file:text-white hover:file:bg-primary-800 dark:border-white/15 dark:bg-primary-950 dark:text-primary-100"
          />
          <p className="mt-2 text-xs leading-5 text-primary-500 dark:text-primary-200">
            JPG, PNG veya WebP · en fazla 5 MB
          </p>
          {previewUrl ? (
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
