import Layout from "@/src/layouts/dashboard/layout";
import { FaSearch } from "react-icons/fa";

export default function Quizzes() {
  return (
    <Layout>
      <div className="text-white mr-20 ml-8">
        <h1 className="text-lg font-semibold">Quizzes</h1>
        <div className="mt-10  flex items-center border-divider border-2 bg-transparent rounded-sm">
          <FaSearch className="text-white mx-2" />
          <input
            className="w-full pl-2 py-2 text-white bg-transparent outline-none"
            placeholder="Search for a Quiz..."
            type="text"
          />
        </div>
      </div>
    </Layout>
  );
}
