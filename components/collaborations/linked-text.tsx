import { linkifyHttpText } from "@/lib/linked-text";

export function LinkedText({ text }: { text: string }) {
  return <>{linkifyHttpText(text).map((part, index) => part.href ? (
    <a
      key={index}
      href={part.href}
      target="_blank"
      rel="noopener noreferrer"
      className="break-all font-medium text-accent-700 underline decoration-accent/40 underline-offset-4 hover:text-accent-900 dark:text-accent-300 dark:hover:text-accent-200"
    >
      {part.text}
    </a>
  ) : <span key={index}>{part.text}</span>)}</>;
}
