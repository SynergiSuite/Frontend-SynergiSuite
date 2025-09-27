'use client'
import { getCookie } from "cookies-next";
import { useEffect } from "react";
import { redirect } from "next/navigation";


export default function Home() {

  useEffect(() => {
    const manage = () => {
      const access_token = getCookie("access_token")
      if (access_token) {
        redirect('/dashboard')
      } else {
        redirect("/main")
      }
    }
    manage();
  }, [])

}
