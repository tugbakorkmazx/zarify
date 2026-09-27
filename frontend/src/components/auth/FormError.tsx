export function FormError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="border border-wine/60 px-4 py-3 font-body text-base text-wine"
    >
      {message}
    </p>
  );
}
