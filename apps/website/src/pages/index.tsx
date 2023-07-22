import HomeScreen from "@/screens/HomeScreen";

export default function Home() {
  return (
    <main className="container grid place-items-center h-screen">
      <div className="border p-4 rounded-md w-full md:w-[80%] lg:w-1/2">
        <h1 className="font-bold text-2xl capitalize text-center">quicker</h1>
        <HomeScreen />
      </div>
    </main>
  );
}
