import { useSession } from "@/src/contexts/SessionContext";
import Layout from "@/src/layouts/dashboard/layout";

export default function Dashboard() {
  const { session } = useSession();
  return <h1>hi</h1>;
}

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
