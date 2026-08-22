import { normalizePersonName } from "@/lib/person-name";
import { getSafeHttpUrl } from "@/lib/url-security";

export type PersonAdminInput = {
  name: string;
  nameEn: string | null;
  normalizedName: string;
  department: string;
  departmentEn: string | null;
  photoAlt: string | null;
  photoAltEn: string | null;
  socialPlatform: "instagram" | "linkedin" | null;
  socialUrl: string | null;
};

export type MembershipAdminInput = {
  categoryId: number | null;
  newCategoryName: string | null;
  newCategoryNameEn: string | null;
  role: string;
  roleEn: string | null;
  order: number | null;
};

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

export function validatePersonForm(
  formData: FormData,
): ValidationResult<PersonAdminInput> {
  const name = value(formData, "name").replace(/\s+/g, " ");
  const nameEn = value(formData, "nameEn").replace(/\s+/g, " ");
  const department = value(formData, "department").replace(/\s+/g, " ");
  const departmentEn = value(formData, "departmentEn").replace(/\s+/g, " ");
  const photoAlt = value(formData, "photoAlt");
  const photoAltEn = value(formData, "photoAltEn");
  const socialPlatform = value(formData, "socialPlatform");
  const socialUrl = value(formData, "socialUrl");

  if (name.length < 2 || name.length > 100) {
    return { success: false, error: "Ad soyad 2–100 karakter olmalıdır." };
  }

  if (department.length < 2 || department.length > 120) {
    return { success: false, error: "Bölüm 2–120 karakter olmalıdır." };
  }

  if (nameEn && (nameEn.length < 2 || nameEn.length > 100)) {
    return { success: false, error: "İngilizce ad 2–100 karakter olmalıdır." };
  }

  if (departmentEn && (departmentEn.length < 2 || departmentEn.length > 120)) {
    return { success: false, error: "İngilizce bölüm 2–120 karakter olmalıdır." };
  }

  if (photoAlt.length > 180) {
    return { success: false, error: "Fotoğraf alt metni en fazla 180 karakter olabilir." };
  }


  if (photoAltEn.length > 180) {
    return { success: false, error: "İngilizce fotoğraf alt metni en fazla 180 karakter olabilir." };
  }

  if (
    socialPlatform &&
    socialPlatform !== "instagram" &&
    socialPlatform !== "linkedin"
  ) {
    return { success: false, error: "Geçerli bir profil bağlantısı türü seçin." };
  }

  if (Boolean(socialPlatform) !== Boolean(socialUrl)) {
    return {
      success: false,
      error: "Profil türü ve profil bağlantısı birlikte doldurulmalıdır.",
    };
  }

  if (socialUrl && (!getSafeHttpUrl(socialUrl) || socialUrl.length > 500)) {
    return { success: false, error: "Geçerli bir http(s) profil bağlantısı girin." };
  }

  return {
    success: true,
    data: {
      name,
      nameEn: nameEn || null,
      normalizedName: normalizePersonName(name),
      department,
      departmentEn: departmentEn || null,
      photoAlt: photoAlt || null,
      photoAltEn: photoAltEn || null,
      socialPlatform: socialPlatform
        ? (socialPlatform as "instagram" | "linkedin")
        : null,
      socialUrl: socialUrl || null,
    },
  };
}

export function validateMembershipForm(
  formData: FormData,
): ValidationResult<MembershipAdminInput> {
  const categoryValue = value(formData, "categoryId");
  const newCategoryName = value(formData, "newCategoryName");
  const newCategoryNameEn = value(formData, "newCategoryNameEn").replace(/\s+/g, " ");
  const role = value(formData, "role").replace(/\s+/g, " ");
  const roleEn = value(formData, "roleEn").replace(/\s+/g, " ");
  const orderValue = value(formData, "order");
  const order = orderValue === "" ? null : Number(orderValue);

  if (role.length < 2 || role.length > 140) {
    return { success: false, error: "Kategori rolü 2–140 karakter olmalıdır." };
  }


  if (roleEn && (roleEn.length < 2 || roleEn.length > 140)) {
    return { success: false, error: "İngilizce kategori rolü 2–140 karakter olmalıdır." };
  }

  if (
    order !== null &&
    (!Number.isInteger(order) || order < 0 || order > 9999)
  ) {
    return { success: false, error: "Sıralama 0–9999 arasında tam sayı olmalıdır." };
  }

  if (categoryValue === "new") {
    if (newCategoryName.length < 2 || newCategoryName.length > 80) {
      return { success: false, error: "Yeni kategori adı 2–80 karakter olmalıdır." };
    }

    if (newCategoryNameEn && (newCategoryNameEn.length < 2 || newCategoryNameEn.length > 80)) {
      return { success: false, error: "İngilizce yeni kategori adı 2–80 karakter olmalıdır." };
    }

    return {
      success: true,
      data: { categoryId: null, newCategoryName, newCategoryNameEn: newCategoryNameEn || null, role, roleEn: roleEn || null, order },
    };
  }

  const categoryId = Number(categoryValue);
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return { success: false, error: "Geçerli bir ekip kategorisi seçin." };
  }

  return {
    success: true,
    data: { categoryId, newCategoryName: null, newCategoryNameEn: null, role, roleEn: roleEn || null, order },
  };
}
