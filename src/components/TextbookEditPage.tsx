import React, { useState, useCallback, useMemo, useEffect } from "react";
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
import { Chapter } from "@/lib/api/chapters/routes";

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
  const [image_file, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [numPages, setNumPages] = useState<number>(0);
  const [current_page, setCurrentPage] = useState<number>(0);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [pdfData, setPdfData] = useState<{ data: Uint8Array } | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [chapters, setChapters] = useState<
    Array<Chapter>
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);

    if (selectedFile) {
      selectedFile.arrayBuffer().then((data) => {
        setPdfData({ data: new Uint8Array(data) });
      });
    }
  };

  const handleImageFileSelect = (selectedImageFile: File) => {
    setImageFile(selectedImageFile);

    if (selectedImageFile) {
      // Generate and set image preview URL only if a file is selected
      const fileUrl = URL.createObjectURL(selectedImageFile);
      setImagePreviewUrl(fileUrl);
    } else {
      // If no file is selected (e.g., upload is cancelled), clear the preview
      setImagePreviewUrl(null);
    }
  };

  const onDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void => {
    setNumPages(nextNumPages);
  };

  const handleAddChapterClick = () => {
    if (chapters.length < 10) {
      setChapters([...chapters, { chapter_title: "", start_page: 0, end_page: 0 }]);
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

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const handleCreateTextbook = async () => {
    const formData = new FormData();
    formData.append("file", file as Blob);
    formData.append("title", title);
    formData.append("nickname", nickname);
    formData.append("image_file", image_file as Blob);

    // Try textbook creation
    try {
      setLoading(true);
      await fetch("/api/textbooks/create", {
        method: "POST",
        body: formData,
      }).then(async (res) => {
        let js = await res.json();
        await fetch("/api/chapters/create", {
          method: "POST",
          body: JSON.stringify({
            textbook_id: js.response.textbook_id,
            chapters: chapters,
          }),
        }).then((res) => {
          setLoading(false);
          router.push("/dashboard/quiz/textbooks");
        })
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row text-white mx-8 space-x-8">
          <div className="flex flex-col w-full">
            <div className="flex items-center space-x-8">
              <FaChevronLeft className="text-white text-sm cursor-pointer" onClick={()=>router.back()} />
              <h1 className="text-lg font-semibold">Edit</h1>
            </div>
            <div className="text-white text-sm mt-10 mb-5">
              Upload a textbook cover image (.png, .jpg, .jpeg)
            </div>
            {imagePreviewUrl && (
              <div className="mt-4">
                <img
                  src={imagePreviewUrl}
                  alt="Image Preview"
                  className="max-w-xs max-h-36 mb-10 border border-divider rounded-sm py-2 px-2"
                />
              </div>
            )}
            <OutlineInputFile onFileSelect={handleImageFileSelect} />
            <div className="text-white text-sm mt-10 mb-5">
              Upload a textbook file (.pdf, .docx, doc)
            </div>
            <OutlineInputFile onFileSelect={handleFileSelect} />
            {/* <OutlineButton className="text-white text-sm ">Upload</OutlineButton> */}
            <div className="text-white text-sm mt-10 mb-5">Textbook Name</div>
            <OutlineInput
              placeholder="ex: textbook"
              value={title}
              onChange={handleTitleChange}
            />

            <div className="text-white text-sm mt-10 mb-5">
              Textbook Nickname
            </div>
            <OutlineInput
              placeholder="ex: science book"
              value={nickname}
              onChange={handleNicknameChange}
            />
            <div className="text-white text-sm mt-10 mb-5">
              Chapters (maximum of 10)
            </div>
            {chapters.length < 10 ? (
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
                      value={chapter.chapter_title}
                      className="text-white text-sm"
                      onChange={(e: any) =>
                        handleChapterChange(index, "chapter_title", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <p className="text-sm mb-3">Chapter Start Page</p>
                    <OutlineInput
                      placeholder="Enter start page"
                      value={chapter.start_page}
                      className="text-white text-sm"
                      onChange={(e: any) =>
                        handleChapterChange(index, "start_page", e.target.value)
                      }
                    ></OutlineInput>
                  </div>
                  <div>
                    <p className="text-sm mb-3">Chapter End Page</p>
                    <OutlineInput
                      placeholder="Enter end page"
                      value={chapter.end_page}
                      className="text-white text-sm"
                      onChange={(e: any) =>
                        handleChapterChange(index, "end_page", e.target.value)
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
          loading={loading}
        >
          Update textbook
        </GradientButton>
      </div>
    </>
  );
}

CreateTextbook.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
