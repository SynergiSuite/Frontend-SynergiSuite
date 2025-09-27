"use client"
import { Suspense } from "react";
import React, { useEffect } from "react";
import Header from "./header";
import Form from "./form";
import Footer from "./footer";
import { useState } from "react";
import { Loader } from "@/components/ui/loader";
import { useSearchParams } from "next/navigation";

export default function Session(){
    const [form, setForm] = useState('signup');
    const searchParams = useSearchParams();

    useEffect(() => {
        const formParam = searchParams.get("form");
        
        if (formParam === "login") {
          setForm("login");
        } else if (formParam === "signup") {
          setForm("signup");
        }
    }, [searchParams]);

    const text = {
        subSignup: "Create a new account",
        subSignin: "Sign in your account",
        headSignup: "Register Account",
        headSignin: "Welcome Back"
    };
    return(
        <>
        <Suspense fallback={<Loader />}>
        <div className="flex flex-col justify-center items-center">
            <Header/>
            <Form text={text} form = {form} />
            <Footer form = {form} setForm = {setForm} />

        </div>
        </Suspense>
        </>
    )
}