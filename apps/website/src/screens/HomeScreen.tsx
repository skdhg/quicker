import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { SiMongodb } from "react-icons/si";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { useDatabase } from "@/lib/context";
import { useRouter } from "next/router";

export default function HomeScreen() {
  const [config, setConfig] = useState({
    url: "",
    type: "",
  });
  const [err, setErr] = useState("");
  const { setDatabase } = useDatabase();
  const router = useRouter();

  const submit = () => {
    if (!config.type) return setErr("Database type is required!");
    if (!config.url) return setErr("Database url is required!");
    setErr("");
    setDatabase(config);
    router.replace("/diagram");
  };

  return (
    <div className="space-y-5">
      {err && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{err}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col gap-2">
        <Label>Database Type</Label>
        <Select
          autoComplete="off"
          onValueChange={(value) =>
            setConfig((p) => ({
              ...p,
              type: value,
            }))
          }
        >
          <SelectTrigger className="w-[230px]">
            <SelectValue
              placeholder="Select your database"
              className="select-none"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Database</SelectLabel>
              <SelectItem value="mongodb">
                <span className="flex items-center">
                  <SiMongodb className="text-teal-500 h-5 w-5" />
                  Mongodb
                </span>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="db">Database URL</Label>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Enter your database url"
            required
            id="db"
            autoComplete="off"
            spellCheck={false}
            value={config.url}
            onChange={(e) => {
              setConfig((p) => ({ ...p, url: e.target.value }));
            }}
          />
          <Button onClick={submit}>Generate</Button>
        </div>
      </div>
    </div>
  );
}
