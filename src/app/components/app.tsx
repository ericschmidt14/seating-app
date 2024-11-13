import { useSession } from "next-auth/react";
import { useSeating } from "../context/seatingContext";
import Grid from "./grid";
import Header from "./header";
import Login from "./login";

export default function App() {
  const { data: session, status } = useSession();
  const { selectedSeats } = useSeating();

  if (status === "loading") {
    return <></>;
  }

  if (!session) {
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
