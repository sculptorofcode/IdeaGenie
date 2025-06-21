"use client";
import { useState } from 'react';

// Add the missing functions that are being imported in other files
export async function updateUser(userData) {
  // Simulate API call to update user data
  console.log("Updating user data:", userData);
  return {
    success: true,
    user: {
      ...userData,
      updatedAt: new Date().toISOString()
    }
  };
}

export async function getUserOnboardingStatus(userId) {
  // Simulate API call to get user onboarding status
  console.log("Getting onboarding status for user:", userId);
  return {
    completed: false,
    steps: {
      profile: true,
      preferences: false,
      goals: false
    }
  };
}

export default function Dashboard() {
  const [selectedType, setSelectedType] = useState('');
  const [prompt, setPrompt] = useState('');

  const ideas = [
    {
      title: "AI-Powered Crop Monitoring",
      description: "Farmers lack real-time information on crop health",
      tags: ["#Digital", "BeginnerFriendly", "AI"],
    },
    {
      title: "Automated Irrigation System",
      description: "Farmers struggle with inefficient water use",
      tags: ["#Physical", "#Agriculture"],
    },
    {
      title: "Local Produce Delivery",
      description: "Long distances make it hard to access fresh produce",
      tags: ["#Physical", "Logistics"],
    },
    {
      title: "Sustainable Pest Control",
      description: "Farmers require eco-friendly solutions for managing pests",
      tags: ["#Digital", "AgTech"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-blue-600">IDEAGENI</h1>
          <p className="text-gray-600">Generate your next big idea</p>
        </header>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Type</h2>

        {/* Product Type Selection */}
        <div className="flex space-x-4 mb-8">
          {['Physical', 'Digital', 'None'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg ${
                selectedType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Prompt Input */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Enter a prompt or category..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Generate
          </button>
        </div>

        {/* Team Info */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Team Info</h2>
          <p className="text-gray-600">Alex Al Jordan Taylor</p>
          <p className="text-gray-600">Design Marketing</p>
        </div>

        {/* Goal */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Goal</h2>
          <p className="text-gray-600">Learn AI</p>
        </div>

        {/* Constraints */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Constraints</h2>
          <p className="text-gray-600">3 months</p>
        </div>

        {/* Idea Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ideas.map((idea, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{idea.title}</h3>
              <p className="text-gray-600 mb-4">{idea.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {idea.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                {index % 2 === 0 ? 'Explore More' : 'Go Through'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
