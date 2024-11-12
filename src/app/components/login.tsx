import { Button, Paper, PinInput } from "@mantine/core";
import { IconLogin2 } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { useUser } from "../context/userContext";

export default function Login() {
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
        className="w-[420px] relative z-50 p-8 flex flex-col items-center gap-8"
      >
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" width={48} height={48} alt="1. FCN Logo" />
          <div className="flex items-center gap-8">
            <p className="text-4xl">
              CLUB<b>SEAT</b>
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <PinInput
            length={8}
            mask
            value={password}
            onChange={(e) => setPassword(e)}
          />
          <Button
            type="submit"
            leftSection={<IconLogin2 size={16} />}
            disabled={password.length < 1}
          >
            Einloggen
          </Button>
        </form>
      </Paper>
    </div>
  );
}
