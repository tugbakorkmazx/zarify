import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { getPublishedInvitation } from "@/lib/publicInvitation";
import { formatDateLine } from "@/lib/formatDateLine";

/** The share-preview card for a published invitation: the swan-lake cover
 * (a pre-cropped, darkened 1200×630 JPEG — Satori can't read WebP) with the
 * couple's names, date and venue in Gloock on an ivory card. Served as
 * JPEG: WhatsApp drops previews whose image is too heavy, and a PNG of a
 * painting easily is. A pending or unknown invitation gets the same card
 * without any names. Assets: frontend/assets/og/ (Gloock is OFL-licensed,
 * see OFL.txt there). */

export const alt = "Düğün davetiyesi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

const assets = join(process.cwd(), "assets", "og");
const fontData = readFile(join(assets, "Gloock-Regular.ttf"));
const background = readFile(join(assets, "swan-lake-og.jpg")).then(
  (data) => `data:image/jpeg;base64,${data.toString("base64")}`,
);

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const invitation = await getPublishedInvitation(slug);

  const names = invitation ? `${invitation.brideName} & ${invitation.groomName}` : "Zarify";
  const lines = invitation
    ? [formatDateLine(invitation.weddingDate), invitation.venueName]
    : ["Dijital düğün davetiyesi"];

  const png = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img> only */}
        <img
          src={await background}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 760,
            padding: "52px 56px",
            background: "#efe8d6",
            border: "2px solid rgba(31,28,23,0.25)",
            boxShadow: "0 12px 40px rgba(18,15,12,0.55)",
            color: "#1f1c17",
            textAlign: "center",
          }}
        >
          {/* Uppercased in Turkish here — Satori's text-transform would
              give "DAVETIYESI" without the dotted İ. */}
          <div style={{ fontSize: 24, letterSpacing: 6, color: "#6d1d28" }}>
            {(invitation ? "Düğün Davetiyesi" : "Davetiye").toLocaleUpperCase("tr-TR")}
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: names.length > 26 ? 60 : 76,
              lineHeight: 1.02,
              display: "flex",
              textAlign: "center",
            }}
          >
            {names}
          </div>
          <div style={{ marginTop: 22, width: 140, height: 6, borderTop: "1px solid #1f1c17", borderBottom: "1px solid #1f1c17" }} />
          {lines.map((line) => (
            <div key={line} style={{ marginTop: 18, fontSize: 30, color: "#4c463b" }}>
              {line}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Gloock", data: await fontData, style: "normal", weight: 400 }],
    },
  );

  const jpeg = await sharp(Buffer.from(await png.arrayBuffer())).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
