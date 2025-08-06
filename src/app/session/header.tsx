import React from "react";
import Logo from "@/assets/logo_without_bg.svg";
import Image from "next/image";

export default function Header() {
  return (
    <>
      <div className="flex justify-center items-center">
        <Image src={Logo} alt="Logo" width={250} height={250} />
        {/* <Logo width={250} height={250} /> */}
      </div>
    </>
  );
}
