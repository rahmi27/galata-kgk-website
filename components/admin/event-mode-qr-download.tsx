"use client";

import { useState } from "react";
import { Download, LoaderCircle, QrCode } from "lucide-react";
import QRCode from "qrcode";

import { Button } from "@/components/ui/button";

export function EventModeQrDownload({ url }: { url: string }) {
  const [isPreparing, setIsPreparing] = useState(false);

  async function download() {
    setIsPreparing(true);
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 1200,
        margin: 3,
        color: { dark: "#1b2a5e", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });
      const anchor = document.createElement("a");
      anchor.href = dataUrl;
      anchor.download = "galata-kgk-etkinlik-qr.png";
      anchor.click();
    } finally {
      setIsPreparing(false);
    }
  }

  return (
    <Button type="button" variant="secondary" onClick={download} disabled={isPreparing}>
      {isPreparing ? <LoaderCircle className="animate-spin" /> : <QrCode />}
      QR Kodu İndir (PNG)
      {!isPreparing ? <Download /> : null}
    </Button>
  );
}
