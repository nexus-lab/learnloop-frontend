import { Spacer } from "@/components/Spacer";
import Image from "next/image";
import Lottie from "lottie-react";
import study from "@/public/study.json";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex h-full w-full">
        {/* Left Column */}
        <div className="bg-main px-20" style={{width: '50%'}}>
          {children}
        </div>
  
        {/* Right Column */}
        <div className="bg-top flex flex-col justify-center items-center" style={{width: '50%', height: '100%'}}>
          {/* Content for the right column goes here */}
          <Lottie animationData={study} loop={true} />
          {/* <Image src="/art.svg" width={700} height={700} alt="Learnloop" /> */}
          <Spacer />
          <p className="text-white">One question at a time.</p>
        </div>
      </div>
    );
}
