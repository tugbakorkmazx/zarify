"use client";

import Link from "next/link";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { Biz } from "@/components/legal/Placeholder";

/** DRAFT: to be reviewed by a lawyer. */
export function TermsOfUse() {
  return <LegalLayout tr={<Tr />} en={<En />} />;
}

function Tr() {
  return (
    <>
      <section>
        <p>
          Bu Kullanım Şartları, <Biz field="tradeName" /> (&quot;Zarify&quot;, &quot;biz&quot;)
          tarafından işletilen Zarify dijital davetiye platformunun (&quot;Platform&quot;) kullanımına
          ilişkin koşulları düzenler. Platform&apos;a kayıt olarak veya Platform&apos;u kullanarak bu
          şartları kabul etmiş sayılırsınız.
        </p>
      </section>
      <section>
        <h2>1. Hizmetin Tanımı</h2>
        <p>
          Zarify; kullanıcıların hazır şablonlar üzerinden dijital düğün davetiyesi sayfası oluşturmasını,
          bu sayfayı bir bağlantıyla misafirleriyle paylaşmasını ve isteğe bağlı olarak misafirlerden
          katılım bildirimi toplamasını sağlayan bir çevrim içi hizmettir. Misafirlerin davetiyeyi
          görüntülemek veya katılım bildirmek için hesap açması gerekmez.
        </p>
      </section>
      <section>
        <h2>2. Hesap</h2>
        <ul>
          <li>Kayıt olmak için 18 yaşını doldurmuş olmanız gerekir.</li>
          <li>Kayıtta verdiğiniz bilgilerin doğru ve güncel olmasından siz sorumlusunuz.</li>
          <li>Şifrenizin gizliliği ve hesabınız üzerinden yapılan işlemler sizin sorumluluğunuzdadır; yetkisiz bir kullanım fark ederseniz bize derhâl bildiriniz.</li>
        </ul>
      </section>
      <section>
        <h2>3. Ücretlendirme ve Yayın</h2>
        <p>
          Kayıt olmak, davetiye bilgilerini girmek ve önizlemek ücretsizdir. Bir davetiyenin misafirlere
          açık olarak yayınlanması ücretlidir; bedel, ödeme yöntemi ve ifa koşulları{" "}
          <Link href="/on-bilgilendirme-formu">Ön Bilgilendirme Formu</Link> ve{" "}
          <Link href="/mesafeli-satis-sozlesmesi">Mesafeli Satış Sözleşmesi</Link>&apos;nde, cayma hakkı ve
          iadeler <Link href="/iptal-ve-iade">İptal ve İade Politikası</Link>&apos;nda düzenlenmiştir.
        </p>
      </section>
      <section>
        <h2>4. Kullanıcı İçeriği</h2>
        <p>
          Davetiyenize eklediğiniz isimler, tarih, mekân, metin ve diğer içerikler (&quot;İçerik&quot;)
          size aittir ve bunlardan siz sorumlusunuz. İçerik&apos;in üçüncü kişilerin haklarını ihlal
          etmediğini ve hukuka uygun olduğunu kabul edersiniz. Yayınlanan davetiyenin bağlantısını bilen
          herkesin İçerik&apos;i görebileceğini bilerek paylaşım yapmalısınız.
        </p>
        <p>
          İçerik&apos;i yalnızca hizmeti size sunmak amacıyla (saklamak, görüntülemek, misafirlerinize
          göstermek) kullanma hakkını bize vermiş olursunuz; bu hak davetiyeniz veya hesabınız silindiğinde
          sona erer.
        </p>
      </section>
      <section>
        <h2>5. Misafir Verileri</h2>
        <p>
          Misafirlerinizin gönderdiği katılım bildirimleri (ad, katılım durumu, kişi sayısı, not)
          panelinizde size gösterilir. Bu bilgileri yalnızca davetinizin organizasyonu için kullanmayı ve
          misafirlerinizin rızası olmadan üçüncü kişilerle paylaşmamayı kabul edersiniz. Verilerin nasıl
          işlendiği <Link href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</Link>&apos;nde açıklanmıştır.
        </p>
      </section>
      <section>
        <h2>6. Yasak Kullanımlar</h2>
        <p>Platform&apos;u aşağıdaki amaçlarla kullanamazsınız:</p>
        <ul>
          <li>hukuka aykırı, yanıltıcı, hakaret içeren, müstehcen veya üçüncü kişilerin haklarını ihlal eden içerik yayınlamak,</li>
          <li>davetiye dışı amaçlarla (reklam, istenmeyen toplu ileti, dolandırıcılık, kimlik avı vb.) sayfa oluşturmak,</li>
          <li>Platform&apos;un güvenliğini tehlikeye atmak, sistemlere yetkisiz erişmeye çalışmak veya hizmeti aşırı yükleyecek otomatik istekler göndermek,</li>
          <li>başka bir kişinin adına veya izni olmadan davetiye oluşturmak.</li>
        </ul>
        <p>Bu kurallara aykırı içerikleri yayından kaldırma ve ilgili hesabı askıya alma veya kapatma hakkımız saklıdır.</p>
      </section>
      <section>
        <h2>7. Fikri Mülkiyet</h2>
        <p>
          Şablonlar, tasarımlar, görseller, yazılım ve Zarify markası dahil Platform&apos;un tüm unsurları
          Zarify&apos;a veya lisans verenlerine aittir. Şablonları yalnızca Platform üzerinde, kendi
          davetiyeniz için kullanabilirsiniz; kopyalanması, çoğaltılması veya Platform dışında kullanılması
          yasaktır.
        </p>
      </section>
      <section>
        <h2>8. Hizmetin Sürekliliği ve Sorumluluk</h2>
        <p>
          Platform&apos;u kesintisiz ve hatasız sunmak için makul özeni gösteririz; ancak bakım, teknik arıza
          veya elimizde olmayan sebeplerle yaşanabilecek kesintilerden doğan dolaylı zararlardan sorumlu
          değiliz. Zarify, davetiyelerdeki etkinliklerin organizatörü değildir; etkinliğin gerçekleşmesi,
          değişmesi veya iptali davetiye sahibinin sorumluluğundadır. Kanunen sınırlandırılamayan
          sorumluluklar ile tüketici mevzuatından doğan haklarınız saklıdır.
        </p>
      </section>
      <section>
        <h2>9. Fesih</h2>
        <p>
          Hesabınızın kapatılmasını dilediğiniz zaman <Biz field="email" /> adresinden talep edebilirsiniz.
          Bu şartları ihlal etmeniz hâlinde hesabınızı askıya alabilir veya kapatabiliriz. Hesabın
          kapanmasıyla davetiyeleriniz yayından kaldırılır ve verileriniz KVKK Aydınlatma Metni&apos;ndeki
          sürelere uygun olarak silinir.
        </p>
      </section>
      <section>
        <h2>10. Değişiklikler</h2>
        <p>
          Bu şartları zaman zaman güncelleyebiliriz. Önemli değişiklikleri yürürlüğe girmeden önce
          Platform üzerinden veya e-posta ile bildiririz. Değişiklikten sonra Platform&apos;u kullanmaya
          devam etmeniz, güncel şartları kabul ettiğiniz anlamına gelir.
        </p>
      </section>
      <section>
        <h2>11. Uygulanacak Hukuk ve Uyuşmazlıklar</h2>
        <p>
          Bu şartlar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda <Biz field="courtCity" />{" "}
          mahkemeleri ve icra daireleri yetkilidir. Tüketici sıfatıyla hareket eden kullanıcıların, yasal
          parasal sınırlar dahilinde tüketici hakem heyetlerine ve tüketici mahkemelerine başvurma hakkı
          saklıdır.
        </p>
      </section>
      <section>
        <h2>12. İletişim</h2>
        <p>
          <Biz field="email" /> · <Biz field="phone" /> · <Biz field="address" />
        </p>
      </section>
    </>
  );
}

function En() {
  return (
    <>
      <section>
        <p>
          These Terms of Use govern the use of the Zarify digital invitation platform (the
          &quot;Platform&quot;) operated by <Biz field="tradeName" /> (&quot;Zarify&quot;, &quot;we&quot;).
          By signing up to or using the Platform you accept these terms.
        </p>
      </section>
      <section>
        <h2>1. The Service</h2>
        <p>
          Zarify lets users build a digital wedding invitation page from ready-made templates, share it
          with guests by link, and optionally collect RSVPs. Guests don&apos;t need an account to view an
          invitation or reply.
        </p>
      </section>
      <section>
        <h2>2. Your Account</h2>
        <ul>
          <li>You must be 18 or older to sign up.</li>
          <li>You are responsible for the details you give being accurate and up to date.</li>
          <li>You are responsible for keeping your password secret and for what is done through your account; tell us at once if you notice unauthorised use.</li>
        </ul>
      </section>
      <section>
        <h2>3. Pricing and Publishing</h2>
        <p>
          Signing up, entering your details and previewing are free. Publishing an invitation to guests is
          paid; the price, payment method and performance terms are set out in the{" "}
          <Link href="/on-bilgilendirme-formu">Pre-Contract Information Form</Link> and the{" "}
          <Link href="/mesafeli-satis-sozlesmesi">Distance Sales Contract</Link>, and withdrawal and refunds
          in the <Link href="/iptal-ve-iade">Cancellation &amp; Refund Policy</Link>.
        </p>
      </section>
      <section>
        <h2>4. Your Content</h2>
        <p>
          The names, date, venue, text and anything else you add (&quot;Content&quot;) belong to you and
          you are responsible for them. You confirm that your Content is lawful and doesn&apos;t infringe
          anyone&apos;s rights. Remember that anyone with a published invitation&apos;s link can see it.
        </p>
        <p>
          You give us the right to use your Content only to provide the service to you (storing it,
          displaying it, showing it to your guests); this right ends when your invitation or account is deleted.
        </p>
      </section>
      <section>
        <h2>5. Guest Data</h2>
        <p>
          RSVPs your guests send (name, attendance, number of guests, note) are shown in your dashboard. You
          agree to use them only to organise your event and not to share them with others without your
          guests&apos; consent. How the data is processed is explained in the{" "}
          <Link href="/kvkk-aydinlatma-metni">Personal Data Notice</Link>.
        </p>
      </section>
      <section>
        <h2>6. Prohibited Use</h2>
        <p>You may not use the Platform to:</p>
        <ul>
          <li>publish unlawful, misleading, abusive or obscene content, or content that infringes others&apos; rights,</li>
          <li>create pages for anything other than an invitation (advertising, spam, fraud, phishing, etc.),</li>
          <li>endanger the Platform&apos;s security, try to access systems without authorisation, or overload the service with automated requests,</li>
          <li>create an invitation in someone else&apos;s name or without their permission.</li>
        </ul>
        <p>We may remove content that breaks these rules and suspend or close the account concerned.</p>
      </section>
      <section>
        <h2>7. Intellectual Property</h2>
        <p>
          Templates, designs, images, software and the Zarify brand belong to Zarify or its licensors. You
          may use the templates only on the Platform, for your own invitation; copying them or using them
          elsewhere is prohibited.
        </p>
      </section>
      <section>
        <h2>8. Availability and Liability</h2>
        <p>
          We take reasonable care to run the Platform without interruptions or errors, but we are not liable
          for indirect loss from outages caused by maintenance, technical faults or events beyond our
          control. Zarify doesn&apos;t organise the events in invitations; whether an event takes place, changes
          or is cancelled is the owner&apos;s responsibility. Liability that cannot be limited by law and your
          rights as a consumer are unaffected.
        </p>
      </section>
      <section>
        <h2>9. Ending the Agreement</h2>
        <p>
          You can ask us to close your account at any time via <Biz field="email" />. If you break these
          terms we may suspend or close your account. When an account is closed its invitations are taken
          offline and the data is deleted within the periods in the Personal Data Notice.
        </p>
      </section>
      <section>
        <h2>10. Changes</h2>
        <p>
          We may update these terms from time to time and will announce important changes on the Platform
          or by email before they take effect. Continuing to use the Platform afterwards means you accept the
          updated terms.
        </p>
      </section>
      <section>
        <h2>11. Governing Law and Disputes</h2>
        <p>
          These terms are governed by the laws of the Republic of Turkey. The courts and enforcement offices
          of <Biz field="courtCity" /> have jurisdiction. Users acting as consumers keep their right to apply
          to consumer arbitration committees and consumer courts within the statutory limits.
        </p>
      </section>
      <section>
        <h2>12. Contact</h2>
        <p>
          <Biz field="email" /> · <Biz field="phone" /> · <Biz field="address" />
        </p>
      </section>
    </>
  );
}
