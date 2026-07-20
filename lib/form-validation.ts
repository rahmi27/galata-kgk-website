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

export type ContactSubmissionInput = {
  name: string;
  email: string;
  message: string;
};

export type MembershipApplicationInput = {
  fullName: string;
  email: string;
  studentNumber: string | null;
  department: string;
  phone: string | null;
  motivation: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+()\s-]+$/;

function getString(
  payload: Record<string, unknown>,
  key: string,
) {
  const value = payload[key];
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateEmail(email: string): string | null {
  if (!email) {
    return "E-posta alanı zorunludur.";
  }

  if (email.length > 254 || !emailPattern.test(email)) {
    return "Lütfen geçerli bir e-posta adresi girin.";
  }

  return null;
}

export function validateContactSubmission(
  payload: unknown,
): ValidationResult<ContactSubmissionInput> {
  if (!isRecord(payload)) {
    return {
      success: false,
      error: "Form verileri geçerli bir biçimde gönderilmedi.",
    };
  }

  const name = getString(payload, "name");
  const email = getString(payload, "email").toLocaleLowerCase("tr-TR");
  const message = getString(payload, "message");

  if (name.length < 2) {
    return {
      success: false,
      error: "Ad soyad alanı en az 2 karakter olmalıdır.",
    };
  }

  if (name.length > 100) {
    return {
      success: false,
      error: "Ad soyad alanı en fazla 100 karakter olabilir.",
    };
  }

  const emailError = validateEmail(email);

  if (emailError) {
    return {
      success: false,
      error: emailError,
    };
  }

  if (message.length < 10) {
    return {
      success: false,
      error: "Mesaj alanı en az 10 karakter olmalıdır.",
    };
  }

  if (message.length > 2000) {
    return {
      success: false,
      error: "Mesaj alanı en fazla 2000 karakter olabilir.",
    };
  }

  return {
    success: true,
    data: {
      name,
      email,
      message,
    },
  };
}

export function validateMembershipApplication(
  payload: unknown,
): ValidationResult<MembershipApplicationInput> {
  if (!isRecord(payload)) {
    return {
      success: false,
      error: "Form verileri geçerli bir biçimde gönderilmedi.",
    };
  }

  const fullName = getString(payload, "fullName");
  const email = getString(payload, "email").toLocaleLowerCase("tr-TR");
  const studentNumber = getString(payload, "studentNumber");
  const department = getString(payload, "department");
  const phone = getString(payload, "phone");
  const motivation = getString(payload, "motivation");

  if (fullName.length < 2) {
    return {
      success: false,
      error: "Ad soyad alanı en az 2 karakter olmalıdır.",
    };
  }

  if (fullName.length > 100) {
    return {
      success: false,
      error: "Ad soyad alanı en fazla 100 karakter olabilir.",
    };
  }

  const emailError = validateEmail(email);

  if (emailError) {
    return {
      success: false,
      error: emailError,
    };
  }

  if (studentNumber.length > 30) {
    return {
      success: false,
      error: "Öğrenci numarası en fazla 30 karakter olabilir.",
    };
  }

  if (department.length < 2) {
    return {
      success: false,
      error: "Bölüm alanı en az 2 karakter olmalıdır.",
    };
  }

  if (department.length > 150) {
    return {
      success: false,
      error: "Bölüm alanı en fazla 150 karakter olabilir.",
    };
  }

  if (
    phone &&
    (phone.length < 7 ||
      phone.length > 30 ||
      !phonePattern.test(phone))
  ) {
    return {
      success: false,
      error: "Lütfen geçerli bir telefon numarası girin.",
    };
  }

  if (motivation.length < 10) {
    return {
      success: false,
      error: "Katılım motivasyonu en az 10 karakter olmalıdır.",
    };
  }

  if (motivation.length > 1000) {
    return {
      success: false,
      error: "Katılım motivasyonu en fazla 1000 karakter olabilir.",
    };
  }

  return {
    success: true,
    data: {
      fullName,
      email,
      studentNumber: studentNumber || null,
      department,
      phone: phone || null,
      motivation,
    },
  };
}
