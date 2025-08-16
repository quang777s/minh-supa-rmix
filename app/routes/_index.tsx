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
import Menu from "~/components/Menu";
import { createSupabaseServerClient } from "~/lib/supabase/supabase.server";

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
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;
  const locale = formData.get("locale") as string;

  try {
    if (locale) {
      return redirect(request.url, {
        headers: {
          "Set-Cookie": await setLocale(request, locale as "vi" | "en"),
        },
      });
    }

    if (!!message && !!name && !!email) {
      const supabase = createSupabaseServerClient(request);

      // Insert contact
      const { error } = await supabase.client
        .from("contacts")
        .insert([{ name, email, message }]);

      if (error) {
        console.error("Error inserting contact:", error);
        return json({ error: "Failed to submit contact" }, { status: 500 });
      }
    }

    return redirect(request.url);
  } catch (error) {
    console.error("Error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};

export default function Index() {
  const { locale, t }: { locale?: string; t?: any } = useLoaderData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const btnPrimaryClasses =
    "inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-opacity duration-300";
  const btnSecondaryClasses =
    "inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-300";

  return (
    <div
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="antialiased bg-gray-900 text-gray-100 min-h-screen"
    >
      <Menu locale={locale} t={t?.landing} />

      <main>
        <section className="relative py-32 sm:py-40 lg:py-48 text-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/public/starfield.jpg')] bg-cover bg-center opacity-30 animate-pulse-slow" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-8 leading-tight bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                {locale === "vi"
                  ? "Kiến Tạo Tương Lai Số"
                  : "Crafting Digital Futures"}
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl mb-12 text-gray-300">
                {locale === "vi"
                  ? "Biến ý tưởng thành trải nghiệm số ấn tượng"
                  : "Transforming ideas into exceptional digital experiences"}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-blue-500/30"
                  onClick={(e) => {
                    e.preventDefault();
                    requestAnimationFrame(() => {
                      const header = document.querySelector("header");
                      const el = document.getElementById("contact");
                      if (el && header) {
                        const headerHeight = header.offsetHeight;
                        const yOffset =
                          el.getBoundingClientRect().top +
                          window.pageYOffset -
                          headerHeight;
                        window.scrollTo({ top: yOffset, behavior: "smooth" });
                      }
                    });
                  }}
                >
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  {locale === "vi" ? "Bắt Đầu Dự Án" : "Start Your Project"}
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-100 border-2 border-gray-600 rounded-xl hover:border-blue-400 hover:text-blue-400 transition-colors duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    requestAnimationFrame(() => {
                      const header = document.querySelector("header");
                      const el = document.getElementById("services");
                      if (el && header) {
                        const headerHeight = header.offsetHeight;
                        const yOffset =
                          el.getBoundingClientRect().top +
                          window.pageYOffset -
                          headerHeight;
                        window.scrollTo({ top: yOffset, behavior: "smooth" });
                      }
                    });
                  }}
                >
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m7 0V5a2 2 0 012-2h2a2 2 0 012 2v4m-4 0a2 2 0 002 2H9m7 0a2 2 0 01-2-2V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4"
                    />
                  </svg>
                  {locale === "vi" ? "Xem Dịch Vụ" : "View Services"}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="py-16 sm:py-24 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              {locale === "vi" ? "Dịch Vụ Của Chúng Tôi" : "Our Services"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative bg-gray-700/20 p-8 rounded-3xl border-2 border-gray-600 hover:border-purple-400 transition-all duration-500 hover:-translate-y-3">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                <div className="relative space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:rotate-12 transition-transform duration-500">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    {locale === "vi" ? "Thiết Kế Web" : "Web Design"}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {locale === "vi"
                      ? "Giải pháp thiết kế web đáp ứng mọi màn hình, tối ưu tốc độ và trải nghiệm người dùng"
                      : "Responsive web solutions optimized for speed and seamless user experiences"}
                  </p>
                </div>
              </div>

              <div className="group relative bg-gray-700/30 p-8 rounded-2xl backdrop-blur-lg border border-gray-600 hover:border-purple-400 transition-all duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative">
                  <div className="w-20 h-20 bg-gray-800 rounded-xl flex items-center justify-center mb-6 mx-auto">
                    <svg
                      className="w-10 h-10 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-100 mb-4">
                    {locale === "vi"
                      ? "Phát Triển Ứng Dụng"
                      : "App Development"}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {locale === "vi"
                      ? "Xây dựng ứng dụng di động và web app hiệu năng cao"
                      : "High-performance mobile apps and web applications"}
                  </p>
                </div>
              </div>

              <div className="group relative bg-gray-700/30 p-8 rounded-2xl backdrop-blur-lg border border-gray-600 hover:border-blue-400 transition-all duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative">
                  <div className="w-20 h-20 bg-gray-800 rounded-xl flex items-center justify-center mb-6 mx-auto">
                    <svg
                      className="w-10 h-10 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-100 mb-4">
                    {locale === "vi" ? "Tối Ưu SEO" : "SEO Optimization"}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {locale === "vi"
                      ? "Tối ưu hóa công cụ tìm kiếm để tăng lượng truy cập tự nhiên"
                      : "Search engine optimization to boost organic traffic"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="py-16 sm:py-24 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
              {locale === "vi" ? "Lợi Ích" : "Why Choose Us"}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0 w-full md:w-1/3">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-1 rounded-2xl">
                    <div className="bg-gray-800 p-6 rounded-xl h-full">
                      <svg
                        className="w-12 h-12 text-blue-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <h3 className="text-2xl font-bold text-gray-100 mb-2">
                        {locale === "vi" ? "Hiệu Suất Cao" : "High Performance"}
                      </h3>
                      <p className="text-gray-400">
                        {locale === "vi"
                          ? "Ứng dụng tải nhanh, mượt mà trên mọi thiết bị"
                          : "Lightning-fast loading and smooth operation across all devices"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-gray-100 mb-4">
                    {locale === "vi"
                      ? "Công Nghệ Tiên Tiến"
                      : "Cutting-edge Technology"}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {locale === "vi"
                      ? "Sử dụng các framework và công cụ mới nhất để đảm bảo hiệu suất và bảo mật tối ưu"
                      : "Utilizing the latest frameworks and tools to ensure optimal performance and security"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0 w-full md:w-1/3">
                  <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-1 rounded-2xl">
                    <div className="bg-gray-800 p-6 rounded-xl h-full">
                      <svg
                        className="w-12 h-12 text-purple-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <h3 className="text-2xl font-bold text-gray-100 mb-2">
                        {locale === "vi"
                          ? "Bảo Mật Mạnh Mẽ"
                          : "Robust Security"}
                      </h3>
                      <p className="text-gray-400">
                        {locale === "vi"
                          ? "Bảo vệ dữ liệu với mã hóa tiên tiến"
                          : "Advanced encryption and security protocols"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-gray-100 mb-4">
                    {locale === "vi"
                      ? "An Toàn Tuyệt Đối"
                      : "Complete Protection"}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {locale === "vi"
                      ? "Hệ thống bảo mật đa lớp và cập nhật thường xuyên"
                      : "Multi-layered security systems with regular updates"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0 w-full md:w-1/3">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-1 rounded-2xl">
                    <div className="bg-gray-800 p-6 rounded-xl h-full">
                      <svg
                        className="w-12 h-12 text-blue-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <h3 className="text-2xl font-bold text-gray-100 mb-2">
                        {locale === "vi" ? "Hỗ Trợ 24/7" : "24/7 Support"}
                      </h3>
                      <p className="text-gray-400">
                        {locale === "vi"
                          ? "Đội ngũ hỗ trợ luôn sẵn sàng"
                          : "Round-the-clock technical support"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-gray-100 mb-4">
                    {locale === "vi" ? "Luôn Đồng Hành" : "Always Available"}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {locale === "vi"
                      ? "Hỗ trợ kỹ thuật và tư vấn chuyên sâu mọi lúc"
                      : "Technical support and expert consultation whenever you need"}
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
              onClick={(e) => {
                e.preventDefault();
                requestAnimationFrame(() => {
                  const header = document.querySelector("header");
                  const el = document.getElementById("contact");
                  if (el && header) {
                    const headerHeight = header.offsetHeight;
                    const yOffset =
                      el.getBoundingClientRect().top +
                      window.pageYOffset -
                      headerHeight;
                    window.scrollTo({ top: yOffset, behavior: "smooth" });
                  }
                });
              }}
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

        <section
          id="contact"
          className="py-16 sm:py-24 bg-gradient-to-br from-gray-900 to-gray-800"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl border border-gray-700/50">
              <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                {locale === "vi" ? "Liên Hệ" : "Contact Us"}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 bg-gray-800 rounded-lg">
                      <svg
                        className="w-8 h-8 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.9 5.3M21 8l-7.9 5.3M3 8a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-100 mb-2">
                        {locale === "vi" ? "Email" : "Email"}
                      </h3>
                      <a
                        href="mailto:duyminhweb22@gmail.com"
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        duyminhweb22@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 bg-gray-800 rounded-lg">
                      <svg
                        className="w-8 h-8 text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-100 mb-2">
                        {locale === "vi" ? "Điện Thoại" : "Phone"}
                      </h3>
                      <p className="text-gray-400">+84 935 38 99X</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 bg-gray-800 rounded-lg">
                      <svg
                        className="w-8 h-8 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-100 mb-2">
                        {locale === "vi" ? "Văn Phòng" : "Office"}
                      </h3>
                      <p className="text-gray-400">
                        {locale === "vi"
                          ? "Đường 53, Phường Hiệp Bình, TP Thủ Đức, TP.HCM"
                          : "Street 53, Hiep Binh Ward, HCMC"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Form
                    method="post"
                    className="space-y-6"
                    onSubmit={(e) => {
                      const now = Date.now();
                      const submissions = JSON.parse(
                        localStorage.getItem("contactSubmissions") || "[]"
                      );
                      const recentSubmissions = submissions.filter(
                        (timestamp: number) => now - timestamp < 300000 // 5 minutes in milliseconds
                      );

                      if (recentSubmissions.length >= 2) {
                        e.preventDefault();
                        setSubmitError(
                          "Too many requests. Please try again later."
                        );
                        return;
                      }

                      localStorage.setItem(
                        "contactSubmissions",
                        JSON.stringify([...submissions, now].slice(-2))
                      );
                    }}
                  >
                    {submitError && (
                      <div className="text-red-500 p-4 bg-red-100 rounded-lg mb-4">
                        {submitError}
                      </div>
                    )}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        {locale === "vi" ? "Họ Tên" : "Full Name"}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                        placeholder={
                          locale === "vi" ? "Nguyễn Văn A" : "John Doe"
                        }
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        {locale === "vi" ? "Nội Dung" : "Message"}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                        placeholder={
                          locale === "vi"
                            ? "Mô tả dự án của bạn..."
                            : "Describe your project..."
                        }
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                    >
                      {locale === "vi" ? "Gửi Tin Nhắn" : "Send Message"}
                    </button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8 rounded-t-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>&copy; 2025 Duy Minh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
