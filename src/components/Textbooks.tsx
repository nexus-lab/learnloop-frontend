import Image from "next/image";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Spinner } from "./Spinner";

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
  onSelectTextbook: (textbook: Textbook | undefined) => void;
  onSelectChapter: (chapter: Chapter | undefined) => void; // New prop for selecting a chapter
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

export const Textbooks = ({
  search_query,
  onSelectTextbook,
  onSelectChapter,
}: TextbooksProps) => {
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [selectedTextbook, setSelectedTextbook] = useState<Textbook>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter>();

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

  const handleSelectTextbook = (textbook: Textbook) => {
    setSelectedTextbook(textbook);
    onSelectTextbook(textbook); // Notify the parent component
    setSelectedChapter(undefined); // Reset selected chapter when textbook changes
    setChapters([]); // Clear chapters when a new textbook is selected
    setLoadingChapters(false); // Reset loading state
    loadChapters(textbook.textbook_id, 0, 10); // Start loading chapters for the new textbook
  };

  const handleSelectChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    onSelectChapter(chapter); // Notify the parent component
  };

  const loadChapters = async (
    textbookId: number,
    skip: number,
    limit: number
  ) => {
    setLoadingChapters(true);
    const resp = await getChapters(textbookId, skip, limit);
    if (!resp.error) {
      setChapters((prevChapters) => [...prevChapters, ...resp]);
      if (resp.length === limit) {
        loadChapters(textbookId, skip + limit, limit); // Load more chapters if available
      }
    }
    setLoadingChapters(false);
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
                <p className="font-bold text-xl">{textbook.title}</p>
                <p className="text-sm ml-4">{`(${textbook.nickname})`}</p>
              </div>

              <button
                className={`border-[1px] border-mainblue rounded-sm px-4 py-2 self-start ${
                  selectedTextbook?.textbook_id === textbook.textbook_id
                    ? "bg-mainblue/20 text-white" // Change background and text color when selected
                    : "bg-transparent"
                }`}
                onClick={() => handleSelectTextbook(textbook)}
              >
                {selectedTextbook?.textbook_id === textbook.textbook_id
                  ? "Selected" // Change button text to "Selected"
                  : "Select"}
              </button>
            </div>
          </div>
          {selectedTextbook?.textbook_id == textbook.textbook_id && (
            <div>
              <h2 className="font-bold">Chapters ({chapters.length})</h2>
              {loadingChapters ? (
                <Spinner />
              ) : (
                chapters.map((chapter) => (
                  <div key={chapter.chapter_id} className="flex flex-row my-2 justify-between">
                    <div className="flex flex-col"> 
                        <p className="font-bold">{chapter.chapter_title}</p>
                        <p className="text-sm">{`Pages ${chapter.start_page} - ${chapter.end_page}`}</p>
                    </div>
                    <button
                      className={`border-[1px] border-mainblue rounded-sm px-4 py-2 self-start ${
                        selectedChapter?.chapter_id === chapter.chapter_id
                          ? "bg-mainblue/20 text-white" // Change background and text color when selected
                          : "bg-transparent"
                      }`}
                      onClick={() => handleSelectChapter(chapter)}
                    >
                      {selectedChapter?.chapter_id === chapter.chapter_id
                        ? "Selected" // Change button text to "Selected"
                        : "Select"}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}
      {/* Pagination and Limit Controls */}
      <div className="flex justify-between items-center my-4">
        <button
          onClick={handlePreviousPage}
          className="border border-divider rounded-sm px-4 py-2 flex items-center"
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
            className="bg-transparent border-[1px] border-divider"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>

        <button
          onClick={handleNextPage}
          className="border border-divider rounded-sm px-4 py-2 flex items-center"
        >
          Next
        </button>
      </div>
    </>
  );
};
