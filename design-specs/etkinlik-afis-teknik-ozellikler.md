# Etkinlik Modu giriş afişi — tasarım ekibi teknik referansı

Bu belge, giriş popup'ının **afiş görseli** için geçerlidir. Quiz, çekiliş ve rozet görsellerinin ölçüleri farklı olabilir. Düzen, `components/event-mode/event-poster-modal.tsx` ve `lib/image-upload.ts` ile 24 Eylül 2026 tarihinde karşılaştırılmıştır.

## Teslim ölçüleri

| Yön | Önerilen nihai dosya | En-boy oranı | Önemli içerik için güvenli alan | Kabul edilen türler | Yükleme üst sınırı |
| --- | --- | --- | --- | --- | --- |
| Dikey | **1080 × 1350 px** | **4:5** | Soldan/sağdan 72 px; üstten/alttan 90 px | JPG, PNG, WebP | **5 MB** |
| Yatay | **1600 × 900 px** | **16:9** | Soldan/sağdan 96 px; üstten/alttan 72 px | JPG, PNG, WebP | **5 MB** |

Güvenli alan, **kırpma payı değildir**: popup görseli `object-contain` ile bütün olarak gösterir, otomatik kırpmaz. Bu boşluk metin/logonun pencere kenarına dayanmasını ve sağ üstte afişin üzerine binen **36 × 36 px kapatma düğmesiyle** çakışmasını önler. Düğme mobilde üst/sağdan yaklaşık 12 px, geniş ekranda yaklaşık 16 px içeridedir. Özellikle sağ üst köşeye tarih, QR veya sponsor logosu koymayın.

## Popup'ta yerleşim

Afiş, modalın ana alanıdır. Genişliği; ekran genişliği, afişin **gerçek dosya en-boy oranı** ve en çok yaklaşık **ekran yüksekliğinin %84'ü** ile sınırlanır. Yatay görselin modal genişliği en çok 1440 px, dikey görselinki en çok 672 px olur; ekran daha küçükse otomatik daralır. Admin'deki yön seçimi ilk görünüm için bir tahmindir, görsel yüklendikten sonra gerçek oranı esas alınır. Ekran daraldığında bütün afiş görünür; gerekirse modal kendi içinde kaydırılabilir.

**Buton ve kısa açıklama afiş dosyasının içine basılmaz; afişin ALTINDA ayrı bir modal bandında üretilir.** Tasarımcı, bu öğeler için afişin alt %15'ini boş bırakmak zorunda değildir. Aşağıdaki ölçüler CSS pikselleridir ve yerelleştirilmiş metnin uzunluğuna göre bandın yüksekliği değişebilir.

| Görünüm | Açıklama metni | “Etkinliğe Katıl” düğmesi | Bandın yaklaşık yüksekliği |
| --- | --- | --- | --- |
| Dikey afiş — masaüstü / tablet (≥640 CSS px) | Alt bantta solda; bant solundan **24 px**, 16 px yazı | Aynı bantta sağda; sağdan **24 px**, **48 px** yüksek, yatay iç boşluk **28 px**, metne göre değişen genişlik (TR yaklaşık 180–190 px) | Yaklaşık **80 px** |
| Yatay afiş — masaüstü / tablet (≥640 CSS px) | Afişin altındaki bantta ortalı; 16 px yazı | Açıklamanın **12 px altında**, yatayda ortalı, **48 px** yüksek; yatay iç boşluk **28 px** | Tek satırlı açıklamayla yaklaşık **117 px** |
| Mobil (<640 CSS px) | Alt bantta üst satır; soldan/sağdan **16 px**, 13 px yazı | Metnin altında **8 px** boşlukla; soldan/sağdan **16 px**, kullanılabilir genişliğin tamamı, **48 px** yüksek | Tek satırlı metinde yaklaşık **100 px**, satır kırılırsa daha fazla |

Modalın çevresindeki turuncu/lacivert 2 px çerçeve, yumuşak ışık ve koyulaştırılmış/bulanık sayfa arka planı arayüz tarafından sağlanır; bunları görsel dosyasına eklemeyin. Afiş, açık ve koyu tema üzerinde aynı şekilde sergilenir. Tasarımın **kendi içinde** okunaklı kontrastı olsun: koyu zeminde açık yazı veya açık zeminde koyu yazı kullanın; çok soluk renklerden, ince küçük yazılardan ve sıkışık yerleşimden kaçının. Web için sRGB kullanın; JPG/WebP'de yaklaşık %80–90 kalite, metinli işlerde PNG veya yüksek kaliteli WebP tercih edin.

**İyi örnek:** 1600 × 900 px bir afişte başlık, tarih ve logolar x=96…1504 / y=72…828 güvenli alanında; sağ üstte kapatma düğmesinin denk geleceği bölgede önemli bilgi yok. Yüksek kontrastlı kısa başlık küçük ekranda da okunuyor.

**Kaçınılması gereken:** 410 × 273 px görseli 1600 × 900 px afiş gibi büyütmek; önemli tarih veya QR'ı sağ üst köşeye koymak; afişin altına ayrıca CTA çizip arayüzün kendi CTA'sını iki kez göstermek.

## Yüklenebilir ölçü taslakları

SVG kaynakları düzenlenebilir; **admin yükleme alanı SVG kabul etmediğinden** eş boyutlu PNG karşılıkları yükleme ve popup kontrolü içindir:

- Dikey: [`etkinlik-afis-dikey-1080x1350.svg`](../public/design-reference/etkinlik-afis-dikey-1080x1350.svg) · [`PNG`](../public/design-reference/etkinlik-afis-dikey-1080x1350.png)
- Yatay: [`etkinlik-afis-yatay-1600x900.svg`](../public/design-reference/etkinlik-afis-yatay-1600x900.svg) · [`PNG`](../public/design-reference/etkinlik-afis-yatay-1600x900.png)

Taslaklardaki taralı kenarlar **önerilen tipografik güvenlik payını**, kesikli çerçeve önemli içerik alanını gösterir. Taslak içine yazılmış “modal yerleşim notu”, butonun gerçek görselin üzerine basılacağı anlamına gelmez; popup'ta alt bant ayrı oluşturulur.
