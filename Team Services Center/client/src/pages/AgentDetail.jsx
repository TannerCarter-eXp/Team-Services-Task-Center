// Agent Detail Page
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import agentImage from "../images/jane-smith.png";
import NavBar from "../components/NavBar";

const mockAgent = {
  name: "Jane Doe",
  image: agentImage,
  status: "Inactive",
  agentId: "1002",
  uuid: "abcdef12-3456-7890-abcd-ef1234567890",
  systemId: "SYS-2002",
  email: "jane.doe@example.com",
  secondEmail: "jane@exprealty.com",
  phone: "(555) 123-4567",
  fax: "(555) 765-4321",
  title: "Broker",
  customTitle: "Director of Sales",
  joinDate: "2/14/2015",
  anniversary: "2/14/2020",
  nrds: "9876543210",
  region: "Eastern",
  ssnMasked: "***-**-1234",
  address: "123 Main St, Springfield, IL 62704, US",
  licensedState: "Illinois",
  payPlan: "Mega Team 1/4 Cap Agents",
  capResetDate: "February 01, 2026",
  cap: "4000.00",
  splitCheckPreference: "Yes",
  leftCompetitor: "No",
  preferredPaymentMethod: "WF Check",
  stockProgram: "Not Enrolled",
  financialPerformance: {
    currentPerformance: "0.00",
    liabilityFeesPaid: "0.00",
    capPercentReached: "0.00",
  },
  flags: [
    "Commercial Agent",
    "Referral Division Agent",
    "Boost Agent",
    "Canadian Corporation",
    "Luxury Agent",
  ],
};

export default function AgentDetail() {
  const [tab, setTab] = useState("General");
  const [agent, setAgent] = useState(null);
  const { teamId, agentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, we would fetch agent data based on agentId
    // For now, just use the mock data
    setAgent(mockAgent);
  }, [agentId]);

  const handleGoBack = () => {
    navigate(`/team/${teamId}`);
  };

  if (!agent) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Agent Not Found
          </h2>
          <p className="mb-6">The agent could not be found.</p>
          <Button
            onClick={handleGoBack}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Return to Team
          </Button>
        </div>
      </div>
    );
  }

  const tabs = ["General", "Contact", "Financial", "Teams", "Documents"];

  return (
    <div>
      {/* Add the NavBar at the top */}
      <NavBar />

      <div className="p-6">
        {/* Agent header section - now with "Agent Profile" text */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Agent Profile
          </h1>

          {/* Return to Team button below the header */}
          <Button variant="outline" onClick={() => navigate(`/team/${teamId}`)}>
            ← Return to Team
          </Button>
        </div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">
              {agent.name}
            </h2>
            <div className="flex gap-6">
              <img
                src={agent.image}
                alt="Agent"
                className="w-40 h-40 object-cover rounded-full border"
              />
              <div className="flex flex-col justify-between">
                <button href="/">
                  <div className="bg-blue-800 text-white px-4 py-1 rounded-full text-sm text-center">
                    Link to ENT Profile
                  </div>
                </button>
                <div className="text-sm mt-4 space-y-1">
                  <p>
                    <strong>Status:</strong> {agent.status}
                  </p>
                  <p>
                    <strong>Agent ID:</strong> {agent.agentId}
                  </p>
                  <p>
                    <strong>UUID:</strong> {agent.uuid}
                  </p>
                  <p>
                    <strong>System ID:</strong> {agent.systemId}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">
              Agent Details
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-600">Email:</p>
                <p>{agent.email}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Secondary Email:</p>
                <p>{agent.secondEmail}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Phone:</p>
                <p>{agent.phone}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Fax:</p>
                <p>{agent.fax}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Title:</p>
                <p>{agent.title}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Custom Title:</p>
                <p>{agent.customTitle}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Join Date:</p>
                <p>{agent.joinDate}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Anniversary:</p>
                <p>{agent.anniversary}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-6 bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto py-2 px-4" aria-label="Tabs">
              {tabs.map((tabName) => (
                <button
                  key={tabName}
                  onClick={() => setTab(tabName)}
                  className={`whitespace-nowrap py-2 px-4 font-medium text-sm rounded-md mr-2 focus:outline-none ${
                    tab === tabName
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tabName}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {tab === "General" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">General Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-600">NRDS:</p>
                    <p>{agent.nrds}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Region:</p>
                    <p>{agent.region}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">SSN:</p>
                    <p>{agent.ssnMasked}</p>
                  </div>
                  <div className="md:col-span-3">
                    <p className="font-semibold text-gray-600">Address:</p>
                    <p>{agent.address}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">
                      Licensed State:
                    </p>
                    <p>{agent.licensedState}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">
                      Split Check Preference:
                    </p>
                    <p>{agent.splitCheckPreference}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">
                      Left Competitor:
                    </p>
                    <p>{agent.leftCompetitor}</p>
                  </div>
                </div>
              </div>
            )}

            {tab === "Financial" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Financial Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-600">Pay Plan:</p>
                    <p>{agent.payPlan}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">
                      Cap Reset Date:
                    </p>
                    <p>{agent.capResetDate}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Cap:</p>
                    <p>${agent.cap}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">
                      Current Performance:
                    </p>
                    <p>${agent.financialPerformance.currentPerformance}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">
                      Liability Fees Paid:
                    </p>
                    <p>${agent.financialPerformance.liabilityFeesPaid}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">
                      Cap % Reached:
                    </p>
                    <p>{agent.financialPerformance.capPercentReached}%</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">
                      Preferred Payment Method:
                    </p>
                    <p>{agent.preferredPaymentMethod}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">
                      Stock Program:
                    </p>
                    <p>{agent.stockProgram}</p>
                  </div>
                </div>
              </div>
            )}

            {tab === "Contact" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-600">Email:</p>
                    <p>{agent.email}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">
                      Secondary Email:
                    </p>
                    <p>{agent.secondEmail}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Phone:</p>
                    <p>{agent.phone}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Fax:</p>
                    <p>{agent.fax}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="font-semibold text-gray-600">Address:</p>
                    <p>{agent.address}</p>
                  </div>
                </div>
              </div>
            )}

            {tab === "Teams" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Team Information</h3>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                  <p>This agent is a member of the following team:</p>
                  <p className="font-semibold mt-2">{`Team: California Mega Team Alpha (Team ID: ${teamId})`}</p>
                  <p>Role: Team Leader</p>
                </div>
              </div>
            )}

            {tab === "Documents" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Documents</h3>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-md text-center">
                  <p>No documents available for this agent.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Agent Flags Section */}
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">
            Agent Flags
          </h2>
          <div className="flex flex-wrap gap-2">
            {agent.flags.map((flag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {flag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
