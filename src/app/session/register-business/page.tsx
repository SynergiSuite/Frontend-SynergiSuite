'use client';

import React, { useEffect, useState } from "react";
import { Button } from "@/global/buttons";
import { ChevronDown, ChevronUp, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "./header";
import { motion, AnimatePresence } from "framer-motion";
import { registerBusinessScheme } from "../schema/registerBusinessSchema";
import { json, ZodError } from "zod";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Category {
  id: string;
  name: string;
}

export default function RegisterBusiness() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [data, setData] = useState<Category[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [name, setName] = useState<string>("");
  const [number_of_employees, setNumberOfEmployees] = useState<number>(0);
  const [category_id, setCategoryID] = useState<number>(0);
  const [invitationLink, setInvitationLink] = useState("");
  const router = useRouter();

  // Category Call
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie('access_token');
        setToken(token as string);
        setIsLoading(true);
        // Replace this URL with your actual API endpoint
        const response = await fetch('http://localhost:3002/category/get-all');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Cleanup function (optional)
    return () => {
      // Cancel any pending requests or subscriptions here
    };
  }, []);

  const options = ["Register a new Business", "Join an existing Business"];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption === "Register a new Business") {
      console.log({ name, number_of_employees, category_id });
      registerBusiness();
    } else if (selectedOption === "Join an existing Business") {
      console.log({ invitationLink });
    }
  };

  const joinBusiness = () => {}

  const registerBusiness = async() => {
    setIsLoading(true);
    const data = {
      name,
      number_of_employees,
      category_id,
    }

    try {
      const validation = registerBusinessScheme.safeParse(data);
      if (!validation.success) {
        setError(validation.error.issues[0]?.message || "Invalid Input");
        return;
      }
      const userData = JSON.stringify(validation.data);

      const res = await fetch("http://localhost:3002/business/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: userData,
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.message || "Failed to register business. Try Again later.");
      }

      deleteCookie("register-token");
      setCookie("business_name", responseData.updated_user.business.name, { path: '/', maxAge: 60 * 60 * 24 * 1 });
      setCookie("business_id", responseData.updated_user.business.business_id, { path: '/', maxAge: 60 * 60 * 24 * 1 });
      router.replace("/dashboard");

    } catch (error) {
      if (error instanceof ZodError) {
        setError(error.issues[0]?.message || "Invalid input");
      } else if (error instanceof Error) {
        setError(error.message || "Something went wrong. Try again later.");
      } else {
        setError("Unknown error occurred.");
      }
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <Header />

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className='my-4'
          >
            <Alert variant="destructive">
              <Terminal />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                <p className="text-red-600 text-sm">{error}</p>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dropdown */}
          <div className="relative">
            <div
              className="w-full border border-gray-300 rounded-md px-4 py-3 flex justify-between items-center cursor-pointer text-sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span
                className={selectedOption ? "text-gray-900" : "text-gray-400"}
              >
                {selectedOption || "Select an option"}
              </span>
              {isDropdownOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {options.map((option) => (
                  <div
                    key={option}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Animated Sections */}
          <AnimatePresence mode="wait">
            {selectedOption === "Register a new Business" && (
              <motion.div
                key="register-form"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden space-y-4"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none text-sm"
                    placeholder="Enter your business name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="numberOfEmployees"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Number of Employees
                  </label>
                  <input
                    type="number"
                    id="numberOfEmployees"
                    value={number_of_employees} 
                    onChange={(e) => setNumberOfEmployees(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none text-sm"
                    placeholder="Enter number of employees"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="businessCategory"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Business Category
                  </label>
                  <select
                    id="businessCategory"
                    value={category_id}
                    onChange={(e) => setCategoryID(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none text-sm"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select category</option>
                    {isLoading ? (
                      <option>Loading categories...</option>
                    ) : error ? (
                      <option>Error loading categories</option>
                    ) : (
                      data?.map((category: { id: string; name: string }) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <Button
                  type="submit"
                  className="button_primary_full"
                  disabled={isLoading}
                >
                  Register Business
                </Button>
              </motion.div>
            )}

            {selectedOption === "Join an existing Business" && (
              <motion.div
                key="join-form"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden space-y-4"
              >
                <div>
                  <label
                    htmlFor="invitationLink"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Enter Link
                  </label>
                  <input
                    type="text"
                    id="invitationLink"
                    value={invitationLink}
                    onChange={(e) => setInvitationLink(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none text-sm"
                    placeholder="Paste your invitation link here"
                    required
                  />
                </div>

                <Button type="submit" className="button_primary_full" disabled={isLoading}>
                  Join Now
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
