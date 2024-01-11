import Image from "next/image";
import { useEffect, useState } from "react";
import { Spinner } from "./Spinner";
import useViewTransitionRouter from "../hooks/useViewTransitionRouter";

export interface Textbook {
  cognito_user_id: string;
  title: string;
  file_path: string;
  nickname: string;
  textbook_id: number;
  image_url: string;
}

export interface Chapter {
  chapter_id: number;
  textbook_id: number;
  chapter_title: string;
  start_page: number;
  end_page: number;
  content_url: string;
}

interface TextbooksProps {
  search_query: string;
}

const getTextbooks = async (skip: number, limit: number, query: string) => {
  const response = await fetch(
    `/api/textbooks/getAll?skip=${skip}&limit=${limit}&query=${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const resp = await response.json();
  return resp;
};

const getChapters = async (
  textbook_id: number,
  skip: number,
  limit: number
) => {
  const response = await fetch(
    `/api/chapters/getAll?textbook_id=${textbook_id}&skip=${skip}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const resp = await response.json();
  return resp;
};

export const TextbooksList = ({ search_query }: TextbooksProps) => {
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [selectedTextbook, setSelectedTextbook] = useState<Textbook>();
  const router = useViewTransitionRouter();

  useEffect(() => {
    getTextbooks(skip, limit, search_query).then((resp) => {
      if (!resp.error) {
        setTextbooks(resp);
      }
    });
  }, [limit, skip, search_query]);

  useEffect(() => {
    if (search_query) {
      getTextbooks(skip, limit, search_query).then((resp) => {
        if (!resp.error) {
          setTextbooks(resp);
        }
      });
    }
  }, [search_query, limit, skip]);

  const handlePreviousPage = () => {
    if (skip - limit >= 0) {
      setSkip(skip - limit);
    }
  };

  const handleNextPage = () => {
    setSkip(skip + limit);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setSkip(0); // Reset skip to 0 when limit changes
  };

  const handleEditTextbook = async (textbook: Textbook) => {
    router.push(`/dashboard/quiz/textbooks/${textbook.textbook_id}`);
  };

  return (
    <>
      {textbooks.map((textbook) => (
        <div key={textbook.textbook_id}>
          <div
            key={textbook.textbook_id}
            className="flex flex-row items-start my-8"
          >
            <Image
              src={textbook.image_url}
              className="border border-divider rounded-sm py-3"
              alt={textbook.title}
              height={80}
              width={120}
            />

            <div className="flex flex-col justify-between ml-4 h-[8.2rem]">
              <div className="flex flex-row items-center">
                <p className="font-bold text-xl text-white">{textbook.title}</p>
                <p className="text-sm ml-4 text-white">{`(${textbook.nickname})`}</p>
              </div>

              <button
                className={`border-[1px] border-divider rounded-sm px-10 py-1 self-start text-white`}
                onClick={() => handleEditTextbook(textbook)}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      ))}
      {/* Pagination and Limit Controls */}
      <div className="flex justify-between items-center my-4">
        <button
          onClick={handlePreviousPage}
          className="border border-divider rounded-sm px-4 py-2 flex items-center text-white"
          disabled={skip === 0}
        >
          Prev
        </button>

        <div>
          {/* Custom select for changing limit */}
          {/* Your custom select component here */}
          {/* Example: */}
          <select
            value={limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="bg-transparent border-[1px] border-divider text-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>

        <button
          onClick={handleNextPage}
          className="border border-divider rounded-sm px-4 py-2 flex items-center text-white"
        >
          Next
        </button>
      </div>
    </>
  );
};
