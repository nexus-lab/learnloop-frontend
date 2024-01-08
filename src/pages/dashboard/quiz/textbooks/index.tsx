import Layout from "@/src/layouts/dashboard/layout";
import { useSession } from "@/src/contexts/SessionContext";
import { GradientButton } from "@/src/components/GradientButton";
import { Heading } from "@/src/components/Heading";
import { Input } from "@/src/components/ui/input";
import { FaSearch } from "react-icons/fa";
import HeadElements from "@/src/components/misc/HeadElements";
import { useRouter } from "next/router";
import TextbookCard from "@/src/components/TextbookCard";

export interface Textbook {
  id: number;
  image_url: string;
  title: string;
  isbn: string;
}
const mockTextbooks: Textbook[] = [
  {
    id: 1,
    image_url: "/images/opsys.png",
    title: "Operating System Concepts",
    isbn: "123-4567890123",
  },
];
const handleSelectBook = (book: Textbook) => {};
export default function Textbooks() {
  const router = useRouter();
  return (
    <>
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
      <div className="mt-10 mx-8 flex items-center border-divider border-2 bg-transparent rounded-sm">
        <FaSearch className="text-white mx-2" />
        <input
          className="w-full pl-2 py-2 text-white bg-transparent outline-none"
          placeholder="Search for a textbook..."
          type="text"
        />
      </div>
      <div className=" mt-10 mx-8">
        {mockTextbooks.map((book) => (
          <TextbookCard
            key={book.id}
            image_url={book.image_url}
            title={book.title}
            isbn={book.isbn}
            onSelect={() => handleSelectBook(book)}
          />
        ))}
      </div>
    </>
  );
}

Textbooks.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
