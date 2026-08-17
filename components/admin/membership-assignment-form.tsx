"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { LoaderCircle, Search, UserPlus } from "lucide-react";

import { ImageUploadField } from "@/components/admin/image-upload-field";
import { ActionMessage, FormField } from "@/components/admin/person-admin-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminActionState } from "@/lib/admin-action-state";
import { initialAdminActionState } from "@/lib/admin-action-state";

type PersonOption = { id: number; name: string; department: string };
type CategoryOption = { id: number; name: string; nextOrder: number };

export function MembershipAssignmentForm({
  action,
  people,
  categories,
  fixedPerson,
}: {
  action: (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;
  people: PersonOption[];
  categories: CategoryOption[];
  fixedPerson?: PersonOption;
}) {
  const [mode, setMode] = useState<"existing" | "new">("new");
  const [search, setSearch] = useState("");
  const [categorySelection, setCategorySelection] = useState("");
  const [order, setOrder] = useState(1);
  const [state, formAction, isPending] = useActionState(action, initialAdminActionState);

  const filteredPeople = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("tr-TR");
    if (!query) return people;
    return people.filter((person) => `${person.name} ${person.department}`.toLocaleLowerCase("tr-TR").includes(query));
  }, [people, search]);

  function selectCategory(value: string) {
    setCategorySelection(value);
    const category = categories.find((item) => String(item.id) === value);
    if (category) setOrder(category.nextOrder);
  }

  return (
    <form action={formAction} className="space-y-5">
      {!fixedPerson ? (
        <>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-primary-50 p-1 dark:bg-primary-800">
            <button type="button" onClick={() => setMode("new")} className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${mode === "new" ? "bg-white text-primary-950 shadow-sm dark:bg-primary-950 dark:text-white" : "text-primary-600 dark:text-primary-200"}`}>Yeni kişi oluştur</button>
            <button type="button" onClick={() => setMode("existing")} className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${mode === "existing" ? "bg-white text-primary-950 shadow-sm dark:bg-primary-950 dark:text-white" : "text-primary-600 dark:text-primary-200"}`}>Var olan kişiyi ekle</button>
          </div>
          <input type="hidden" name="personMode" value={mode} />
          {mode === "existing" ? (
            <div className="space-y-3">
              <FormField label="Kişi ara" htmlFor="membership-person-search" hint="İsim veya bölüm yazdıkça liste filtrelenir.">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary-400" aria-hidden="true" />
                  <Input id="membership-person-search" value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Örn. Özden Topuz" autoComplete="off" />
                </div>
              </FormField>
              <FormField label="Var olan kişi" htmlFor="membership-person">
                <select id="membership-person" name="personId" className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm" required={mode === "existing"}>
                  <option value="">Kişi seçin ({filteredPeople.length} sonuç)</option>
                  {filteredPeople.map((person) => <option key={person.id} value={person.id}>{person.name} — {person.department}</option>)}
                </select>
              </FormField>
              <FormField
                label="Bölümü güncelle (isteğe bağlı)"
                htmlFor="membership-existing-department"
                hint="Boş bırakırsanız kişinin mevcut bölüm bilgisi korunur."
              >
                <Input
                  id="membership-existing-department"
                  name="existingDepartment"
                  minLength={2}
                  maxLength={120}
                  placeholder="Yalnızca değiştirmek istiyorsanız doldurun"
                />
              </FormField>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Yeni kişinin adı" htmlFor="membership-new-name">
                  <Input id="membership-new-name" name="name" minLength={2} maxLength={100} required={mode === "new"} />
                </FormField>
                <FormField label="Bölümü" htmlFor="membership-new-department">
                  <Input id="membership-new-department" name="department" minLength={2} maxLength={120} required={mode === "new"} />
                </FormField>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 dark:border-white/10 dark:bg-primary-800">
          <p className="font-heading text-sm font-bold text-primary-950 dark:text-white">{fixedPerson.name}</p>
          <p className="mt-1 text-xs text-primary-600 dark:text-primary-200">{fixedPerson.department}</p>
        </div>
      )}

      <FormField label="Kategori" htmlFor="membership-category">
        <select id="membership-category" name="categoryId" value={categorySelection} onChange={(event) => selectCategory(event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm" required>
          <option value="">Kategori seçin</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          <option value="new">+ Yeni kategori ekle</option>
        </select>
      </FormField>
      {categorySelection === "new" ? (
        <FormField label="Yeni kategori adı" htmlFor="membership-new-category" hint="Aynı ad farklı harf biçimiyle varsa mevcut kategori kullanılır.">
          <Input id="membership-new-category" name="newCategoryName" minLength={2} maxLength={80} required />
        </FormField>
      ) : null}
      <Link
        href="/admin/uyeler/kategoriler"
        className="inline-flex text-xs font-semibold text-primary-700 underline-offset-4 hover:text-accent-700 hover:underline dark:text-primary-100"
      >
        Kategorileri ayrı ekranda yönet
      </Link>

      {!fixedPerson ? (
        <>
          <ImageUploadField
            id="membership-photo"
            name="memberPhoto"
            label={mode === "new" ? "Üye fotoğrafı" : "Yeni fotoğraf (isteğe bağlı)"}
          />
          <FormField
            label="Fotoğraf alt metni"
            htmlFor={mode === "new" ? "membership-photo-alt" : "membership-existing-photo-alt"}
            hint={mode === "new" ? "Fotoğraf varsa kısa bir erişilebilirlik açıklaması yazın." : "Yeni fotoğraf seçerseniz kullanılacaktır."}
          >
            <Input
              id={mode === "new" ? "membership-photo-alt" : "membership-existing-photo-alt"}
              name={mode === "new" ? "photoAlt" : "existingPhotoAlt"}
              maxLength={180}
              placeholder="Örn. Üye portresi"
            />
          </FormField>
        </>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-[1fr_8rem]">
        <FormField label="Bu kategorideki rolü" htmlFor="membership-role">
          <Input id="membership-role" name="role" minLength={2} maxLength={140} placeholder="Örn. Etkinlik Koordinatörü" required />
        </FormField>
        <FormField label="Sıra" htmlFor="membership-order" hint="Otomatik dolar">
          <Input id="membership-order" name="order" type="number" min={0} max={9999} value={order} onChange={(event) => setOrder(Number(event.target.value))} />
        </FormField>
      </div>
      <ActionMessage state={state} />
      <Button type="submit" variant="primary" className="rounded-xl" disabled={isPending}>
        {isPending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <UserPlus aria-hidden="true" />}
        {isPending ? "Atanıyor..." : "Kategoriye ekle"}
      </Button>
    </form>
  );
}
