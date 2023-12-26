import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { OutlineInputFile } from "@/src/components/OutlineInputFile";
import { OutlineInput } from "@/src/components/OutlineInput";
import { GradientButton } from "@/src/components/GradientButton";
import { OutlineButton } from "@/src/components/OutlineButton";
import { pdfjs, Document, Page } from "react-pdf";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { FaChevronLeft, FaChevronRight, FaTrash } from "react-icons/fa";

import type { PDFDocumentProxy } from "pdfjs-dist";
import Layout from "../layouts/dashboard/layout";
import { set } from "react-hook-form";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const resizeObserverOptions = {};
const maxWidth = 800;

export default function CreateTextbook() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [current_page, setCurrentPage] = useState<number>(0);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [pdfData, setPdfData] = useState<{ data: Uint8Array } | null>(null);
  const [numberOfChapters, setNumberOfChapters] = useState<number>(0);
  const [chapters, setChapters] = useState<
    Array<{ name: string; startPage: number; endPage: number }>
  >([]);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  const handleFileSelect = (file: File) => {
    setFile(file);

    if (file)
      file.arrayBuffer().then((data) => {
        setPdfData({ data: new Uint8Array(data) });
      });
  };

  const onDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void => {
    setNumPages(nextNumPages);
  };

  const handleAddChapterClick = () => {
    if (chapters.length < 10) {
      setChapters([...chapters, { name: "", startPage: 0, endPage: 0 }]);
    }
  };

  const handleDeleteChapter = (index: number) => {
    setChapters(chapters.filter((_, chapIndex) => chapIndex !== index));
  };

  const handleChapterChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedChapters = [...chapters];
    updatedChapters[index] = { ...updatedChapters[index], [field]: value };
    setChapters(updatedChapters);
  };

  const goForwardOnePage = () => {
    if (current_page < numPages - 1) {
      setCurrentPage(current_page + 1);
    }
  };

  const goBackOnePage = () => {
    if (current_page > 0) {
      setCurrentPage(current_page - 1);
    }
  };

  const handleCreateTextbook = async () => {
    const formData = new FormData();
    formData.append("file", file as Blob);
    formData.append("title", "textbook");
    formData.append("nickname", "textbook");
    formData.append("image_file", file as Blob);

    const response = await fetch("/api/textbooks/create", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    console.log(response)
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row text-white mx-8 space-x-8">
          <div className="flex flex-col w-full">
            <div className="flex items-center space-x-8">
              <h1 className="text-lg font-semibold">Textbooks</h1>

              {/* <GradientButton
                onClick={() => {
                  router.push("./textbooks/create");
                }}
                className="text-sm px-8 py-2"
                size="sm"
              >
                Create a new textbook
              </GradientButton> */}
            </div>
            <div className="text-white text-sm mt-10 mb-5">
              Upload a textbook file (.pdf, .docx, doc)
            </div>
            <OutlineInputFile
              onFileSelect={handleFileSelect}
            ></OutlineInputFile>
            {/* <OutlineButton className="text-white text-sm ">Upload</OutlineButton> */}
            <div className="text-white text-sm mt-10 mb-5">Textbook Name</div>
            <OutlineInput placeholder="ex: textbook"></OutlineInput>
            <div className="text-white text-sm mt-10 mb-5">
              Textbook Nickname
            </div>
            <OutlineInput placeholder="ex: science book"></OutlineInput>
            <div className="text-white text-sm mt-10 mb-5">
              Chapters (maximum of 10)
            </div>
            {numberOfChapters < 10 ? (
              <OutlineButton
                onClick={handleAddChapterClick}
                className="text-sm font-normal text-white"
              >
                Add Chapter
              </OutlineButton>
            ) : (
              <></>
            )}

            {chapters.map((chapter, index) => (
              <div key={index}>
                <div className="flex flex-row mt-10">
                  <p className="font-bold">Chapter {index + 1}</p>
                  <FaTrash
                    className="text-red-500 ml-auto cursor-pointer self-center"
                    onClick={() => handleDeleteChapter(index)}
                  />
                </div>
                <div className="space-y-5 mt-6">
                  <div>
                    <p className="text-sm mb-3">Chapter Name</p>
                    <OutlineInput
                      placeholder="Enter chapter name"
                      value={chapter.name}
                      className="text-white text-sm"
                      onChange={(e: any) =>
                        handleChapterChange(index, "name", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <p className="text-sm mb-3">Chapter Start Page</p>
                    <OutlineInput
                      placeholder="Enter start page"
                      value={chapter.startPage}
                      className="text-white text-sm"
                      onChange={(e: any) =>
                        handleChapterChange(index, "startPage", e.target.value)
                      }
                    ></OutlineInput>
                  </div>
                  <div>
                    <p className="text-sm mb-3">Chapter End Page</p>
                    <OutlineInput
                      placeholder="Enter end page"
                      value={chapter.startPage}
                      className="text-white text-sm"
                      onChange={(e: any) =>
                        handleChapterChange(index, "endPage", e.target.value)
                      }
                    ></OutlineInput>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mt-10 mb-2">
              <div className="text-white text-sm ">Preview</div>

              <div className="flex items-center">
                <div className="text-white text-sm mr-2">
                  Page {current_page + 1} out of {numPages}
                </div>
                <FaChevronLeft
                  className="text-white mx-2 cursor-pointer self-center"
                  onClick={goBackOnePage}
                />
                <OutlineInput
                  height="h-8"
                  width="w-20"
                  align="text-center"
                  placeholder="ex: 1"
                  value={current_page + 1}
                  onChange={(e: any) => {
                    // only change page if the input is a number and is within the range of the pdf
                    if (
                      e.target.value.match(/^[0-9]+$/) &&
                      parseInt(e.target.value) <= numPages
                    ) {
                      setCurrentPage(parseInt(e.target.value) - 1);
                    }
                  }}
                ></OutlineInput>
                <FaChevronRight
                  className="text-white mx-2 cursor-pointer self-center"
                  onClick={goForwardOnePage}
                />
              </div>
            </div>

            <div
              className="bg-transparent border-[1px] border-divider h-full rounded-sm"
              ref={setContainerRef}
            >
              {pdfData && (
                <Document
                  file={pdfData}
                  onLoadSuccess={onDocumentLoadSuccess}
                  options={options}
                >
                  <Page
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    onRenderError={(error) => {
                      console.error(error);
                    }}
                    key={`page_${current_page + 1}`}
                    pageNumber={current_page + 1}
                    width={
                      containerWidth
                        ? Math.min(containerWidth, maxWidth)
                        : maxWidth
                    }
                  />
                </Document>
              )}
            </div>
          </div>
        </div>
        <GradientButton
          onClick={handleCreateTextbook}
          className="text-sm px-8 py-4 mt-10 mx-8 mb-8"
        >
          Create a new textbook
        </GradientButton>
      </div>
    </>
  );
}

CreateTextbook.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
