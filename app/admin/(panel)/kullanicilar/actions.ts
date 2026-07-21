"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import {
  validateAdminPassword,
  validateUsername,
} from "@/lib/admin-credentials";
import { prisma } from "@/lib/prisma";

export async function createAdminUserAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  const rawUsername = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const usernameValidation = validateUsername(rawUsername);

  if (!usernameValidation.success) {
    return {
      success: false,
      message: usernameValidation.error,
    };
  }

  const passwordError = validateAdminPassword(password);

  if (passwordError) {
    return {
      success: false,
      message: passwordError,
    };
  }

  const existingUser = await prisma.adminUser.findUnique({
    where: {
      username: usernameValidation.username,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    return {
      success: false,
      message: "Bu kullanıcı adı zaten kullanılıyor.",
    };
  }

  try {
    const passwordHash = await hash(password, 12);

    await prisma.adminUser.create({
      data: {
        username: usernameValidation.username,
        name: usernameValidation.username,
        passwordHash,
      },
    });

    revalidatePath("/admin/kullanicilar");

    return {
      success: true,
      message: "Yeni admin kullanıcı oluşturuldu.",
    };
  } catch (error) {
    console.error("Admin kullanıcı oluşturulamadı.", error);

    return {
      success: false,
      message: "Kullanıcı oluşturulamadı. Lütfen tekrar deneyin.",
    };
  }
}

export async function deleteAdminUserAction(
  userId: number,
): Promise<AdminActionState> {
  const currentUser = await requireAdmin();

  try {
    const result = await prisma.$transaction(async (transaction) => {
      const targetUser = await transaction.adminUser.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          username: true,
        },
      });

      if (!targetUser) {
        return {
          success: false,
          message: "Silmek istediğiniz kullanıcı bulunamadı.",
        };
      }

      if (targetUser.username === currentUser.username) {
        return {
          success: false,
          message: "Giriş yaptığınız kendi hesabınızı silemezsiniz.",
        };
      }

      const adminCount = await transaction.adminUser.count();

      if (adminCount <= 1) {
        return {
          success: false,
          message: "Sistemde en az bir admin kullanıcı kalmalıdır.",
        };
      }

      await transaction.adminUser.delete({
        where: {
          id: targetUser.id,
        },
      });

      return {
        success: true,
        message: "Admin kullanıcı silindi.",
      };
    });

    if (result.success) {
      revalidatePath("/admin/kullanicilar");
    }

    return result;
  } catch (error) {
    console.error("Admin kullanıcı silinemedi.", error);

    return {
      success: false,
      message: "Kullanıcı silinemedi. Lütfen tekrar deneyin.",
    };
  }
}
