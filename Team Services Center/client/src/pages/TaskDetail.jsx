import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import NavBar from "../components/NavBar";

function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [task, setTask] = useState(null);

  // Get origin information from location state
  const from = location.state?.from;
  const originTeamId = location.state?.teamId;

  // Handle the back navigation
  const handleBackNavigation = () => {
    if (from === "teamDetail" && originTeamId) {
      navigate(`/team/${originTeamId}`);
    } else {
      navigate("/");
    }
  };

  // Mock tasks data
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
      description:
        "Follow up on the new team member addendum for California Mega Team Alpha. Documents need to be signed by the team leader and the new agent.",
      teamLeader: "Jane Smith",
      teamRegion: "COE1",
      teamType: "Mega",
      teamStatus: "Active",
    },
    // Other task entries would go here
  ];

  useEffect(() => {
    // Find the task by ID
    const foundTask = mockTasks.find((t) => t.id === taskId);
    if (foundTask) {
      setTask(foundTask);
    }
  }, [taskId]);

  if (!task) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Task Not Found
          </h2>
          <p className="mb-6">
            The task with ID "{taskId}" could not be found.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Task: {task.taskType}
          </h1>
          <Button
            variant="outline"
            onClick={handleBackNavigation}
            className="mb-6"
          >
            {from === "teamDetail" ? `← Return to Team` : "← Return to Home"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Task Details Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-bold border-b pb-2">Task Details</h2>

              <div>
                <Label className="text-gray-600">Task ID</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">{task.id}</p>
              </div>

              <div>
                <Label className="text-gray-600">Task Type</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">
                  {task.taskType}
                </p>
              </div>

              <div>
                <Label className="text-gray-600">Description</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">
                  {task.description}
                </p>
              </div>

              <div>
                <Label className="text-gray-600">Notes</Label>
                <Textarea
                  defaultValue={task.notes}
                  className="mt-1 bg-gray-50"
                />
              </div>

              <div>
                <Label className="text-gray-600">Status</Label>
                <p className="mt-1">
                  <span
                    className={`px-3 py-1 inline-flex text-sm rounded-full ${
                      task.completedDate
                        ? "bg-green-100 text-green-800"
                        : new Date(task.dueDate) < new Date()
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.completedDate ? "Completed" : "Open"}
                  </span>
                </p>
              </div>

              {task.completedDate && (
                <>
                  <div>
                    <Label className="text-gray-600">Completed By</Label>
                    <p className="mt-1 p-2 bg-gray-50 rounded-md">
                      {task.completedBy}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Completed Date</Label>
                    <p className="mt-1 p-2 bg-gray-50 rounded-md">
                      {task.completedDate}
                    </p>
                  </div>
                </>
              )}

              <div className="mt-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {task.completedDate ? "Reopen Task" : "Mark as Completed"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team Details Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-bold border-b pb-2">Team Details</h2>

              <div>
                <Label className="text-gray-600">Team Name</Label>
                <p
                  className="mt-1 p-2 bg-gray-50 rounded-md cursor-pointer text-blue-600"
                  onClick={() => navigate(`/team/${task.teamId}`)}
                >
                  {task.teamName}
                </p>
              </div>

              <div>
                <Label className="text-gray-600">Team ID</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">{task.teamId}</p>
              </div>

              <div>
                <Label className="text-gray-600">Team Leader</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">
                  {task.teamLeader}
                </p>
              </div>

              <div>
                <Label className="text-gray-600">Region</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">
                  {task.teamRegion}
                </p>
              </div>

              <div>
                <Label className="text-gray-600">Team Type</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">
                  {task.teamType}
                </p>
              </div>

              <div>
                <Label className="text-gray-600">Status</Label>
                <p className="mt-1">
                  <span
                    className={`px-3 py-1 inline-flex text-sm rounded-full ${
                      task.teamStatus === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {task.teamStatus}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Task Assignment Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-bold border-b pb-2">
                Task Assignment
              </h2>

              <div>
                <Label className="text-gray-600">Assigned To</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">
                  {task.assignedUser}
                </p>
              </div>

              <div>
                <Label className="text-gray-600">Task Owner</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">{task.owner}</p>
              </div>

              <div>
                <Label className="text-gray-600">Priority</Label>
                <p className="mt-1">
                  <span
                    className={`px-3 py-1 inline-flex text-sm rounded-full ${
                      task.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.priority}
                  </span>
                </p>
              </div>

              <div>
                <Label className="text-gray-600">Due Date</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">{task.dueDate}</p>
              </div>

              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  Reassign Task
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Task Activity Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-bold border-b pb-2">Activity Log</h2>

              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                <div className="border-l-2 border-blue-500 pl-4 py-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">System</span> created this
                    task
                  </p>
                  <p className="text-xs text-gray-500">2024-07-01 09:00 AM</p>
                </div>

                <div className="border-l-2 border-blue-500 pl-4 py-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Admin</span> assigned task
                    to{" "}
                    <span className="font-semibold">{task.assignedUser}</span>
                  </p>
                  <p className="text-xs text-gray-500">2024-07-01 09:05 AM</p>
                </div>

                <div className="border-l-2 border-blue-500 pl-4 py-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">{task.assignedUser}</span>{" "}
                    updated notes
                  </p>
                  <p className="text-xs text-gray-500">2024-07-02 11:30 AM</p>
                </div>
              </div>

              <div className="mt-4">
                <Label className="text-gray-600">Add Comment</Label>
                <Textarea
                  placeholder="Type your comment here..."
                  className="mt-1 bg-gray-50"
                />
                <Button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">
                  Post Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
