import Link from "next/link";
import { Button } from "./ui/button";
import useViewTransitionRouter from "../hooks/useViewTransitionRouter";

export const QuizTool = () => {
  const router = useViewTransitionRouter();

  const onClickCreate = (e: any) => {
    e.preventDefault();
    router.push("/dashboard/quiz/create");
  };

  return (
    <div className="flex flex-col mt-6">
      <h1 className="text-white font-semibold text-lg mb-4">Quizify</h1>

      <Link
        href="/quiz/create"
        className="bg-mainblue rounded-sm py-2 px-2 flex"
        onClick={onClickCreate}
        data-testid="signup"
      >
        <p className="text-white text-sm">Create a quiz</p>
      </Link>
    </div>
  );
};
