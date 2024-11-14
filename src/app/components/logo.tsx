import Image from "next/image";

export default function Logo({ transparent }: { transparent?: boolean }) {
  return (
    <div className="flex items-center gap-2 cursor-default">
      <Image
        src={transparent ? "/logo_transparent.svg" : "/logo.svg"}
        width={48}
        height={48}
        alt="1. FCN Logo"
      />
      <div className="flex items-center gap-8">
        <p className="text-4xl">
          <b>Club</b>
          <i>Seating</i>
        </p>
      </div>
    </div>
  );
}
