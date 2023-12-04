import { useSession } from "@/src/contexts/SessionContext";
import Layout from "@/src/layouts/dashboard/layout";
import { GradientButton } from "@/src/components/GradientButton";
import { Heading } from "@/src/components/Heading";
import { Input } from '@/src/components/ui/input';

export default function Dashboard() {
  const { session } = useSession();
  return (
      <div className='p-8'>
          <div className="flex items-center space-x-8">
              <Heading>Explore</Heading>
              <GradientButton
                  type="submit"
                  className="text-sm px-7 py-2"
                  size="sm"
              >
                  Create a tool
              </GradientButton>

          </div>
          <div className='pt-10 pr-20'>
              <Input
                  className="pl-10 text-white border-white bg-black rounded-sm"
                  placeholder="Search for a tool..."
                  type="text"
              />


          </div>
          <div className='pt-10'>
              <Heading>Official</Heading>
          </div>
          <div>

          </div>
          <div className='pt-10'>
              <Heading>Community</Heading>
          </div>

      </div>

  );
}


Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
