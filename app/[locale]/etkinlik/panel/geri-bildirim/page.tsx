import { CheckCircle2, Star } from "lucide-react";

import { submitEventFeedbackAction } from "@/app/[locale]/etkinlik/panel/geri-bildirim/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { requireEventParticipant } from "@/lib/event-participant-session";

export const dynamic = "force-dynamic";

export default async function FeedbackPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ durum?: string }> }) {
  const [{ locale }, { durum }] = await Promise.all([params, searchParams]);
  const participant = await requireEventParticipant(locale);
  const en = locale === "en";
  if (!participant.eventSession.feedbackEnabled) return <Unavailable en={en} />;
  if (durum === "tesekkurler") return <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-5 py-16"><div className="w-full rounded-[2rem] border bg-card p-10 text-center"><CheckCircle2 className="mx-auto size-14 text-emerald-600" /><h1 className="mt-5 font-heading text-3xl font-bold">{en ? "Thank you!" : "Teşekkür ederiz!"}</h1><p className="mt-4 text-muted-foreground">{en ? "Your feedback has been shared with the event team." : "Geri bildirimin etkinlik ekibiyle paylaşıldı."}</p></div></main>;
  return <main className="mx-auto max-w-2xl px-5 py-16"><div className="rounded-[2rem] border border-primary-100 bg-card p-8 sm:p-10 dark:border-white/10"><h1 className="font-heading text-3xl font-bold">{en ? "Share your feedback" : "Geri bildirimini paylaş"}</h1><p className="mt-3 text-muted-foreground">{en ? "Your rating helps us improve future events." : "Puanın gelecek etkinlikleri geliştirmemize yardımcı olur."}</p>{durum === "gecersiz" ? <p className="mt-4 text-sm font-semibold text-red-700">{en ? "Please select a rating." : "Lütfen bir puan seç."}</p> : null}<form action={submitEventFeedbackAction} className="mt-7 space-y-6"><input type="hidden" name="locale" value={locale} /><fieldset><legend className="text-sm font-semibold">{en ? "Rating" : "Puan"}</legend><div className="mt-3 flex flex-wrap gap-2">{[1,2,3,4,5].map((rating) => <label key={rating} className="cursor-pointer"><input className="peer sr-only" type="radio" name="rating" value={rating} required /><span className="flex items-center gap-1 rounded-full border border-primary-100 px-4 py-2 font-semibold peer-checked:border-accent peer-checked:bg-accent-50 peer-checked:text-accent-800 dark:border-white/10">{rating}<Star className="size-4" /></span></label>)}</div></fieldset><label className="block text-sm font-semibold">{en ? "Comment (optional)" : "Yorum (opsiyonel)"}<Textarea name="comment" maxLength={2000} className="mt-2 min-h-32" /></label><Button type="submit" className="w-full">{en ? "Send feedback" : "Geri bildirimi gönder"}</Button></form></div></main>;
}
function Unavailable({ en }: { en: boolean }) { return <main className="mx-auto max-w-2xl px-5 py-20 text-center"><h1 className="font-heading text-3xl font-bold">{en ? "Feedback is closed" : "Geri bildirim kapalı"}</h1></main>; }
