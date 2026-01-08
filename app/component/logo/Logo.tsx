import Image from "next/image";

interface LogoProps {
    width?: number;
    height?: number;
    text?: string;
    size?: "md" | "xl";
};



export default function Logo({
    width = 100, 
    height= 100,
    text = "",
    size = "md"
}: LogoProps) {

    const textSize = {
        md: "text-lg",
        xl: "text-2xl"
    }

  return (
    <div className="flex items-center">
      <Image
        src="/logo.png"
        alt="Ahmadiyyah Digital Records Management System (ADRMS)"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
      {/* Render text only if it exists */}
      {
        text && <h2 className={`font-semibold ${textSize[size]}`}>{text}</h2>
      }
    </div>
  )
}
