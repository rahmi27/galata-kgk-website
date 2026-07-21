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
- Güvenli görsel yükleme: tür, dosya imzası, boyut ve dosya adı kontrolleri

## Kullanılan Teknolojiler

- Next.js 16 — App Router ve Server Components
- React 19 ve TypeScript
- Tailwind CSS 3 ve shadcn/ui
- Prisma ORM 7 ve SQLite
- Auth.js / NextAuth — Credentials provider ve JWT oturumu
- bcryptjs — yönetici parolalarının hashlenmesi

## Gereksinimler

- Node.js 20.9 veya üzeri
- npm 10 veya üzeri

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

4. Veritabanı migration'larını uygulayın:

   ```bash
   npx prisma migrate dev
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
| `DATABASE_URL` | SQLite dosya bağlantısı; yerel kullanım için `file:./dev.db` biçimindedir. |
| `AUTH_SECRET` | Auth.js JWT ve oturum güvenliği için uzun, rastgele ve gizli anahtar. |
| `AUTH_URL` | Uygulamanın Auth.js tarafından kullanılan ana adresi. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, Open Graph, sitemap ve robots çıktıları için sitenin herkese açık ana adresi. |
| `ADMIN_SEED_PASSWORD` | Seed sırasında oluşturulan `admin` hesabının geçici parolası; en az 12 karakter olmalıdır. |

Gerçek değerleri yalnızca `.env` içinde tutun. `.env` dosyaları Git tarafından yok sayılır; `.env.example` yalnızca değişken adlarını ve güvenli örnekleri gösterir.

## Komutlar

| Komut | Amaç |
| --- | --- |
| `npm run dev` | Geliştirme sunucusunu başlatır. |
| `npm run build` | Optimize production derlemesi oluşturur ve TypeScript kontrolünü çalıştırır. |
| `npm run start` | Oluşturulmuş production derlemesini başlatır. |
| `npm run lint` | ESLint denetimini çalıştırır. |
| `npx prisma migrate dev` | Yerel migration'ları uygular/geliştirir. |
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
public/uploads/         Yerelde admin panelinden yüklenen görseller
types/                  Auth.js TypeScript genişletmeleri
```

## Veritabanı Özeti

Prisma şeması etkinlikleri, ekip kategorileri/üyeleri, sponsor tier'ları/sponsorları, site istatistiklerini, iletişim mesajlarını, üyelik başvurularını, admin kullanıcılarını ve başarısız giriş denemelerini tutar. SQLite geliştirme kolaylığı için seçilmiştir; Prisma katmanı ileride PostgreSQL'e geçişi kolaylaştırır.

## Güvenlik ve Yayına Alma Notları

- Admin işlemleri middleware'e ek olarak her Server Action içinde aktif kullanıcıyı veritabanından doğrular.
- İletişim ve katılım formlarında 10 dakikalık tekrar gönderim koruması; admin girişinde 5 başarısız denemeden sonra 10 dakikalık kilit vardır.
- Production ortamında HTTPS kullanın ve `AUTH_SECRET`, `ADMIN_SEED_PASSWORD` gibi değerleri hosting sağlayıcınızın secret yönetiminde saklayın.
- SQLite dosyası ve `public/uploads` dizini kalıcı disk gerektirir. Serverless/çok instance'lı production dağıtımında PostgreSQL ve nesne depolama çözümüne geçilmesi önerilir.

## Ekran Görüntüsü

> Projenin güncel ekran görüntüsü daha sonra bu alana eklenecektir.

## Kalite Kontrolü

Değişiklik göndermeden önce aşağıdaki komutları çalıştırın:

```bash
npm run lint
npm run build
npm audit
```
