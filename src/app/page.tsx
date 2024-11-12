"use client";
import Grid from "./components/grid";
import Header from "./components/header";
import Login from "./components/login";
import { useSeating } from "./context/seatingContext";
import { useUser } from "./context/userContext";

export default function Home() {
  const { selectedSeats } = useSeating();
  const { user } = useUser();

  if (!user) {
    return <Login />;
  }

  return (
    <div
      className={`min-w-screen min-h-screen flex justify-between bg-[length:300%_300%] bg-gradient-to-r from-[#b3193e] via-[#aa1124] via-30% to-[#220407] ${
        selectedSeats.length > 0 ? "bg-right" : "bg-left"
      } transition-all duration-300`}
    >
      <div className="w-full min-h-screen flex flex-col">
        <Header />
        <Grid />
      </div>
    </div>
  );
}
