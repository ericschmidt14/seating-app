import { Button, Paper, PasswordInput } from "@mantine/core";
import { IconBrandWindows, IconLock, IconLogin2 } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "../utils";
import DotPattern from "./dots";
import Logo from "./logo";

export default function Login({ azure }: { azure?: boolean }) {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const errorFromQuery = searchParams.get("error");
    if (errorFromQuery === "CredentialsSignin") {
      setError("Passwort falsch. Bitte erneut versuchen.");
    } else if (errorFromQuery) {
      setError(
        "Ein unbekannter Fehler ist aufgetreten. Bitte erneut versuchen."
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const result = await signIn("credentials", { redirect: false, password });

    if (result?.error) {
      setError("Passwort falsch. Bitte erneut versuchen.");
    }
  };

  return (
    <div className="min-w-screen min-h-screen flex justify-center items-center bg-[length:300%_300%] bg-gradient-to-r from-[#b3193e] via-[#aa1124] via-30% to-[#220407] bg-right">
      <Paper
        radius="md"
        shadow="xl"
        bg="rgba(0,0,0,0.6)"
        className="w-[420px] relative z-50 p-8 flex flex-col items-center gap-8 backdrop-blur-md shadow-2xl shadow-black/60"
      >
        <Logo />
        {!azure && (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
            <PasswordInput
              size="lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftSectionPointerEvents="none"
              leftSection={<IconLock size={16} />}
              error={error}
            />
            <Button type="submit" leftSection={<IconLogin2 size={16} />}>
              Anmelden
            </Button>
          </form>
        )}
        <Button
          color={azure ? "red" : "dark"}
          onClick={() => signIn("azure-ad")}
          leftSection={<IconBrandWindows size={16} />}
          className="w-full"
        >
          Mit Azure Account anmelden
        </Button>
        <a href="https://como-solution.de" target="_blank">
          <p className="text-xs flex items-center gap-1 opacity-50">
            Ein Produkt der
            <Image src="/como.svg" width={20} height={20} alt="CoMo Logo" />
            CoMo Solution GmbH
          </p>
        </a>
      </Paper>
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(640px_circle_at_center,white,transparent)]"
        )}
      />
    </div>
  );
}
