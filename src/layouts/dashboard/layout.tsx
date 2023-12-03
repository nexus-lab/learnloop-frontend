import { UserMenu } from "@/src/components/User";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full" style={{ backgroundColor: "#0F0F0F" }}>
      {/* Left Column -- Navigation */}
      <div className="flex flex-col w-1/5">
        {/* Content for the left column goes here */}
        {/* ... */}

        <Image
          src="/real.svg"
          width={200}
          height={200}
          alt="Learnloop"
          className="cursor-pointer lg:ml-6 mt-10"
        />

        <UserMenu />

        <h1 className="text- text-white ml-8 mt-10 font-semibold">Tools</h1>
      </div>

      {/* Vertical Divider */}
      <div className="w-px bg-divider"></div>

      {/* Right Column -- Content */}
      <div className="flex flex-col w-4/5">{children}</div>
    </div>
  );
}
