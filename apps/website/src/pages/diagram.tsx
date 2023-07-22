import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useDatabase } from "@/lib/context";
import DiagramScreen, { DatabaseStructure } from "@/screens/DiagramScreen";
import { AlertCircleIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function Diagram() {
  const { database } = useDatabase();
  const router = useRouter();
  const [err, setErr] = useState("");
  const [structure, setStructure] = useState<DatabaseStructure[]>([]);

  const fetchStructure = useCallback(
    async (signal: AbortSignal) => {
      // eslint-disable-next-line
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(database),
        signal,
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message);
          }
          return data;
        })
        .then((res) => {
          if (!Array.isArray(res.structure))
            throw new Error("Invalid response");
          setStructure(res.structure);
        })
        .catch((err) => {
          setErr(String(err));
        });
    },
    [database]
  );

  useEffect(() => {
    if (!database.type || !database.url) {
      return void router.replace("/");
    }

    const controller = new AbortController();

    fetchStructure(controller.signal);

    return () => {
      controller.abort();
    };
  }, [database, router, fetchStructure]);

  if (err)
    return (
      <main className="container grid place-items-center h-screen">
        <div className="border p-4 rounded-md w-full md:w-[80%] lg:w-1/2">
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{err}</AlertDescription>
          </Alert>
          <Button onClick={() => router.replace("/")}>Back</Button>
        </div>
      </main>
    );

  if (!structure.length)
    return (
      <main className="container grid place-items-center h-screen">
        <div className="border p-4 rounded-md w-full md:w-[80%] lg:w-1/2">
          <p className="text-center">Loading...</p>
          <Button onClick={() => router.replace("/")}>Back</Button>
        </div>
      </main>
    );

  return <DiagramScreen structure={structure} />;
}
