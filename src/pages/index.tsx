import { TransparentButton } from "../components/TransparentButton";
import Image from "next/image";
import { GradientButton } from "../components/GradientButton";
import useViewTransitionRouter from "../hooks/useViewTransitionRouter";
import HeadElements from "../components/misc/HeadElements";
import { isAuthenticated } from "@/lib/api/auth/helper";
import { useEffect, useState } from "react";
import Layout from "../layouts/dashboard/layout";

import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
 
 
// export async function getServerSideProps(context) {
//   const token = context.req.cookies['id_token'];
//   if (!token || !isTokenValid(token)) {
//     return {
//       redirect: {
//         destination: '/dashboard',
//         permanent: false,
//       },
//     };
//   }

//   return { props: {} };
// }
 

export default function Home() {
  const router = useViewTransitionRouter(); // Initialize the router
  // animated router
  // Handler for login navigation
  const handleLoginClick = () => {
    router.push("/login");
  };

  // Handler for signup navigation
  const handleSignupClick = () => {
    router.push("/signup");
  };

  const goBack = () => {
    router.push("/");
  };

  return (
    <>
      <HeadElements title="Learnloop" />
      <div className="flex flex-col h-screen">
        {/* Top Bar */}
        <div className="h-10 bg-top"></div>

        {/* Main Column - Fills remaining space */}
        <div
          className="flex-1 px-4 sm:px-10 md:px-20 bg-main overflow-auto"
          style={{
            backgroundImage: "url(/pattern.svg)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-center items-center pt-10 mb-20 sm:mb-40">
            <Image
              src="/real.svg"
              width={150}
              height={150}
              alt="Learnloop"
              className="cursor-pointer"
              onClick={goBack}
            />
            <TransparentButton
              variant={"ghost"}
              className="mt-4 sm:mt-0 sm:ml-auto text-md font-regular"
              onClick={handleLoginClick}
            >
              Login
            </TransparentButton>
          </div>

          <div
            className="flex flex-col justify-center space-y-10 md:space-y-20"
            aria-label="features"
          >
            <h1 className="text-2xl md:text-4xl text-center font-bold text-white">
              Learn differently with the power of AI
            </h1>
            <p className="text-base md:text-lg text-greytext px-4 md:px-72 text-center">
              Revolutionize your study sessions with Learnloop&apos;s AI-powered
              quiz generator. Upload your textbook, select chapters, and get a
              tailored quiz instantly. Beyond quizzes, envision a future with
              Learnloop&apos;s expanding AI tools, including an interactive
              coding playground.
            </p>
            <GradientButton
              className="w-full sm:w-[36rem] h-12 self-center"
              onClick={handleSignupClick}
            >
              Get Started
            </GradientButton>
          </div>
        </div>
      </div>
    </>
  );
}
