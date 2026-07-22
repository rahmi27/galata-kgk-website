import "server-only";

type ValidationSuccess<T> = {
  success: true;
  data: T;
};

type ValidationFailure = {
  success: false;
  error: string;
};

type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export type EventAdminInput = {
  title: string;
  description: string;
  longDescription: string;
  date: Date | null;
  location: string;
  imageUrl: string | null;
  imageAlt: string | null;
  category: string;
};

export type TeamMemberAdminInput = {
  name: string;
  role: string;
  department: string;
  categoryId: number | null;
  newCategoryName: string | null;
  photoAlt: string | null;
  order: number;
};

export type SiteStatAdminInput = {
  label: string;
  value: string;
  order: number;
};

export type SponsorAdminInput = {
  name: string;
  websiteUrl: string | null;
  description: string | null;
  tierId: number | null;
  newTierName: string | null;
  logoAlt: string;
  order: number;
};

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validateOptionalUrl(value: string) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateEventForm(
  formData: FormData,
): ValidationResult<EventAdminInput> {
  const title = getFormString(formData, "title");
  const description = getFormString(formData, "description");
  const longDescription = getFormString(formData, "longDescription");
  const dateValue = getFormString(formData, "date");
  const location = getFormString(formData, "location");
  const category = getFormString(formData, "category");
  const imageUrl = getFormString(formData, "imageUrl");
  const imageAlt = getFormString(formData, "imageAlt");
  const date = dateValue ? new Date(dateValue) : null;

  if (title.length < 3 || title.length > 140) {
    return {
      success: false,
      error: "Etkinlik başlığı 3–140 karakter arasında olmalıdır.",
    };
  }

  if (description.length < 10 || description.length > 320) {
    return {
      success: false,
      error: "Kısa açıklama 10–320 karakter arasında olmalıdır.",
    };
  }

  if (longDescription.length < 20 || longDescription.length > 5000) {
    return {
      success: false,
      error: "Detaylı açıklama 20–5000 karakter arasında olmalıdır.",
    };
  }

  if (date && Number.isNaN(date.getTime())) {
    return {
      success: false,
      error: "Etkinlik tarihini geçerli bir biçimde seçin veya tarih kesinleşmediyse alanı boş bırakın.",
    };
  }

  if (location.length < 2 || location.length > 180) {
    return {
      success: false,
      error: "Konum 2–180 karakter arasında olmalıdır.",
    };
  }

  if (category.length < 2 || category.length > 80) {
    return {
      success: false,
      error: "Kategori 2–80 karakter arasında olmalıdır.",
    };
  }

  if (imageUrl.length > 500 || !validateOptionalUrl(imageUrl)) {
    return {
      success: false,
      error: "Görsel adresi http veya https ile başlayan geçerli bir URL olmalıdır.",
    };
  }

  if (imageAlt.length > 180) {
    return {
      success: false,
      error: "Görsel alt metni en fazla 180 karakter olabilir.",
    };
  }

  return {
    success: true,
    data: {
      title,
      description,
      longDescription,
      date,
      location,
      category,
      imageUrl: imageUrl || null,
      imageAlt: imageAlt || null,
    },
  };
}

export function validateTeamMemberForm(
  formData: FormData,
): ValidationResult<TeamMemberAdminInput> {
  const name = getFormString(formData, "name");
  const role = getFormString(formData, "role");
  const department = getFormString(formData, "department");
  const categoryValue = getFormString(formData, "categoryId");
  const newCategoryName = getFormString(formData, "newCategoryName");
  const orderValue = getFormString(formData, "order");
  const photoAlt = getFormString(formData, "photoAlt");
  const order = Number(orderValue);

  if (name.length < 2 || name.length > 100) {
    return {
      success: false,
      error: "Ad soyad 2–100 karakter arasında olmalıdır.",
    };
  }

  if (role.length < 2 || role.length > 100) {
    return {
      success: false,
      error: "Görev 2–100 karakter arasında olmalıdır.",
    };
  }

  if (department.length < 2 || department.length > 120) {
    return {
      success: false,
      error: "Bölüm bilgisi 2–120 karakter arasında olmalıdır.",
    };
  }

  if (photoAlt.length > 180) {
    return {
      success: false,
      error: "Fotoğraf alt metni en fazla 180 karakter olabilir.",
    };
  }

  if (!Number.isInteger(order) || order < 0 || order > 9999) {
    return {
      success: false,
      error: "Sıralama 0–9999 arasında tam sayı olmalıdır.",
    };
  }

  const categoryId =
    categoryValue === "new" ? null : Number(categoryValue);

  if (categoryValue === "new") {
    if (newCategoryName.length < 2 || newCategoryName.length > 80) {
      return {
        success: false,
        error: "Yeni kategori adı 2–80 karakter arasında olmalıdır.",
      };
    }
  } else if (
    categoryId === null ||
    !Number.isInteger(categoryId) ||
    categoryId <= 0
  ) {
    return {
      success: false,
      error: "Geçerli bir ekip kategorisi seçin.",
    };
  }

  return {
    success: true,
    data: {
      name,
      role,
      department,
      categoryId,
      newCategoryName:
        categoryValue === "new" ? newCategoryName : null,
      photoAlt: photoAlt || null,
      order,
    },
  };
}

export function validateSponsorForm(
  formData: FormData,
): ValidationResult<SponsorAdminInput> {
  const name = getFormString(formData, "name");
  const websiteUrl = getFormString(formData, "websiteUrl");
  const description = getFormString(formData, "description");
  const tierValue = getFormString(formData, "tierId");
  const newTierName = getFormString(formData, "newTierName");
  const logoAlt = getFormString(formData, "logoAlt");
  const order = Number(getFormString(formData, "order"));

  if (name.length < 2 || name.length > 120) {
    return {
      success: false,
      error: "Sponsor adı 2–120 karakter arasında olmalıdır.",
    };
  }

  if (websiteUrl.length > 500 || !validateOptionalUrl(websiteUrl)) {
    return {
      success: false,
      error: "Web sitesi http veya https ile başlayan geçerli bir adres olmalıdır.",
    };
  }

  if (description.length > 320) {
    return {
      success: false,
      error: "Kısa açıklama en fazla 320 karakter olabilir.",
    };
  }

  if (logoAlt.length < 3 || logoAlt.length > 180) {
    return {
      success: false,
      error: "Logo alt metni 3–180 karakter arasında olmalıdır.",
    };
  }

  if (!Number.isInteger(order) || order < 0 || order > 9999) {
    return {
      success: false,
      error: "Sıralama 0–9999 arasında tam sayı olmalıdır.",
    };
  }

  const tierId = tierValue === "new" ? null : Number(tierValue);

  if (tierValue === "new") {
    if (newTierName.length < 2 || newTierName.length > 80) {
      return {
        success: false,
        error: "Yeni tier adı 2–80 karakter arasında olmalıdır.",
      };
    }
  } else if (tierId === null || !Number.isInteger(tierId) || tierId <= 0) {
    return {
      success: false,
      error: "Geçerli bir sponsor tier'ı seçin.",
    };
  }

  return {
    success: true,
    data: {
      name,
      websiteUrl: websiteUrl || null,
      description: description || null,
      tierId,
      newTierName: tierValue === "new" ? newTierName : null,
      logoAlt,
      order,
    },
  };
}

export function validateSiteStatForm(
  formData: FormData,
): ValidationResult<SiteStatAdminInput> {
  const label = getFormString(formData, "label");
  const value = getFormString(formData, "value");
  const orderValue = getFormString(formData, "order");
  const order = Number(orderValue);

  if (label.length < 2 || label.length > 80) {
    return {
      success: false,
      error: "İstatistik etiketi 2–80 karakter arasında olmalıdır.",
    };
  }

  if (value.length < 1 || value.length > 30) {
    return {
      success: false,
      error: "İstatistik değeri 1–30 karakter arasında olmalıdır.",
    };
  }

  if (!Number.isInteger(order) || order < 0 || order > 9999) {
    return {
      success: false,
      error: "Sıralama 0–9999 arasında tam sayı olmalıdır.",
    };
  }

  return {
    success: true,
    data: {
      label,
      value,
      order,
    },
  };
}
