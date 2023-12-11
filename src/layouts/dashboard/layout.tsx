import React from "react";
import { QuizTool } from "@/src/components/QuizTool";
import { UserMenu } from "@/src/components/User";
import { FaCube } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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

  const gLC = (href: string) => {
    return pathname.includes(href) ? "text-white" : "text-gray-500";
  };

  return (
    <div
      className="flex flex-col lg:flex-row lg:h-screen w-full"
      style={{ backgroundColor: "#0F0F0F" }}
    >
      {/* Left Column -- Navigation */}
      <div className="flex flex-col w-full lg:w-1/5 px-8">
        <Image
          src="/real.svg"
          width={150}
          height={150}
          alt="Learnloop"
          className="cursor-pointer mt-10"
        />

        <UserMenu
          imageUrl="https://images.unsplash.com/photo-1682686580036-b5e25932ce9a"
          name="Francisco"
          onLogout={onLogout}
        />

        <Link
          href="/dashboard"
          onClick={onClickExplore}
          className="bg-transparent w-full hover:bg-divider rounded-sm py-2 px-2 flex items-center justify-between my-6"
        >
          <p className="text-white text-sm">Explore</p>
          <FaCube className="text-white" />
        </Link>

        <h1 className="font-bold text-xl text-white text-center lg:text-left mt-10">
          Official Tools
        </h1>
        <QuizTool />
      </div>

      {/* Vertical Divider */}
      <div className="hidden lg:block w-px bg-divider"></div>

      {/* Right Column -- Content */}
      <div className="flex flex-col w-full">
        {pathname.includes("/dashboard/quiz") && (
          <div className="flex flex-col lg:flex-row p-8 space-x-0 lg:space-x-4 space-y-4 lg:space-y-0">
            <Link
              href="/dashboard/quiz/create"
              className={gLC("/dashboard/quiz/create") + " text-lg"}
            >
              Create
            </Link>
            <Link
              href="/dashboard/quiz/textbooks"
              className={gLC("/dashboard/quiz/textbooks") + " text-lg"}
            >
              Textbooks
            </Link>
            <Link
              href="/dashboard/quiz/quizzes"
              className={gLC("/dashboard/quiz/quizzes") + " text-lg"}
            >
              Quizzes
            </Link>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
