"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, ApiError, loginHref } from "@/lib/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BUTTON_SECONDARY_SM, TEXT_LINK } from "@/lib/ui";
import { getContractDocument, saveBlob, type ContractDocument } from "@/lib/invitations";
import { describeError } from "@/lib/apiErrors";

/** "Sözleşmemi görüntüle": the Pre-Contract Information Form and the
 * Distance Sales Contract exactly as archived when the owner accepted them,
 * filled in with their details. Shown in a sandboxed frame (no scripts, no
 * same-origin access) — it's a stored document, not part of the app — and
 * downloadable as the same HTML file the order email carried. */
export default function ContractPage() {
  const { id } = useParams<{ id: string }>();
  const { ready, token } = useAuth();
  const router = useRouter();
  const [doc, setDoc] = useState<ContractDocument | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      router.replace(loginHref());
      return;
    }
    let cancelled = false;
    getContractDocument(token, id)
      .then((result) => {
        if (!cancelled) setDoc(result);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          router.replace(loginHref());
          return;
        }
        setError(describeError(err));
      });
    return () => {
      cancelled = true;
    };
  }, [ready, token, id, router]);

  if (!token) return null;

  return (
    <AuthLayout
      eyebrow="Davetiyelerim"
      title="Sözleşmem"
      wide
      footer={
        <p className="mt-10 border-t border-soot/20 pt-6">
          <Link href="/davetiyelerim" className={`apparatus text-sm ${TEXT_LINK}`}>
            ← Davetiyelerim
          </Link>
        </p>
      }
    >
      {error ? (
        <p role="alert" className="font-body text-lg text-wine">
          {error}
        </p>
      ) : !doc ? (
        <p role="status" className="font-body text-lg text-soot-soft">
          Yükleniyor…
        </p>
      ) : (
        <>
          <p className="mb-6 font-body text-lg leading-relaxed text-soot-soft">
            Onayladığınız Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi, onay anındaki hâliyle saklanır ve
            değiştirilmez. Aynı dosya sipariş e-postanızın ekinde de var.
          </p>
          <iframe
            title="Onaylanan sözleşme metinleri"
            sandbox=""
            srcDoc={doc.html}
            className="h-[70vh] w-full border border-soot/30 bg-paper"
          />
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() =>
                saveBlob(
                  new Blob([doc.html], { type: "text/html;charset=utf-8" }),
                  `zarify-sozlesme-${doc.paymentReference ?? id}.html`,
                )
              }
              className={BUTTON_SECONDARY_SM}
            >
              Dosya olarak indir
            </button>
            {doc.sha256 && (
              <span className="break-all font-body text-xs text-soot-soft">SHA-256: {doc.sha256}</span>
            )}
          </div>
        </>
      )}
    </AuthLayout>
  );
}
