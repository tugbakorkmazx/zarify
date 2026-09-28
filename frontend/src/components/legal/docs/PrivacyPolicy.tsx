"use client";

import Link from "next/link";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { Biz } from "@/components/legal/Placeholder";

/** The plain-language overview. The legally required detail (purposes,
 * legal grounds, retention, KVKK md. 11 rights) lives in the KVKK notice;
 * browser storage in the cookie policy. DRAFT: to be reviewed by a lawyer. */
export function PrivacyPolicy() {
  return <LegalLayout tr={<Tr />} en={<En />} />;
}

function Tr() {
  return (
    <>
      <section>
        <p>
          Zarify bir davetiye hizmetidir, veri işi değil. Yalnızca davetiyenizi hazırlamak, yayınlamak ve
          misafirlerinizin yanıtlarını size iletmek için gereken bilgileri tutarız. Ayrıntılar{" "}
          <Link href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</Link>&apos;nde yer alır.
        </p>
      </section>

      <section>
        <h2>Taahhütlerimiz</h2>
        <ul>
          <li>Verilerinizi satmayız, reklam veya pazarlama için kullanmayız.</li>
          <li>Sitede reklam, analiz veya takip aracı yoktur; çerez kullanmayız (<Link href="/cerez-politikasi">Çerez Politikası</Link>).</li>
          <li>Misafirlerinizden yalnızca ad, katılım durumu, kişi sayısı ve isteğe bağlı bir not isteriz; e-posta veya telefon istemeyiz.</li>
          <li>Misafir yanıtlarını yalnızca davetiye sahibi görür; davetiye sayfasında gösterilmez.</li>
          <li>Kart bilgisi toplamayız; ödeme banka havalesiyle yapılır.</li>
        </ul>
      </section>

      <section>
        <h2>Güvenlik</h2>
        <ul>
          <li>Tüm bağlantılar şifrelidir (HTTPS).</li>
          <li>Şifreler geri döndürülemez biçimde (bcrypt) saklanır; kimse göremez.</li>
          <li>Giriş, kayıt ve katılım formları kısa sürede çok sayıda denemeye karşı sınırlandırılmıştır.</li>
          <li>Misafir yanıtlarını yalnızca davetiye sahibi görebilir; ödeme referansını ise sahibi ve havaleyi onaylayan yöneticimiz görür.</li>
        </ul>
      </section>

      <section>
        <h2>Paylaşım</h2>
        <p>
          Yayınlanan bir davetiyenin içeriği, bağlantıyı bilen herkes tarafından görülebilir; bağlantıyı
          kiminle paylaşacağınıza siz karar verirsiniz. Veriler yalnızca barındırma sağlayıcımızla (
          <Biz field="hostingProvider" />) ve kanunen yetkili kurumlarla, talep hâlinde paylaşılır.
        </p>
      </section>

      <section>
        <h2>Yaş Sınırı</h2>
        <p>Hesap açmak için 18 yaşını doldurmuş olmanız gerekir.</p>
      </section>

      <section>
        <h2>İletişim ve Haklarınız</h2>
        <p>
          Verilerinize erişmek, düzeltmek veya silinmesini istemek için <Biz field="email" /> adresine
          yazabilirsiniz. KVKK kapsamındaki tüm haklarınız ve başvuru yolları{" "}
          <Link href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</Link>&apos;nde açıklanmıştır.
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
          Zarify is an invitation service, not a data business. We keep only what is needed to prepare and
          publish your invitation and to pass your guests&apos; replies on to you. The details are in the{" "}
          <Link href="/kvkk-aydinlatma-metni">Personal Data Notice</Link>.
        </p>
      </section>

      <section>
        <h2>Our Commitments</h2>
        <ul>
          <li>We never sell your data or use it for advertising or marketing.</li>
          <li>There are no ads, analytics or trackers on the site, and no cookies (<Link href="/cerez-politikasi">Cookie Policy</Link>).</li>
          <li>From your guests we ask only for a name, whether they&apos;re coming, how many, and an optional note — never an email or phone number.</li>
          <li>Guests&apos; replies are seen only by the invitation owner and never shown on the invitation page.</li>
          <li>We don&apos;t collect card details; payment is by bank transfer.</li>
        </ul>
      </section>

      <section>
        <h2>Security</h2>
        <ul>
          <li>All connections are encrypted (HTTPS).</li>
          <li>Passwords are stored irreversibly (bcrypt); nobody can read them.</li>
          <li>Sign-in, sign-up and RSVP forms are limited against rapid repeated attempts.</li>
          <li>Guests&apos; replies can be seen only by the invitation owner; the payment reference is seen by the owner and by our admin who confirms the transfer.</li>
        </ul>
      </section>

      <section>
        <h2>Sharing</h2>
        <p>
          A published invitation&apos;s content can be seen by anyone who has its link; you decide who gets
          it. Otherwise data is shared only with our hosting provider (<Biz field="hostingProvider" />) and,
          on request, with competent authorities.
        </p>
      </section>

      <section>
        <h2>Age</h2>
        <p>You must be 18 or older to open an account.</p>
      </section>

      <section>
        <h2>Contact and Your Rights</h2>
        <p>
          To access, correct or delete your data, write to <Biz field="email" />. All your rights under KVKK
          and how to use them are set out in the <Link href="/kvkk-aydinlatma-metni">Personal Data Notice</Link>.
        </p>
      </section>
    </>
  );
}
