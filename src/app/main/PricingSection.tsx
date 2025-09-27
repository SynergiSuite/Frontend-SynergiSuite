import { Button } from "@/global/buttons";
import React from "react";

export default function PricingSection() {
  const handleClick = (plan: string) => {
  alert(`Thank you for choosing the ${plan} plan!`);
 };
  return (
    <>
      <section className="py-16 bg-gray-100 pricing-section">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Flexible pricing for teams of all sizes
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-8 border border-transparent hover:border-black">
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Starter</h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">
                $10 <span className="text-base font-normal text-gray-500">/month</span>
              </p>
              <p className="text-gray-600 mb-6">Perfect for small teams</p>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li>✔ Up to 10 team members</li>
                <li>✔ 5GB storage</li>
                <li>✔ Basic reporting</li>
                <li>✔ API access</li>
              </ul>
              <Button  onClick={() => handleClick("Starter")} className="button_primary_full">
               Get Started
              </Button>
            </div>

            {/* Professional Plan */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-8 border border-transparent hover:border-black">
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Professional</h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">
                $25 <span className="text-base font-normal text-gray-500">/month</span>
              </p>
              <p className="text-gray-600 mb-6">For growing businesses</p>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li>✔ Up to 50 team members</li>
                <li>✔ 50GB storage</li>
                <li>✔ Advanced reporting</li>
                <li>✔ Priority support</li>
                <li>✔ Custom integrations</li>
              </ul>
              <Button  onClick={() => handleClick("Professional")} className="button_primary_full">
               Get Started
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-8 border border-transparent hover:border-black">
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Enterprise</h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">Custom</p>
              <p className="text-gray-600 mb-6">For large organizations</p>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li>✔ Unlimited team members</li>
                <li>✔ Unlimited storage</li>
                <li>✔ Custom reporting</li>
                <li>✔ 24/7 support</li>
                <li>✔ Dedicated account manager</li>
                <li>✔ Custom deployment</li>
              </ul>
              <Button  onClick={() => handleClick("Enterprise")} className="button_primary_full">
               Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

