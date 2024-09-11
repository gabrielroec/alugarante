import Hero from "@/components/Hero";
import Second from "@/components/Second";
import Third from "@/components/Third";
import Table from "@/assets/Table";
import TableMobile from "@/assets/TableMobile";
import Fourth from "@/components/Fourth";
import LandingPageHeader from "@/components/LandingPageHeader";

export default function Home() {
  return (
    <>
      <LandingPageHeader />
      <Hero />
      <Second />
      <Third />
      <Table className="container relative -top-40 max-lg:hidden" />
      <TableMobile className="container w-full relative -top-60 hidden max-lg:block" />
      <Fourth />
    </>
  );
}
