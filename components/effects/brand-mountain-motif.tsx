import { cn } from "@/lib/utils";

type MountainArtworkProps = {
  className?: string;
};

const mountainSymbolId = "brand-mountain-symbol";
const towerSymbolId = "brand-tower-symbol";

function BrandScenerySprite() {
  return (
    <svg
      className="pointer-events-none absolute size-0 overflow-hidden"
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id="brand-mountain-back"
          x1="100"
          y1="160"
          x2="874"
          y2="546"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1B2A5E" />
          <stop offset="0.58" stopColor="#334A93" />
          <stop offset="1" stopColor="#E85D2C" />
        </linearGradient>
        <linearGradient
          id="brand-mountain-middle"
          x1="88"
          y1="286"
          x2="900"
          y2="570"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#223873" />
          <stop offset="0.72" stopColor="#596FAA" />
          <stop offset="1" stopColor="#F5845B" />
        </linearGradient>
        <linearGradient
          id="brand-mountain-front"
          x1="70"
          y1="420"
          x2="880"
          y2="590"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#101B44" />
          <stop offset="0.64" stopColor="#1B2A5E" />
          <stop offset="1" stopColor="#C94920" />
        </linearGradient>
        <linearGradient
          id="brand-tower-fill"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop stopColor="#E85D2C" />
          <stop offset="0.38" stopColor="#596FAA" />
          <stop offset="1" stopColor="#1B2A5E" />
        </linearGradient>
        <radialGradient
          id="brand-tower-halo"
          cx="50%"
          cy="42%"
          r="54%"
        >
          <stop stopColor="#F5845B" />
          <stop offset="1" stopColor="#1B2A5E" stopOpacity="0" />
        </radialGradient>
        <symbol id={mountainSymbolId} viewBox="0 0 960 620">
          <path
            d="M24 520C116 477 171 361 258 369C330 376 360 348 390 302C412 269 416 218 435 169C444 147 455 147 464 170C484 218 489 276 520 307C558 346 598 345 637 318C708 270 755 174 828 198C882 216 908 300 944 356V620H24V520Z"
            fill="url(#brand-mountain-back)"
          />
          <path
            d="M10 557C118 522 178 412 270 427C359 442 403 307 489 330C576 353 615 432 691 392C762 355 804 262 884 286C922 298 947 343 960 376V620H10V557Z"
            fill="url(#brand-mountain-middle)"
            opacity="0.72"
          />
          <path
            d="M0 588C137 561 207 488 318 505C410 519 474 410 566 430C653 449 719 527 803 476C867 437 913 392 960 409V620H0V588Z"
            fill="url(#brand-mountain-front)"
            opacity="0.78"
          />
        </symbol>
        <symbol id={towerSymbolId} viewBox="0 0 19.932 19.932">
          <circle
            cx="9.966"
            cy="8.65"
            r="8.5"
            fill="url(#brand-tower-halo)"
            opacity="0.32"
          />
          <path
            d="M13.089 9.551V9.262h.227v-.326h-.34v-.374h-.34v-.806h.275v-.274h-.812l-.627-1.86v-.649h-.244l-1.179-3.639h-.038V1.17a.193.193 0 0 0 .148-.188.193.193 0 0 0-.148-.188V0h-.084v.793a.194.194 0 0 0-.152.189c0 .093.064.17.151.188v.164h-.04L8.705 4.973h-.239v.648l-.634 1.86h-.808v.273h.275v.807h-.341v.373h-.341v.326h.229v.289h.112v2.072h-.342v.321h.229v.291h.112v7.699h6.021v-7.699h.111v-.291h.227v-.321h-.34v-2.07h.113ZM8.112 8.094a.294.294 0 0 1 .294.293c0 .021-.002.035-.004.055v.607h-.581v-.608a.257.257 0 0 1-.005-.054c0-.16.133-.293.296-.293ZM7.979 14v.483h-.462V14a.21.21 0 0 1-.004-.045.233.233 0 0 1 .232-.232c.132 0 .236.105.236.232 0 .018-.002.029-.002.045Zm.597-3.537v.889h-.85v-.889a.394.394 0 0 1-.008-.076c0-.24.193-.434.434-.434.237 0 .433.192.433.434 0 .025-.004.051-.009.076Zm.502-2.076a.294.294 0 0 1 .294-.293c.165 0 .294.133.294.293 0 .021 0 .035-.003.055v.607h-.581v-.608a.351.351 0 0 1-.004-.054ZM10.234 14v.483h-.46V14a.264.264 0 0 1-.006-.045c0-.127.104-.232.235-.232.128 0 .233.105.233.232 0 .018.002.029-.002.045Zm.195-3.537v.889h-.85v-.889a.507.507 0 0 1-.006-.076c0-.24.191-.434.432-.434.237 0 .432.192.432.434 0 .025-.005.051-.008.076Zm.496-2.022v.607h-.58v-.607a.351.351 0 0 1-.005-.055c0-.16.132-.293.296-.293.162 0 .295.133.295.293 0 .02-.004.036-.006.055Zm.971-.347c.164 0 .293.133.293.293 0 .021-.002.035-.002.055v.607h-.578v-.608a.257.257 0 0 1-.006-.055c0-.159.131-.292.293-.292Zm-.471 2.293c0-.24.189-.434.432-.434.238 0 .432.192.432.434 0 .025-.004.051-.008.076v.889h-.85v-.889a.507.507 0 0 1-.006-.076ZM12.49 14v.483h-.459V14a.21.21 0 0 1-.006-.045c0-.127.105-.232.234-.232s.234.105.234.232c.001.018-.001.029-.003.045Z"
            fill="url(#brand-tower-fill)"
            fillRule="evenodd"
          />
        </symbol>
      </defs>
    </svg>
  );
}

function TowerArtwork() {
  return (
    <svg
      className="brand-tower-art"
      viewBox="0 0 19.932 19.932"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
    >
      <use href={`#${towerSymbolId}`} />
    </svg>
  );
}

function MountainArtwork({ className }: MountainArtworkProps) {
  return (
    <svg
      className={cn("brand-mountain-art", className)}
      viewBox="0 0 960 620"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
    >
      <use href={`#${mountainSymbolId}`} />
    </svg>
  );
}

export function BrandMountainBackdrop() {
  return (
    <div className="brand-mountain-backdrop" aria-hidden="true">
      <BrandScenerySprite />
      <div className="brand-tower-backdrop__breathe">
        <div className="brand-tower-backdrop__drift">
          <TowerArtwork />
        </div>
      </div>
      <div className="brand-mountain-backdrop__breathe">
        <div className="brand-mountain-backdrop__drift">
          <MountainArtwork />
        </div>
      </div>
    </div>
  );
}

type BrandMountainEchoProps = {
  className?: string;
};

export function BrandMountainEcho({ className }: BrandMountainEchoProps) {
  return (
    <div
      className={cn("brand-mountain-echo", className)}
      aria-hidden="true"
    >
      <div className="brand-mountain-echo__drift">
        <MountainArtwork />
      </div>
    </div>
  );
}
