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
});

export default function ForgotPassword() {
  const router = useViewTransitionRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setSession } = useSession();

  const goBack = () => {
    router.push("/");
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
    },
  });

  const onSubmit = async (values: any) => {
    console.log("hi")
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/auth/forgot?email=${values.email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsSubmitting(false);
        // const data = await response.json();
        // console.log(data);
        router.push("/forgot/confirm?email=" + values.email);
      } else {
        const data = await response.json();
        console.log(data);
        // setErrorMessage(data.message);
        // setTimeout(() => {
        //   setIsSubmitting(false);
        // }, 2000);
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
      <HeadElements title="Forgot Password" />
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
        <Heading>Forgot Password</Heading>
        <Spacer />
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
            <GradientButton
              loading={isSubmitting}
              type="submit"
              className="w-full"
            >
              Submit
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
