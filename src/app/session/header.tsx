import React from "react";
import Logo from "@/assets/logo_without_bg.svg"

export default function Header(){
    return(
        <div className="flex justify-center items-center">
            <Logo width={250} height={250} />
        </div>
    )
}