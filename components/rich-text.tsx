import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { safeHttpUrl } from "@/lib/join-validation";
import { normalizeMarkdown } from "@/lib/normalize-markdown";

export function RichText({ markdown, className = "" }: { markdown: string; className?: string }) {
  return <div className={`max-w-[72ch] break-words text-base text-foreground ${className}`}>
    <ReactMarkdown
      skipHtml
      remarkPlugins={[remarkBreaks]}
      components={{
        h2: ({ children }) => <h2 className="mb-4 mt-10 font-heading text-2xl font-bold tracking-tight text-primary-950 first:mt-0 dark:text-white sm:text-3xl">{children}</h2>,
        h3: ({ children }) => <h3 className="mb-3 mt-8 border-l-2 border-accent-700 pl-3 font-heading text-xl font-bold text-primary-950 dark:border-accent-300 dark:text-white">{children}</h3>,
        p: ({ children }) => <p className="mb-5 leading-7 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="my-5 list-disc space-y-2 pl-6 marker:text-accent-700 dark:marker:text-accent-300">{children}</ul>,
        ol: ({ children }) => <ol className="my-5 list-decimal space-y-2 pl-6 marker:text-accent-700 dark:marker:text-accent-300">{children}</ol>,
        li: ({ children }) => <li className="pl-1 leading-7">{children}</li>,
        strong: ({ children }) => <strong className="font-bold text-primary-950 dark:text-white">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        a: ({ href, children }) => {
          const safe = safeHttpUrl(href);
          return safe ? <a href={safe} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent-700 underline underline-offset-4 hover:text-accent-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-700 dark:text-accent-300 dark:hover:text-accent-200">{children}</a> : <span>{children}</span>;
        },
        blockquote: ({ children }) => <blockquote className="my-6 border-l-4 border-accent-700 bg-accent-50 px-5 py-4 text-primary-950 dark:border-accent-300 dark:bg-white/5 dark:text-white">{children}</blockquote>,
        hr: () => <hr className="my-8 border-primary/20 dark:border-white/20" />,
      }}
    >{normalizeMarkdown(markdown)}</ReactMarkdown>
  </div>;
}
