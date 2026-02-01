import NavBar from "@/components/NavBar";

export default function Dashboard() {
  return (
    <section className="flex flex-col items-center">
      <NavBar title="Dashboard" />
      <section className=" w-[47%] border h-[120vh]"></section>
    </section>
  );
}
