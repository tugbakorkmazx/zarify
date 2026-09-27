import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { legalEntity } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Kullanım Şartları — Zarify",
  description: "Zarify dijital davetiye platformunun kullanım şartları.",
};

export default function TermsOfUsePage() {
  const e = legalEntity;

  return (
    <LegalLayout eyebrow="Sözleşme" title="Kullanım Şartları">
      <section>
        <p>
          Bu Kullanım Şartları, {e.name} (&quot;Zarify&quot;, &quot;biz&quot;)
          tarafından işletilen Zarify dijital davetiye platformunun
          (&quot;Platform&quot;) kullanımına ilişkin koşulları düzenler.
          Platform&apos;a kayıt olarak veya Platform&apos;u kullanarak bu
          şartları kabul etmiş sayılırsınız.
        </p>
      </section>

      <section>
        <h2>1. Hizmetin Tanımı</h2>
        <p>
          Zarify; kullanıcıların hazır şablonlar üzerinden dijital düğün
          davetiyesi sayfası oluşturmasını, bu sayfayı bir bağlantı ile
          misafirleriyle paylaşmasını ve isteğe bağlı olarak misafirlerden
          katılım bildirimi (LCV) toplamasını sağlayan bir çevrim içi
          hizmettir. Misafirlerin davetiyeyi görüntülemek veya katılım
          bildirmek için hesap açması gerekmez.
        </p>
      </section>

      <section>
        <h2>2. Hesap</h2>
        <ul>
          <li>Kayıt olmak için 18 yaşını doldurmuş olmanız gerekir.</li>
          <li>
            Kayıt sırasında verdiğiniz bilgilerin doğru ve güncel olmasından
            siz sorumlusunuz.
          </li>
          <li>
            Şifrenizin gizliliğini korumak ve hesabınız üzerinden yapılan
            işlemler sizin sorumluluğunuzdadır. Yetkisiz bir kullanım fark
            ederseniz bize derhâl bildiriniz.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Ücretlendirme ve Yayın</h2>
        <p>
          Kayıt olmak ve davetiye bilgilerinizi girmek ücretsizdir. Bir
          davetiyenin misafirlere açık olarak yayınlanması, ilgili paket
          ücretinin ödenmesine bağlıdır. Güncel ücret ve ödeme talimatları,
          davetiyenizi yayınlamadan önce size gösterilir. Ödemeniz tarafımızca
          doğrulandıktan sonra davetiyeniz yayına alınır.
        </p>
        <p>
          Ücretli satışlara ilişkin cayma hakkı, iade ve diğer koşullar,
          ayrıca yayınlanacak Mesafeli Satış Sözleşmesi ve İade Politikası
          ile düzenlenir.
        </p>
      </section>

      <section>
        <h2>4. Kullanıcı İçeriği</h2>
        <p>
          Davetiyenize eklediğiniz isimler, tarih, mekân, metin ve diğer
          içerikler (&quot;İçerik&quot;) size aittir ve bunlardan siz
          sorumlusunuz. İçeriğin üçüncü kişilerin haklarını ihlal etmediğini
          ve hukuka uygun olduğunu kabul edersiniz. Yayınlanan bir davetiyenin
          bağlantısını bilen herkesin İçerik&apos;i görüntüleyebileceğini
          bilerek paylaşım yapmalısınız.
        </p>
        <p>
          İçerik&apos;i yalnızca hizmeti size sunmak amacıyla (saklamak,
          görüntülemek, misafirlerinize göstermek) kullanma hakkını bize
          vermiş olursunuz. Bu hak, davetiyeniz veya hesabınız silindiğinde
          sona erer.
        </p>
      </section>

      <section>
        <h2>5. Misafir Verileri</h2>
        <p>
          Misafirlerinizin gönderdiği katılım bildirimleri (ad, katılım
          durumu, kişi sayısı, not) panelinizde size gösterilir. Bu bilgileri
          yalnızca davetinizin organizasyonu amacıyla kullanmayı ve
          misafirlerinizin rızası olmadan üçüncü kişilerle paylaşmamayı kabul
          edersiniz. Verilerin nasıl işlendiği{" "}
          <Link href="/gizlilik">Gizlilik Politikası</Link>&apos;nda
          açıklanmıştır.
        </p>
      </section>

      <section>
        <h2>6. Yasak Kullanımlar</h2>
        <p>Platform&apos;u aşağıdaki amaçlarla kullanamazsınız:</p>
        <ul>
          <li>
            Hukuka aykırı, yanıltıcı, hakaret içeren, müstehcen veya üçüncü
            kişilerin haklarını ihlal eden içerik yayınlamak,
          </li>
          <li>
            Davetiye dışı amaçlarla (reklam, istenmeyen toplu ileti,
            dolandırıcılık, kimlik avı vb.) sayfa oluşturmak,
          </li>
          <li>
            Platform&apos;un güvenliğini tehlikeye atmak, sistemlere yetkisiz
            erişmeye çalışmak veya hizmeti aşırı yükleyecek otomatik
            istekler göndermek,
          </li>
          <li>Başka bir kişinin adına veya izni olmadan davetiye oluşturmak.</li>
        </ul>
        <p>
          Bu kurallara aykırı içerikleri yayından kaldırma ve ilgili hesabı
          askıya alma veya kapatma hakkımız saklıdır.
        </p>
      </section>

      <section>
        <h2>7. Fikri Mülkiyet</h2>
        <p>
          Şablonlar, tasarımlar, süslemeler, yazılım ve Zarify markası dahil
          olmak üzere Platform&apos;un tüm unsurları Zarify&apos;a veya lisans
          verenlerine aittir. Şablonları yalnızca Platform üzerinde, kendi
          davetiyeniz için kullanabilirsiniz; kopyalanması, çoğaltılması veya
          Platform dışında kullanılması yasaktır.
        </p>
      </section>

      <section>
        <h2>8. Hizmetin Sürekliliği ve Sorumluluk</h2>
        <p>
          Platform&apos;u kesintisiz ve hatasız sunmak için makul özeni
          gösteririz; ancak bakım, teknik arıza veya elimizde olmayan
          sebeplerle yaşanabilecek kesintilerden doğan dolaylı zararlardan
          sorumlu değiliz. Misafir yanıtlarının ve davetiye içeriğinin
          yedeğini almanızı öneririz.
        </p>
        <p>
          Zarify, davetiyelerde yer alan etkinliklerin organizatörü değildir;
          etkinliğin gerçekleşmesi, değişmesi veya iptali davetiye sahibinin
          sorumluluğundadır. Kanunen sınırlandırılamayan sorumluluklar ile
          tüketici mevzuatından doğan haklarınız saklıdır.
        </p>
      </section>

      <section>
        <h2>9. Fesih</h2>
        <p>
          Hesabınızı dilediğiniz zaman kapatmayı talep edebilirsiniz. Bu
          şartları ihlal etmeniz hâlinde hesabınızı askıya alabilir veya
          kapatabiliriz. Hesabın kapanmasıyla birlikte davetiyeleriniz
          yayından kaldırılır ve verileriniz Gizlilik Politikası&apos;nda
          belirtilen sürelere uygun olarak silinir.
        </p>
      </section>

      <section>
        <h2>10. Değişiklikler</h2>
        <p>
          Bu şartları zaman zaman güncelleyebiliriz. Önemli değişiklikleri
          yürürlüğe girmeden önce Platform üzerinden veya e-posta ile
          bildiririz. Değişiklikten sonra Platform&apos;u kullanmaya devam
          etmeniz, güncel şartları kabul ettiğiniz anlamına gelir.
        </p>
      </section>

      <section>
        <h2>11. Uygulanacak Hukuk ve Uyuşmazlıklar</h2>
        <p>
          Bu şartlar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda{" "}
          {e.courtCity} mahkemeleri ve icra daireleri yetkilidir. Tüketici
          sıfatıyla hareket eden kullanıcıların, yasal parasal sınırlar
          dahilinde tüketici hakem heyetlerine ve tüketici mahkemelerine
          başvurma hakkı saklıdır.
        </p>
      </section>

      <section>
        <h2>12. İletişim</h2>
        <p>
          Sorularınız için {e.email} adresinden veya {e.address} adresinden
          bize ulaşabilirsiniz.
        </p>
      </section>
    </LegalLayout>
  );
}
