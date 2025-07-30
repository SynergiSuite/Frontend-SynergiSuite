"use client"
import React from "react";
import Header from "./header";
import Form from "./form";
import Footer from "./footer";
import { useState } from "react";

export default function Session(){
    const [form, setForm] = useState('signup');

    const text = {
        subSignup: "Create a new account",
        subSignin: "Sign in your account",
        headSignup: "Register Account",
        headSignin: "Welcome Back"
    };
    return(
        <>
        <div className="flex flex-col justify-center items-center">
            <Header/>
            <Form text={text} form = {form} />
            <Footer form = {form} setForm = {setForm} />

        </div>
        </>
    )
}