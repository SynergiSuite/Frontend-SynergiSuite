import React from "react";
import Image from "next/image";
import HeroImageMain from "@/assets/HeroImageMain.png";
import { Button } from "@/global/buttons";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/session");
  };
  
  return (
    <>
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row items-center justify-between">
          {/* Left Side Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left mt-10 lg:mt-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Streamline Your Team&apos;s Workflow
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              All-in-one collaboration platform for modern teams to manage projects, track time, and boost productivity.
            </p>
            <Button onClick={handleClick} className="mt-6 py-2 button_primary_xl">Get Started</Button>
            <p className="text-sm text-gray-500 mt-2">Trusted by 10,000+ teams worldwide</p>
          </div>

          {/* Right Side Image */}
          <div className="w-full lg:w-1/2 lg:ml-6">
          <Image
          width={250}
          height={250}
          src={HeroImageMain}
          alt="Hero illustration"
          className="w-full max-w-md mx-auto lg:max-w-full rounded-xl"
          />
            
          </div>
        </div>
      </section>
    </>
  );
}
