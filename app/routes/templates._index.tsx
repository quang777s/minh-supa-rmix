import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Card } from "~/components/ui/card";
import { Link, useLoaderData } from "@remix-run/react";
import Menu from "~/components/Menu";
import { getLocale, setLocale } from "~/i18n/i18n.server";
import enTranslations from "~/i18n/locales/en.json";
import viTranslations from "~/i18n/locales/vi.json";

const translations = {
  en: enTranslations,
  vi: viTranslations,
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const locale = await getLocale(request);
  return json({ locale, t: translations[locale] });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const newLocale = formData.get("locale") as string;
  if (newLocale && ["en", "vi"].includes(newLocale)) {
    return redirect(request.url, {
      headers: {
        "Set-Cookie": await setLocale(request, newLocale as "vi" | "en"),
      },
    });
  }
  return null;
};

export default function TemplatesPage() {
  const { locale, t }: { locale?: string; t?: any } = useLoaderData();
  const templates = [
    {
      id: 1,
      name: "E-commerce Template",
      image: "/electronic/img/product-2.jpg",
      description: "Modern online store template with product showcase",
      link: "/electronic/index.html",
    },
    {
      id: 2,
      name: "Furniture Store",
      image: "/furn/assets/images/features/f3.jpg",
      description: "Elegant furniture catalog layout",
      link: "/furn/index.html",
    },
    {
      id: 3,
      name: "Business Portfolio",
      image: "/majes/assets/img/gallery/vanity-bag.png",
      description: "Professional business presentation template",
      link: "/majes/index.html",
    },
    {
      id: 4,
      name: "Shop",
      image: "/shop/images/product-2.jpg",
      description: "Go-To-Market Strategy Slides",
      link: "/shop/index.html",
    },
  ];

  return (
    <div
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="antialiased bg-gray-900 text-gray-100 min-h-screen"
    >
      <Menu locale={locale} t={t?.landing || {}} />
      <main>
        <div className="container mx-auto p-4 mb-28 mt-14">
          <h1 className="text-3xl font-bold mb-8">
            {t?.templates?.choose_template || "Choose Your Template"}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="p-4 hover:shadow-lg transition-shadow"
              >
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
                <h3 className="text-xl font-semibold mb-2">
                  {t?.templates?.[template.name] || template.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t?.templates?.[template.description] || template.description}
                </p>
                <Link
                  to={template.link}
                  target="_blank"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {t?.templates?.preview_template || "Preview Template"}
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 rounded-t-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>&copy; 2025 Duy Minh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
