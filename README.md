# Galata KGK Web Sitesi

İstanbul Galata Üniversitesi Kariyer ve Girişimcilik Kulübünün resmi web sitesi ve içerik yönetim paneli. Proje; kulübün etkinliklerini, ekibini, sponsorlarını ve kurumsal yaklaşımını yayınlamak, iletişim ile üyelik başvurularını toplamak ve tüm bu verileri yetkili yöneticilerin tek bir panelden yönetmesini sağlamak için geliştirilmiştir.

> **Slogan:** Galata'da Okunur, Gelecek Burada Kurulur.

## Özellikler

- Gerçek kulüp içerikleriyle hazırlanmış responsive halka açık site
- Etkinlik, ekip, sponsor ve anasayfa istatistiği yönetimi
- İletişim mesajları ve üyelik başvuruları için veritabanı destekli formlar
- Kullanıcı adı ve bcrypt ile hashlenmiş parola kullanan korumalı admin paneli
- Açık/koyu tema, marka tipografisi ve yeniden kullanılabilir tasarım sistemi
- Sayfa bazlı SEO metadata, Open Graph/Twitter Card, JSON-LD, sitemap ve robots kuralları
- Vercel Blob destekli güvenli görsel yükleme: tür, dosya imzası, boyut ve dosya adı kontrolleri

## Kullanılan Teknolojiler

- Next.js 16 — App Router ve Server Components
- React 19 ve TypeScript
- Tailwind CSS 3 ve shadcn/ui
- Prisma ORM 7, Neon PostgreSQL ve `@prisma/adapter-pg`
- Vercel Blob nesne depolama
- Auth.js / NextAuth — Credentials provider ve JWT oturumu
- bcryptjs — yönetici parolalarının hashlenmesi

## Gereksinimler

- Node.js 20.19 veya üzeri
- npm 10 veya üzeri
- Yerel veya Neon üzerinde erişilebilir bir PostgreSQL veritabanı

## Yerel Kurulum

1. Bağımlılıkları yükleyin:

   ```bash
   npm install
   ```

2. Örnek ortam dosyasını yerel `.env` dosyasına kopyalayın:

   ```bash
   cp .env.example .env
   ```

   PowerShell kullanıyorsanız:

   ```powershell
   Copy-Item .env.example .env
   ```

3. `.env` içindeki örnek değerleri kendi yerel değerlerinizle değiştirin. Özellikle `AUTH_SECRET` için en az 32 baytlık rastgele bir değer, `ADMIN_SEED_PASSWORD` için en az 12 karakterli güçlü bir geçici parola kullanın.

4. PostgreSQL migration'larını uygulayın:

   ```bash
   npx prisma migrate deploy
   ```

5. Başlangıç verilerini ve ilk admin hesabını oluşturun:

   ```bash
   npx prisma db seed
   ```

   Seed tamamlandığında admin kullanıcı adı ve geçici parola terminalde gösterilir. Parola README'ye veya Git geçmişine yazılmaz.

6. Geliştirme sunucusunu başlatın:

   ```bash
   npm run dev
   ```

   Site varsayılan olarak [http://localhost:3000](http://localhost:3000) adresinde açılır.

## Ortam Değişkenleri

| Değişken | Açıklama |
| --- | --- |
| `DATABASE_URL` | Prisma Client'ın çalışma zamanında kullandığı, host adında `-pooler` bulunan Neon pooled bağlantı adresi. |
| `DIRECT_URL` | Prisma CLI migration işlemlerinde kullanılan, host adında `-pooler` bulunmayan doğrudan Neon bağlantı adresi. |
| `AUTH_SECRET` | Auth.js JWT ve oturum güvenliği için uzun, rastgele ve gizli anahtar. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob'a görsel yüklemek ve yönetilen görselleri silmek için gereken gizli token. |
| `ADMIN_SEED_PASSWORD` | Yalnızca seed sırasında kullanılan geçici admin parolası; Vercel çalışma zamanı için zorunlu değildir. |
| `NEXT_PUBLIC_SITE_URL` | İsteğe bağlı canonical URL geçersiz kılma değeri; Vercel alan adı otomatik algılanır. |

Gerçek değerleri yalnızca `.env` içinde tutun. `.env` dosyaları Git tarafından yok sayılır; `.env.example` yalnızca değişken adlarını ve güvenli örnekleri gösterir.

## Komutlar

| Komut | Amaç |
| --- | --- |
| `npm run dev` | Geliştirme sunucusunu başlatır. |
| `npm run build` | Prisma Client üretir, production migration'larını uygular ve optimize Next.js derlemesini oluşturur. |
| `npm run start` | Oluşturulmuş production derlemesini başlatır. |
| `npm run lint` | ESLint denetimini çalıştırır. |
| `npx prisma migrate deploy` | Bekleyen production migration'larını uygular. |
| `npx prisma db seed` | İçerik ve ilk admin hesabı için seed işlemini çalıştırır. |
| `npx prisma studio` | Yerel veritabanını tarayıcı arayüzünde görüntüler. |

## Sayfa Haritası

| Rota | İçerik |
| --- | --- |
| `/` | Anasayfa, istatistikler, öne çıkan etkinlikler ve sponsor şeridi |
| `/hakkimizda` | Kulübün vizyonu, misyonu ve zaman tüneli |
| `/etkinliklerimiz` | Yaklaşan/geçmiş filtreli etkinlik listesi |
| `/etkinliklerimiz/[slug]` | Etkinlik detay sayfası |
| `/ekibimiz` | Kategorilere göre gruplanmış kulüp ekibi |
| `/sponsorlar` | Tier bazında sponsorlar ve iş ortaklığı yaklaşımı |
| `/iletisim` | Kulüp iletişim bilgileri ve çalışan iletişim formu |
| `/katilim` | Çalışan üyelik başvuru formu |
| `/admin/giris` | Yönetici giriş ekranı |
| `/admin` | Etkinlik, ekip, sponsor, mesaj, başvuru, istatistik ve kullanıcı yönetimi |

Admin paneline `/admin/giris` üzerinden erişilir. İlk kullanıcı adı ve geçici parola seed işleminden sonra terminalde gösterilir; bu belgeye parola eklenmez.

## Klasör Yapısı

```text
app/                    Next.js rotaları, layout'lar, API route'ları ve metadata dosyaları
  admin/                Giriş ve korumalı yönetim paneli sayfaları
  api/                  Auth.js, iletişim ve katılım endpoint'leri
components/             Paylaşılan site, admin, form, SEO ve shadcn/ui bileşenleri
content/                Koddan bağımsız düzenlenebilen site metinleri ve içerik kaynakları
lib/                    Prisma, doğrulama, kimlik doğrulama ve dosya yükleme servisleri
prisma/                 Veri modeli, migration'lar ve seed betiği
types/                  Auth.js TypeScript genişletmeleri
```

## Veritabanı Özeti

Prisma şeması etkinlikleri, ekip kategorileri/üyeleri, sponsor tier'ları/sponsorları, site istatistiklerini, iletişim mesajlarını, üyelik başvurularını, admin kullanıcılarını ve başarısız giriş denemelerini Neon PostgreSQL üzerinde tutar. Migration'lar `prisma migrate deploy` ile production veritabanına uygulanır.

## Güvenlik ve Yayına Alma Notları

- Admin işlemleri middleware'e ek olarak her Server Action içinde aktif kullanıcıyı veritabanından doğrular.
- İletişim ve katılım formlarında 10 dakikalık tekrar gönderim koruması; admin girişinde 5 başarısız denemeden sonra 10 dakikalık kilit vardır.
- Vercel Production ortamında `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `BLOB_READ_WRITE_TOKEN` ve ana domaini belirleyen `NEXT_PUBLIC_SITE_URL` değerlerini tanımlayın. Preview deployment'ları production veritabanına bağlamayın; ayrı bir Neon branch kullanın.
- Görseller Vercel Blob'da tutulur; Vercel'in geçici dosya sistemine kalıcı dosya yazılmaz.

## Ekran Görüntüsü

> Projenin güncel ekran görüntüsü daha sonra bu alana eklenecektir.

## Kalite Kontrolü

Değişiklik göndermeden önce aşağıdaki komutları çalıştırın:

```bash
npm run lint
npm run build
npm audit
```
