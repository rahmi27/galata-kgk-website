import "server-only";

import { isSafeHttpUrl } from "@/lib/url-security";

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
  logoAlt: string | null;
  order: number;
};

export type PartnerClubAdminInput = {
  name: string;
  shortDescription: string;
  logoAlt: string;
  order: number;
};

export type CollaborationItemAdminInput = {
  title: string;
  description: string;
  date: Date | null;
  order: number;
};

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validateOptionalUrl(value: string) {
  return !value || isSafeHttpUrl(value);
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

  if (logoAlt && (logoAlt.length < 3 || logoAlt.length > 180)) {
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
      logoAlt: logoAlt || null,
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

export function validatePartnerClubForm(
  formData: FormData,
): ValidationResult<PartnerClubAdminInput> {
  const name = getFormString(formData, "name");
  const shortDescription = getFormString(formData, "shortDescription");
  const logoAlt = getFormString(formData, "logoAlt");
  const order = Number(getFormString(formData, "order"));

  if (name.length < 2 || name.length > 120) {
    return {
      success: false,
      error: "Partner kulüp adı 2–120 karakter arasında olmalıdır.",
    };
  }

  if (shortDescription.length < 10 || shortDescription.length > 500) {
    return {
      success: false,
      error: "Kısa açıklama 10–500 karakter arasında olmalıdır.",
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

  return {
    success: true,
    data: { name, shortDescription, logoAlt, order },
  };
}

export function validateCollaborationItemForm(
  formData: FormData,
): ValidationResult<CollaborationItemAdminInput> {
  const title = getFormString(formData, "title");
  const description = getFormString(formData, "description");
  const dateValue = getFormString(formData, "date");
  const order = Number(getFormString(formData, "order"));
  const date = dateValue ? new Date(`${dateValue}T12:00:00.000Z`) : null;

  if (title.length < 3 || title.length > 140) {
    return {
      success: false,
      error: "İş birliği başlığı 3–140 karakter arasında olmalıdır.",
    };
  }

  if (description.length < 10 || description.length > 2000) {
    return {
      success: false,
      error: "Açıklama 10–2000 karakter arasında olmalıdır.",
    };
  }

  if (date && Number.isNaN(date.getTime())) {
    return {
      success: false,
      error: "Geçerli bir tarih seçin veya alanı boş bırakın.",
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
    data: { title, description, date, order },
  };
}
