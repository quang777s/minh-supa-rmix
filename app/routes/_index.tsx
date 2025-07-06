import type {
  MetaFunction,
  LinksFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useState } from "react";
import { getLocale, setLocale } from "~/i18n/i18n.server";
import enTranslations from "~/i18n/locales/en.json";
import viTranslations from "~/i18n/locales/vi.json";
import { LanguageSwitcher } from "~/components/language-switcher";

const translations = {
  en: enTranslations,
  vi: viTranslations,
};

export const meta: MetaFunction = () => {
  return [
    { title: "Your Vision, Our Code: Custom Web Solutions" },
    {
      name: "description",
      content:
        "Empowering businesses, groups, and individuals with stunning, functional, and custom-tailored websites.",
    },
  ];
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
    },
  ];
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

export default function Index() {
  const { locale, t }: { locale?: string; t?: any } = useLoaderData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const btnPrimaryClasses =
    "inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-opacity duration-300";
  const btnSecondaryClasses =
    "inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-300";

  return (
    <div
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="antialiased bg-slate-50 text-slate-700"
    >
      <header className="bg-white shadow-sm py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <a href="/" className="flex items-center rounded-lg">
            <img
              src="/blue-logo640.png"
              alt={(t?.landing?.logo?.alt || "Logo") + ""}
              className="h-10 w-auto mr-2"
            />
            <div className="text-2xl lg:text-2xl font-bold text-indigo-950">
              Duy Minh
            </div>
          </a>
          <nav className="hidden md:flex space-x-8">
            <a
              href="#services"
              className="text-gray-600 hover:text-indigo-600 font-medium rounded-lg px-3 py-2"
            >
              {locale === "vi" ? "Dịch vụ" : "Services"}
            </a>
            <a
              href="#benefits"
              className="text-gray-600 hover:text-indigo-600 font-medium rounded-lg px-3 py-2"
            >
              {locale === "vi" ? "Tại sao chọn chúng tôi" : "Why Choose Us"}
            </a>
            <a
              href="#contact"
              className="text-gray-600 hover:text-indigo-600 font-medium rounded-lg px-3 py-2"
            >
              {locale === "vi" ? "Liên hệ" : "Contact"}
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher currentLocale={locale} />
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
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
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
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <a
              href="#services"
              className="text-gray-700 hover:text-indigo-600 font-medium rounded-lg px-3 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {locale === "vi" ? "Dịch vụ" : "Services"}
            </a>
            <a
              href="#benefits"
              className="text-gray-700 hover:text-indigo-600 font-medium rounded-lg px-3 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {locale === "vi" ? "Tại sao chọn chúng tôi" : "Why Choose Us"}
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-indigo-600 font-medium rounded-lg px-3 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {locale === "vi" ? "Liên hệ" : "Contact"}
            </a>
          </div>
        </nav>
      )}

      <main>
        <section className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-20 sm:py-32 lg:py-40 text-center rounded-b-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              {locale === "vi"
                ? "Kiến Tạo Từ Ý Tưởng."
                : "Your Vision, Our Code."}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto opacity-90">
              {locale === "vi"
                ? "Website độc đáo, tính năng hoàn hảo – Nâng tầm giá trị cho bạn."
                : "Empowering businesses, groups, and individuals with stunning, functional, and custom-tailored websites."}
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a href="#contact" className={btnPrimaryClasses}>
                <svg
                  className="inline-block w-6 h-6 align-middle mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
                {locale === "vi" ? "Nhận báo giá miễn phí" : "Get a Free Quote"}
              </a>
              <a href="#services" className={btnSecondaryClasses}>
                <svg
                  className="inline-block w-6 h-6 align-middle mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m7 0V5a2 2 0 012-2h2a2 2 0 012 2v4m-4 0a2 2 0 002 2H9m7 0a2 2 0 01-2-2V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4"
                  ></path>
                </svg>
                {locale === "vi" ? "Khám phá dịch vụ" : "Explore Services"}
              </a>
            </div>
          </div>
        </section>

        <section id="services" className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
              {locale === "vi"
                ? "Dịch vụ web của chúng tôi"
                : "Our Comprehensive Web Services"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-gray-50 p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="mx-auto text-indigo-600 mb-6 w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.75 17L9 20l-1 1h8l-1-1l-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {locale === "vi" ? "Tạo trang web" : "Website Creation"}
                </h3>
                <p className="text-gray-600">
                  {locale === "vi"
                    ? "Từ khái niệm đầu tiên đến khi triển khai, chúng tôi xây dựng các trang web phản hồi, hoạt động và đáp ứng được nhu cầu đặc biệt của bạn. Chúng tôi tập trung vào thiết kế hiện đại, chức năng bền vững và trải nghiệm người dùng đặc biệt."
                    : "From initial concept to launch, we build responsive, high-performing websites tailored to your unique needs. We focus on modern design, robust functionality, and exceptional user experience."}
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="mx-auto text-purple-600 mb-6 w-16 h-16 flex items-center justify-center rounded-full bg-purple-100">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {locale === "vi"
                    ? "Bảo trì trang web"
                    : "Website Maintenance"}
                </h3>
                <p className="text-gray-600">
                  {locale === "vi"
                    ? "Giữ cho trang web của bạn an toàn, nhanh chóng và cập nhật đầy đủ với các gói bảo trì đầy đủ."
                    : "Keep your site secure, fast, and up-to-date with our comprehensive maintenance packages. We handle updates, backups, security checks, and performance optimizations."}
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="mx-auto text-blue-600 mb-6 w-16 h-16 flex items-center justify-center rounded-full bg-blue-100">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {locale === "vi"
                    ? "Tùy chỉnh trang web"
                    : "Website Customization"}
                </h3>
                <p className="text-gray-600">
                  {locale === "vi"
                    ? "Nâng cấp trang web hiện có của bạn với các tính năng mới, tích hợp và cập nhật thiết kế."
                    : "Enhance your existing website with new features, integrations, and design updates. We help your site evolve with your business needs and industry trends."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="py-16 sm:py-24 bg-slate-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
              {locale === "vi" ? "Tại sao chọn chúng tôi?" : "Why Choose Us?"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
              <div className="flex items-start bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex-shrink-0 text-indigo-600 mr-4 mt-1">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {locale === "vi"
                      ? "Giải pháp được thiết kế riêng"
                      : "Tailored Solutions"}
                  </h3>
                  <p className="text-gray-600">
                    {locale === "vi"
                      ? "Chúng tôi không tin vào một kích thước phù hợp cho tất cả. Mỗi trang web chúng tôi xây dựng hoặc bảo trì đều được thiết kế độc đáo để đáp ứng các mục tiêu và nhận dạng thương hiệu của bạn."
                      : "We don't believe in one-size-fits-all. Every website we build or maintain is uniquely crafted to meet your specific goals and brand identity."}
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex-shrink-0 text-indigo-600 mr-4 mt-1">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.007 12.007 0 002.944 12c.045 1.135.178 2.261.393 3.364l-.248 1.488a.75.75 0 00.912.912l1.488-.248c1.103.215 2.229.348 3.364.393a12.007 12.007 0 009.096-2.944 11.955 11.955 0 013.04-8.618z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {locale === "vi" ? "Đội ngũ chuyên nghiệp" : "Expert Team"}
                  </h3>
                  <p className="text-gray-600">
                    {locale === "vi"
                      ? "Đội ngũ của chúng tôi bao gồm các nhà phát triển, thiết kế và nhà phát triển chiến lược điện tử được đào tạo để cung cấp kết quả chất lượng cao."
                      : "Our team comprises experienced developers, designers, and digital strategists dedicated to delivering high-quality results."}
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex-shrink-0 text-indigo-600 mr-4 mt-1">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {locale === "vi"
                      ? "Hỗ trợ đáng tin cậy"
                      : "Reliable Support"}
                  </h3>
                  <p className="text-gray-600">
                    {locale === "vi"
                      ? "Chúng tôi cung cấp hỗ trợ liên tục và bảo trì để đảm bảo trang web của bạn luôn chạy trơn tru, giảm thời gian ngừng hoạt động."
                      : "We provide ongoing support and proactive maintenance to ensure your website always runs smoothly, minimizing downtime."}
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex-shrink-0 text-indigo-600 mr-4 mt-1">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c1.333-1.333 2.667-1.333 4 0s2.667 3.333 0 4l-4 4-4-4c-2.667-1.333-1.333-4 0-4s2.667-1.333 4 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {locale === "vi"
                      ? "Giải pháp có hiệu quả chi phí"
                      : "Cost-Effective Solutions"}
                  </h3>
                  <p className="text-gray-600">
                    {locale === "vi"
                      ? "Nhận các dịch vụ web chuyên nghiệp mà không phải bất kỳ chi phí nào."
                      : "Get professional web services without breaking the bank. We offer transparent pricing and scalable solutions for every budget."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              {locale === "vi"
                ? "Sẵn sàng chuyển đổi vẻ ngoài trực tuyến của bạn?"
                : "Ready to Transform Your Online Presence?"}
            </h2>
            <p className="text-lg sm:text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              {locale === "vi"
                ? "Hãy thảo luận về dự án của bạn và đưa ý tưởng của bạn thành hiện thực. Chúng tôi rất hào hứng để giúp bạn thành công trực tuyến."
                : "Let's discuss your project and bring your ideas to life. We're excited to help you succeed online."}
            </p>
            <a
              href="#contact"
              className={`${btnSecondaryClasses} !bg-white !text-indigo-600 hover:!bg-indigo-50 !border-indigo-600`}
            >
              <svg
                className="inline-block w-6 h-6 align-middle mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.9 5.3M21 8l-7.9 5.3M3 8a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                ></path>
              </svg>
              {locale === "vi" ? "Nhận liên hệ" : "Get in Touch"}
            </a>
          </div>
        </section>

        <section id="contact" className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
              {locale === "vi" ? "Liên hệ chúng tôi" : "Contact Us"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {locale === "vi"
                      ? "Liên hệ với chúng tôi:"
                      : "Connect with us:"}
                  </h3>
                  <p className="text-gray-600 flex items-center">
                    <svg
                      className="inline-block w-5 h-5 align-middle mr-2 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.9 5.3M21 8l-7.9 5.3M3 8a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                      ></path>
                    </svg>
                    <a
                      href="mailto:info@websolutions.com"
                      className="hover:underline"
                    >
                      info@websolutions.com
                    </a>
                  </p>
                  <p className="text-gray-600 flex items-center mt-2">
                    <svg
                      className="inline-block w-5 h-5 align-middle mr-2 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
                      ></path>
                    </svg>
                    +1 (555) 123-4567
                  </p>
                  <p className="text-gray-600 flex items-center mt-2">
                    <svg
                      className="inline-block w-5 h-5 align-middle mr-2 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                    {locale === "vi"
                      ? "123 Đường Web, Tầng 400, Thành phốville, ST 12345"
                      : "123 Web Street, Suite 400, Cityville, ST 12345"}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {locale === "vi"
                    ? "Gửi cho chúng tôi một tin nhắn:"
                    : "Send us a message:"}
                </h3>
                <Form method="post" className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {locale === "vi" ? "Tên" : "Name"}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder={
                        locale === "vi" ? "Tên của bạn" : "Your Name"
                      }
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {locale === "vi" ? "Email" : "Email"}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder={
                        locale === "vi"
                          ? "your@example.com"
                          : "your@example.com"
                      }
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {locale === "vi" ? "Tin nhắn" : "Message"}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder={
                        locale === "vi"
                          ? "Nói về dự án của bạn..."
                          : "Tell us about your project..."
                      }
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className={`${btnPrimaryClasses} w-full`}
                  >
                    {locale === "vi" ? "Gửi tin nhắn" : "Send Message"}
                  </button>
                </Form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12 rounded-t-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>&copy; 2025 Duy Minh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
