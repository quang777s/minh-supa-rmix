import { Link } from "@remix-run/react";
import { useState } from "react";
import { LanguageSwitcher } from "~/components/language-switcher";

type MenuProps = {
  locale?: string;
  t?: {
    landing?: {
      menu?: {
        open: string;
        close: string;
        templates?: string;
      };
      logo?: {
        alt: string;
      };
    };
  };
};

export default function Menu({ locale, t }: MenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSmoothScroll = (id: string) => {
    const header = document.querySelector("header");
    const el = document.getElementById(id);
    if (el && header) {
      const headerHeight = header.offsetHeight;
      const yOffset =
        el.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top: yOffset, behavior: "smooth" });
    }
  };

  return (
    <header className="bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 py-5 sticky top-0 z-50 transition-all duration-300 hover:border-purple-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <a href="/" className="flex items-center group space-x-3">
          <img
            src="/dm640.png"
            alt={(t?.landing?.logo?.alt || "Logo") + ""}
            className="h-14 w-auto transition-transform duration-500 group-hover:rotate-[360deg]"
          />
          <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
            Duy Minh
          </div>
        </a>

        <nav className="hidden md:flex space-x-8">
          <button
            className="text-gray-600 hover:text-indigo-600 font-medium rounded-lg px-3 py-2"
            onClick={() => {
              if (window.location.pathname !== "/") {
                window.location.href = "/#services";
              } else {
                handleSmoothScroll("services");
              }
            }}
          >
            {locale === "vi" ? "Dịch vụ" : "Services"}
          </button>
          <button
            className="text-gray-600 hover:text-indigo-600 font-medium rounded-lg px-3 py-2"
            onClick={() => {
              if (window.location.pathname !== "/") {
                window.location.href = "/#benefits";
              } else {
                handleSmoothScroll("benefits");
              }
            }}
          >
            {locale === "vi" ? "Tại sao chọn chúng tôi" : "Why Choose Us"}
          </button>
          <button
            className="text-gray-600 hover:text-indigo-600 font-medium rounded-lg px-3 py-2"
            onClick={() => {
              // If not on home page, navigate to home first
              if (window.location.pathname !== "/") {
                window.location.href = "/#contact";
              } else {
                handleSmoothScroll("contact");
              }
            }}
          >
            {locale === "vi" ? "Liên hệ" : "Contact"}
          </button>
          <Link
            to="/templates"
            className="text-gray-600 hover:text-indigo-600 font-medium rounded-lg px-3 py-2"
          >
            {locale === "vi" ? "Mẫu" : "Templates"}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher currentLocale={locale!} />
          <div className="md:hidden">
            <button
              className="text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-2"
              aria-label={t?.landing?.menu?.open || "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden bg-white shadow-lg border-b border-gray-100 fixed top-0 left-0 right-0 w-full z-50">
          <div className="relative flex flex-col px-4 py-4 space-y-2 pt-20">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-2"
              aria-label={t?.landing?.menu?.close || "Close menu"}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <button
              className="text-gray-700 hover:text-indigo-600 font-medium rounded-lg px-3 py-2 text-left"
              onClick={() => {
                setMobileMenuOpen(false);
                if (window.location.pathname !== "/") {
                  window.location.href = "/#services";
                } else {
                  handleSmoothScroll("services");
                }
              }}
            >
              {locale === "vi" ? "Dịch vụ" : "Services"}
            </button>
            <button
              className="text-gray-700 hover:text-indigo-600 font-medium rounded-lg px-3 py-2 text-left"
              onClick={() => {
                setMobileMenuOpen(false);
                if (window.location.pathname !== "/") {
                  window.location.href = "/#benefits";
                } else {
                  handleSmoothScroll("benefits");
                }
              }}
            >
              {locale === "vi" ? "Tại sao chọn chúng tôi" : "Why Choose Us"}
            </button>
            <button
              className="text-gray-700 hover:text-indigo-600 font-medium rounded-lg px-3 py-2 text-left"
              onClick={() => {
                setMobileMenuOpen(false);
                if (window.location.pathname !== "/") {
                  window.location.href = "/#contact";
                } else {
                  handleSmoothScroll("contact");
                }
              }}
            >
              {locale === "vi" ? "Liên hệ" : "Contact"}
            </button>
            <Link
              to="/templates"
              className="text-gray-700 hover:text-indigo-600 font-medium rounded-lg px-3 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {locale === "vi" ? "Mẫu" : "Templates"}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
