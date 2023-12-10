import { QuizTool } from "@/src/components/QuizTool";
import { UserMenu } from "@/src/components/User";
import { useSessionCheck } from "@/src/hooks/useSessionCheck";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";

export default function Layout({ children }: { children: React.ReactNode }) {
  // useSessionCheck();

  const onClickExplore = (e: any) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  const onLogout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      router.push("/");
    }
  };

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

        <UserMenu
          imageUrl="https://images.unsplash.com/photo-1682686580036-b5e25932ce9a"
          name="Francisco"
          onLogout={onLogout}
        />

        <Link
          href="/dashboard"
          className="bg-divider rounded-sm py-2 px-2 flex mr-8 ml-8 mt-6"
          onClick={onClickExplore}
        >
          <p className="text-white">Explore</p>
        </Link>

        <h1 className="font-bold text-xl text-white ml-8 mt-10">
          Official Tools
        </h1>
        <QuizTool />
      </div>

      {/* Vertical Divider */}
      <div className="w-px bg-divider"></div>

      {/* Right Column -- Content */}
      <div className="flex flex-col w-4/5">{children}</div>
    </div>
  );
}
