import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

import { deleteQuizQuestionAction, saveQuizAction, saveQuizQuestionAction } from "@/app/admin/(panel)/etkinlik-modu/quiz/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function QuizAdminPage({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  const [{ durum }, active] = await Promise.all([
    searchParams,
    prisma.eventSession.findFirst({
      where: { isActive: true },
      include: { quizzes: { orderBy: { id: "asc" }, include: { questions: { orderBy: { order: "asc" } } } } },
    }),
  ]);
  const quiz = active?.quizzes.find((item) => item.isActive) ?? active?.quizzes[0];

  return <>
    <AdminPageHeader eyebrow="Etkinlik Modu" title="Quiz Yönetimi" description="Aktif oturumun quiz başlığını, sorularını, dört seçeneğini ve doğru cevabını yönetin." actions={<Button asChild variant="outline"><Link href="/admin/etkinlik-modu"><ArrowLeft /> Merkeze dön</Link></Button>} />
    {durum ? <p className="mt-6 rounded-xl border border-primary-100 bg-white px-4 py-3 text-sm font-semibold dark:border-white/10 dark:bg-primary-950">İşlem tamamlandı: {durum}</p> : null}
    {!active ? <p className="mt-8 rounded-3xl border border-dashed border-primary-200 p-10 text-center">Önce bir etkinlik oturumunu aktif yapın.</p> : <div className="mt-8 grid gap-7 xl:grid-cols-[1fr_25rem]">
      <section className="space-y-4">
        {quiz?.questions.map((question) => <QuestionCard key={question.id} question={question} quizId={quiz.id} />)}
        {quiz && !quiz.questions.length ? <p className="rounded-3xl border border-dashed p-10 text-center">Henüz soru yok.</p> : null}
      </section>
      <aside className="space-y-6">
        <section className="rounded-3xl border border-primary-100 bg-white p-6 dark:border-white/10 dark:bg-primary-950">
          <h2 className="font-heading text-xl font-bold">Quiz ayarları</h2>
          <form action={saveQuizAction} className="mt-5 space-y-4">
            {quiz ? <input type="hidden" name="id" value={quiz.id} /> : null}
            <label className="block text-sm font-semibold">Quiz başlığı<Input name="title" defaultValue={quiz?.title ?? `${active.title} Quiz`} minLength={3} maxLength={140} required className="mt-2" /></label>
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="isActive" defaultChecked={quiz?.isActive ?? true} /> Aktif quiz</label>
            <Button type="submit" size="sm">Kaydet</Button>
          </form>
        </section>
        {quiz ? <section className="rounded-3xl border border-primary-100 bg-white p-6 dark:border-white/10 dark:bg-primary-950"><h2 className="font-heading text-xl font-bold">Yeni soru</h2><QuestionForm quizId={quiz.id} nextOrder={quiz.questions.length + 1} /></section> : null}
      </aside>
    </div>}
  </>;
}

type Question = { id: number; questionText: string; options: unknown; correctOptionIndex: number; order: number };

function QuestionCard({ question, quizId }: { question: Question; quizId: number }) {
  const options = Array.isArray(question.options) ? question.options.map(String) : ["", "", "", ""];
  return <article className="rounded-3xl border border-primary-100 bg-white p-6 dark:border-white/10 dark:bg-primary-950">
    <div className="flex items-center justify-between"><h2 className="font-heading text-lg font-bold">{question.order}. {question.questionText}</h2><form action={deleteQuizQuestionAction}><input type="hidden" name="id" value={question.id} /><Button type="submit" size="icon" variant="destructive" aria-label="Soruyu sil"><Trash2 /></Button></form></div>
    <details className="mt-4"><summary className="cursor-pointer text-sm font-semibold text-accent-700">Soruyu düzenle</summary><QuestionForm quizId={quizId} question={{ ...question, options }} /></details>
  </article>;
}

function QuestionForm({ quizId, nextOrder = 1, question }: { quizId: number; nextOrder?: number; question?: Question & { options: string[] } }) {
  return <form action={saveQuizQuestionAction} className="mt-5 space-y-4">
    <input type="hidden" name="quizId" value={quizId} />{question ? <input type="hidden" name="id" value={question.id} /> : null}
    <label className="block text-sm font-semibold">Soru<Input name="questionText" defaultValue={question?.questionText} minLength={3} maxLength={500} required className="mt-2" /></label>
    {[0, 1, 2, 3].map((index) => <label key={index} className="block text-sm font-semibold">{index + 1}. seçenek<Input name={`option${index}`} defaultValue={question?.options[index]} maxLength={240} required className="mt-2" /></label>)}
    <div className="grid grid-cols-2 gap-3"><label className="text-sm font-semibold">Doğru seçenek<select name="correctOptionIndex" defaultValue={question?.correctOptionIndex ?? 0} className="mt-2 h-10 w-full rounded-md border bg-background px-3">{[0,1,2,3].map((index) => <option key={index} value={index}>{index + 1}</option>)}</select></label><label className="text-sm font-semibold">Sıra<Input name="order" type="number" min={0} max={10000} defaultValue={question?.order ?? nextOrder} required className="mt-2" /></label></div>
    <Button type="submit" size="sm"><Plus /> {question ? "Güncelle" : "Soru ekle"}</Button>
  </form>;
}
