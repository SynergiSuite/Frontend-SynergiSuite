import Image from "next/image";
import Logo from "@/assets/Logo.png";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export default function BrandLogo({
  className = "",
  imageClassName = "",
  priority = false,
}: BrandLogoProps) {
  return (
    <span
      role="img"
      aria-label="SynergiSuite"
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
    >
      <Image
        src={Logo}
        alt=""
        priority={priority}
        className={`h-full w-auto object-contain ${imageClassName}`}
      />
    </span>
  );
}
