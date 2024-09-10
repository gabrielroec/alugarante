import Hero from "@/components/Hero";
import Second from "@/components/Second";
import Third from "@/components/Third";
import Table from "@/assets/Table";

export default function Home() {
  return (
    <>
      <Hero />
      <Second />
      <Third />
      <Table className="container relative -top-32" />
    </>
  );
}
