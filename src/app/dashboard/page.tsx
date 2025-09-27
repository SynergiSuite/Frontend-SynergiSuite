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
    const [userRole, setUserRole] = useState<string>("");
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
        const userRole = getCookie("role");
        setUserRole(userRole as string);
    }, []);

    return (

        <div className=''>
            <h1>Dashboard</h1>
            <p>{userName}</p>
            <p>{userEmail}</p>
            <p>{userBusinessName}</p>
            <p>{userBusinessId}</p>
            <p>{userRole}</p>
            <p>{token}</p>
        </div>
    );
}