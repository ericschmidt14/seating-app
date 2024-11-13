import { Button, Paper, PasswordInput } from "@mantine/core";
import { IconLock, IconLogin2 } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { useUser } from "../context/userContext";
import { cn } from "../utils";
import DotPattern from "./dots";
import Logo from "./logo";

export default function Login({ azure }: { azure?: boolean }) {
  const { handleLogin } = useUser();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        password,
      }),
    });

    if (response.status === 200) {
      const data = await response.text();
      handleLogin(data);
    } else {
      setError("Passwort falsch.");
    }
  };

  return (
    <div className="min-w-screen min-h-screen flex justify-center items-center bg-[length:300%_300%] bg-gradient-to-r from-[#b3193e] via-[#aa1124] via-30% to-[#220407] bg-right">
      <Paper
        radius="md"
        shadow="xl"
        bg="rgba(0,0,0,0.6)"
        className="w-[420px] relative z-50 p-8 flex flex-col items-center gap-8 backdrop-blur-md shadow-2xl shadow-black"
      >
        <Logo />
        {azure ? (
          <Button
            onClick={() => signIn("azure-ad")}
            leftSection={<IconLogin2 size={16} />}
            className="w-full"
          >
            Anmelden
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
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
