import React from "react";

export default function FeaturesSection() {
  const handleClick = (title: string) => {
    alert(`You clicked on "${title}"`);
  };
  return (
    <>
      <section className="py-16 bg-gray-50 features-section">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Everything You Need for Seamless Collaboration
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Powerful features to help your team succeed
          </p>

          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="feature-card bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 text-center cursor-pointer" onClick={() => handleClick("Project Management")}>
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Project Management</h3>
              <p className="text-gray-600">Plan, track, and manage projects with intuitive boards and timelines</p>
            </div>

            <div className="feature-card bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 text-center cursor-pointer" onClick={() => handleClick("Team Chat")}>
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Team Chat</h3>
              <p className="text-gray-600">Real-time messaging and collaboration tools to keep your team connected</p>
            </div>

            <div className="feature-card bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 text-center cursor-pointer" onClick={() => handleClick("File Sharing")}>
               <div className="text-4xl mb-4">📁</div>
               <h3 className="text-xl font-semibold text-gray-800 mb-2">File Sharing</h3>
               <p className="text-gray-600">Securely store, share, and collaborate on files in one place</p>
            </div>

            <div className="feature-card bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 text-center cursor-pointer" onClick={() => handleClick("Time Tracking")}>
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Time Tracking</h3>
              <p className="text-gray-600">Track time spent on tasks and projects for better productivity</p>
            </div>

            <div className="feature-card bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 text-center cursor-pointer" onClick={() => handleClick("Reports & Analytics")}>
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Reports & Analytics</h3>
              <p className="text-gray-600">Get insights into your team's performance with detailed reports</p>
            </div>

            <div className="feature-card bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 text-center cursor-pointer" onClick={() => handleClick("Integrations")}>
              <div className="text-4xl mb-4">🧩</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Integrations</h3>
              <p className="text-gray-600">Connect with your favorite tools for a seamless workflow</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
