import React from "react";
import EmailLogo from "@/assets/email-icon.svg"
import PasswordLogo from "@/assets/password-icon.svg"
import { Button } from "@/global/buttons";

export default function Signup(){
    return(
        <>
        <form action="" method="post" className="py-4 mt-12 w-[90%] m-auto space-y-4">
            <div className="text-[#09090B]">
                <label htmlFor="name" className="text-sm mb-3">Full name</label>
                <div className="border_primary flex flex-row items-center h-10 px-4 space-x-2">
                    <EmailLogo width={50}/>
                    <input type="text" name="name" id="" className="w-full focus:outline-none text-gray-600" placeholder="John Doe"/>      
                </div>
            </div>

            <div className="text-[#09090B]">
                <label htmlFor="email" className="text-sm mb-3">Email</label>
                <div className="border_primary flex flex-row items-center h-10 px-4 space-x-2">
                    <EmailLogo width={50}/>
                    <input type="email" name="email" id="" className="w-full focus:outline-none text-gray-600" placeholder="example@gmail.com"/>      
                </div>
            </div>

            <div className="text-[#09090B]">
                <label htmlFor="password" className="text-sm mb-3">Password</label>
                <div className="border_primary flex flex-row items-center h-10 px-4 space-x-2">
                    <PasswordLogo width={50}/>
                    <input type="password" name="password" id="" className="w-full focus:outline-none text-gray-600" placeholder="•••••••••••"/>      
                </div>
            </div>

            <div className="text-end">
                <a href="/"><p className="underline text-[#09090B] font-medium text-sm">Forgot Password?</p></a>
            </div>

            <Button className="button_primary_full mt-5">Create Account</Button>
        </form>
        </>
    )
}