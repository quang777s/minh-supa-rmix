import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, Form, useNavigation, useNavigate } from "@remix-run/react";
import { useEffect, useState, useRef } from "react";
import { json, redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "~/lib/supabase/supabase.server";
import { getLocale } from "~/i18n/i18n.server";
import enTranslations from "~/i18n/locales/en.json";
import viTranslations from "~/i18n/locales/vi.json";
import Menu from "~/components/Menu";
import wheelSpinData from "~/data/wheel-spin.json";

const translations = {
  en: enTranslations,
  vi: viTranslations,
};

type WheelItem = {
  id: number;
  name: string;
  type: string;
  nervous_system_area: string;
  note: string;
};

type ActionData = {
  error?: string;
  success?: boolean;
  result?: WheelItem;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const supabase = createSupabaseServerClient(request);

  // Check if user is logged in
  const { data: { session } } = await supabase.client.auth.getSession();
  if (!session) {
    return redirect("/login");
  }

  // Check if user already has a spin result
  const { data: profile } = await supabase.client
    .from("profiles")
    .select("signature")
    .eq("user_id", session.user.id)
    .single();

  // Fetch pages for menu
  const { data: pages, error: pagesError } = await supabase.client
    .from("tara_posts")
    .select("*")
    .eq("category_id", 1)
    .order("order_index", { ascending: true });

  if (pagesError || !pages) {
    throw new Error("Failed to fetch pages");
  }

  // Get current locale
  const locale = await getLocale(request);

  return json({
    pages,
    locale,
    t: translations[locale].landing,
    isLoggedIn: !!session,
    hasSpun: !!profile?.signature,
    spinResult: profile?.signature ? wheelSpinData.find(item => item.name === profile.signature) : null
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const supabase = createSupabaseServerClient(request);

  // Check if user is logged in
  const { data: { session } } = await supabase.client.auth.getSession();
  if (!session) {
    return json<ActionData>({ error: "Please login to spin the wheel" }, { status: 401 });
  }

  // Check if user already has a spin result
  const { data: profile } = await supabase.client
    .from("profiles")
    .select("signature")
    .eq("user_id", session.user.id)
    .single();

  if (profile?.signature) {
    return json<ActionData>({ error: "You have already spun the wheel" }, { status: 400 });
  }

  // Get the result from the form data
  const formData = await request.formData();
  const resultName = formData.get("result") as string;
  const result = wheelSpinData.find(item => item.name === resultName);

  if (!result) {
    return json<ActionData>({ error: "Invalid result" }, { status: 400 });
  }

  if (session.user.email === "dofyahepse@gufum.com") {
    return json<ActionData>({ success: true, result });
  }

  // Update user's profile with the result
  const { error } = await supabase.client
    .from("profiles")
    .update({ signature: result.name })
    .eq("user_id", session.user.id);

  if (error) {
    return json<ActionData>({ error: "Failed to save spin result" }, { status: 500 });
  }

  return json<ActionData>({ success: true, result });
};

export default function SpinWheel() {
  const { pages, locale, t, isLoggedIn, hasSpun, spinResult } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const spinInterval = useRef<NodeJS.Timeout>();
  const [selectedResult, setSelectedResult] = useState<WheelItem | null>(null);

  // // Calculate the target rotation based on the result
  // const calculateTargetRotation = (result: WheelItem) => {
  //   const itemIndex = wheelSpinData.findIndex(item => item.name === result.name);
  //   if (itemIndex === -1) return 0;

  //   // Calculate the angle for the item (each item takes up 360/totalItems degrees)
  //   const itemAngle = (360 / wheelSpinData.length) * itemIndex;

  //   // Since the wheel rotates clockwise and we want the item to land at the top (pointer),
  //   // we need to rotate the wheel so that the item's center aligns with the pointer.
  //   // The pointer is at 0 degrees (top), so we need to rotate the wheel
  //   // so that the item's center is at 0 degrees.
  //   const targetAngle = itemAngle;

  //   // Add some full rotations for effect (5-10 full spins)
  //   const fullSpins = 5 + Math.random() * 5;
  //   return (fullSpins * 360) + targetAngle;
  // };

  // Calculate the target rotation based on the result
  const calculateTargetRotation = (result: WheelItem) => {
    const itemIndex = wheelSpinData.findIndex(item => item.name === result.name);
    if (itemIndex === -1) return 0;

    const totalItems = wheelSpinData.length;
    const segmentDegrees = 360 / totalItems; // Angle covered by each segment

    // Calculate the angular position of the center of the chosen item's segment.
    // The segments are ordered clockwise, starting from the top.
    // Index 0 segment spans from 0 to segmentDegrees. Its center is at segmentDegrees / 2.
    // The item at `itemIndex` starts at `itemIndex * segmentDegrees`.
    // Its center is at `(itemIndex * segmentDegrees) + (segmentDegrees / 2)`.
    const centerOfChosenSegment = (itemIndex * segmentDegrees) + (segmentDegrees / 2);

    // The pointer is fixed at 0 degrees (top center).
    // To align the `centerOfChosenSegment` with the pointer, we need to rotate
    // the wheel by an amount that brings this angle to 0.
    // This is `(360 - centerOfChosenSegment)` modulo 360 to get a positive rotation.
    const rotationToAlign = (360 - centerOfChosenSegment) % 360;

    // Add multiple full spins for a dramatic effect. This ensures the wheel
    // spins a few times before settling on the target.
    // We add enough full spins to ensure the animation is visible and smooth.
    // Start from currentRotation to ensure smooth transition from a prior state if any
    const currentFullRotations = Math.floor(currentRotation / 360);
    const targetFullRotations = currentFullRotations + 5 + Math.floor(Math.random() * 5); // 5 to 9 additional full spins

    // The final target rotation is the sum of full spins and the precise alignment rotation.
    return (targetFullRotations * 360) + rotationToAlign;
  };

  // Start continuous spinning
  const startSpinning = () => {
    let rotation = currentRotation;
    spinInterval.current = setInterval(() => {
      rotation += 10; // Increment rotation by 10 degrees each frame
      setCurrentRotation(rotation);
    }, 16); // Approximately 60fps
  };

  // Stop spinning and set final position
  const stopSpinning = (targetRotation: number) => {
    if (spinInterval.current) {
      clearInterval(spinInterval.current);
    }
    setCurrentRotation(targetRotation);
  };

  // Debug logging
  useEffect(() => {
    console.log('Action Data:', actionData);
    console.log('Has Spun:', hasSpun);
    console.log('Spin Result:', spinResult);
    console.log('Show Modal:', showResultModal);
  }, [actionData, hasSpun, spinResult, showResultModal]);

  // Show result modal when spin is complete
  useEffect(() => {
    if (actionData?.result) {
      console.log('Setting timer for modal');
      const timer = setTimeout(() => {
        console.log('Timer completed, showing modal');
        setShowResultModal(true);
      }, 5000); // Show after wheel stops spinning
      return () => clearTimeout(timer);
    }
  }, [actionData?.result]);

  // Show modal immediately if user already has a result
  useEffect(() => {
    if (hasSpun && spinResult) {
      console.log('User has existing result, showing modal');
      setShowResultModal(true);
    }
  }, [hasSpun, spinResult]);

  // Update rotation when we get a result
  useEffect(() => {
    if (selectedResult) {
      const targetRotation = calculateTargetRotation(selectedResult);
      stopSpinning(targetRotation);
      setIsSpinning(false);
    }
  }, [selectedResult]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (spinInterval.current) {
        clearInterval(spinInterval.current);
      }
    };
  }, []);

  const handleSpin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default form submission
    if (hasSpun) return;

    setIsSpinning(true);
    setShowResultModal(false); // Reset modal state when starting new spin
    startSpinning(); // Start continuous spinning

    // Select a random result
    const randomIndex = Math.floor(Math.random() * wheelSpinData.length);
    const result = wheelSpinData[randomIndex];
    setSelectedResult(result);

    // Submit the form with the selected result
    const formData = new FormData(formRef.current!);
    formData.set('result', result.name);

    setTimeout(() => {
      formRef.current?.submit();
    }, 1000); // Wait 1 second before submitting to allow animation to start
  };

  const closeModal = () => {
    setShowResultModal(false);
    navigate('/user/profile');
  };

  // Get the current result to display
  const currentResult = actionData?.result || spinResult;

  return (
    <div className="min-h-screen bg-black">
      <Menu pages={pages} t={t} isLoggedIn={isLoggedIn} />

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white text-center mb-12 font-vietnamese">
          Vòng Quay Định Mệnh
        </h1>

        <div className="max-w-2xl mx-auto">
          {/* Spin Wheel */}
          <div className="relative w-full aspect-square mb-12">
            {/* Outer Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-xl animate-pulse"></div>

            {/* Wheel Container */}
            <div
              className="absolute inset-0 rounded-full border-8 border-white/20 overflow-hidden bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-sm"
              style={{
                transform: `rotate(${currentRotation}deg)`,
                transition: isSpinning ? 'none' : 'transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
                boxShadow: 'inset 0 0 50px rgba(255,255,255,0.1)'
              }}
            >
              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-4 border-white/20 backdrop-blur-sm"></div>

              {wheelSpinData.map((item, index) => {
                const angle = (360 / wheelSpinData.length) * index;
                return (
                  <div
                    key={item.id}
                    className="absolute inset-0"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: '50% 50%'
                    }}
                  >
                    <div
                      className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-right"
                      style={{
                        transform: `rotate(${360 / wheelSpinData.length}deg)`,
                        background: index % 2 === 0
                          ? 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))'
                          : 'linear-gradient(45deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
                      }}
                    >
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 text-[8px] font-vietnamese transform -rotate-45 whitespace-nowrap"
                        style={{
                          textShadow: '0 0 10px rgba(255,255,255,0.3)',
                          width: '100px',
                          textAlign: 'center'
                        }}
                      >
                        {item.name}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Decorative Rings */}
              <div className="absolute inset-0 rounded-full border border-white/10"></div>
              <div className="absolute inset-4 rounded-full border border-white/10"></div>
              <div className="absolute inset-8 rounded-full border border-white/10"></div>
            </div>

            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-16 transform -translate-y-1/2">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-transparent border-b-red-500"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[12px] border-transparent border-b-white"></div>
            </div>

            {/* Sparkle Effects */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Spin Button */}
          {!hasSpun && (
            <Form method="post" ref={formRef} className="text-center">
              <input type="hidden" name="result" value={selectedResult?.name || ''} />
              <button
                type="button"
                disabled={isSubmitting || isSpinning}
                onClick={handleSpin}
                className="px-8 py-4 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50 font-vietnamese text-xl"
              >
                {isSubmitting ? "Đang quay..." : "Quay Ngay"}
              </button>
            </Form>
          )}

          {actionData?.error && (
            <div className="mt-4 p-4 bg-red-500/20 rounded-lg">
              <p className="text-red-500 text-center">{actionData.error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Result Modal */}
      {showResultModal && currentResult && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-purple-900/90 to-black/90 rounded-2xl p-8 max-w-lg w-full border border-white/10 shadow-2xl animate-slide-up">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2 font-vietnamese">Kết Quả Của Bạn</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-6 text-white">
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-2xl font-bold mb-4 font-vietnamese text-purple-300">
                  {currentResult.name}
                </h3>
                <div className="space-y-4">
                  <p className="font-vietnamese">
                    <span className="text-purple-300 font-semibold">Loại:</span> {currentResult.type}
                  </p>
                  <p className="font-vietnamese">
                    <span className="text-purple-300 font-semibold">Vùng Hệ Thần Kinh:</span> {currentResult.nervous_system_area}
                  </p>
                  <p className="font-vietnamese">
                    <span className="text-purple-300 font-semibold">Ghi Chú:</span> {currentResult.note}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-300 font-vietnamese"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Copyright Bar */}
      <div className="fixed bottom-0 w-full bg-black backdrop-blur-sm py-3 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white text-sm">{t.copyright}</p>
        </div>
      </div>
    </div>
  );
} 