"use client"
import React from "react"

export default function LoaderCustom() {
    return (
        <div className="flex items-center justify-center h-full">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    )
}