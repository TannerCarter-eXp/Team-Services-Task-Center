import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TeamDetail from "./pages/TeamDetail";
import AgentDetail from "./pages/AgentDetail";
import TaskDetail from "./pages/TaskDetail";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team/:teamId" element={<TeamDetail />} />
          <Route
            path="/team/:teamId/agent/:agentId"
            element={<AgentDetail />}
          />
          <Route path="/task/:taskId" element={<TaskDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
