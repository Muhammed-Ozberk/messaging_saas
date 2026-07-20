# Messaging SaaS

Web ve mobil istemciler için Express, Socket.IO, Sequelize ve MySQL tabanlı örnek mesajlaşma servisi.

Bu dosya BOM içermeyen UTF-8 olarak saklanır.

## Güvenlik modeli

- Parolalar MD5 veya düz metin olarak tutulmaz. `bcryptjs` ile varsayılan cost 12 kullanılarak hashlenir; `BCRYPT_COST` yalnızca 10–15 aralığında kabul edilir.
- JWT, en az 32 karakterli `JWT_SECRET` ile HS256 kullanılarak imzalanır. Issuer, audience, subject ve süre sonu doğrulanır.
- Web oturumu JWT'yi `HttpOnly`, `SameSite=Strict` cookie içinde taşır. Production ortamında cookie ayrıca `Secure` olur.
- Socket istemcisi artık `query.userID` ile kimlik belirleyemez. Handshake, aynı cookie'yi (veya web dışı istemciler için `auth.token` değerini) doğrular; kullanıcı kimliği yalnızca JWT `sub` alanından alınır.
- Odaya katılma ve mesaj gönderme işlemleri konuşma üyeliğini kontrol eder. Socket, katılmadığı bir odaya mesaj gönderemez; mesaj uzunluğu 4.000 karakterle sınırlıdır.
- JWT ve veritabanı sırları repoda tutulmaz; ortam değişkenlerinden okunur.

Yeni bir veritabanında Docker başlangıcı `DEMO_USER_IDS` listesindeki demo kullanıcıları `DEMO_USER_PASSWORD` ile oluşturur. Parola en az 12 karakter olmalıdır. Eski kullanıcıların güvenli biçimde tahmin edilebilecek bir parolaya dönüştürülmesi mümkün olmadığından migration eski satırlara parola atamaz; bu kullanıcılar yönetilen bir parola sıfırlama/seed işlemi yapılana kadar giriş yapamaz.

## Kurulum

### Docker ile

```bash
cp .env.example .env
# .env içindeki tüm replace-with-* değerlerini değiştirin
docker compose up --build
```

Uygulama `http://localhost:8080`, sağlık kontrolü `http://localhost:8080/health`, Swagger arayüzü `http://localhost:8080/api-docs` adresindedir. MySQL verisi `mysql-data` volume'ünde kalıcıdır. Uygulama container'ı root olmayan `node` kullanıcısıyla çalışır ve veritabanı sağlıklı olmadan başlamaz.

### Yerel geliştirme

Node.js 22 ve MySQL 8 önerilir.

```bash
cp .env.example .env
npm ci
npm start
```

## Socket authentication

Aynı origin'deki tarayıcı, `HttpOnly` cookie'yi handshake sırasında otomatik gönderir:

```js
const socket = io();
```

Mobil veya farklı origin istemcisi önce `POST /api/auth/login` çağrısına `userID` ve `password` göndererek aldığı kısa ömürlü JWT'yi Socket.IO auth payload'ında vermelidir:

```js
const socket = io(API_URL, { auth: { token: accessToken } });
```

`userID` göndermek kimlik doğrulamaz. Sunucu kullanıcıyı token'ın `sub` claim'inden belirler ve veritabanında hâlâ var olduğunu kontrol eder. Token URL query string'ine konmamalıdır; URL'ler proxy ve erişim loglarına yazılabilir.

## Repository pattern

Katmanların sorumlulukları şöyledir:

```text
HTTP / Socket controller
        ↓ girdi, auth bağlamı, çıktı
Domain repository (user / conversation / message)
        ↓ iş kuralı ve yetki kontrolü
Base repository
        ↓ ortak Sequelize sorguları
Sequelize model / MySQL
```

`baseRepository` CRUD ve sorgu tekrarını merkezileştirir. Domain repository'leri konuşma üyeliği, gönderen-token eşleşmesi ve okundu bilgisi gibi iş kurallarını taşır. Controller'lar transport ayrıntılarıyla (HTTP response, Socket.IO event/ack) sınırlı kalır. Bu ayrım sorgu uygulamasını değiştirmeyi ve repository'leri fake/model stub'larıyla test etmeyi kolaylaştırır. Bununla birlikte mevcut `baseRepository` doğrudan Sequelize modelleri aldığı için tam bir dependency inversion sağlamaz; daha büyük bir sistemde model bağımlılıkları constructor ile enjekte edilmelidir.

## Testler

```bash
npm test
```

Testler bcrypt hash/doğrulamasını, zayıf parola reddini, JWT claim ve kurcalama kontrollerini, cookie ile socket doğrulamayı ve sahte `query.userID` reddini kapsar.

## Stress testi

Bağımsız ve tekrarlanabilir smoke/stress senaryosu veritabanına dokunmadan `/health` endpoint'ine yük bindirir:

```bash
npm run stress
STRESS_REQUESTS=10000 STRESS_CONCURRENCY=100 npm run stress
```

20 Temmuz 2026 tarihinde yerel geliştirme ortamında, Node.js v20.16.0 ile varsayılan senaryo (2.000 istek, 50 eşzamanlı worker) çalıştırılmıştır. Güncel ölçüm değerleri aşağıdaki test çalıştırmasından sonra kaydedilmiştir:

| Ölçüm | Sonuç |
| --- | ---: |
| Başarılı / toplam | 2.000 / 2.000 |
| Hata | 0 |
| Throughput | 3.747,4 istek/sn |
| p50 gecikme | 12,11 ms |
| p95 gecikme | 20,41 ms |
| p99 gecikme | 29,15 ms |
| Toplam süre | 533,70 ms |

Bu sonuç yalnızca Express sağlık endpoint'inin process içi kapasitesini gösterir; MySQL sorgusu, bcrypt login maliyeti, Socket.IO bağlantısı, ağ gecikmesi veya çoklu instance davranışını ölçmez. Production kapasite kararı için ayrı bir test ortamında gerçek konuşma/mesaj senaryoları, bağlantı ramp-up'ı, p95/p99 gecikme, hata oranı, CPU, bellek ve DB pool doygunluğu birlikte izlenmelidir.

## Yararlı komutlar

```bash
npm start
npm test
npm run stress
docker compose config
docker compose up --build
```

## Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.
