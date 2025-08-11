import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginSchema } from "./schema/loginSchema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { motion } from "framer-motion";
import EmailLogo from "@/assets/email-icon.svg";
import PasswordLogo from "@/assets/password-icon.svg";
import { Button } from "@/global/buttons";
import { useState } from "react";
import { ZodError } from "zod";
import { setCookie } from "cookies-next";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Upon submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      email,
      password_hash: password,
    };

    try {
      const validation = loginSchema.safeParse(data);
      if (!validation.success) {
        setError(validation.error.issues[0]?.message || "Invalid Input");
        return;
      }
      const userData = validation.data;

      const res = await fetch("http://localhost:3002/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const responseData = await res.json();
      
      if (!res.ok) {
        throw new Error( "Failed to login. Try Again later.");
      }

      // If user is created and not verified
      if (responseData.verified === false) {
        console.log(responseData.verified)
        // Request email verification
        const req = await fetch("http://localhost:3002/user/request-verify-email", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${responseData.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        if (!req.ok) {
          throw new Error("Failed to request email verification. Try Again later.");
        }

        setCookie('access_token', responseData.access_token, { path: '/', maxAge: 60 * 60 * 24 * 1 });
        router.push(`/session/verify-code?email=${encodeURIComponent(email)}`);
      } else {
        router.push('/dashboard');
      }
      setError(null);
    } catch (error) {
      if (error instanceof ZodError) {
        setError(error.issues[0]?.message || "Invalid input");
      } else if (error instanceof Error) {
        setError(error.message || "Something went wrong. Try again later.");
      } else {
        setError("Unknown error occurred.");
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        action=""
        method="post"
        className="py-4 mt-12 w-[90%] m-auto space-y-4"
      >

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" className="border-red-400">
              <Terminal />
              <AlertTitle>OOPs!</AlertTitle>
              <AlertDescription>
                <p className="text-red-600 text-sm">{error}</p>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="text-[#09090B]">
          <label htmlFor="email" className="text-sm mb-3">
            Email
          </label>
          <div className="border_primary flex flex-row items-center h-10 px-4 space-x-2">
            <Image src={EmailLogo} alt="Email" width={20} />
            <input
              type="email"
              name="email"
              value={email}
              id="emailLogin"
              onChange={(e) => {
                setEmail(e.target.value)
                setError(null)
              }}
              className="w-full focus:outline-none text-gray-600"
              placeholder="example@gmail.com"
              required
            />
          </div>
        </div>

        <div className="text-[#09090B]">
          <label htmlFor="password" className="text-sm mb-3">
            Password
          </label>
          <div className="border_primary flex flex-row items-center h-10 px-4 space-x-2">
            <Image src={PasswordLogo} alt="Password" width={20} />
            <input
              type="password"
              name="password"
              id="passwordLogin"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(null)
              }}
              className="w-full focus:outline-none text-gray-600"
              placeholder="•••••••••••"
              required
            />
          </div>
        </div>

        <div className="text-end">
          <a href="">
            <p className="underline text-[#09090B] font-medium text-sm">
              Forgot Password?
            </p>
          </a>
        </div>

        <Button type="submit" className="button_primary_full mt-5">
          Login
        </Button>
      </form>
    </>
  );
}
