// src/components/AIAssistant.jsx
import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
const [serverStatus, setServerStatus] = useState("unknown"); // "unknown", "waking", "ready"

// Add this useEffect to wake up the server when the component mounts
useEffect(() => {
  const wakeUpServer = async () => {
    try {
      setServerStatus("waking");
      // Simple ping to wake up the server
      const response = await fetch(
        `${import.meta.env.VITE_GLITCH_API_URL}/ping`
      );
      if (response.ok) {
        setServerStatus("ready");
        console.log("Glitch server is awake");
      }
    } catch (error) {
      console.log("Server wake-up ping failed, will retry on user interaction");
    }
  };

  wakeUpServer();
}, []);

const AIAssistant = ({ teamData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I can help you analyze team data or generate reports. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add the export functions here
  const handleExport = (content) => {
    // Extract table data from markdown
    const tableData = parseMarkdownTable(content);

    // Convert to CSV
    const csv = convertToCSV(tableData);

    // Create download
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "COE1_Teams_Report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Helper functions
  const parseMarkdownTable = (markdown) => {
    const lines = markdown.split("\n");
    const tableLines = lines.filter((line) => line.trim().startsWith("|"));

    // Skip header separator row (the one with |---|---|)
    const dataLines = tableLines.filter((line) => !line.includes("|-"));

    return dataLines.map((line) => {
      // Split by | and remove empty first/last elements
      const cells = line.split("|").filter((cell) => cell.trim() !== "");
      return cells.map((cell) => cell.trim());
    });
  };

  const convertToCSV = (data) => {
    return data
      .map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    const userQuery = input;
    setInput("");
    setIsProcessing(true);

    try {
      // Determine relevant data based on query
      let relevantData = [];
      const lowerQuery = userQuery.toLowerCase();

      // Filter data based on query
      if (lowerQuery.includes("coe1")) {
        relevantData = teamData.filter((team) => team.region === "COE1");
      } else if (lowerQuery.includes("mega")) {
        relevantData = teamData.filter((team) => team.type === "Mega");
      } else if (lowerQuery.includes("standard")) {
        relevantData = teamData.filter((team) => team.type === "Standard");
      } else if (lowerQuery.includes("self-organized")) {
        relevantData = teamData.filter(
          (team) => team.type === "Self-Organized"
        );
      } else {
        // Default: send a sample of data (or summary data)
        relevantData = teamData.slice(0, 10); // Just first 10 for example
      }

      // Call our AI service
      // To this:
      const response = await fetch(
        `${import.meta.env.VITE_GLITCH_API_URL}/api/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userQuery,
            teamData: relevantData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();

      // Handle special actions like data export
      if (data.action === "export_data") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message,
            attachments: [{ type: "data", label: "Download Report" }],
          },
        ]);
      } else {
        // Regular text response
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
      }
    } catch (error) {
      console.error("Error processing AI request:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error processing your request. Please try again.",
        },
      ]);
    }

    setIsProcessing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (content) => {
    // Detect if the content contains a markdown table
    if (content.includes("|") && content.includes("-")) {
      // Parse the table
      const lines = content.split("\n");

      // Find title (any line that starts with # or has a : at the end)
      // Change from const to let so we can modify it
      let titleLine = lines.find(
        (line) =>
          (line.trim().startsWith("#") || line.trim().endsWith(":")) &&
          !line.includes("|")
      );

      // Clean up the title by removing markdown heading indicators
      if (titleLine) {
        titleLine = titleLine.replace(/^#+\s*/, "").trim();
      }

      // Get all table lines (containing |)
      const tableLines = lines.filter((line) => line.includes("|"));

      // Find separator line (contains --- or ===)
      const separatorIndex = tableLines.findIndex(
        (line) => line.includes("-") && line.includes("|")
      );

      // If we found a separator, the header is the line before it
      let headerLine;
      let dataLines;

      if (separatorIndex > 0) {
        // Normal markdown table format with separator
        headerLine = tableLines[separatorIndex - 1];
        dataLines = tableLines.slice(separatorIndex + 1);
      } else if (tableLines.length > 0) {
        // No separator found, assume first line is header
        headerLine = tableLines[0];
        dataLines = tableLines.slice(1);
      } else {
        // Fallback if structure is unclear
        return <div className="whitespace-pre-wrap">{content}</div>;
      }

      // Extract headers
      const headers = headerLine
        .split("|")
        .filter((cell) => cell.trim() !== "")
        .map((cell) => cell.trim());

      // Extract data rows
      const rows = dataLines
        .map((line) => {
          return line
            .split("|")
            .filter((cell) => cell.trim() !== "")
            .map((cell) => cell.trim());
        })
        .filter((row) => row.length > 0); // Filter out empty rows

      // Return a nicely formatted table component
      return (
        <div className="overflow-hidden">
          {titleLine && <h3 className="font-bold text-lg mb-2">{titleLine}</h3>}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((header, i) => (
                    <th
                      key={i}
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="px-3 py-2 text-sm text-gray-500 border-b"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // For non-table content or if table detection fails
    return <div className="whitespace-pre-wrap">{content}</div>;
  };

  return (
    <>
      {/* Chat panel */}
      <div
        className={`fixed right-0 bottom-0 z-40 h-[600px] w-[400px] bg-white shadow-xl rounded-tl-2xl transition-all duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header with close button */}
        <div className="bg-blue-600 text-white p-4 rounded-tl-2xl flex justify-between items-center">
          <h3 className="font-semibold">Team Services AI Assistant</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-red-200 transition-colors"
            aria-label="Close assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages area - Keep your existing messages area code */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 ${
                msg.role === "user"
                  ? "ml-auto max-w-[80%]"
                  : "mr-auto max-w-[80%]"
              }`}
            >
              <div
                className={`p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                {msg.role === "assistant"
                  ? renderMessage(msg.content)
                  : msg.content}

                {/* Attachments with export functionality */}
                {msg.attachments?.map((attachment, i) => (
                  <button
                    key={i}
                    className="flex items-center mt-2 text-blue-600 hover:underline"
                    onClick={() => handleExport(msg.content)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    {attachment.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area - Keep your existing input area code */}
        <div className="p-4 border-t border-gray-200">
          {serverStatus === "waking" && (
            <div className="text-sm text-amber-600 mb-2">
              AI server is waking up, first response may take a moment...
            </div>
          )}
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your teams..."
              className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isProcessing}
            />
            <button
              onClick={handleSendMessage}
              disabled={isProcessing}
              className={`p-2 rounded-r-md transition-colors ${
                isProcessing
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Suggested prompts */}
          <div className="mt-3 flex gap-2 flex-wrap">
            <button
              onClick={() => setInput("Create a report of all COE1 teams")}
              className="text-xs bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1"
            >
              COE1 teams report
            </button>
            <button
              onClick={() => setInput("Compare mega teams vs standard teams")}
              className="text-xs bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1"
            >
              Compare team types
            </button>
            <button
              onClick={() => setInput("Which teams need attention?")}
              className="text-xs bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1"
            >
              At-risk teams
            </button>
          </div>
        </div>
      </div>

      {/* Floating button - now only for opening */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <MessageSquare className="text-white w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default AIAssistant;
