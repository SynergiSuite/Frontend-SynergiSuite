import React from "react";
import { motion } from "framer-motion";

type Props = {
    form: string;
    setForm: (value: "signup" | "signin") => void;
};

export default function Footer({form, setForm}: Props){
    return(
        <>
        <div className="w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] my-6 px-1">
          <div className="relative flex bg-gray-200 py-1 rounded-[8px] p-1">
            {/* Animated sliding pill */}
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-[2px] mx-[5px] my-[1px] w-1/2 bg-white rounded-[8px] z-0"
              style={{
                left: form === 'signup' ? '0%' : '48%',
              }}
            />
    
            {/* Buttons */}
            <button
              className={`flex-1 z-10 py-2 text-sm font-medium transition-colors ${
                form === 'signup' ? 'text-black' : 'text-gray-600'
              }`}
              onClick={() => setForm('signup')}
            >
              Sign up
            </button>
    
            <button
              className={`flex-1 z-10 py-2 text-sm font-medium transition-colors ${
                form === 'signin' ? 'text-black' : 'text-gray-600'
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