import React from "react";
import Signup from "./signup";
import Signin from "./signin";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./header";

type Props = {
    text: {
        subSignup: string
        subSignin: string
        headSignup: string
        headSignin: string
    },

    form: string 
};

export default function Form({form, text}: Props){
    return(
        <>
          <div className="relative overflow-hidden bg-[#0a0826]/45 border border-white/[0.08] backdrop-blur-2xl shadow-[0_25px_60px_rgba(82,113,255,0.12)] rounded-2xl px-6 py-8 sm:px-8 sm:py-9 mx-auto w-[90%] sm:w-[70%] md:w-[60%] lg:w-[45%] xl:w-[32%] transition-all duration-500">
            {/* Top highlight glow lines */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#5271ff]/40 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-[#5271ff]/60 blur-[1px]" />
            
            {/* Corner high-tech accent highlights */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#5271ff]/30 rounded-tl" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#5271ff]/30 rounded-tr" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#5271ff]/30 rounded-bl" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#5271ff]/30 rounded-br" />

            <div className="mb-4 flex justify-center">
              <Header />
            </div>

            {/* Header Text */}
            <div className="flex flex-col items-center justify-center text-center mb-2">
              <h3 className="landing-serif text-3xl font-bold text-white tracking-tight">
                {form === 'signup' ? text.headSignup : text.headSignin}
              </h3>
              <p className="text-sm text-white/50 pt-2 font-light">
                {form === 'signup' ? text.subSignup : text.subSignin}
              </p>
            </div>
        
            {/* Animated Form Switcher */}
            <div className="relative mt-4 flex w-full items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={form}
                  initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                  transition={{
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1], // Custom ultra-premium cubic bezier
                  }}
                  className="w-full"
                >
                  {form === 'signup' ? <Signup /> : <Signin />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </>

    )
}

