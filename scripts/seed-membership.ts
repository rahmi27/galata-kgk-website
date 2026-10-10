import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, PositionQuestionType } from "../lib/generated/prisma/client";

// Never run from build/deploy. Run only against a reviewed DIRECT_URL/DATABASE_URL.
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) throw new Error("DIRECT_URL veya DATABASE_URL gerekli.");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

export const departments = [
  "Diş Hekimliği", "Diş Hekimliği (İngilizce)",
  "Bilgisayar Mühendisliği", "Veri Bilimi ve Analitiği",
  "Beslenme ve Diyetetik", "Fizyoterapi ve Rehabilitasyon", "Hemşirelik",
  "Gastronomi ve Mutfak Sanatları", "Halkla İlişkiler ve Reklamcılık",
  "İç Mimarlık ve Çevre Tasarımı", "İç Mimarlık ve Çevre Tasarımı (İngilizce)",
  "İletişim ve Tasarımı", "İngiliz Dili ve Edebiyatı", "İşletme",
  "İşletme (İngilizce)", "Lojistik Yönetimi", "Psikoloji", "Psikoloji (İngilizce)",
  "Yönetim Bilişim Sistemleri", "Antrenörlük Eğitimi",
  "Ağız ve Diş Sağlığı", "Anestezi", "Aşçılık", "Dijital Dönüşüm Elektroniği",
  "Dış Ticaret", "E-Ticaret ve Pazarlama", "Eczane Hizmetleri", "Fizyoterapi",
  "İlk ve Acil Yardım", "Oyun Geliştirme ve Programlama", "Ön-Yüz Yazılım Geliştirme",
  "Tıbbi Görüntüleme Teknikleri", "Tıbbi Veri İşleme Teknikerliği", "Diğer",
];

type Question = {
  type: PositionQuestionType;
  label: string;
  required?: boolean;
  minFiles?: number;
  maxFiles?: number;
  anyOfGroup?: string;
};
const yes = (label: string): Question => ({ type: "YES_NO", label, required: true });
const long = (label: string, required = true): Question => ({ type: "LONG_TEXT", label, required });

const positions: { slug: string; title: string; shortDescription: string; detailMarkdown: string; questions: Question[] }[] = [
  {
    slug: "sayman", title: "Sayman",
    shortDescription: "Kulübün gelir-gider takibini ve bütçe tablolarını düzenli tutarsın.",
    detailMarkdown: `## Sayman
Kulübün mali kayıtlarını düzenli biçimde tutan koordinatörlük görevidir.
- Gelir ve gider işlemlerinin kayıt altına alınması
- Bütçe ve gelir-gider tablolarının hazırlanması
- Etkinlik harcamalarının takibi`,
    questions: [
      yes("Excel kullanabiliyor musun?"),
      yes("Daha önce gelir-gider tablosu, bütçe tablosu veya benzeri bir çalışma yaptın mı?"),
      long("Yaptıysan kısaca anlatır mısın?", false),
      long("Kulübün bir ay içerisindeki 15–20 farklı gelir ve gider işlemini takip etmeniz gerekiyor. Sizce bu işlemleri nasıl kayıt altına alırsınız? Kullanacağınız tablo/sistem ve hangi bilgileri tutacağınızı kısaca açıklayınız."),
      long("Neden Kariyer ve Girişimcilik Kulübü’nde Sayman olmak istiyorsunuz ve bu görevi düzenli şekilde yürütebileceğinizi neden düşünüyorsunuz?"),
    ],
  },
  {
    slug: "tasarim-koordinatorlugu", title: "Tasarım Koordinatörlüğü",
    shortDescription: "Kulübün afiş, poster ve etkinlik görsellerini tasarlarsın. Yaratıcı fikirlerini göstermen yeterli.",
    detailMarkdown: `## Tasarım Koordinatörlüğü Üye Alımı
İstanbul Galata Üniversitesi Kariyer ve Girişimcilik Kulübü olarak Tasarım Koordinatörlüğü ekibimize yeni ekip arkadaşları arıyoruz.

Bu başvuruda bölüm veya sınıf ayrımı yapılmamaktadır. İç Mimarlık, İletişim, Görsel İletişim, Grafik Tasarım veya tasarım odaklı herhangi bir bölümde okuma şartı bulunmamaktadır. Tasarım konusunda kendine güvenen, yaratıcı fikirler üretebilen ve görsel iletişim konusunda yetenekli olan tüm öğrenciler başvurabilir.

### Tasarım Görevi
Başvuru sürecinde adaylardan küçük bir tasarım çalışması hazırlamaları istenmektedir.

Göreviniz, kulübümüzün planladığı GALATA IMPACT 2026 zirvesi için bir poster/afiş tasarlamaktır.

Başvuru sayfasında sizlere iki farklı poster tasarım örneği sunulacaktır. Bu örnekler yalnızca bizlerin nasıl bir görsel yaklaşım aradığını anlatmak amacıyla paylaşılmaktadır.

Örnekleri birebir kopyalamanız veya aynı tasarımı yeniden oluşturmanız kesinlikle beklenmemektedir. Örneklerden ilham alarak kendi özgün fikrinizi, tasarım dilinizi ve yaratıcılığınızı ortaya koymanız beklenmektedir.

### Galata Impact 2026 Nedir?
Galata Impact 2026, farklı üniversiteleri ve farklı akademik bölümleri bir araya getirmeyi amaçlayan bir zirve projesidir.

Zirvede İstanbul Galata Üniversitesi’nin 5’ten fazla bölümünden ve farklı üniversitelerden öğrencilerin katkısıyla belirlenen konuşmacılar yer alacaktır.

Her bölümden kulübümüz bünyesinde yer alan öğrenci temsilcileri, kendi alanlarıyla ilgili 20–30 kişilik potansiyel konuşmacı listeleri oluşturacak ve bu kişiler arasından zirveye davet edilebilecek isimler belirlenecektir.

Ayrıca her bölümün öğrenci temsilcisi, kendi alanından davet edilen konuşmacılarla gerçekleştirilecek röportaj ve içerik çalışmalarında aktif rol alacaktır.

Bu nedenle Galata Impact 2026; farklı bölümlerden, farklı üniversitelerden ve farklı alanlardan insanları bir araya getiren, öğrencilerin doğrudan organizasyonun içerisinde yer aldığı bir zirve olarak tasarlanmaktadır.

### Posterde Neler Olmalı?
Poster tasarımının;
- GALATA IMPACT 2026 ifadesini içermesi,
- Kariyer ve Girişimcilik Kulübü’nü temsil eden görsel kimliğe sahip olması,
- Etkinliğin tarih ve saat bilgilerinin kullanılabilecek şekilde düşünülmesi,
- Zirvenin profesyonel, yenilikçi ve dikkat çekici yapısını yansıtması
beklenmektedir.

Bunun dışında renk paleti, yazı karakterleri, kompozisyon, grafik dil, görsel kullanım biçimi ve genel tasarım yaklaşımı tamamen size bırakılmıştır.

Kulübümüzün mevcut logo ve renklerine birebir bağlı kalmanız zorunlu değildir. Burada asıl amacımız, sizin tasarım bakış açınızı ve özgün fikirlerinizi görebilmektir.

Başvurunuz kabul edildiği takdirde tasarımınız, yönetim kurulu değerlendirmesi ve gerekli revizeler sonrasında Galata Impact 2026’nın resmi afiş tasarımında kullanılabilir.

### Kaç Tasarım Gönderebilirsiniz?
Başvuru kapsamında minimum 1, maksimum 2 tasarım gönderebilirsiniz.

Gönderdiğiniz tasarımlar arasından yönetim kurulu tarafından en başarılı bulunan çalışma, gerekli revizeler yapılarak Galata Impact 2026’nın resmi poster tasarımına dönüştürülebilecektir.

Bu çalışma aynı zamanda Tasarım Koordinatörlüğü’ne kabul sürecindeki yetenek değerlendirmesinin bir parçasıdır.

### Son Teslim
Hazırladığınız minimum 1, maksimum 2 tasarımı bu formun sonundaki dosya yükleme alanından yükleyebilirsiniz (dosya başına en fazla 5 MB; büyük dosyalar için Drive veya Behance bağlantısı ekleyebilirsiniz).

Tüm başvurular yönetim kurulu tarafından değerlendirilecek ve Tasarım Koordinatörlüğü’ne dahil edilecek adaylar belirlenerek kendileriyle iletişime geçilecektir.

Yaratıcılığını göster. Tasarımınla Galata Impact 2026’ya kendi imzanı at.`,
    questions: [
      yes("Canva kullanmayı biliyor musun?"),
      long("Neden İstanbul Galata Üniversitesi Kariyer ve Girişimcilik Kulübü Tasarım Koordinatörlüğü’nde görev almak istiyorsun?"),
      yes("Akademik sorumluluklarını ve ders programını aksatmadan Tasarım Koordinatörlüğü’nde aktif olarak rol alabilir misin?"),
      yes("Kulübümüzün gerçekleştireceği proje, etkinlik ve organizasyonlarda ekip çalışmasına uyum sağlayarak aktif ve yüksek performansla görev alabilir misin?"),
      { type: "FILE", label: "Hazırladığın Galata Impact 2026 poster tasarımını (ve varsa ikinci tasarımını) yükle.", minFiles: 1, maxFiles: 2, anyOfGroup: "tasarim-teslim" },
      { type: "LINK", label: "Dosya büyükse veya ek çalışmaların varsa bağlantı ekleyebilirsin (Drive, Behance vb.).", anyOfGroup: "tasarim-teslim" },
    ],
  },
  {
    slug: "sosyal-medya-koordinatorlugu", title: "Sosyal Medya Koordinatörlüğü",
    shortDescription: "Kulübün sosyal medya hesapları için video, tasarım ve içerik üretir, düzenli paylaşım akışını yürütürsün.",
    detailMarkdown: `## Sosyal Medya Koordinatörlüğü
Kulübün Instagram ve diğer sosyal medya hesaplarında düzenli, kaliteli içerik üretiminden sorumlu ekip.
- Video edit ve kısa video (Reels) içerikleri
- Canva ile afiş ve görsel tasarımı
- İçerik planı ve trend takibi
Daha önce hazırladığın içerikleri paylaşman değerlendirmemize yardımcı olur.`,
    questions: [
      yes("Video edit yapmayı biliyor musun?"),
      yes("CapCut uygulamasını düzgün ve kaliteli içerikler hazırlayabilecek şekilde kullanabiliyor musun?"),
      yes("KineMaster uygulamasını kullanmayı biliyor musun?"),
      yes("Canva uygulamasını kullanarak kaliteli tasarım ve poster hazırlayabiliyor musun?"),
      long("Neden İstanbul Galata Üniversitesi Kariyer ve Girişimcilik Kulübü Sosyal Medya Koordinatörlüğü’nde görev almak istiyorsun?"),
      yes("Kulübümüz için aktif ve düzenli bir şekilde sosyal medya içeriği üretebilir misin?"),
      { type: "LINK", label: "Daha önce hazırladığın sosyal medya içerikleri, videolar, posterler veya tasarımlar varsa bağlantısını paylaşabilir misin?" },
      { type: "FILE", label: "Varsa örnek çalışmalarını yükleyebilirsin.", minFiles: 0, maxFiles: 2 },
      yes("Sosyal medya trendlerini ve Instagram içeriklerini aktif olarak takip ediyor musun?"),
      long("Kariyer ve Girişimcilik Kulübü’nün sosyal medya hesaplarını geliştirmek için ne gibi fikirlerin var?"),
    ],
  },
  {
    slug: "akademik-bolum-iliskileri-koordinatorlugu", title: "Akademik ve Bölüm İlişkileri Koordinatörlüğü",
    shortDescription: "Kendi bölümünü temsil ederek kulüp ile bölümler arasında köprü kurar, akademik içerik ve etkinlik çalışmalarında rol alırsın.",
    detailMarkdown: `## Akademik ve Bölüm İlişkileri Koordinatörlüğü Üye Alımı
Lisans ve ön lisans programlarında öğrenim gören tüm öğrenciler başvurabilir.

Akademi Koordinatörlüğü bünyesinde, mevcut Saha Ekibi’nde yer almayan departmanlardan öğrenci alımı gerçekleştirilecektir.

Her departmandan alınacak öğrenci sayısı, başvuru sürecine ve ihtiyaçlara göre artabilir veya azalabilir. Bu nedenle belirli bir departman için önceden kesin bir kontenjan veya kişi sayısı belirlenmemiştir.

Başvurular, öğrencilerin ilgisi, yetkinlikleri, sorumluluk bilinci ve koordinatörlük çalışmalarına sağlayabilecekleri katkılar doğrultusunda değerlendirilecektir.`,
    questions: [
      long("Neden İstanbul Galata Üniversitesi Kariyer ve Girişimcilik Kulübü Akademik ve Bölüm İlişkileri Koordinatörlüğü’nde görev almak istiyorsun?"),
      yes("Akademik sorumluluklarını ve ders programını aksatmadan bu görevde aktif olarak rol alabilir misin?"),
      yes("Kulübümüzün proje, etkinlik ve organizasyonlarında ekip çalışmasına uyum sağlayarak aktif görev alabilir misin?"),
    ],
  },
];

async function main() {
  for (const [order, name] of departments.entries()) {
    await prisma.department.upsert({ where: { name }, create: { name, order }, update: {} });
  }
  for (const [order, position] of positions.entries()) {
    const saved = await prisma.recruitmentPosition.upsert({
      where: { slug: position.slug },
      create: { slug: position.slug, title: position.title, shortDescription: position.shortDescription, detailMarkdown: position.detailMarkdown, order: order + 1, isOpen: false },
      update: {},
    });
    if (await prisma.positionQuestion.count({ where: { positionId: saved.id } })) continue;
    await prisma.positionQuestion.createMany({ data: position.questions.map((question, index) => ({ positionId: saved.id, order: index + 1, ...question })) });
  }
  console.log(`${departments.length} bölüm, ${positions.length} kapalı pozisyon hazır.`);
}

main().finally(() => prisma.$disconnect());
