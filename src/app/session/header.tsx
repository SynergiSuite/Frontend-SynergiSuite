import React from "react";
import Image from "next/image";
import Logo from "@/assets/Logo.png";

export default function Header() {
  return (
    <>
      <div className="flex justify-center items-center">
        <Image
          src={Logo}
          alt="SynergiSuite"
          width={150}
          height={150}
          className="h-auto w-[150px] object-contain"
          priority
        />
      </div>
    </>
  );
}
