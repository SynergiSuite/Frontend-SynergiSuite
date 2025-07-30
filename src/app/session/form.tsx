import React from "react";
import Signup from "./signup";
import Signin from "./signin";
import { AnimatePresence, motion } from "framer-motion";

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
          <div className="border_primary transform transition-transform w-[90%] sm:w-[70%] md:w-[60%] lg:w-[40%] xl:w-[30%] py-8 px-4 sm:px-6 rounded-lg         mx-auto">
            {/* Header Text */}
            <div className="flex flex-col justify-center items-center text-center">
              <h3 className="component_heading">
                {form === 'signup' ? text.headSignup : text.headSignin}
              </h3>
              <p className="under_heading pt-4">
                {form === 'signup' ? text.subSignup : text.subSignin}
              </p>
            </div>
        
            {/* Animated Form */}
            <div className="relative w-full flex justify-center items-center mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={form}
                  initial={{ scale: 0, borderRadius: "100%" }}
                  animate={{ scale: 1, borderRadius: "0%" }}
                  exit={{ scale: 0, borderRadius: "100%" }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
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