"use client";

import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Save, Trash2, Upload } from "lucide-react";

import {
  addEventMediaAction,
  deleteEventMediaAction,
  updateEventMediaAction,
} from "@/app/admin/(panel)/etkinlikler/media-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type MediaItem = {
  id: number;
  type: "image" | "video";
  url: string;
  caption: string | null;
  captionEn: string | null;
  order: number;
};

const imageTypes = ["image/jpeg", "image/png", "image/webp"];
const videoTypes = ["video/mp4", "video/webm"];

export function EventMediaManager({ eventId, media }: { eventId: number; media: MediaItem[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<"image" | "video">("image");
  const [caption, setCaption] = useState("");
  const [captionEn, setCaptionEn] = useState("");
  const [order, setOrder] = useState(Math.max(0, ...media.map((item) => item.order)) + 1);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function addMedia(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return setMessage("Önce bir dosya seçin.");
    const allowed = type === "image" ? imageTypes : videoTypes;
    const limit = type === "image" ? 5 * 1024 * 1024 : 100 * 1024 * 1024;
    if (!allowed.includes(file.type) || file.size > limit) {
      return setMessage(type === "image"
        ? "JPG/PNG/WebP seçin (en fazla 5 MB)."
        : "MP4/WebM seçin (en fazla 100 MB).");
    }
    setBusy(true);
    setMessage("");
    try {
      const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
      const pathname = `uploads/events/gallery/${eventId}/${crypto.randomUUID()}.${extension}`;
      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/admin/events/media/upload",
        clientPayload: JSON.stringify({ eventId, type }),
      });
      const result = await addEventMediaAction(eventId, { type, url: blob.url, caption, captionEn, order });
      setMessage(result.message);
      if (result.success) {
        if (fileRef.current) fileRef.current.value = "";
        setCaption("");
        setCaptionEn("");
        setOrder((value) => value + 1);
        router.refresh();
      }
    } catch (error) {
      console.error("Galeri yüklemesi başarısız.", error);
      setMessage("Dosya yüklenemedi. Oturumunuzu ve Blob ayarlarını kontrol edin.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-7 max-w-4xl rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] sm:p-8">
      <h2 className="font-heading text-xl font-bold text-primary-950">Fotoğraf ve video galerisi</h2>
      <p className="mt-2 text-sm text-primary-500">Etkinlik detayının altında sırayla görünür. Görseller en fazla 5 MB; MP4/WebM videolar en fazla 100 MB olabilir.</p>

      <div className="mt-6 space-y-5">
        {media.length === 0 ? <p className="text-sm text-primary-500">Henüz galeri medyası yok.</p> : null}
        {media.map((item) => <MediaRow key={item.id} eventId={eventId} item={item} onSaved={() => router.refresh()} />)}
      </div>

      <form onSubmit={addMedia} className="mt-8 grid gap-4 border-t border-primary-100 pt-6 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-primary-900">
          Medya tipi
          <select
            value={type}
            onChange={(event) => {
              setType(event.target.value as "image" | "video");
              if (fileRef.current) fileRef.current.value = "";
            }}
            className="block h-11 w-full rounded-xl border border-primary-200 bg-white px-3 text-primary-900"
          >
            <option value="image">Fotoğraf</option>
            <option value="video">Video</option>
          </select>
        </label>
        <label className="space-y-2 text-sm font-semibold text-primary-900">
          Dosya
          <Input ref={fileRef} type="file" accept={type === "image" ? ".jpg,.jpeg,.png,.webp" : ".mp4,.webm"} required />
        </label>
        <label className="space-y-2 text-sm font-semibold text-primary-900">
          Kısa açıklama (opsiyonel)
          <Input value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={180} />
        </label>
        <label className="space-y-2 text-sm font-semibold text-primary-900">
          İngilizce açıklama (opsiyonel)
          <Input value={captionEn} onChange={(event) => setCaptionEn(event.target.value)} maxLength={180} />
        </label>
        <label className="space-y-2 text-sm font-semibold text-primary-900">
          Sıra
          <Input type="number" min={0} max={10000} value={order} onChange={(event) => setOrder(Number(event.target.value))} required />
        </label>
        <div className="flex items-end">
          <Button type="submit" disabled={busy} className="w-full rounded-xl">
            <Upload className="size-4" aria-hidden="true" />
            {busy ? "Yükleniyor..." : "Galeriye ekle"}
          </Button>
        </div>
      </form>
      {message ? <p role="status" className="mt-4 text-sm font-medium text-primary-800">{message}</p> : null}
    </section>
  );
}

function MediaRow({ eventId, item, onSaved }: { eventId: number; item: MediaItem; onSaved: () => void }) {
  const [caption, setCaption] = useState(item.caption ?? "");
  const [captionEn, setCaptionEn] = useState(item.captionEn ?? "");
  const [order, setOrder] = useState(item.order);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function save(nextOrder = order) {
    startTransition(async () => {
      const result = await updateEventMediaAction(eventId, item.id, { caption, captionEn, order: nextOrder });
      setMessage(result.message);
      if (result.success) onSaved();
    });
  }

  function remove() {
    if (!window.confirm("Bu galeri öğesini silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      const result = await deleteEventMediaAction(eventId, item.id);
      setMessage(result.message);
      if (result.success) onSaved();
    });
  }

  return (
    <article className="grid gap-4 rounded-xl border border-primary-100 p-4 sm:grid-cols-[10rem_1fr]">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-primary-950">
        {item.type === "image" ? (
          <Image src={item.url} alt={item.caption ?? "Etkinlik galeri fotoğrafı"} fill sizes="160px" className="object-cover" />
        ) : (
          <video src={item.url} controls preload="metadata" className="h-full w-full object-contain" aria-label={item.caption ?? "Etkinlik galeri videosu"} />
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-xs font-semibold text-primary-800">Açıklama
          <Input value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={180} />
        </label>
        <label className="space-y-1 text-xs font-semibold text-primary-800">Açıklama (EN)
          <Input value={captionEn} onChange={(event) => setCaptionEn(event.target.value)} maxLength={180} />
        </label>
        <label className="space-y-1 text-xs font-semibold text-primary-800">Sıra
          <Input type="number" min={0} max={10000} value={order} onChange={(event) => setOrder(Number(event.target.value))} />
        </label>
        <div className="flex flex-wrap items-end gap-2">
          <Button type="button" size="sm" variant="outline" disabled={pending || order === 0} onClick={() => { setOrder(Math.max(0, order - 1)); save(Math.max(0, order - 1)); }} aria-label="Bir sıra yukarı"><ArrowUp className="size-4" /></Button>
          <Button type="button" size="sm" variant="outline" disabled={pending || order >= 10000} onClick={() => { setOrder(order + 1); save(order + 1); }} aria-label="Bir sıra aşağı"><ArrowDown className="size-4" /></Button>
          <Button type="button" size="sm" disabled={pending} onClick={() => save()}><Save className="size-4" /> Kaydet</Button>
          <Button type="button" size="sm" variant="outline" disabled={pending} onClick={remove} aria-label="Medyayı sil"><Trash2 className="size-4" /></Button>
        </div>
        {message ? <p role="status" className="text-xs text-primary-700 sm:col-span-2">{message}</p> : null}
      </div>
    </article>
  );
}
