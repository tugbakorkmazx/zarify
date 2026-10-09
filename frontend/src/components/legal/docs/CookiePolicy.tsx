"use client";

import Link from "next/link";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { Biz } from "@/components/legal/Placeholder";

/** Written from an actual scan of the code (2026-09-28): the site sets no
 * cookies and loads nothing from third parties; the only browser storage
 * is the three entries listed below. Update this page whenever that
 * changes — and add a consent banner if any non-essential cookie or
 * tracker is ever introduced. DRAFT: to be reviewed by a lawyer. */
export function CookiePolicy() {
  return <LegalLayout tr={<Tr />} en={<En />} />;
}

function Tr() {
  return (
    <>
      <section>
        <p>
          Bu politika, Zarify&apos;ın tarayıcınızda hangi bilgileri, ne amaçla ve ne kadar süre
          sakladığını açıklar.
        </p>
      </section>

      <section>
        <h2>1. Kısaca</h2>
        <ul>
          <li><strong>Zarify çerez (cookie) kullanmaz.</strong></li>
          <li>Analiz, reklam, takip veya sosyal medya çerezi ya da benzeri bir izleme aracı yoktur.</li>
          <li>
            Sayfalar üçüncü taraf kaynak yüklemez: yazı tipleri ve görseller kendi sunucumuzdan gelir,
            dışarıdan betik, harita veya video gömülmez.
          </li>
          <li>
            Yalnızca sitenin çalışması için zorunlu olan üç bilgi, tarayıcınızın yerel depolama
            alanlarında tutulur (aşağıdaki tablo). Bunlar sunucuya gönderilmez ve sizi başka sitelerde
            tanımak için kullanılamaz.
          </li>
          <li>
            Kullanılan tüm depolama kesinlikle gerekli nitelikte olduğundan onay (çerez) banner&apos;ı
            gösterilmez.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Tarayıcıda Tutulan Bilgiler</h2>
        <table>
          <thead>
            <tr>
              <th>Ad</th>
              <th>Tür</th>
              <th>Ne için</th>
              <th>Ne kadar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>zarify.auth</code></td>
              <td>localStorage</td>
              <td>Giriş yaptığınızda oturumunuzu açık tutar: oturum anahtarı ile adınız, e-postanız ve hesap türünüz.</td>
              <td>Çıkış yapana kadar; oturum 60 dakika sonra geçersiz sayılır.</td>
            </tr>
            <tr>
              <td><code>zarify.invitationDraft</code></td>
              <td>localStorage</td>
              <td>Henüz yayınlamadığınız davetiyenin form bilgilerini, önizlemeye geçerken kaybolmasın diye saklar.</td>
              <td>Davetiyeyi yayınlayana veya taslağı temizleyene kadar.</td>
            </tr>
            <tr>
              <td><code>zarify.envelopeShown.&lt;davetiye&gt;</code></td>
              <td>sessionStorage</td>
              <td>Bir davetiyenin zarf açılış animasyonunun aynı sekmede yeniden oynamamasını sağlar (değeri yalnızca &quot;1&quot;).</td>
              <td>Sekmeyi kapatana kadar.</td>
            </tr>
            <tr>
              <td><code>zarify.rsvp.&lt;davetiye&gt;</code></td>
              <td>localStorage</td>
              <td>Bir davetiyeye katılım bildirimi gönderdiğinizde, yanıtınızı yalnızca bu tarayıcıdan güncelleyebilmeniz için rastgele bir düzenleme anahtarı ve yazdığınız adı saklar. Sunucuda anahtarın yalnızca geri döndürülemez özeti tutulur.</td>
              <td>Tarayıcı verilerini temizleyene kadar.</td>
            </tr>
          </tbody>
        </table>
        <p>Dil tercihiniz (TR/EN) hiçbir yerde saklanmaz; sayfa yenilendiğinde Türkçe açılır.</p>
      </section>

      <section>
        <h2>3. Nasıl Silebilirsiniz?</h2>
        <p>
          &quot;Çıkış Yap&quot; oturum bilgisini siler. Tüm bilgileri, tarayıcınızın ayarlarından bu site
          için &quot;site verilerini temizle&quot; seçeneğiyle istediğiniz zaman silebilirsiniz; bu durumda
          yeniden giriş yapmanız gerekir ve yayınlanmamış taslağınız kaybolur.
        </p>
      </section>

      <section>
        <h2>4. Değişiklikler ve İletişim</h2>
        <p>
          İleride analiz veya benzeri, zorunlu olmayan bir araç eklersek bu politikayı güncelleyecek ve
          kullanmadan önce onayınızı isteyeceğiz. Kişisel verilerinizin işlenmesi hakkında bilgi için{" "}
          <Link href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</Link>&apos;ni inceleyebilir, sorularınız
          için <Biz field="email" /> adresine yazabilirsiniz.
        </p>
      </section>
    </>
  );
}

function En() {
  return (
    <>
      <section>
        <p>This policy explains what Zarify keeps in your browser, why, and for how long.</p>
      </section>

      <section>
        <h2>1. In Short</h2>
        <ul>
          <li><strong>Zarify does not use cookies.</strong></li>
          <li>There are no analytics, advertising, tracking or social-media cookies, and no similar tracking tools.</li>
          <li>Pages load nothing from third parties: fonts and images come from our own server, and no outside scripts, maps or videos are embedded.</li>
          <li>
            Only three pieces of information that the site needs in order to work are kept in your
            browser&apos;s local storage (table below). They are not sent to our server and cannot be used
            to recognise you on other sites.
          </li>
          <li>Because all of this storage is strictly necessary, no consent banner is shown.</li>
        </ul>
      </section>

      <section>
        <h2>2. What Is Kept in Your Browser</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>zarify.auth</code></td>
              <td>localStorage</td>
              <td>Keeps you signed in: your session token, name, email and account type.</td>
              <td>Until you sign out; the session stops being valid after 60 minutes.</td>
            </tr>
            <tr>
              <td><code>zarify.invitationDraft</code></td>
              <td>localStorage</td>
              <td>Keeps the details of an invitation you haven&apos;t published yet, so they aren&apos;t lost on the way to the preview.</td>
              <td>Until you publish or clear the draft.</td>
            </tr>
            <tr>
              <td><code>zarify.envelopeShown.&lt;invitation&gt;</code></td>
              <td>sessionStorage</td>
              <td>Stops an invitation&apos;s envelope animation from replaying in the same tab (the value is just &quot;1&quot;).</td>
              <td>Until you close the tab.</td>
            </tr>
            <tr>
              <td><code>zarify.rsvp.&lt;invitation&gt;</code></td>
              <td>localStorage</td>
              <td>After you RSVP to an invitation, keeps a random edit key and the name you entered, so your reply can be updated from this browser only. The server keeps only an irreversible hash of the key.</td>
              <td>Until you clear your browser data.</td>
            </tr>
          </tbody>
        </table>
        <p>Your language choice (TR/EN) is not stored anywhere; the site opens in Turkish after a reload.</p>
      </section>

      <section>
        <h2>3. How to Delete It</h2>
        <p>
          &quot;Sign out&quot; removes the session. You can remove everything at any time with your
          browser&apos;s &quot;clear site data&quot; option for this site; you&apos;ll then need to sign in
          again and any unpublished draft is lost.
        </p>
      </section>

      <section>
        <h2>4. Changes and Contact</h2>
        <p>
          If we ever add analytics or any other non-essential tool, we will update this policy and ask for
          your consent before using it. For how your personal data is processed, see the{" "}
          <Link href="/kvkk-aydinlatma-metni">Personal Data Notice</Link>; for questions, write to{" "}
          <Biz field="email" />.
        </p>
      </section>
    </>
  );
}
