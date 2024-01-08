// pages/index.tsx

import React, { useEffect, useState } from "react";
import TextbookCard from "@/src/components/TextbookCard";

export interface Textbook {
  id: number;
  image_url: string;
  title: string;
  isbn: string;
}

// const IndexPage: React.FC = () => {
//   const [textbooks, setTextbooks] = useState<Textbook[]>([]);

//   useEffect(() => {
//     fetch("/api/textbooks")
//       .then((response) => response.json())
//       .then((data: Textbook[]) => setTextbooks(data))
//       .catch((error) => console.error("Fetching textbooks failed:", error));
//   }, []);
const IndexPage: React.FC = () => {
  // Mock data for testing
  const mockTextbooks: Textbook[] = [
    {
      id: 1,
      image_url: "/images/opsys.png",
      title: "Operating System Concepts",
      isbn: "123-4567890123",
    },
  ];

  const handleSelectBook = (book: Textbook) => {};

  return (
    <div className="">
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
  );
};

export default IndexPage;
