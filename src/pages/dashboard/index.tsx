import { useSession } from "@/src/contexts/SessionContext";
import Layout from "@/src/layouts/dashboard/layout";
import { GradientButton } from "@/src/components/GradientButton";
import { Heading } from "@/src/components/Heading";
import { Input } from "@/src/components/ui/input";
import { FaSearch } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import HeadElements from "@/src/components/misc/HeadElements";
import useViewTransitionRouter from "@/src/hooks/useViewTransitionRouter";

export default function Dashboard() {
  const { session } = useSession();
  const router = useViewTransitionRouter();

  const goToQuizify = () => {
    router.push("/dashboard/quiz/create");
  }

  // console.log(session);
  return (
    <div className="p-8 h-screen">
      <HeadElements title="Dashboard" />
      <div className="flex items-center space-x-8">
        <Heading>Explore</Heading>
        {/* <GradientButton type="submit" className="text-sm px-7 py-2" size="sm">
          Create a tool
        </GradientButton> */}
      </div>
      {/* <div className="mt-10 flex items-center border-divider border-2 bg-transparent rounded-sm">
        <FaSearch className="text-white mx-2" />
        <input
          className="w-full pl-2 py-2 text-white bg-transparent outline-none"
          placeholder="Search for a tool..."
          type="text"
        />
      </div> */}

      <div className="pt-10">
        <Heading>Official</Heading>
        <div className="mt-10 flex flex-row rounded-sm border border-divider hover:bg-divider cursor-pointer" onClick={goToQuizify}>
            <div className="rounded-sm py-3 px-5 w-50 h-50 text-white">
              <MdQuiz className="text-5xl mx-auto" />
            </div>
            <div className="self-center ml-3 space-y-2">
              <p className="text-white font-semibold">Quizify</p>
              <p className="text-gray-300">AI-generate quizzes using textbook data or using a topic.</p>
            </div>
        </div>
      </div>
      {/* <div className="pt-10">
        <Heading>Community</Heading>
      </div> */}
    </div>
  );
}

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
