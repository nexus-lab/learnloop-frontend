import HeadElements from "@/src/components/misc/HeadElements";
import Layout from "@/src/layouts/dashboard/layout";
import dynamic from "next/dynamic";

/**
 * Critical: prevents "TypeError: url.replace is not a function" error
 */
const TPage = dynamic(() => import("@/src/components/TextbookCreatePage"), {
  ssr: false,
});

export default function Page() {
  return (
    <>
      <HeadElements title="Create a Textbook" />
      <TPage />
    </>
  );
}

Page.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
