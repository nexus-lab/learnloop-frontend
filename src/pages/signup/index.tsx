import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/src/components/ui/button";
import { Heading } from "@/src/components/Heading";
import { Spacer } from "@/src/components/Spacer";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import Layout from "@/src/layouts/landing/layout";
import { GradientButton } from "@/src/components/GradientButton";
import { TransparentButton } from "@/src/components/TransparentButton";
import { useRouter } from "next/navigation";
import { signupUser } from "@/lib/api/auth/routes";
import { useState } from "react";
import useViewTransitionRouter from "@/src/hooks/useViewTransitionRouter";
import Link from "next/link";

const formSchema: any = z
  .object({
    name: z.string().min(2, {
      message: "Please enter a valid name.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long.",
      })
      .regex(/\d/, {
        message: "Password must contain at least one number.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string().min(8, {
      message: "Please confirm your password.",
    }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function ProfileForm() {
  // Router
  const router = useViewTransitionRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goBack = () => {
    router.push("/");
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onClickForgotPassword = (e: any) => {
    e.preventDefault();
    router.push("/forgot");
  };

  const onClickLogin = (e: any) => {
    e.preventDefault();
    router.push("/login");
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        router.push("/signup/confirm?email=" + values.email);
      }

      // Simulate a delay
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000); // 2000 milliseconds delay (2 seconds)
    } catch (e) {
      console.log(e);
      // Also set the delay here in case of an error
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  }

  return (
    <Layout>
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
        <Heading>Signup</Heading>
        <Spacer />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Name</FormLabel>
                  <FormControl className="bg-transparent border-gray-700">
                    <Input
                      placeholder="ex: John Doe"
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
                      placeholder="********"
                      className="focus:border-ring focus-visible:ring-0 focus:outline-none text-white"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Confirm Password</FormLabel>
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
              Signup
            </GradientButton>
          </form>
        </Form>
        <Spacer />
        <Link
          href="/login"
          className="bg-transparent hover:bg-transparent text-gray-400 flex"
          onClick={onClickLogin}
        >
          <p className="ml-auto text-sm">Already have an account?</p>
          <span className="text-mainblue font-bold ml-2 text-sm mr-auto">
            Login
          </span>
        </Link>
      </div>
    </Layout>
  );
}
