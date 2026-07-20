# Galata KGK Website

İstanbul Galata Üniversitesi Kariyer ve Girişimcilik Kulübü web sitesi için
hazırlanmış proje iskeletidir. Bu aşamada sayfa içeriği veya görsel tasarım
bulunmaz; geliştirmeye hazır teknik altyapı sunulur.

## Teknoloji Yığını

- Next.js 16 (App Router)
- React 19 ve TypeScript
- Tailwind CSS 3
- shadcn/ui
- Prisma ORM 7

## Gereksinimler

- Node.js 20.9 veya üzeri
- npm 10 veya üzeri

## Yerel Geliştirme

Bağımlılıkları yükleyin:

```bash
npm install
```

Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Uygulama varsayılan olarak [http://localhost:3000](http://localhost:3000)
adresinde çalışır.

Üretim derlemesini doğrulamak için:

```bash
npm run build
```

Kod kalitesi kontrolü için:

```bash
npm run lint
```

## Klasör Yapısı

| Klasör | Amaç |
| --- | --- |
| `app/` | Next.js App Router sayfaları, yerleşimler ve global stiller |
| `components/` | Paylaşılan React ve shadcn/ui bileşenleri |
| `content/` | İleride eklenecek JSON/Markdown içerikleri ve görsel referansları |
| `lib/` | Yardımcı fonksiyonlar ve uygulama servisleri |
| `prisma/` | Prisma şeması ve ileride eklenecek veritabanı dosyaları |
| `public/` | Statik ve herkese açık dosyalar |

## Prisma

Prisma kurulmuş ve şema altyapısı hazırlanmıştır. Henüz bir veri modeli veya
gerçek veritabanı bağlantısı yoktur. Bağlantı eklendiğinde `DATABASE_URL`
değeri yerel `.env` dosyasında tutulmalıdır; `.env` dosyaları Git tarafından
yok sayılır.

## Marka Renkleri

Tailwind yapılandırmasında aşağıdaki marka renkleri `50`–`900` shade
skalalarıyla tanımlıdır:

- `primary`: `#1B2A5E` (lacivert)
- `accent`: `#E85D2C` (turuncu)

## Kurulum Günlüğü

- `chore: initialize Next.js app with TypeScript and Tailwind CSS` — App Router,
  TypeScript, Tailwind ve temel kalite araçları kuruldu.
- `feat: add shadcn ui and base components` — shadcn/ui yapılandırıldı; button,
  card, navigation-menu, input, textarea ve dialog bileşenleri eklendi.
- `feat: define primary and accent brand palettes` — Marka renkleri ve shade
  skalaları tanımlandı.
- `chore: initialize Prisma ORM` — Prisma bağımlılıkları, şema ve yapılandırma
  dosyaları eklendi.
- `chore: establish project directory structure` — İçerik ve statik dosya
  klasörleri dahil temel proje yapısı tamamlandı.
- `docs: add project README` — Çalıştırma, klasör yapısı ve kurulum notları
  belgelendi.
