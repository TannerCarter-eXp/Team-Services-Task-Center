// Team detail page
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Pencil, MessageSquare, Link } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

// Helper functions
function getTeamAlerts(team) {
  const alerts = [];
  if (!team || typeof team !== "object") return alerts;

  // Check if team is understaffed for its type
  if (
    team.type === "Mega" &&
    Array.isArray(team.agents) &&
    team.agents.length < 10
  ) {
    alerts.push("Mega Team has fewer than 10 members");
  }

  // Check for high agent loss
  if (team.recentLoss && team.recentLoss >= 3) {
    alerts.push("High agent loss");
  }

  // Check for single agent teams
  if (Array.isArray(team.agents) && team.agents.length === 1) {
    alerts.push("Single agent team");
  }

  // Add more mock alerts regardless of team state
  alerts.push("License renewal needed for team member");
  alerts.push("Compliance documentation pending");
  alerts.push("Team production below target for Q2");

  // Add a conditional mock alert based on team type
  if (team.type === "Standard" || team.type === "Mega") {
    alerts.push("Annual review overdue");
  }

  return alerts;
}

function determineTeamType(team) {
  if (!team || typeof team !== "object") return "Unknown Team Type";
  const memberCount = Array.isArray(team.agents) ? team.agents.length : 0;

  if (memberCount === 2 && team.type === "Domestic Partnership")
    return "Domestic Partnership";
  if (team.type === "Mega") return "Mega Team";
  if (team.type === "Standard") return "Standard Team";
  return "Self-Organized Team";
}

// Generate agent data for teams
function generateAgentsForTeam(team, count = 5) {
  const roles = ["Agent", "Agent", "Agent", "Agent", "Agent"];
  roles[0] = "Team Lead"; // First agent is always the team lead

  const states = [
    "CA",
    "OR",
    "WA",
    "TX",
    "FL",
    "NY",
    "AZ",
    "CO",
    "MI",
    "OH",
    "NV",
    "ID",
  ];
  const divisions = [
    "Residential",
    "Commercial",
    "Luxury",
    "Property Management",
  ];
  const capStatuses = ["Full Cap", "Half Cap", "Quarter Cap"];
  const payPlans = ["Standard", "Split", "Team"];
  const agentNames = [
    team.teamLeader,
    "Alex Johnson",
    "Jamie Smith",
    "Casey Brown",
    "Jordan Lee",
    "Taylor Green",
    "Morgan Davis",
    "Riley Wilson",
    "Quinn Martinez",
    "Sam Rodriguez",
    "Cameron Garcia",
    "Jordan Patel",
    "Avery Thompson",
    "Drew Williams",
    "Blake Anderson",
    "Sydney Thomas",
    "Leslie Hall",
  ];

  // Make sure we have at least the number of agent names we need
  while (agentNames.length < count) {
    agentNames.push(`Agent ${agentNames.length + 1}`);
  }

  const agents = [];

  for (let i = 0; i < count; i++) {
    const yearOffset = Math.floor(Math.random() * 4);
    const monthOffset = Math.floor(Math.random() * 12) + 1;
    const dayOffset = Math.floor(Math.random() * 28) + 1;

    const date = new Date();
    date.setFullYear(date.getFullYear() - yearOffset);
    date.setMonth(monthOffset - 1);
    date.setDate(dayOffset);

    const effectiveDate = date.toISOString().split("T")[0].replace(/-/g, "/");

    agents.push({
      name: agentNames[i],
      effectiveDate,
      capStatus: capStatuses[Math.floor(Math.random() * capStatuses.length)],
      payPlan: payPlans[Math.floor(Math.random() * payPlans.length)],
      role: roles[i] || "Agent",
      primaryState:
        i === 0
          ? team.state
          : states[Math.floor(Math.random() * states.length)],
      division: divisions[Math.floor(Math.random() * divisions.length)],
      lifecycle: "Active",
    });
  }

  return agents;
}

// Mock teams data - based on the home page mock data but enhanced for team details view
const mockTeamsData = [
  {
    teamId: "CA001",
    teamName: "California Mega Team Alpha",
    teamLeader: "Jane Smith",
    members: "View",
    type: "Mega",
    status: "Active",
    state: "CA",
    additionalStates: ["OR", "NV"],
    region: "COE1",
    date: "2023-01-15",
    expEntity: "eXp Realty, LLC",
    capResetDate: "2025-01-15",
    formedDate: "2023-01-15",
    creationDate: "2023-01-15",
    openToAgents: true,
    recentLoss: 3,
    agents: [],
  },
  {
    teamId: "CA002",
    teamName: "California Mega Team Beta",
    teamLeader: "John Davis",
    members: "View",
    type: "Mega",
    status: "Active",
    state: "CA",
    additionalStates: ["AZ"],
    region: "COE1",
    date: "2023-02-20",
    expEntity: "eXp Realty, LLC",
    capResetDate: "2025-02-20",
    formedDate: "2023-02-20",
    creationDate: "2023-02-20",
    openToAgents: true,
    recentLoss: 0,
    agents: [],
  },
  {
    teamId: "CA003",
    teamName: "Bay Area Standard Team",
    teamLeader: "Michael Johnson",
    members: "View",
    type: "Standard",
    status: "Active",
    state: "CA",
    additionalStates: [],
    region: "COE1",
    date: "2023-03-10",
    expEntity: "eXp Realty, LLC",
    capResetDate: "2025-03-10",
    formedDate: "2023-03-10",
    creationDate: "2023-03-10",
    openToAgents: false,
    recentLoss: 0,
    agents: [],
  },
  {
    teamId: "CA004",
    teamName: "LA Standard Team",
    teamLeader: "Sarah Williams",
    members: "View",
    type: "Standard",
    status: "Active",
    state: "CA",
    additionalStates: [],
    region: "COE1",
    date: "2023-04-05",
    expEntity: "eXp Realty, LLC",
    capResetDate: "2025-04-05",
    formedDate: "2023-04-05",
    creationDate: "2023-04-05",
    openToAgents: true,
    recentLoss: 1,
    agents: [],
  },
  {
    teamId: "CA005",
    teamName: "San Diego Self-Organized Team",
    teamLeader: "Robert Brown",
    members: "View",
    type: "Self-Organized",
    status: "Active",
    state: "CA",
    additionalStates: [],
    region: "COE1",
    date: "2023-05-22",
    expEntity: "eXp Realty, LLC",
    capResetDate: "2025-05-22",
    formedDate: "2023-05-22",
    creationDate: "2023-05-22",
    openToAgents: false,
    recentLoss: 0,
    agents: [],
  },
  {
    teamId: "CA006",
    teamName: "Sacramento Self-Organized Team",
    teamLeader: "Emily Wilson",
    members: "View",
    type: "Self-Organized",
    status: "Active",
    state: "CA",
    additionalStates: [],
    region: "COE1",
    date: "2023-06-18",
    expEntity: "eXp Realty, LLC",
    capResetDate: "2025-06-18",
    formedDate: "2023-06-18",
    creationDate: "2023-06-18",
    openToAgents: true,
    recentLoss: 0,
    agents: [],
  },
  {
    teamId: "OR001",
    teamName: "Pacific Northwest Mega Team",
    teamLeader: "David Miller",
    members: "View",
    type: "Mega",
    status: "Active",
    state: "OR",
    additionalStates: ["WA", "ID"],
    region: "COE2",
    date: "2023-02-10",
    expEntity: "eXp Realty, LLC",
    capResetDate: "2025-02-10",
    formedDate: "2023-02-10",
    creationDate: "2023-02-10",
    openToAgents: true,
    recentLoss: 0,
    agents: [],
  },
  {
    teamId: "WA001",
    teamName: "Seattle Mega Team",
    teamLeader: "Lisa Anderson",
    members: "View",
    type: "Mega",
    status: "Active",
    state: "WA",
    additionalStates: ["OR"],
    region: "COE2",
    date: "2023-03-15",
    expEntity: "eXp Realty, LLC",
    capResetDate: "2025-03-15",
    formedDate: "2023-03-15",
    creationDate: "2023-03-15",
    openToAgents: true,
    recentLoss: 1,
    agents: [],
  },
  {
    teamId: "MI001",
    teamName: "Michigan Standard Team",
    teamLeader: "Thomas Clark",
    members: "View",
    type: "Standard",
    status: "Active",
    state: "MI",
    additionalStates: [],
    region: "COE2",
    date: "2023-01-25",
    expEntity: "eXp Realty, LLC",
    capResetDate: "2025-01-25",
    formedDate: "2023-01-25",
    creationDate: "2023-01-25",
    openToAgents: false,
    recentLoss: 0,
    agents: [],
  },
  {
    teamId: "AK001",
    teamName: "Alaska Standard Team",
    teamLeader: "Jennifer White",
    members: "View",
    type: "Standard",
    status: "Active",
    state: "AK",
    additionalStates: [],
    region: "COE2",
    date: "2023-04-20",
    expEntity: "eXp Realty, LLC",
    capResetDate: "2025-04-20",
    formedDate: "2023-04-20",
    creationDate: "2023-04-20",
    openToAgents: true,
    recentLoss: 0,
    agents: [],
  },
  {
    teamId: "WA002",
    teamName: "Tacoma Self-Organized Team",
    teamLeader: "Kevin Lee",
    members: "View",
    type: "Self-Organized",
    status: "Active",
    state: "WA",
    additionalStates: [],
    region: "COE2",
    date: "2023-05-05",
    expEntity: "eXp Realty, LLC",
    capResetDate: "2025-05-05",
    formedDate: "2023-05-05",
    creationDate: "2023-05-05",
    openToAgents: false,
    recentLoss: 0,
    agents: [],
  },
  {
    teamId: "MI002",
    teamName: "Detroit Self-Organized Team",
    teamLeader: "Amanda Martin",
    members: "View",
    type: "Self-Organized",
    status: "Active",
    state: "MI",
    additionalStates: [],
    region: "COE2",
    date: "2023-06-10",
    expEntity: "eXp Realty, LLC",
    capResetDate: "2025-06-10",
    formedDate: "2023-06-10",
    creationDate: "2023-06-10",
    openToAgents: true,
    recentLoss: 0,
    agents: [],
  },
];

// Generate agent data for each team
mockTeamsData.forEach((team) => {
  const agentCount =
    team.type === "Mega" ? 12 : team.type === "Standard" ? 6 : 3;
  team.agents = generateAgentsForTeam(team, agentCount);
});

// Main TeamDetail component
function TeamDetail() {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [rosterLink, setRosterLink] = useState(""); // Add this for storing the roster URL
  const [isEditLinkOpen, setIsEditLinkOpen] = useState(false); // Add this for controlling the dialog
  const [membersTab, setMembersTab] = useState("active");
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [currentAlertId, setCurrentAlertId] = useState(null);
  const [alertNote, setAlertNote] = useState("");

  // Add function to handle opening note dialog
  const navigateToTask = () => {
    navigate(`/task/T001`, {
      state: {
        from: "teamDetail",
        teamId: team.teamId,
      },
    });
  };

  // Add function to save note
  const saveAlertNote = () => {
    // Here you would save the note for the specific alert
    console.log(`Saving note for alert ${currentAlertId}: ${alertNote}`);
    setIsNotesDialogOpen(false);
  };

  // Find and set the team data
  useEffect(() => {
    const foundTeam = mockTeamsData.find((t) => t.teamId === teamId);
    if (foundTeam) {
      setTeam(foundTeam);
    }
  }, [teamId]);

  const handleGoBack = () => {
    navigate("/");
  };

  const openRosterLinkEditor = () => setIsEditLinkOpen(true);
  const closeRosterLinkEditor = () => setIsEditLinkOpen(false);

  const saveRosterLink = () => {
    // Here you would typically save this to your backend
    closeRosterLinkEditor();
  };

  const handleOpenRosterLink = () => {
    if (rosterLink) {
      window.open(rosterLink, "_blank");
    } else {
      openRosterLinkEditor();
    }
  };

  const formerTeamMembers = [
    {
      name: "Alex Rodriguez",
      role: "Team Member",
      primaryState: "CA",
      division: "Residential",
      payPlan: "Standard",
      lifecycle: "Inactive",
      capStatus: "N/A",
      effectiveDate: "2023/02/15",
      exitDate: "2023/11/20",
      exitReason: "Left company",
    },
  ];

  // If team is not found
  if (!team) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Team Not Found
          </h2>
          <p className="mb-6">
            The team with ID "{teamId}" could not be found.
          </p>
          <Button
            onClick={handleGoBack}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const alerts = getTeamAlerts(team);

  return (
    <div>
      {/* Add the NavBar at the top */}
      <NavBar />
      <div className="p-6">
        {/* Team header section */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {team.teamName || "Team Details"}
          </h1>

          {/* Move Return to Home button below the header */}
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="mb-6"
          >
            ← Return to Home
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-bold border-b pb-2">
                Team Information
              </h2>
              <div>
                <Label className="text-gray-600">Name</Label>
                <Input
                  defaultValue={team.teamName || ""}
                  readOnly
                  className="mt-1 bg-gray-50"
                />
              </div>
              <div>
                <Label className="text-gray-600">ID</Label>
                <Input
                  defaultValue={team.teamId || ""}
                  readOnly
                  className="mt-1 bg-gray-50"
                />
              </div>
              <div>
                <Label className="text-gray-600">Team Type</Label>
                <Input
                  defaultValue={team.type || ""}
                  readOnly
                  className="mt-1 bg-gray-50"
                />
              </div>
              <div>
                <Label className="text-gray-600">Team Leader</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">
                  {team.teamLeader || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Status</Label>
                <p className="mt-1">
                  <span
                    className={`px-3 py-1 inline-flex text-sm rounded-full ${
                      team.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {team.status || "Unknown"}
                  </span>
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handleOpenRosterLink}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50 flex-grow mr-2"
                  >
                    Link to Team Roster Spreadsheet
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={openRosterLinkEditor}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-bold border-b pb-2">
                Team Geography
              </h2>
              <div>
                <Label className="text-gray-600">Region</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">
                  {team.region || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Primary State</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">
                  {team.state || "N/A"}
                </p>
              </div>
              {team.additionalStates && team.additionalStates.length > 0 && (
                <div>
                  <Label className="text-gray-600">Additional States</Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded-md">
                    {team.additionalStates.join(", ")}
                  </p>
                </div>
              )}
              <div>
                <Label className="text-gray-600">eXp Entity</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">
                  {team.expEntity || "N/A"}
                </p>
              </div>
              <h2 className="text-xl font-bold border-b pb-2 mt-6">
                Team Key Dates
              </h2>
              <div>
                <Label className="text-gray-600">Cap Reset Date</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">
                  {team.capResetDate || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Formed Date</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">
                  {team.formedDate || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Creation Date</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">
                  {team.creationDate || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Third column - split into Alerts and Notes vertically */}
          <div className="space-y-6">
            {/* Alerts card - top half of third column */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow h-[calc(50%-12px)]">
              <CardContent className="space-y-4 p-6 h-full flex flex-col">
                <h2 className="text-xl font-bold border-b pb-2">Alerts</h2>
                <div className="flex-grow overflow-y-auto">
                  {alerts.length > 0 ? (
                    <ul className="list-disc list-inside text-sm space-y-2 mt-2">
                      {alerts.map((alert, index) => (
                        <li
                          key={index}
                          className={`font-semibold p-2 rounded-md flex justify-between items-center ${
                            alert.includes("Single") ||
                            alert.includes("License")
                              ? "text-red-600 bg-red-50"
                              : alert.includes("Mega") ||
                                alert.includes("review")
                              ? "text-yellow-600 bg-yellow-50"
                              : alert.includes("production") ||
                                alert.includes("Compliance")
                              ? "text-blue-600 bg-blue-50"
                              : "text-orange-600 bg-orange-50"
                          }`}
                        >
                          <span>{alert}</span>
                          <div className="flex items-center gap-2">
                            {/* Add link icon that navigates to task detail for High agent loss */}
                            {alert.includes("High agent loss") ? (
                              <button
                                onClick={() =>
                                  navigate("/task/T001", {
                                    state: {
                                      from: "teamDetail",
                                      teamId: team.teamId,
                                    },
                                  })
                                }
                                className="text-gray-500 hover:text-blue-600 flex-shrink-0"
                                title="View related task"
                              >
                                <Link size={16} />
                              </button>
                            ) : (
                              <button
                                className="text-gray-500 hover:text-blue-600 flex-shrink-0 opacity-50"
                                title="No related task"
                              >
                                <Link size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => openNoteDialog(index)}
                              className="text-gray-500 hover:text-blue-600 flex-shrink-0"
                              title="Add note for this alert"
                            >
                              <MessageSquare size={16} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2 p-2 bg-gray-50 rounded-md">
                      No active alerts.
                    </p>
                  )}
                </div>
                <div className="mt-auto pt-2">
                  <Button
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50 w-full"
                  >
                    View All Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notes card - bottom half of third column */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow h-[calc(50%-12px)]">
              <CardContent className="space-y-4 p-6 h-full flex flex-col">
                <h2 className="text-xl font-bold border-b pb-2">Notes</h2>
                <div className="flex-grow">
                  <Textarea
                    placeholder="Add internal notes about this team..."
                    className="h-full min-h-[120px] mt-2"
                  />
                </div>
                <div className="mt-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Save Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Alert Note</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Textarea
                  placeholder="Add a note about this alert..."
                  value={alertNote}
                  onChange={(e) => setAlertNote(e.target.value)}
                  className="w-full h-32"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsNotesDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={saveAlertNote}>Save Note</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mt-6 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="space-y-4 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Team Members ({team.agents?.length || 0})
              </h2>
              <Button
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Add Member
              </Button>
            </div>

            <Tabs
              defaultValue="active"
              value={membersTab}
              onValueChange={setMembersTab}
              className="w-full mt-4"
            >
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="active">Active Team Members</TabsTrigger>
                <TabsTrigger value="joining">Joining Team Members</TabsTrigger>
                <TabsTrigger value="satellite">
                  Satellite Team Members
                </TabsTrigger>
                <TabsTrigger value="former">Former Team Members</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-left">
                      <tr>
                        <th className="px-4 py-3 font-medium text-gray-600 border">
                          Agent ID
                        </th>
                        <th className="px-4 py-3 font-medium text-gray-600 border">
                          Agent Name
                        </th>
                        <th className="px-4 py-3 font-medium text-gray-600 border">
                          Team Agent Role
                        </th>
                        <th className="px-4 py-3 font-medium text-gray-600 border">
                          Primary Licensed State
                        </th>
                        <th className="px-4 py-3 font-medium text-gray-600 border">
                          Division
                        </th>
                        <th className="px-4 py-3 font-medium text-gray-600 border">
                          Payplan
                        </th>
                        <th className="px-4 py-3 font-medium text-gray-600 border">
                          Lifecycle Status
                        </th>
                        <th className="px-4 py-3 font-medium text-gray-600 border">
                          Cap
                        </th>
                        <th className="px-4 py-3 font-medium text-gray-600 border">
                          Effective Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(team.agents) && team.agents.length > 0 ? (
                        team.agents.map((agent, index) => (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="px-4 py-3 border">
                              AGENT-{team.teamId}-{index + 1}
                            </td>
                            <td className="px-4 py-3 border font-medium">
                              <span
                                onClick={() =>
                                  navigate(
                                    `/team/${team.teamId}/agent/AGENT-${
                                      team.teamId
                                    }-${index + 1}`
                                  )
                                }
                                className="cursor-pointer text-blue-600 hover:underline"
                              >
                                {agent.name}
                              </span>
                            </td>
                            <td className="px-4 py-3 border">
                              {agent.role === "Team Lead"
                                ? "Team Leader"
                                : "Team Member"}
                            </td>
                            <td className="px-4 py-3 border">
                              {agent.primaryState}
                            </td>
                            <td className="px-4 py-3 border">
                              {agent.division}
                            </td>
                            <td className="px-4 py-3 border">
                              {team.type === "Mega"
                                ? agent.role === "Team Lead"
                                  ? "Mega Team Leader"
                                  : "Mega Team 1/4 Cap Agent"
                                : agent.payPlan}
                            </td>
                            <td className="px-4 py-3 border">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {agent.lifecycle}
                              </span>
                            </td>
                            <td className="px-4 py-3 border">
                              {team.type === "Mega"
                                ? agent.role === "Team Lead"
                                  ? "$16,000"
                                  : "$4,000"
                                : agent.capStatus}
                            </td>
                            <td className="px-4 py-3 border">
                              {agent.effectiveDate}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={9}
                            className="text-center px-4 py-4 border"
                          >
                            No active agents listed.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="joining" className="mt-0">
                <div className="flex items-center justify-center h-48 border rounded-lg bg-gray-50">
                  <p className="text-gray-500">
                    No agents currently joining this team.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="satellite" className="mt-0">
                <div className="flex items-center justify-center h-48 border rounded-lg bg-gray-50">
                  <p className="text-gray-500">
                    No satellite agents in this team.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="former" className="mt-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-left">
                      <tr>
                        <th className="px-4 py-3 font-medium text-gray-600 border">
                          Agent ID
                        </th>
                        <th className="px-4 py-3 font-medium text-gray-600 border">
                          Agent Name
                        </th>
                        <th className="px-4 py-3 font-medium text-gray-600 border">
                          Team Agent Role
                        </th>
                        <th className="px-4 py-3 font-medium text-gray-600 border">
                          Primary Licensed State
                        </th>
                        <th className="px-4 py-3 font-medium text-gray-600 border">
                          Division
                        </th>
                        <th className="px-4 py-3 font-medium text-gray-600 border">
                          Payplan
                        </th>
                        <th className="px-4 py-3 font-medium text-gray-600 border">
                          Exit Date
                        </th>
                        <th className="px-4 py-3 font-medium text-gray-600 border">
                          Exit Reason
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formerTeamMembers.map((agent, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-4 py-3 border">
                            FORMER-{team.teamId}-{index + 1}
                          </td>
                          <td className="px-4 py-3 border font-medium">
                            {agent.name}
                          </td>
                          <td className="px-4 py-3 border">{agent.role}</td>
                          <td className="px-4 py-3 border">
                            {agent.primaryState}
                          </td>
                          <td className="px-4 py-3 border">{agent.division}</td>
                          <td className="px-4 py-3 border">{agent.payPlan}</td>
                          <td className="px-4 py-3 border">{agent.exitDate}</td>
                          <td className="px-4 py-3 border">
                            {agent.exitReason}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditLinkOpen} onOpenChange={setIsEditLinkOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Team Roster Spreadsheet Link</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Paste spreadsheet URL here"
              value={rosterLink}
              onChange={(e) => setRosterLink(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeRosterLinkEditor}>
              Cancel
            </Button>
            <Button onClick={saveRosterLink}>Save Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TeamDetail;
