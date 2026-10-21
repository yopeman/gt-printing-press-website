import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LocaleNotFound() {
  const t = useTranslations("common");

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4 p-8 rounded-2xl bg-surface border border-border shadow-sm">
        <div className="text-4xl font-black text-primary">404</div>
        <h1 className="text-xl font-bold">Page Not Found</h1>
        <p className="text-sm text-foreground-muted">
          The requested page could not be found.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            {t("learnMore")}
          </Link>
        </div>
      </div>
    </div>
  );
}
