import React, { useState } from "react";
import Layout from "@/src/layouts/dashboard/layout";
import { Heading } from "@/src/components/Heading";
import { useRouter } from "next/router";
import { GradientButton } from "@/src/components/GradientButton";
import { OutlineButton } from "@/src/components/OutlineButton";
import { OutlineInput } from "@/src/components/OutlineInput";

export default function CreateTextbook() {
  const router = useRouter();
  const [showChapterInputs, setShowChapterInputs] = useState(false);

  const handleAddChapterClick = () => {
    setShowChapterInputs(!showChapterInputs);
  };
  return (
    <>
      <div className="flex text-white">
        <div className="flex flex-col mx-8 ">
          <div className="flex items-center space-x-8 ">
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
          <div className="text-white text-sm mt-10 mb-5">
            Upload a textbook file (.pdf, .docx, doc)
          </div>
          <OutlineButton className="text-white text-sm ">Upload</OutlineButton>
          <div className="text-white text-sm mt-10 mb-5">Textbook Name</div>
          <OutlineInput placeholder=" ex: textbook"></OutlineInput>
          <div className="text-white text-sm mt-10 mb-5">Chapters</div>
          <OutlineButton
            onClick={handleAddChapterClick}
            className="text-sm text-blue-900"
          >
            Add Chapter
          </OutlineButton>

          {showChapterInputs && (
            <div>
              <div className="text-white text-sm mt-10 mb-5">Chapter Name</div>
              <OutlineInput placeholder="Enter chapter name"></OutlineInput>
              <div className="text-white text-sm mt-10 mb-5">Start Page</div>
              <OutlineInput placeholder="Enter start page"></OutlineInput>
              <div className="text-white text-sm mt-10 mb-5">End Page</div>
              <OutlineInput placeholder="Enter end page"></OutlineInput>
            </div>
          )}
        </div>

        <div className="flex flex-col ml-20 mr-20 w-full">
          <div className="flex justify-between items-center mt-10 mb-2">
            <div className="text-white text-sm ">Preview</div>

            <div className="flex items-center">
              <div className="text-white text-sm mr-2">Page</div>
              <OutlineInput
                height="h-8"
                width="w-20"
                align="text-center"
                placeholder="ex: 1"
              ></OutlineInput>
            </div>
          </div>

          <div className="bg-transparent border-[1px] border-divider h-full rounded-sm"></div>
        </div>
      </div>
      <GradientButton
        onClick={() => {
          router.push("./textbooks/create");
        }}
        className="text-sm px-8 py-2 mt-10 ml-8 mr-20"
        size="sm"
      >
        Create a new textbook
      </GradientButton>
    </>
  );
}

CreateTextbook.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
