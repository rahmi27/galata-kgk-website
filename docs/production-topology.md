# Production altyapısı

## Bölge yerleşimi

- Vercel Functions: `fra1` (Frankfurt, Almanya)
- Neon PostgreSQL: `eu-central-1` (Frankfurt, Almanya)
- Statik dosyalar ve ISR önbelleği: Vercel'in global CDN ağı

Vercel Function bölgesi, proje kökündeki `vercel.json` dosyasının
`regions` alanıyla sabitlenir:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "regions": ["fra1"]
}
```

Bu proje Node.js tabanlı Next.js App Router kullandığı için proje seviyesindeki
`regions` ayarı tüm serverless fonksiyonları kapsar. `preferredRegion` route
segment ayarı eklenmesine gerek yoktur.

Bir deployment'ın build kaydında görülebilen `createdIn` bölgesi, fonksiyonların
çalıştığı bölge değildir. Çalışma bölgesi deployment çıktısındaki Lambda
`deployedTo` alanından doğrulanmalıdır:

```bash
npx vercel inspect https://galatakariyervegirisimcilik.com --format=json
```

## Neon bağlantıları

Uygulama iki ayrı bağlantı adresi kullanır:

| Değişken | Neon bağlantı türü | Kullanım |
| --- | --- | --- |
| `DATABASE_URL` | Pooled connection (`-pooler` içeren host) | Prisma Client ile normal uygulama trafiği |
| `DIRECT_URL` | Direct connection (`-pooler` içermeyen host) | Prisma CLI ve `prisma migrate deploy` |

`DIRECT_URL`, Neon Console'da **Connect** ekranından **Direct connection**
seçilerek alınmalıdır. `DATABASE_URL` ile aynı branch, database ve role
bağlanmalı; yalnızca bağlantı hostu pooler olmayan doğrudan uç nokta olmalıdır.

Production değişkenleri Vercel'de Production ortamına tanımlanmalıdır. Preview
deployment'ları production veritabanına bağlanmamalı; ayrı bir Neon branch ve
ona ait ayrı pooled/direct URL çifti kullanılmalıdır.

## Performans notu

`fra1` ile `eu-central-1` aynı Frankfurt yerleşimine denk geldiği için dinamik
sunucu işlemlerinde kıtalar arası veritabanı gecikmesi oluşmaz. Anasayfa ISR
önbelleğinden sunulduğunda ziyaretçi isteği normalde veritabanına gitmez; bu
nedenle sıcak önbellekte ölçülen LCP için CDN, HTML aktarımı ve tarayıcıdaki
render süresi ayrıca değerlendirilmelidir.
