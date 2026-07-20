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
  date: Date;
  location: string;
  imageUrl: string | null;
  category: string;
};

export type TeamMemberAdminInput = {
  name: string;
  role: string;
  categoryId: number | null;
  newCategoryName: string | null;
  order: number;
};

export type SiteStatAdminInput = {
  label: string;
  value: string;
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
  const date = new Date(dateValue);

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

  if (!dateValue || Number.isNaN(date.getTime())) {
    return {
      success: false,
      error: "Geçerli bir etkinlik tarihi seçin.",
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
    },
  };
}

export function validateTeamMemberForm(
  formData: FormData,
): ValidationResult<TeamMemberAdminInput> {
  const name = getFormString(formData, "name");
  const role = getFormString(formData, "role");
  const categoryValue = getFormString(formData, "categoryId");
  const newCategoryName = getFormString(formData, "newCategoryName");
  const orderValue = getFormString(formData, "order");
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
      categoryId,
      newCategoryName:
        categoryValue === "new" ? newCategoryName : null,
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
