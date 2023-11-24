"use client";
import { TransparentButton } from "@/components/TransparentButton";
import Image from "next/image";
import { GradientButton } from "@/components/GradientButton";
import { useRouter } from "next/navigation"; // Corrected import statement

export default function Home() {
  const router = useRouter(); // Initialize the router

  // Handler for login navigation
  const handleLoginClick = () => {
    router.push("/login");
  };

  // Handler for signup navigation
  const handleSignupClick = () => {
    router.push("/signup");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Bar */}
      <div className="h-10 bg-top"></div>

      {/* Main Column - Fills remaining space */}
      <div className="flex-1 px-20 bg-main overflow-auto"
           style={{
             backgroundImage: "url(/pattern.svg)",
             backgroundRepeat: "no-repeat",
             backgroundPosition: "center", // Centers the background image
           }}
      >
        {/* Navigation */}
        <div className="flex justify-center items-center pt-10 mb-40">
          <Image
            src="/real.svg"
            width={200}
            height={200}
            alt="Learnloop"
          />
          <TransparentButton
            variant={"ghost"}
            className="ml-auto text-md font-regular"
            onClick={handleLoginClick}
          >
            Login
          </TransparentButton>
        </div>

        <div
          className="flex flex-col justify-center space-y-20"
          aria-label="features"
        >
          <h1 className="text-4xl text-center font-bold text-white">
            Learn differently with the power of AI
          </h1>
          <p className="text-lg text-greytext px-72 text-center">
            Revolutionize your study sessions with Learnloop&apos;s AI-powered quiz
            generator. Upload your textbook, select chapters, and get a tailored
            quiz instantly. Beyond quizzes, envision a future with Learnloop&apos;s
            expanding AI tools, including an interactive coding playground.
          </p>
          <GradientButton
            className="ml-4 w-[36rem] h-12 self-center"
            onClick={handleSignupClick}
          >
            Get Started
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
