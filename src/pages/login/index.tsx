import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Heading } from "@/src/components/Heading";
import { Spacer } from "@/src/components/Spacer";
import HeadElements from "@/src/components/misc/HeadElements";
import Layout from "@/src/layouts/landing/layout";
import useViewTransitionRouter from "@/src/hooks/useViewTransitionRouter";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { GradientButton } from "@/src/components/GradientButton";
import { useState } from "react";
import { loginUser, resendVerificationEmail } from "@/lib/api/auth/routes";
import { TransparentButton } from "@/src/components/TransparentButton";
import { useSession } from "@/src/contexts/SessionContext";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export default function Login() {
  const router = useViewTransitionRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setSession } = useSession();

  const goBack = () => {
    router.push("/");
  };

  const onClickForgotPassword = (e: any) => {
    e.preventDefault();
    router.push("/forgot");
  };

  const onClickSignup = (e: any) => {
    e.preventDefault();
    router.push("/signup");
  };

  // Define your form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: any) => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        // // Get user details
        // const resp = await fetch("/api/auth/user", {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });

        // if (resp.ok) {
        //   const sessionData = await resp.json();

        //   console.log(sessionData);

        //   setSession(sessionData);
        //   router.push("/dashboard");
        // }

        // Simulate a delay
        router.push("/dashboard");
      } else if (response.status === 403) {
        // Handle the unverified user case
        router.push("/signup/confirm?email=" + values.email);
      } else {
        const resp = await response.json();
        if (resp.error === "NotAuthorizedException") {
          setErrorMessage("Invalid email or password.");
        } else {
          setErrorMessage("An error occurred. Please try again.");
        }
        // Handle other errors
        // Example: display a generic error message
        setIsSubmitting(false);
      }
    } catch (e) {
      console.error(e);
      // setTimeout(() => {
      //   setIsSubmitting(false);
      // }, 2000);
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <HeadElements title="Login" />
      <div className="mt-20">
        <Image
          src="/real.svg"
          width={200}
          height={200}
          alt="Learnloop"
          onClick={goBack}
          className="hover:cursor-pointer"
        />
        <Spacer />
        <Heading>Login</Heading>
        <Spacer />
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl className="bg-transparent border-gray-700">
                    <Input
                      placeholder="ex: example@gmail.com"
                      className="focus:border-ring focus-visible:ring-0 focus:outline-none text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl className="bg-transparent border-gray-700">
                    <Input
                      type="password"
                      placeholder="********"
                      className="focus:border-ring focus-visible:ring-0 focus:outline-none text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <Link
              href="/forgot"
              className="bg-transparent hover:bg-transparent text-gray-400 flex ml-auto"
              onClick={onClickForgotPassword}
            >
              <span className="ml-auto text-sm">Forgot Password?</span>
            </Link>
            <GradientButton
              loading={isSubmitting}
              type="submit"
              className="w-full"
            >
              Login
            </GradientButton>
          </form>
        </Form>
        <Spacer />
        <Link
          href="/signup"
          className="bg-transparent hover:bg-transparent text-gray-400 flex ml-auto mr-auto"
          onClick={onClickSignup}
          data-testid="signup"
        >
          <p className="ml-auto text-sm">Don&apos;t have an account?</p>
          <span className="text-mainblue font-bold ml-2 text-sm mr-auto">
            Signup
          </span>
        </Link>
        {/* Add any additional buttons or links here */}
      </div>
    </Layout>
  );
}
