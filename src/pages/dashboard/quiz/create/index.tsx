import Layout from "@/src/layouts/dashboard/layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import useViewTransitionRouter from "@/src/hooks/useViewTransitionRouter";
import { usePathname } from "next/navigation";
import { HalfSpacer } from "@/src/components/HalfSpacer";
import { OutlineButton } from "@/src/components/OutlineButton";
import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { OutlineInput } from "@/src/components/OutlineInput";
import { OutlineInputFile } from "@/src/components/OutlineInputFile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { GradientButton } from "@/src/components/GradientButton";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import HeadElements from "@/src/components/misc/HeadElements";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export default function QuizCreation() {
  const router = useViewTransitionRouter();
  const [quizSource, setQuizSource] = useState("prompt");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentDifficulty, setCurrentDifficulty] = useState("easy");
  const [currentNumQuestions, setCurrentNumQuestions] = useState("10");
  const [open, setOpen] = useState(false);
  const options = ["easy", "medium", "hard"];
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

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="mx-8 text-white">
      <HeadElements title="Create a quiz" />
      <div className="flex flex-row">
        <h1 className="text-lg font-semibold">Quiz Source</h1>
        <span className="text-gray-500 text-sm self-center ml-4">
          (Material needed to generate quiz)
        </span>
      </div>
      <HalfSpacer />
      <h1 className="text-sm">
        Select a quiz source: prompt or textbook file (.pdf, .doc, .docx)
      </h1>
      <div className="flex flex-row py-6 space-x-4">
        <OutlineButton
          className={
            "text-sm px-7 py-2" +
            (quizSource === "prompt" ? " bg-mainblue/20" : "")
          }
          size="sm"
          onClick={() => setQuizSource("prompt")}
        >
          Prompt
        </OutlineButton>
        <OutlineButton
          className={
            "text-sm px-7 py-2" +
            (quizSource === "textbook" ? " bg-mainblue/20" : "")
          }
          size="sm"
          onClick={() => setQuizSource("textbook")}
        >
          Textbook File
        </OutlineButton>
      </div>
      {quizSource === "prompt" ? (
        <div>
          <OutlineInput placeholder="Enter a prompt..."></OutlineInput>
        </div>
      ) : (
        <div>
          <OutlineInputFile></OutlineInputFile>
        </div>
      )}
      <HalfSpacer />
      <div className="flex flex-row">
        <h1 className="text-lg font-semibold">Quiz Options</h1>
        <span className="text-gray-500 text-sm self-center ml-4">
          (Customization)
        </span>
      </div>
      <HalfSpacer />
      {/* Difficulty Dropdown */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-transparent border-[1px] border-divider">
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-dropdown border-[1px] border-divider text-white">
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <HalfSpacer />
      <label className="text-sm ">Number of Questions</label>
      <OutlineInput
        placeholder="Enter a number..."
        type="number"
        max={20}
        min={0}
        value={currentNumQuestions}
        onChange={(e) => setCurrentNumQuestions(e.target.value)}
      ></OutlineInput>
      <HalfSpacer />
      <GradientButton loading={isSubmitting} type="submit" className="w-full">
        Generate Quiz
      </GradientButton>
    </div>
  );
}

QuizCreation.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
