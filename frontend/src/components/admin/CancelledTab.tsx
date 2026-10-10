"use client";

import { CoupleNames } from "@/components/herbarium/CoupleNames";
import { getCancelledOrders } from "@/lib/admin";
import { formatPrice } from "@/lib/pricing";
import { EmptyNote, LoadState, formatMoment, useAdminData } from "./shared";

/** Orders their owners cancelled before publishing (or that went with a
 * deleted account). The invitation is gone; the agreement record stays,
 * with what's needed to refund a transfer that already arrived. */
export function CancelledTab() {
  const { status, data, reload } = useAdminData("cancelled", getCancelledOrders);

  if (status !== "ready" || !data) return <LoadState status={status} onRetry={reload} />;

  return (
    <>
      <p className="mx-auto mb-8 max-w-[56ch] text-center font-body text-lg italic text-soot-soft">
        Sahibi tarafından yayından önce iptal edilen siparişler. Davetiye silinmiştir; sözleşme kaydı saklanır. Bu
        referansla havale geldiyse iade edin.
      </p>
      {data.length === 0 ? (
        <EmptyNote>İptal edilen sipariş yok.</EmptyNote>
      ) : (
        <ul className="mx-auto max-w-3xl divide-y divide-soot/20 border-y border-soot">
          {data.map((order) => (
            <li key={order.id} className="flex flex-col items-center gap-1 py-5 text-center">
              <p className="font-display numerals text-2xl leading-none text-wine">
                {order.paymentReference ?? "—"}
                <span className="ml-3 font-body text-lg text-soot">{formatPrice(order.amountTry, "tr")}</span>
              </p>
              <p className="font-body text-lg text-soot">
                <CoupleNames names={order.coupleNames} />
              </p>
              <p className="font-body text-base text-soot-soft">
                {order.userFirstName} {order.userLastName} · <span className="break-all">{order.userEmail}</span>
              </p>
              <p className="font-body text-sm text-soot-soft">
                Sipariş: {formatMoment(order.acceptedAtUtc)} · İptal: {formatMoment(order.cancelledAtUtc)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
