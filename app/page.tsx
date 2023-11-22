'use client'
import { TransparentButton } from "@/components/TransparentButton";
import Image from "next/image";
import { GradientButton } from "@/components/GradientButton";
import { useRouter } from "next/navigation"; // Import useRouter

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
    <div className="bg-main h-screen px-20">
      {/* Navigation */}
      <div className="flex justify-center items-center mb-32 pt-10">
        <Image src="/learnloop.svg" width={300} height={300} alt="Learnloop" />
        <TransparentButton variant={"ghost"} className="ml-auto" onClick={handleLoginClick}>
          Login
        </TransparentButton>
        <GradientButton className="ml-4" onClick={handleSignupClick}>Get Started</GradientButton>
      </div>

      <div className="flex justify-between items-center" aria-label="features">
        {/* Feature description */}
        <div className="flex-1">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Generate your Quiz with the Power of AI
            </h1>
            <p className="mt-4 text-white">
              Need a quick refresher on some material for an upcoming test? Try
              the quiz generator and simply upload your textbook, select the
              study chapters and generate your quiz.
            </p>
          </div>
        </div>
        {/* Feature image */}
        <div className="flex-1">
          <Image
            className="ml-auto"
            src="/pc.png"
            width={500}
            height={500}
            alt="Quiz"
          />
        </div>
      </div>
    </div>
  );
}
