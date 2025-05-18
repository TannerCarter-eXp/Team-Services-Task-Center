// Home page with team services dashboard
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import NavBar from "../components/NavBar";
import AIAssistant from "../components/AIAssistant";

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const [coeRegion, setCoeRegion] = useState("all");
  const [teamType, setTeamType] = useState("all");
  const [primaryState, setPrimaryState] = useState("all");
  const [additionalState, setAdditionalState] = useState("all");
  const [market, setMarket] = useState("");
  const [certification, setCertification] = useState("all");

  const notificationRef = React.useRef(null);

  const [activeTab, setActiveTab] = useState("teams");

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);

  // Add this helper function at the top of your Home component
  const truncateText = (text, maxLength = 25) => {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const taskData = {
    overdue: 33,
    newToday: 170,
    upcoming: 90,
    completed: 111,
  };

  // API-related state
  const [teamData, setTeamData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Function to navigate to team details
  const navigateToTeam = (teamId) => {
    navigate(`/team/${teamId}`);
  };
  // Mock data for different team types
  const mockTeamData = {
    "COE1 | CA": [
      {
        teamId: "CA001",
        teamName: "California Mega Team Alpha",
        teamLeader: "Jane Smith",
        members: 12, // Changed from "View" to 12 (number of agents for Mega team)
        type: "Mega",
        status: "Active",
        state: "CA",
        region: "COE1",
        date: "2023-01-15",
      },
      {
        teamId: "CA002",
        teamName: "California Mega Team Beta",
        teamLeader: "John Davis",
        members: 12, // Changed to 12
        type: "Mega",
        status: "Active",
        state: "CA",
        region: "COE1",
        date: "2023-02-20",
      },
      {
        teamId: "CA003",
        teamName: "Bay Area Standard Team",
        teamLeader: "Michael Johnson",
        members: 6, // Changed to 6 (number of agents for Standard team)
        type: "Standard",
        status: "Active",
        state: "CA",
        region: "COE1",
        date: "2023-03-10",
      },
      {
        teamId: "CA004",
        teamName: "LA Standard Team",
        teamLeader: "Sarah Williams",
        members: 6, // Changed to 6
        type: "Standard",
        status: "Active",
        state: "CA",
        region: "COE1",
        date: "2023-04-05",
      },
      {
        teamId: "CA005",
        teamName: "San Diego Self-Organized Team",
        teamLeader: "Robert Brown",
        members: 3, // Changed to 3 (number of agents for Self-Organized team)
        type: "Self-Organized",
        status: "Active",
        state: "CA",
        region: "COE1",
        date: "2023-05-22",
      },
      {
        teamId: "CA006",
        teamName: "Sacramento Self-Organized Team",
        teamLeader: "Emily Wilson",
        members: 3, // Changed to 3
        type: "Self-Organized",
        status: "Active",
        state: "CA",
        region: "COE1",
        date: "2023-06-18",
      },
    ],
    "COE2 | AK, OR, WA, MI": [
      {
        teamId: "OR001",
        teamName: "Pacific Northwest Mega Team",
        teamLeader: "David Miller",
        members: 12,
        type: "Mega",
        status: "Active",
        state: "OR",
        region: "COE2", // Changed from "Northwest" to "COE2"
        date: "2023-02-10",
      },
      {
        teamId: "CA007",
        teamName: "Bay Area Domestic Partnership Team",
        teamLeader: "Thomas Anderson",
        members: 4,
        type: "Domestic Partnership",
        status: "Active",
        state: "CA",
        region: "COE1",
        date: "2023-07-15",
      },
    ],
    "Onboarding/ In Progress": [
      {
        teamId: "NY005",
        teamName: "Empire State Group",
        teamLeader: "John Miller",
        region: "Onboarding/ In Progress", // Added region
        date: "2023-12-15",
      },
      {
        teamId: "CA010",
        teamName: "Silicon Valley Team",
        teamLeader: "Emily Chang",
        region: "Onboarding/ In Progress", // Added region
        date: "2024-01-20",
      },
    ],
  };

  // Generate mock data for other tabs
  const createMockTeamsForCOE = (coeNumber, states) => {
    const coeId = `COE${coeNumber}`;
    const state = states.split(",")[0].trim();

    return [
      {
        teamId: `${state}001`,
        teamName: `${coeId} Mega Team 1`,
        teamLeader: "Jane Smith",
        members: 12,
        type: "Mega",
        status: "Active",
        state: state,
        region: coeId,
        date: "2023-01-15",
      },
      {
        teamId: `${state}002`,
        teamName: `${coeId} Mega Team 2`,
        teamLeader: "John Davis",
        members: 12,
        type: "Mega",
        status: "Active",
        state: state,
        region: coeId,
        date: "2023-02-20",
      },
      {
        teamId: `${state}003`,
        teamName: `${coeId} Standard Team 1`,
        teamLeader: "Michael Johnson",
        members: 6,
        type: "Standard",
        status: "Active",
        state: state,
        region: coeId,
        date: "2023-03-10",
      },
      {
        teamId: `${state}004`,
        teamName: `${coeId} Standard Team 2`,
        teamLeader: "Sarah Williams",
        members: 6,
        type: "Standard",
        status: "Active",
        state: state,
        region: coeId,
        date: "2023-04-05",
      },
      {
        teamId: `${state}005`,
        teamName: `${coeId} Self-Organized Team 1`,
        teamLeader: "Robert Brown",
        members: 3,
        type: "Self-Organized",
        status: "Active",
        state: state,
        region: coeId,
        date: "2023-05-22",
      },
      {
        teamId: `${state}006`,
        teamName: `${coeId} Self-Organized Team 2`,
        teamLeader: "Emily Wilson",
        members: 3,
        type: "Self-Organized",
        status: "Active",
        state: state,
        region: coeId,
        date: "2023-06-18",
      },
    ];
  };

  // Create mock data for all COE regions
  const allMockTeams = [
    ...mockTeamData["COE1 | CA"],
    ...createMockTeamsForCOE(2, "AK, OR, WA, MI"),
    ...createMockTeamsForCOE(3, "CO, ID, MT, NM, UT, WY"),
    ...createMockTeamsForCOE(4, "TX, ND, MN"),
    ...createMockTeamsForCOE(5, "AL, AR, LA, MS, OK"),
    ...createMockTeamsForCOE(6, "AZ, HI, NV, IN"),
    ...createMockTeamsForCOE(7, "NC, SC"),
    ...createMockTeamsForCOE(8, "DC, DE, MD, WV, VA"),
    ...createMockTeamsForCOE(9, "IA, KS, MO, NE, SD, IL"),
    ...createMockTeamsForCOE(10, "CT, MA, RI, WI, NJ"),
    ...createMockTeamsForCOE(11, "FL, ME, VT, NH"),
    ...createMockTeamsForCOE(12, "NY, OH, PA"),
    ...createMockTeamsForCOE(13, "GA, KY, TN"),
    ...mockTeamData["Onboarding/ In Progress"],
  ];

  // Create mock data for tasks
  const mockTasks = [
    {
      id: "T001",
      taskType: "Follow-up - Team Member Addendum",
      teamName: "California Mega Team Alpha",
      teamId: "CA001",
      assignedUser: "Jane Smith",
      notes: "New team member needs to complete onboarding documents",
      dueDate: "2024-07-15",
      completedBy: "",
      completedDate: "",
      priority: "High",
      owner: "Regional Director",
    },
    {
      id: "T002",
      taskType: "Team Name Approval - requesting broker approval",
      teamName: "Silicon Valley Team",
      teamId: "CA010",
      assignedUser: "Emily Wilson",
      notes: "Team name needs broker approval for compliance",
      dueDate: "2024-07-10",
      completedBy: "",
      completedDate: "",
      priority: "Medium",
      owner: "Compliance Officer",
    },
    {
      id: "T003",
      taskType: "Annual Review Due",
      teamName: "Pacific Northwest Mega Team",
      teamId: "OR001",
      assignedUser: "David Miller",
      notes: "Annual team performance review is due this month",
      dueDate: "2024-07-30",
      completedBy: "",
      completedDate: "",
      priority: "Medium",
      owner: "Team Services Manager",
    },
    {
      id: "T004",
      taskType: "Follow-up - Team Member Release",
      teamName: "Bay Area Standard Team",
      teamId: "CA003",
      assignedUser: "Michael Johnson",
      notes: "Agent release documents need processing",
      dueDate: "2024-07-08",
      completedBy: "Sarah Williams",
      completedDate: "2024-07-05",
      priority: "Low",
      owner: "Team Services Coordinator",
    },
    {
      id: "T005",
      taskType: "Team Expansion Request",
      teamName: "LA Standard Team",
      teamId: "CA004",
      assignedUser: "Sarah Williams",
      notes: "Team requesting to expand to additional markets",
      dueDate: "2024-07-20",
      completedBy: "",
      completedDate: "",
      priority: "High",
      owner: "Regional Director",
    },
    {
      id: "T006",
      taskType: "Custom Task",
      teamName: "Sacramento Self-Organized Team",
      teamId: "CA006",
      assignedUser: "Emily Wilson",
      notes: "Schedule team training session for new systems",
      dueDate: "2024-08-05",
      completedBy: "",
      completedDate: "",
      priority: "Medium",
      owner: "Team Services Manager",
    },
  ];

  // Function to navigate to task details
  const navigateToTask = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  // Fetch all data on initial load
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Comment out API calls
        // await fetchAllTeamsData();
        setInitialDataLoaded(true);

        // Load all teams at once
        setTeamData(allMockTeams);
      } catch (err) {
        console.error("Failed to load initial data:", err);
        setError("Failed to load initial data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []); // Empty dependency array means this runs once on mount

  // Calculate percentages for bar graph
  const total =
    taskData.overdue +
    taskData.newToday +
    taskData.upcoming +
    taskData.completed;
  const percentages = {
    overdue: (taskData.overdue / total) * 100,
    newToday: (taskData.newToday / total) * 100,
    upcoming: (taskData.upcoming / total) * 100,
    completed: (taskData.completed / total) * 100,
  };

  // Calculate team type counts and percentages for team type bar graph
  const teamTypeCounts = {
    domestic: Object.values(mockTeamData)
      .flat()
      .filter((team) => team.type === "Domestic Partnership").length,
    mega: Object.values(mockTeamData)
      .flat()
      .filter((team) => team.type === "Mega").length,
    standard: Object.values(mockTeamData)
      .flat()
      .filter((team) => team.type === "Standard").length,
    selfOrganized: Object.values(mockTeamData)
      .flat()
      .filter((team) => team.type === "Self-Organized").length,
    newInactive: mockTeamData["Onboarding/ In Progress"].length,
  };

  const teamTypeTotal =
    teamTypeCounts.domestic +
    teamTypeCounts.mega +
    teamTypeCounts.standard +
    teamTypeCounts.selfOrganized;
  teamTypeCounts.newInactive;

  const teamTypePercentages = {
    domestic: (teamTypeCounts.domestic / teamTypeTotal) * 100,
    mega: (teamTypeCounts.mega / teamTypeTotal) * 100,
    standard: (teamTypeCounts.standard / teamTypeTotal) * 100,
    selfOrganized: (teamTypeCounts.selfOrganized / teamTypeTotal) * 100,
    newInactive: (teamTypeCounts.newInactive / teamTypeTotal) * 100,
  };

  // Replace your existing filteredTeamData with this enhanced version
  const filteredTeamData = allMockTeams.filter((team) => {
    // First apply the search query filter
    const matchesSearch = searchQuery
      ? team.teamId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.teamName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.teamLeader?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    // Now apply all the select filters
    // Now apply all the select filters
    const matchesCoeRegion =
      coeRegion === "all" || !coeRegion ? true : team.region === coeRegion; // Changed from includes() to exact equality check

    const matchesTeamType =
      teamType === "all" || !teamType ? true : team.type === teamType;

    const matchesPrimaryState =
      primaryState === "all" || !primaryState
        ? true
        : team.state === primaryState;

    // Additional filters can be added similarly

    return (
      matchesSearch &&
      matchesCoeRegion &&
      matchesTeamType &&
      matchesPrimaryState
    );
  });

  return (
    <div>
      {/* Replace the existing nav with the NavBar component */}
      <NavBar />
      <div className="p-6 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Tasks card - shortened version */}
            <Card className="card-component summary-component--tasks-card summary-component--card shadow-md">
              <CardContent className="p-0">
                <div className="summary-component--tasks-card--wrapper summary-component--card--wrapper">
                  <header className="summary-component--card--header p-4 font-semibold text-lg border-b border-gray-200">
                    Tasks
                  </header>

                  <div className="p-4">
                    <div className="summary-component--tasks-card--summary-details-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Only include the buttons, remove the rest */}
                      <button className="summary-component--summary-button-component">
                        <div className="summary-component--detail-component summary-component--detail-component--overdue bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="summary-component--detail-component--content flex justify-between items-center">
                            <span className="summary-component--detail-component--content--label summary-component--detail-component--content--label--overdue text-sm text-gray-500">
                              <span className="summary-component--detail-component--content--label--text">
                                Overdue tasks
                              </span>
                            </span>
                            <div className="summary-component--detail-component--content--value-container flex items-center">
                              <span className="summary-component--detail-component--content--value text-xl font-bold text-red-600 mr-2">
                                {taskData.overdue}
                              </span>
                              <div className="summary-component--detail-component--content--icon-container">
                                <div className="bg-red-600 rounded p-2">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>

                      <button className="summary-component--summary-button-component">
                        <div className="summary-component--detail-component summary-component--detail-component--tasks-assigned-today bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="summary-component--detail-component--content flex justify-between items-center">
                            <span className="summary-component--detail-component--content--label summary-component--detail-component--content--label--tasks_assigned_today text-sm text-gray-500">
                              <span className="summary-component--detail-component--content--label--text">
                                New Tasks Today
                              </span>
                            </span>
                            <div className="summary-component--detail-component--content--value-container flex items-center">
                              <span className="summary-component--detail-component--content--value text-xl font-bold text-purple-600 mr-2">
                                {taskData.newToday}
                              </span>
                              <div className="summary-component--detail-component--content--icon-container">
                                <div className="bg-purple-600 rounded p-2">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>

                      <button className="summary-component--summary-button-component">
                        <div className="summary-component--detail-component summary-component--detail-component--to-do bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="summary-component--detail-component--content flex justify-between items-center">
                            <span className="summary-component--detail-component--content--label summary-component--detail-component--content--label--to_do text-sm text-gray-500">
                              <span className="summary-component--detail-component--content--label--text">
                                Upcoming Tasks
                              </span>
                            </span>
                            <div className="summary-component--detail-component--content--value-container flex items-center">
                              <span className="summary-component--detail-component--content--value text-xl font-bold text-blue-600 mr-2">
                                {taskData.upcoming}
                              </span>
                              <div className="summary-component--detail-component--content--icon-container">
                                <div className="bg-blue-600 rounded p-2">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M8 6h13"></path>
                                    <path d="M8 12h13"></path>
                                    <path d="M8 18h13"></path>
                                    <path d="M3 6h.01"></path>
                                    <path d="M3 12h.01"></path>
                                    <path d="M3 18h.01"></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>

                      <button className="summary-component--summary-button-component">
                        <div className="summary-component--detail-component summary-component--detail-component--completed-tasks bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="summary-component--detail-component--content flex justify-between items-center">
                            <span className="summary-component--detail-component--content--label summary-component--detail-component--content--label--completed_tasks text-sm text-gray-500">
                              <span className="summary-component--detail-component--content--label--text">
                                Completed Tasks
                              </span>
                            </span>
                            <div className="summary-component--detail-component--content--value-container flex items-center">
                              <span className="summary-component--detail-component--content--value text-xl font-bold text-green-600 mr-2">
                                {taskData.completed}
                              </span>
                              <div className="summary-component--detail-component--content--icon-container">
                                <div className="bg-green-600 rounded p-2">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M20 6L9 17l-5-5"></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Type Summary Card below Tasks card */}
            {/* Team Type Summary Card with bar graph */}
            <Card className="shadow-md">
              <CardContent className="p-0">
                <div className="summary-component--card--wrapper">
                  <header className="summary-component--card--header p-3 font-semibold text-lg border-b border-gray-200">
                    Team Type Summary
                  </header>

                  <div className="p-3">
                    {/* Add bar graph for team types */}
                    <div className="summary-component--team-types-bar-graph-container mb-4">
                      <div className="summary-component--team-types-bar-graph-container--bar-graph flex h-10 w-full rounded-md overflow-hidden">
                        <div
                          className="bg-purple-600 text-white flex items-center justify-center text-xs"
                          style={{ width: `${teamTypePercentages.domestic}%` }}
                        >
                          <span>{teamTypeCounts.domestic} Domestic</span>
                        </div>
                        <div
                          className="bg-blue-600 text-white flex items-center justify-center text-xs"
                          style={{ width: `${teamTypePercentages.mega}%` }}
                        >
                          <span>{teamTypeCounts.mega} Mega</span>
                        </div>
                        <div
                          className="bg-green-600 text-white flex items-center justify-center text-xs"
                          style={{ width: `${teamTypePercentages.standard}%` }}
                        >
                          <span>{teamTypeCounts.standard} Standard</span>
                        </div>
                        <div
                          className="bg-orange-600 text-white flex items-center justify-center text-xs"
                          style={{
                            width: `${teamTypePercentages.selfOrganized}%`,
                          }}
                        >
                          <span>
                            {teamTypeCounts.selfOrganized} Self-Organized
                          </span>
                        </div>
                        <div
                          className="bg-red-600 text-white flex items-center justify-center text-xs"
                          style={{
                            width: `${teamTypePercentages.newInactive}%`,
                          }}
                        >
                          <span>
                            {teamTypeCounts.newInactive} Onboarding/ In Progress
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {/* Rest of team type summary content remains the same */}
                      <div className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded-lg">
                        <span className="font-medium text-sm">Domestic</span>
                        <span className="text-base font-bold text-purple-600">
                          {teamTypeCounts.domestic}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded-lg">
                        <span className="font-medium text-sm">Mega</span>
                        <span className="text-base font-bold text-blue-600">
                          {teamTypeCounts.mega}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded-lg">
                        <span className="font-medium text-sm">Standard</span>
                        <span className="text-base font-bold text-green-600">
                          {teamTypeCounts.standard}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded-lg">
                        <span className="font-medium text-sm">
                          Self-Organized
                        </span>
                        <span className="text-base font-bold text-orange-600">
                          {teamTypeCounts.selfOrganized}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded-lg">
                        <span className="font-medium text-sm">
                          Onboarding/ In Progress
                        </span>
                        <span className="text-base font-bold text-red-600">
                          {teamTypeCounts.newInactive}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="font-semibold text-sm">
                          Total Active Teams
                        </span>
                        <span className="text-base font-bold">
                          {teamTypeTotal}
                        </span>
                      </div>
                    </div>
                    <div className="pt-20"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts card - takes up 1/3 of the width on right side */}
          <Card className="shadow-md h-full">
            <CardContent className="p-0 h-full">
              <div className="summary-component--card--wrapper h-full flex flex-col">
                <header className="summary-component--card--header p-3 font-semibold text-lg border-b border-gray-200 flex justify-between items-center">
                  <span>Alerts</span>
                </header>

                <div className="p-3 flex-grow">
                  <div className="space-y-2">
                    {/* Show all 8 mock alerts with normal text size and count numbers */}
                    <div className="p-2 border-l-4 border-red-500 bg-red-50 rounded-r-md flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-red-800 text-sm">
                          Single Agent Team Alert
                        </p>
                        <p className="text-red-700 text-sm mt-0.5">
                          Team requires minimum of 2 agents
                        </p>
                      </div>
                      <span className="bg-red-200 text-red-800 font-bold text-sm rounded-full h-6 w-6 flex items-center justify-center ml-2">
                        2
                      </span>
                    </div>

                    <div className="p-2 border-l-4 border-orange-500 bg-orange-50 rounded-r-md flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-orange-800 text-sm">
                          Team Leader at risk of leaving
                        </p>
                        <p className="text-orange-700 text-sm mt-0.5">
                          Based on activity patterns
                        </p>
                      </div>
                      <span className="bg-orange-200 text-orange-800 font-bold text-sm rounded-full h-6 w-6 flex items-center justify-center ml-2">
                        1
                      </span>
                    </div>

                    <div className="p-2 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-md flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-yellow-800 text-sm">
                          Mega team below minimum
                        </p>
                        <p className="text-yellow-700 text-sm mt-0.5">
                          Only 8 members, below 10 minimum
                        </p>
                      </div>
                      <span className="bg-yellow-200 text-yellow-800 font-bold text-sm rounded-full h-6 w-6 flex items-center justify-center ml-2">
                        3
                      </span>
                    </div>

                    <div className="p-2 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-md flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-yellow-800 text-sm">
                          Standard team below minimum
                        </p>
                        <p className="text-yellow-700 text-sm mt-0.5">
                          1 team below production minimum
                        </p>
                      </div>
                      <span className="bg-yellow-200 text-yellow-800 font-bold text-sm rounded-full h-6 w-6 flex items-center justify-center ml-2">
                        1
                      </span>
                    </div>

                    <div className="p-2 border-l-4 border-blue-500 bg-blue-50 rounded-r-md flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-blue-800 text-sm">
                          High-growth teams
                        </p>
                        <p className="text-blue-700 text-sm mt-0.5">
                          3 teams growing rapidly
                        </p>
                      </div>
                      <span className="bg-blue-200 text-blue-800 font-bold text-sm rounded-full h-6 w-6 flex items-center justify-center ml-2">
                        3
                      </span>
                    </div>

                    <div className="p-2 border-l-4 border-red-500 bg-red-50 rounded-r-md flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-red-800 text-sm">
                          Team at risk
                        </p>
                        <p className="text-red-700 text-sm mt-0.5">
                          5 teams with multiple agents left in the last 30 days
                        </p>
                      </div>
                      <span className="bg-red-200 text-red-800 font-bold text-sm rounded-full h-6 w-6 flex items-center justify-center ml-2">
                        5
                      </span>
                    </div>

                    <div className="p-2 border-l-4 border-purple-500 bg-purple-50 rounded-r-md flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-purple-800 text-sm">
                          Compliance Issue
                        </p>
                        <p className="text-purple-700 text-sm mt-0.5">
                          Team name non-compliant
                        </p>
                      </div>
                      <span className="bg-purple-200 text-purple-800 font-bold text-sm rounded-full h-6 w-6 flex items-center justify-center ml-2">
                        4
                      </span>
                    </div>

                    <div className="p-2 border-l-4 border-purple-500 bg-purple-50 rounded-r-md flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-purple-800 text-sm">
                          Contract Compliance Issue
                        </p>
                        <p className="text-purple-700 text-sm mt-0.5">
                          Requires immediate attention
                        </p>
                      </div>
                      <span className="bg-purple-200 text-purple-800 font-bold text-sm rounded-full h-6 w-6 flex items-center justify-center ml-2">
                        2
                      </span>
                    </div>

                    <div className="p-2 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-md flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-yellow-800 text-sm">
                          Needs Review
                        </p>
                      </div>
                      <span className="bg-yellow-200 text-yellow-800 font-bold text-sm rounded-full h-6 w-6 flex items-center justify-center ml-2">
                        3
                      </span>
                    </div>
                  </div>

                  <button className="w-full mt-2 py-1.5 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
                    View All Alerts
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tabs Header */}
            <div id="tabs-component" className="mb-0">
              <ul
                className="tabs-container flex border-b border-gray-200"
                role="tablist"
              >
                <li className="flex-1 tab-container">
                  <button
                    className={`w-full py-4 px-6 text-lg font-medium transition-colors ${
                      activeTab === "teams"
                        ? "bg-white text-blue-600 border-t-2 border-blue-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    role="tab"
                    type="button"
                    aria-selected={activeTab === "teams"}
                    onClick={() => setActiveTab("teams")}
                  >
                    Teams
                  </button>
                </li>
                <li className="flex-1 tab-container">
                  <button
                    className={`w-full py-4 px-6 text-lg font-medium transition-colors ${
                      activeTab === "tasks"
                        ? "bg-white text-blue-600 border-t-2 border-blue-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    role="tab"
                    type="button"
                    aria-selected={activeTab === "tasks"}
                    onClick={() => setActiveTab("tasks")}
                  >
                    Tasks
                  </button>
                </li>
              </ul>
            </div>

            {/* Teams Tab Content */}
            {activeTab === "teams" && (
              <>
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  {/* Keep existing search filters */}
                  <div className="mb-3">
                    <Input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search teams or agents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mt-4">
                    <Select value={coeRegion} onValueChange={setCoeRegion}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="COE Region (1-13)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        {[...Array(13)].map((_, i) => (
                          <SelectItem key={i + 1} value={`COE${i + 1}`}>{`COE${
                            i + 1
                          }`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={teamType} onValueChange={setTeamType}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Team Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Mega">Mega</SelectItem>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Self-Organized">
                          Self-Organized
                        </SelectItem>
                        <SelectItem value="Domestic Partnership">
                          Domestic Partnership
                        </SelectItem>
                        <SelectItem value="Onboarding/ In Progress">
                          Onboarding/ In Progress
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={primaryState}
                      onValueChange={setPrimaryState}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Primary State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        {[
                          "AL",
                          "AK",
                          "AZ",
                          "AR",
                          "CA",
                          "CO",
                          "CT",
                          "DE",
                          "FL",
                          "GA",
                          "HI",
                          "ID",
                          "IL",
                          "IN",
                          "IA",
                          "KS",
                          "KY",
                          "LA",
                          "ME",
                          "MD",
                          "MA",
                          "MI",
                          "MN",
                          "MS",
                          "MO",
                          "MT",
                          "NE",
                          "NV",
                          "NH",
                          "NJ",
                          "NM",
                          "NY",
                          "NC",
                          "ND",
                          "OH",
                          "OK",
                          "OR",
                          "PA",
                          "RI",
                          "SC",
                          "SD",
                          "TN",
                          "TX",
                          "UT",
                          "VT",
                          "VA",
                          "WA",
                          "WV",
                          "WI",
                          "WY",
                        ].map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={additionalState}
                      onValueChange={setAdditionalState}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Additional State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        {[
                          "AL",
                          "AK",
                          "AZ",
                          "AR",
                          "CA",
                          "CO",
                          "CT",
                          "DE",
                          "FL",
                          "GA",
                          "HI",
                          "ID",
                          "IL",
                          "IN",
                          "IA",
                          "KS",
                          "KY",
                          "LA",
                          "ME",
                          "MD",
                          "MA",
                          "MI",
                          "MN",
                          "MS",
                          "MO",
                          "MT",
                          "NE",
                          "NV",
                          "NH",
                          "NJ",
                          "NM",
                          "NY",
                          "NC",
                          "ND",
                          "OH",
                          "OK",
                          "OR",
                          "PA",
                          "RI",
                          "SC",
                          "SD",
                          "TN",
                          "TX",
                          "UT",
                          "VT",
                          "VA",
                          "WA",
                          "WV",
                          "WI",
                          "WY",
                        ].map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      placeholder="Active Markets / Cities"
                      className="text-sm"
                      value={market}
                      onChange={(e) => setMarket(e.target.value)}
                    />

                    <Select
                      value={certification}
                      onValueChange={setCertification}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="TLA Certification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          All Certification Status
                        </SelectItem>
                        <SelectItem value="yes_accepting">
                          Yes – Accepting New Members
                        </SelectItem>
                        <SelectItem value="yes_not_accepting">
                          Yes – Not Accepting New Members
                        </SelectItem>
                        <SelectItem value="not_certified">
                          Not Certified Team
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Region
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Team ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Team Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Team Leader
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Members
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Type
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                          <tr>
                            <td
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                              colSpan={8}
                            >
                              Loading team data...
                            </td>
                          </tr>
                        ) : error ? (
                          <tr>
                            <td
                              className="px-6 py-4 whitespace-nowrap text-sm text-red-500 text-center"
                              colSpan={7}
                            >
                              {error}
                            </td>
                          </tr>
                        ) : filteredTeamData.length === 0 ? (
                          <tr>
                            <td
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                              colSpan={7}
                            >
                              No team data available.
                            </td>
                          </tr>
                        ) : (
                          filteredTeamData.map((team, index) => {
                            // Create a unique key using both teamId and index
                            const uniqueKey = team.teamId
                              ? `${team.teamId}-${index}`
                              : `index-${index}`;

                            // Check if this teamId has been seen before (for showing the duplicate indicator)
                            const isDuplicate =
                              team.teamId &&
                              filteredTeamData.findIndex(
                                (t) => t.teamId === team.teamId
                              ) !== index;

                            return (
                              <tr
                                key={uniqueKey}
                                className={
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {team.region || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {team.teamId || "-"}
                                  {isDuplicate && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      Duplicate
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 max-w-[200px]">
                                  <div
                                    className="overflow-hidden text-ellipsis cursor-pointer hover:text-blue-600"
                                    title={team.teamName || "-"}
                                    onClick={() => navigateToTeam(team.teamId)}
                                  >
                                    {truncateText(team.teamName) || "-"}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 max-w-[200px]">
                                  <div
                                    className="overflow-hidden text-ellipsis"
                                    title={team.teamLeader || "-"}
                                  >
                                    {truncateText(team.teamLeader) || "-"}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {team.members || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {team.type || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      team.status === "Active"
                                        ? "bg-green-100 text-green-800"
                                        : team.status === "Inactive"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {team.status || "Unknown"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <button
                                    className="text-blue-600 hover:text-blue-900 mr-2"
                                    onClick={() => navigateToTeam(team.teamId)}
                                  >
                                    View
                                  </button>
                                  <button className="text-blue-600 hover:text-blue-900">
                                    Edit
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            {/* Tasks Tab Content */}
            {activeTab === "tasks" && (
              <>
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="mb-3">
                    <Input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mt-4">
                    <Select>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Task Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Task Types</SelectItem>
                        <SelectItem value="follow-up-addendum">
                          Follow-up - Team Member Addendum
                        </SelectItem>
                        <SelectItem value="follow-up-release">
                          Follow-up - Team Member Release
                        </SelectItem>
                        <SelectItem value="annual-review">
                          Annual Review Due
                        </SelectItem>
                        <SelectItem value="custom-task">Custom Task</SelectItem>
                        <SelectItem value="name-approval">
                          Team Name Approval
                        </SelectItem>
                        <SelectItem value="expansion-request">
                          Team Expansion Request
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Teams</SelectItem>
                        {allMockTeams.map((team) => (
                          <SelectItem key={team.teamId} value={team.teamId}>
                            {truncateText(team.teamName)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Due Date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Dates</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="this-week">This Week</SelectItem>
                        <SelectItem value="next-week">Next Week</SelectItem>
                        <SelectItem value="this-month">This Month</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Task Type
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Team Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Assigned User
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Notes
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Due Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockTasks.map((task, index) => (
                          <tr
                            key={task.id}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span
                                className="cursor-pointer text-blue-600 hover:underline"
                                onClick={() => navigateToTask(task.id)}
                              >
                                {task.taskType}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {truncateText(task.teamName)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {task.assignedUser}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 max-w-[200px] truncate">
                              {task.notes}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {task.dueDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  task.completedDate
                                    ? "bg-green-100 text-green-800"
                                    : new Date(task.dueDate) < new Date()
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {task.completedDate ? "Completed" : "Open"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                className="text-blue-600 hover:text-blue-900 mr-2"
                                onClick={() => navigateToTask(task.id)}
                              >
                                View
                              </button>
                              <button className="text-blue-600 hover:text-blue-900">
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
        <AIAssistant teamData={allMockTeams} />
      </div>
    </div>
  );
}

export default Home;
