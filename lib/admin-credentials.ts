export const usernamePattern = /^[a-z0-9._-]{3,32}$/;

export function normalizeUsername(value: string) {
  return value.trim().toLocaleLowerCase("tr-TR");
}

export function validateUsername(value: string) {
  const username = normalizeUsername(value);

  if (!usernamePattern.test(username)) {
    return {
      success: false as const,
      error:
        "Kullanıcı adı 3–32 karakter olmalı; yalnızca küçük harf, rakam, nokta, tire ve alt çizgi içermelidir.",
    };
  }

  return {
    success: true as const,
    username,
  };
}

export function validateAdminPassword(value: string) {
  if (value.length < 12) {
    return "Şifre en az 12 karakter olmalıdır.";
  }

  if (!/[a-zçğıöşü]/i.test(value) || !/\d/.test(value)) {
    return "Şifre en az bir harf ve bir rakam içermelidir.";
  }

  return null;
}
