"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/global/buttons';
import { useRouter } from 'next/navigation';
import { deleteCookie, getCookie } from 'cookies-next';

export default function dashboard() {
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");
    const [userBusinessName, setUserBusinessName] = useState<string>("");
    const [userBusinessId, setUserBusinessId] = useState<string>("");
    const [token, setToken] = useState<string>("");

    const router = useRouter();

    useEffect(() => {
        const token = getCookie("access_token");
        setToken(token as string);
        const user = getCookie("user");
        setUserName(user as string);
        const userEmail = getCookie("user_email");
        setUserEmail(userEmail as string);
        const userBusinessName = getCookie("business_name");
        setUserBusinessName(userBusinessName as string);
        const userBusinessId = getCookie("business_id");
        setUserBusinessId(userBusinessId as string);
    }, []);

    const logout = async () => {
        setIsLoading(true);
        const token = getCookie("access_token");
        setToken(token as string);
        try {
            const res = await fetch("http://localhost:3002/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const responseData = await res.json();
            if (!res.ok) {
                throw new Error(responseData.message || "Failed to logout. Try Again later.");
            }
            deleteCookie("access_token");
            deleteCookie("user_email");
            deleteCookie("user");
            deleteCookie("business_name");
            deleteCookie("business_id");
            router.replace("/session");
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    }
    return (

        <div>
            <h1>Dashboard</h1>
            <p>{userName}</p>
            <p>{userEmail}</p>
            <p>{userBusinessName}</p>
            <p>{userBusinessId}</p>
            <p>{token}</p>
            <Button className="button_primary_full" type='button' disabled={isLoading} onClick={logout} >
                Logout
            </Button>
        </div>
    );
}