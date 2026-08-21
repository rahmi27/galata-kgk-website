import {Inter, Space_Grotesk} from "next/font/google";

import {BrandMountainBackdrop} from "@/components/effects/brand-mountain-motif";
import {SiteTelemetry} from "@/components/site-telemetry";
import {ThemeProvider} from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading",
  display: "optional",
  preload: true,
});

export const rootDocumentBodyClassName =
  `${inter.variable} ${spaceGrotesk.variable} font-body antialiased`;

export function RootDocument({
  children,
  locale,
}: Readonly<{
  children: React.ReactNode;
  locale: string;
}>) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={rootDocumentBodyClassName}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <BrandMountainBackdrop />
          {children}
        </ThemeProvider>
        <SiteTelemetry />
      </body>
    </html>
  );
}
