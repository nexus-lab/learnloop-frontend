import { Heading } from "@/components/Heading";
import { Spacer } from "@/components/Spacer";
import Layout from "@/layouts/landing/layout";
import Image from "next/image";

export default function Login() {
  return (
    <Layout>
      <div className="mt-20">
        <Image src="/real.svg" width={200} height={200} alt="Learnloop" />
        <Spacer />
        <Heading>
            Login
        </Heading>
      </div>
    </Layout>
  );
}
