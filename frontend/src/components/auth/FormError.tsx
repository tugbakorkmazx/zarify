export function FormError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="border border-gold-deep/50 bg-parchment-deep px-4 py-3 font-body text-sm text-ink"
    >
      {message}
    </p>
  );
}
