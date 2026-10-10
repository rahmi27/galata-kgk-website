"use client";

export function ConfirmSubmitButton({ message, children }: { message: string; children: React.ReactNode }) {
  return <button type="submit" onClick={(event) => { if (!window.confirm(message)) event.preventDefault(); }} className="font-semibold text-red-700 underline dark:text-red-300">{children}</button>;
}
