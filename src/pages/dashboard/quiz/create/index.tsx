import Layout from "@/src/layouts/dashboard/layout";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useForm, Controller, set } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Chapter, Textbook, Textbooks } from "@/src/components/Textbooks";
import { OutlineInput } from "@/src/components/OutlineInput";
import { GradientButton } from "@/src/components/GradientButton";
import {
  Form,
  FormControl,
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
import { FaSearch } from "react-icons/fa";
import HeadElements from "@/src/components/misc/HeadElements";
import { HalfSpacer } from "@/src/components/HalfSpacer";
import { OutlineButton } from "@/src/components/OutlineButton";
import useViewTransitionRouter from "@/src/hooks/useViewTransitionRouter";
import { Spacer } from "@/src/components/Spacer";
import { Spinner } from "@/src/components/Spinner";

// Optional but recommended: use the Edge Runtime. This can only be done at the page level, not inside nested components.
export const runtime = "experimental-edge";

// Updated form schema
const formSchema = z.object({
  difficulty: z.enum(["easy", "medium", "hard"]),
  numQuestions: z.number().min(1).max(20),
});

const useUniqueJsonObjects = (buffer: string): object[] => {
  buffer = buffer
    .replace("```json", "")
    .replace("```", "")
    .replace(/\n/g, " ")
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .trim();

  const [objects, setObjects] = useState<object[]>([]);

  const addObject = useCallback((object: object) => {
    setObjects((prevObjects) => {
      const objectExists = prevObjects.some(
        (prevObject) => JSON.stringify(prevObject) === JSON.stringify(object)
      );

      return objectExists ? prevObjects : [...prevObjects, object];
    });
  }, []);

  useEffect(() => {
    let newBuffer = buffer;
    let match;
    while ((match = newBuffer.match(/(\{[^{}]*?\})(?=,|$)/))) {
      const jsonStr = match[0];

      try {
        const data = JSON.parse(jsonStr); // Try to parse the JSON
        addObject(data);
        newBuffer = newBuffer.slice(jsonStr.length).replace(/^,/, "").trim(); // Remove leading comma and trailing whitespaces
      } catch (e) {
        break;
      }
    }
  }, [buffer, addObject]);

  return objects;
};

export default function QuizCreation() {
  const router = useViewTransitionRouter();
  const [quizSource, setQuizSource] = useState("prompt");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentDifficulty, setCurrentDifficulty] = useState("easy");
  const [currentNumQuestions, setCurrentNumQuestions] = useState("10");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTextbook, setSelectedTextbook] = useState<Textbook>();
  const [selectedChapter, setSelectedChapter] = useState<Chapter>();
  const [streamedData, setStreamedData] = useState("");
  const [isLoadingStreamData, setIsLoadingStreamData] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isTryingSave, setIsTryingSave] = useState(false);
  const [quizUUID, setQuizUUID] = useState("");

  const options = ["easy", "medium", "hard"];
  // Define your form with the updated schema
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      difficulty: "easy",
      numQuestions: 10,
    },
  });

  interface QuestionOutput {
    id: number;
    form: string;
    text: string;
    options: string[];
    answer: string;
  }

  // const buffer = useBuffer(streamedData);
  const questions = useUniqueJsonObjects(streamedData) as QuestionOutput[];

  const saveQuiz = async (e: any) => {
    e.preventDefault();
    setIsTryingSave(true);
    const response = await fetch("/api/quizzes/save", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quiz_key: quizUUID,
      }),
    });

    const resp = await response.json();
    console.log(resp);
    setIsTryingSave(false);
  };

  const onSubmit = async (values: any) => {
    // Clear any stream data and start loading animation
    setStreamedData("");
    setIsSubmitting(true);
    setIsLoadingStreamData(true);
    questions.length = 0;

    const isPrompt = quizSource === "prompt";

    if (isPrompt) {
      const response = await fetch("/api/quizzes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          difficulty: currentDifficulty,
          numQuestions: currentNumQuestions,
          prompt: prompt,
        }),
      });

      if (response.body) {
        readStream(response.body.getReader());
      }

      // Get the quiz key from the header
      const quizKey = response.headers.get("x-quiz-key");

      if (quizKey) {
        setQuizUUID(quizKey);
      } 
    } else {
      const response = await fetch("/api/quizzes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          difficulty: currentDifficulty,
          numQuestions: currentNumQuestions,
          chapter_id: selectedChapter?.chapter_id,
        }),
      });

      if (response.body) {
        readStream(response.body.getReader());
      }

      // Get the quiz key from the header
      const quizKey = response.headers.get("x-quiz-key");

      if (quizKey) {
        setQuizUUID(quizKey);
      } 
    }

    setIsSubmitting(false);
  };

  const readStream = async (reader: any) => {
    const { done, value } = await reader.read();
    if (done) {
      console.log("done");
      setIsLoadingStreamData(false); // End loading once the entire stream is read
      return;
    }

    const text = new TextDecoder().decode(value);
    setStreamedData((prevData) => prevData + text); // Append new data
    await readStream(reader); // Continue reading the next chunk
  };

  function LoadingSkeleton({ isVisible }: { isVisible: boolean }) {
    return (
      <div
        className={`relative space-y-5 rounded-2xl ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={!isVisible}
      >
        <div className="h-3 w-3/5 overflow-hidden rounded-lg bg-divider relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border before:border-mainblue before:bg-gradient-to-r before:from-transparent before:via-mainpink/75 before:to-transparent"></div>
        <div className="space-y-3">
          <div className="h-3 w-4/5 overflow-hidden rounded-lg bg-divider relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border before:border-mainblue before:bg-gradient-to-r before:from-transparent before:via-mainpink/75 before:to-transparent"></div>
          <div className="h-3 w-4/5 overflow-hidden rounded-lg bg-divider relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border before:border-mainblue before:bg-gradient-to-r before:from-transparent before:via-mainpink/75 before:to-transparent"></div>
          <div className="h-3 w-4/5 overflow-hidden rounded-lg bg-divider relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border before:border-mainblue before:bg-gradient-to-r before:from-transparent before:via-mainpink/75 before:to-transparent"></div>
          <div className="h-3 w-4/5 overflow-hidden rounded-lg bg-divider relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border before:border-mainblue before:bg-gradient-to-r before:from-transparent before:via-mainpink/75 before:to-transparent"></div>
        </div>
      </div>
    );
  }

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
          Textbook
        </OutlineButton>
      </div>
      {quizSource === "prompt" ? (
        <div>
          <OutlineInput
            onInput={(e: any) => {
              setPrompt(e.target.value);
            }}
            placeholder="Enter a prompt..."
          ></OutlineInput>
        </div>
      ) : (
        <div>
          <div className="flex items-center border-divider border-[1px] bg-transparent rounded-sm">
            <FaSearch className="text-white mx-2" />
            <input
              className="w-full pl-2 py-2.5 text-white text-sm bg-transparent outline-none"
              placeholder="Search for a textbook..."
              type="text"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Textbooks
            search_query={search}
            onSelectTextbook={(t) => setSelectedTextbook(t)}
            onSelectChapter={(c) => setSelectedChapter(c)}
          />
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
          onClick={() => {
            console.log(form.getFieldState("difficulty"));
            console.log(form.getFieldState("numQuestions"));
          }}
          className="space-y-4 mb-10"
        >
          <div>
            <label
              htmlFor="difficulty"
              className="block text-sm font-medium text-white"
            >
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              onInput={(e) => {
                setCurrentDifficulty(e.currentTarget.value);
              }}
              className="flex bg-transparent border-[1px] border-divider h-10 w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            >
              <option value="easy" className="bg-dropdown border-[1px] border-divider text-white">Easy</option>
              <option value="medium" className="bg-dropdown border-[1px] border-divider text-white">Medium</option>
              <option value="hard" className="bg-dropdown border-[1px] border-divider text-white">Hard</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="numQuestions"
              className="block text-sm font-medium text-white"
            >
              Number of Questions
            </label>
            <input
              type="number"
              id="numQuestions"
              name="numQuestions"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-divider h-10 w-full focus:outline-none sm:text-sm rounded-md bg-transparent border-[1px]"
              placeholder="Enter a number..."
              max="20"
              min="1"
              onInput={(e) => {
                setCurrentNumQuestions(e.currentTarget.value);
              }}
            />
          </div>
          <HalfSpacer />
          <div>
            <Suspense>
              <div className="space-y-6">
                {questions.length > 0 ? (
                  <h1 className="text-lg font-semibold mb-5">Quiz Preview</h1>
                ) : null}
                {questions
                  ? questions.map((question, index) => (
                      <div key={question.id} className="rounded-md shadow-sm ">
                        <h3
                          className={`text-md font-semibold mb-5 typewriter-effect`}
                        >
                          {index + 1}. {question.text}
                        </h3>
                        <HalfSpacer />
                        <div className="space-y-2">
                          {question.options
                            ? question.options.map((option, idx) => (
                                <label key={idx} className={`block`}>
                                  <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    value={option}
                                    className="mr-2"
                                    disabled
                                  />
                                  {option}
                                </label>
                              ))
                            : null}
                        </div>
                        <p
                          className={`mt-3 text-green-600 font-semibold typewriter-effect`}
                        >
                          Answer: {question.answer}
                        </p>
                      </div>
                    ))
                  : null}
                {/* Conditionally render the loading skeleton */}
                {isLoadingStreamData ? (
                  <div className={`relative space-y-5 rounded-2xl}`}>
                    <div className="h-3 w-3/5 overflow-hidden rounded-lg bg-divider relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border before:border-mainblue before:bg-gradient-to-r before:from-transparent before:via-mainpink/75 before:to-transparent"></div>
                    <div className="space-y-3">
                      <div className="h-3 w-4/5 overflow-hidden rounded-lg bg-divider relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border before:border-mainblue before:bg-gradient-to-r before:from-transparent before:via-mainpink/75 before:to-transparent"></div>
                      <div className="h-3 w-4/5 overflow-hidden rounded-lg bg-divider relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border before:border-mainblue before:bg-gradient-to-r before:from-transparent before:via-mainpink/75 before:to-transparent"></div>
                      <div className="h-3 w-4/5 overflow-hidden rounded-lg bg-divider relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border before:border-mainblue before:bg-gradient-to-r before:from-transparent before:via-mainpink/75 before:to-transparent"></div>
                      <div className="h-3 w-4/5 overflow-hidden rounded-lg bg-divider relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border before:border-mainblue before:bg-gradient-to-r before:from-transparent before:via-mainpink/75 before:to-transparent"></div>
                    </div>
                  </div>
                ) : null}
                <Spacer />
              </div>
            </Suspense>
          </div>

          <div className="flex flex-row space-x-5">
            {questions.length > 0 ? (
              isTryingSave ? (
                <div className="h-10 inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full bg-mainpink/75 hover:bg-mainpink text-white rounded rounded-sm">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  </div>
                </div>
              ) : (
                <GradientButton
                  loading={isSubmitting}
                  variant={"secondary"}
                  onClick={saveQuiz}
                  className="w-full bg-mainpink/75 hover:bg-mainpink text-white"
                >
                  Save Quiz
                </GradientButton>
              )
            ) : null}
            <GradientButton
              loading={isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
              className="w-full"
            >
              Generate Quiz
            </GradientButton>
          </div>
        </form>
      </Form>
    </div>
  );
}

QuizCreation.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
