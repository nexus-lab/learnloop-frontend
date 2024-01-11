import Layout from "@/src/layouts/dashboard/layout";
import { GradientButton } from "@/src/components/GradientButton";
import { FaSearch } from "react-icons/fa";
import HeadElements from "@/src/components/misc/HeadElements";
import { useRouter } from "next/router";
import { Textbooks } from "@/src/components/Textbooks";
import { useState } from "react";
import useViewTransitionRouter from "@/src/hooks/useViewTransitionRouter";
import { TextbooksList } from "@/src/components/TextbooksList";

export default function TextbooksPage() {
  const router = useViewTransitionRouter();
  const [search, setSearch] = useState("");

  return (
    <>
      <HeadElements title="Textbooks" />
      <div className="flex items-center space-x-8 mx-8 text-white">
        <h1 className="text-lg font-semibold">Textbooks</h1>
        <GradientButton
          onClick={() => {
            router.push("./textbooks/create");
          }}
          className="text-sm px-8 py-2"
          size="sm"
        >
          Create a new textbook
        </GradientButton>
      </div>
      <div className="mt-10 mx-8 bg-transparent rounded-sm">
        <div className="flex items-center border-divider border-[1px] bg-transparent rounded-sm">
          <FaSearch className="text-white mx-2" />
          <input
            className="w-full pl-2 py-2.5 text-white text-sm bg-transparent outline-none"
            placeholder="Search for a textbook..."
            type="text"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <TextbooksList search_query={search} />
      </div>
    </>
  );
}

TextbooksPage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
