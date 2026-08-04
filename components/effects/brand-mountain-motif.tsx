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
          x1="92"
          y1="70"
          x2="282"
          y2="590"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E85D2C" />
          <stop offset="0.36" stopColor="#596FAA" />
          <stop offset="1" stopColor="#1B2A5E" />
        </linearGradient>
        <radialGradient
          id="brand-tower-halo"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="translate(198 238) rotate(90) scale(184 170)"
          gradientUnits="userSpaceOnUse"
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
        <symbol id={towerSymbolId} viewBox="0 0 360 640">
          <path
            d="M34 620C51 534 65 440 73 347C82 249 118 181 198 116C278 181 314 249 323 347C331 440 345 534 362 620H34Z"
            fill="url(#brand-tower-halo)"
            opacity="0.42"
          />
          <path
            d="M126 620C136 535 142 453 145 375L121 342C114 332 119 318 131 314L147 308L142 269C140 248 152 231 171 226V190C171 179 177 170 187 166V97L180 78H190L187 58L198 22L209 58L206 78H216L209 97V166C219 170 225 179 225 190V226C244 231 256 248 254 269L249 308L265 314C277 318 282 332 275 342L251 375C254 453 260 535 270 620H126Z"
            fill="url(#brand-tower-fill)"
          />
          <path
            d="M151 330C168 316 183 309 198 309C213 309 228 316 245 330L237 358C224 349 211 344 198 344C185 344 172 349 159 358L151 330Z"
            fill="#F5845B"
            opacity="0.5"
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
      viewBox="0 0 360 640"
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
