import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/Heading";
import { Spacer } from "@/components/Spacer";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Layout from "@/layouts/landing/layout";
import { GradientButton } from "@/components/GradientButton";
import { TransparentButton } from "@/components/TransparentButton";
import { useEffect, useState } from "react";
import useViewTransitionRouter from "@/src/hooks/useViewTransitionRouter";
import { useSearchParams } from "next/navigation";
import { resendVerificationEmail, verifyUser } from "@/lib/api/auth/routes";

const formSchema: any = z.object({
  confirmation_code: z
    .string()
    .min(6, {
      message: "Confirmation code must be 6 characters long.",
    })
    .refine(
      (v) => {
        let n = Number(v);
        return !isNaN(n) && v?.length > 0;
      },
      { message: "Invalid confirmation code." }
    ),
});

export default function ProfileForm() {
  // Router
  const router = useViewTransitionRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const searchParams = useSearchParams();

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

  const onClickResend = async (e: any) => {
    e.preventDefault();
    setIsResendDisabled(true);
    setCountdown(30);

    try {
      const email = searchParams.get("email");
      const response = await resendVerificationEmail(email as string);

      console.log(response);

      if (response.error) {
        console.log(response);
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const email = searchParams.get("email");

    try {
      const response = await verifyUser({
        email: email as string,
        confirmation_code: values.confirmation_code,
      });
      
      if (response.status === 200) {
        router.push("/login");
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

  useEffect(() => {
    let interval: any;

    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
    }

    return () => clearInterval(interval);
  }, [countdown]);

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
        <Heading>Verify your Account</Heading>
        <Spacer />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="confirmation_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Confirmation Code
                  </FormLabel>
                  <FormControl className="bg-transparent border-gray-700">
                    <Input
                      placeholder="ex: 012345"
                      type="number"
                      minLength={6}
                      maxLength={6}
                      min={0}
                      onInput={(e) => {
                        // Limit input to 6 characters
                        if (e.currentTarget.value.length > 6) {
                          e.currentTarget.value = e.currentTarget.value.slice(
                            0,
                            6
                          );
                        }
                      }}
                      className="focus:border-ring focus-visible:ring-0 focus:outline-none text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* <TransparentButton
              className="bg-transparent hover:bg-transparent text-gray-400 flex ml-auto"
              onClick={onClickForgotPassword}
            >
              Forgot Password?
            </TransparentButton> */}

            <GradientButton
              loading={isSubmitting}
              type="submit"
              className="w-full"
            >
              Verify
            </GradientButton>
          </form>
        </Form>
        <Spacer />
        <TransparentButton
          className="bg-transparent hover:bg-transparent text-gray-400 flex ml-auto mr-auto"
          onClick={onClickResend}
          disabled={isResendDisabled}
        >
          {isResendDisabled ? (
            <p>Resend available in {countdown} seconds</p>
          ) : (
            <p>Didn&apos;t receive the code?</p>
          )}
          {!isResendDisabled && (
            <span className="text-mainblue font-bold ml-2">Resend code</span>
          )}
        </TransparentButton>
      </div>
    </Layout>
  );
}
