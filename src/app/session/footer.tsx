import React from "react";
import { motion } from "framer-motion";

type Props = {
    form: string;
    setForm: (value: "signup" | "signin") => void;
};

export default function Footer({form, setForm}: Props){
    return(
        <>
        <div className="mt-6 w-[90%] px-1 sm:w-[70%] md:w-[50%] lg:w-[35%] xl:w-[25%] transition-all duration-300">
          <div className="relative flex bg-white/[0.02] border border-white/[0.06] backdrop-blur-md p-1 rounded-xl">
            {/* Animated sliding pill */}
            <motion.div
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="absolute inset-y-[3px] left-[3px] w-[calc(50%-3px)] bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] rounded-lg shadow-[0_0_15px_rgba(82,113,255,0.25)] z-0"
              animate={{
                x: form === 'signup' ? '0%' : '100%',
              }}
            />
    
            {/* Buttons */}
            <button
              className={`flex-1 z-10 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                form === 'signup' ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
              onClick={() => setForm('signup')}
            >
              Sign up
            </button>
    
            <button
              className={`flex-1 z-10 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                form === 'signin' ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
              onClick={() => setForm('signin')}
            >
              Login
            </button>
          </div>
        </div>
  
        </>
    );
};

