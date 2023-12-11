import { Spacer } from "@/src/components/Spacer";
import Lottie from "lottie-react";
import study from "@/public/study.json";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      {/* Left Column */}
      <div className="bg-main px-4 md:px-20 w-full md:w-1/2 h-full">
        {children}
      </div>

      {/* Right Column */}
      <div className="bg-top lg:flex md:flex hidden flex-col justify-center items-center w-full md:w-1/2 h-full">
        {/* Content for the right column goes here */}
        <div className="w-full max-w-md">
          <Lottie animationData={study} loop={true} />
        </div>
        {/* <Image src="/art.svg" width={700} height={700} alt="Learnloop" /> */}
        <Spacer />
        <p className="text-white text-center px-4">One question at a time.</p>
      </div>
    </div>
  );
}

