import "server-only";

import nodemailer from "nodemailer";

import type {
  ContactSubmissionInput,
  MembershipApplicationInput,
} from "@/lib/form-validation";
import {
  createContactNotification,
  createMembershipNotification,
} from "@/lib/mail-content";
import { getSafeEmailAddress } from "@/lib/url-security";

const DEFAULT_SMTP_HOST = "smtp.zeptomail.eu";
const DEFAULT_SMTP_PORT = 465;
const DEFAULT_MAILBOX = "info@galatakariyervegirisimcilik.com";

type MailConfiguration = {
  host: string;
  port: number;
  secure: boolean;
  authUser: string;
  password: string;
  fromAddress: string;
  fromName: string;
  notificationTo: string;
};

function readMailConfiguration(): MailConfiguration | null {
  const host = process.env.SMTP_HOST?.trim() || DEFAULT_SMTP_HOST;
  const port = Number.parseInt(process.env.SMTP_PORT?.trim() || String(DEFAULT_SMTP_PORT), 10);
  const secure = (process.env.SMTP_SECURE?.trim().toLowerCase() || "true") !== "false";
  const authUser = process.env.SMTP_USER?.trim() || DEFAULT_MAILBOX;
  const password = process.env.SMTP_PASSWORD;
  const fromAddress = getSafeEmailAddress(
    process.env.MAIL_FROM_ADDRESS?.trim() || DEFAULT_MAILBOX,
  );
  const notificationTo = getSafeEmailAddress(
    process.env.MAIL_NOTIFICATION_TO?.trim() || DEFAULT_MAILBOX,
  );

  if (!host || !Number.isInteger(port) || port < 1 || port > 65535 || !authUser || !password || !fromAddress || !notificationTo) {
    return null;
  }

  return {
    host,
    port,
    secure,
    authUser,
    password,
    fromAddress,
    fromName: process.env.MAIL_FROM_NAME?.trim() || "Galata KGK Web Sitesi",
    notificationTo,
  };
}

async function sendNotification(
  replyTo: { address: string; name: string },
  message: { subject: string; text: string; html: string },
) {
  const configuration = readMailConfiguration();

  if (!configuration) {
    console.warn("E-posta bildirimi gönderilmedi: SMTP ortam değişkenleri tamamlanmamış.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: configuration.host,
    port: configuration.port,
    secure: configuration.secure,
    auth: {
      user: configuration.authUser,
      pass: configuration.password,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    tls: {
      minVersion: "TLSv1.2",
      servername: configuration.host,
    },
  });

  try {
    await transporter.sendMail({
      from: {
        name: configuration.fromName,
        address: configuration.fromAddress,
      },
      to: configuration.notificationTo,
      replyTo,
      ...message,
      disableFileAccess: true,
      disableUrlAccess: true,
    });
    return true;
  } catch (error) {
    console.error(
      "E-posta bildirimi gönderilemedi; form kaydı admin panelinde korunuyor.",
      error instanceof Error ? error.message : "Bilinmeyen SMTP hatası",
    );
    return false;
  } finally {
    transporter.close();
  }
}

export function sendContactNotification(
  submission: ContactSubmissionInput,
  submissionId: number,
) {
  return sendNotification(
    { address: submission.email, name: submission.name },
    createContactNotification(submission, submissionId),
  );
}

export function sendMembershipNotification(
  application: MembershipApplicationInput,
  applicationId: number,
) {
  return sendNotification(
    { address: application.email, name: application.fullName },
    createMembershipNotification(application, applicationId),
  );
}
