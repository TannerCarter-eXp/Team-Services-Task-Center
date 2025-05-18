// src/components/NavBar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const notificationRef = useRef(null);

  useEffect(() => {
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

  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-white border-b border-gray-300 shadow-sm">
      <div className="flex items-center">
        {/* eXp Logo SVG */}
        <svg
          className="h-8 w-auto"
          viewBox="0 0 277.397 144"
          fill="currentColor"
        >
          <path d="M20.991,69.484q1.05,9.443,7.345,14.693a23,23,0,0,0,15.22,5.248,25.05,25.05,0,0,0,13.207-3.238,36.606,36.606,0,0,0,9.358-8.133L81.164,89.425a42.627,42.627,0,0,1-16.442,12.943,48.465,48.465,0,0,1-19.067,3.849,50.408,50.408,0,0,1-17.844-3.149,42.8,42.8,0,0,1-14.518-8.922,42.288,42.288,0,0,1-9.708-13.9A44.4,44.4,0,0,1,0,62.136,44.4,44.4,0,0,1,3.585,44.031a42.306,42.306,0,0,1,9.708-13.907A42.766,42.766,0,0,1,27.811,21.2a50.408,50.408,0,0,1,17.844-3.149,40.8,40.8,0,0,1,16,3.061A34.336,34.336,0,0,1,74.08,29.949a40.854,40.854,0,0,1,8.045,14.257,60.465,60.465,0,0,1,2.888,19.5v5.773ZM64.022,53.739q-.176-9.447-5.773-14.693T42.681,33.8q-9.447,0-14.956,5.423T20.991,53.739Z"></path>
          <path d="M186.786,20.155h19.943V32.748h.35a26.242,26.242,0,0,1,12.244-11.282,40.523,40.523,0,0,1,16.617-3.411,42.294,42.294,0,0,1,17.317,3.411,38.824,38.824,0,0,1,13.12,9.358A40.111,40.111,0,0,1,274.6,44.817a52.424,52.424,0,0,1,2.8,17.319,49.551,49.551,0,0,1-2.974,17.317,43.052,43.052,0,0,1-8.309,13.993,38.343,38.343,0,0,1-12.857,9.361,39.367,39.367,0,0,1-16.442,3.41,40.834,40.834,0,0,1-10.408-1.225,35.733,35.733,0,0,1-8.134-3.149,31.965,31.965,0,0,1-5.948-4.11,29.771,29.771,0,0,1-4.024-4.287h-.524V144H186.786Zm69.62,41.981a27.33,27.33,0,0,0-1.661-9.445,23.782,23.782,0,0,0-4.9-8.049,24.815,24.815,0,0,0-36.209,0,23.7,23.7,0,0,0-4.9,8.049,27.684,27.684,0,0,0,0,18.89,23.628,23.628,0,0,0,4.9,8.047,24.81,24.81,0,0,0,36.209,0,23.706,23.706,0,0,0,4.9-8.047A27.313,27.313,0,0,0,256.406,62.136Z"></path>
          <polygon points="144.25 62.13 176.273 104.114 150.737 104.114 131.458 78.851 112.225 104.114 86.688 104.114 166.086 0 191.624 0 144.25 62.13"></polygon>
          <polygon points="112.238 20.154 86.698 20.154 112.537 54.074 125.293 37.309 112.238 20.154"></polygon>
          <path d="M276.541,3.21A6.245,6.245,0,0,0,274.176.859a6.655,6.655,0,0,0-6.541,0,6.237,6.237,0,0,0-2.37,2.351,6.543,6.543,0,0,0-.023,6.427,6.331,6.331,0,0,0,2.347,2.376,6.6,6.6,0,0,0,6.647-.008,6.322,6.322,0,0,0,2.337-2.386,6.533,6.533,0,0,0-.032-6.409Zm-.367,3.226a5.252,5.252,0,0,1-.7,2.653,5.159,5.159,0,0,1-1.92,1.918,5.35,5.35,0,0,1-5.286.013A5.154,5.154,0,0,1,266.343,9.1a5.325,5.325,0,0,1,0-5.308,5.088,5.088,0,0,1,1.929-1.909,5.394,5.394,0,0,1,5.29.008,5.1,5.1,0,0,1,1.92,1.905A5.209,5.209,0,0,1,276.174,6.436Z"></path>
          <path d="M273.341,6.217a2.016,2.016,0,0,0,.314-1.157,1.816,1.816,0,0,0-.68-1.513,3.058,3.058,0,0,0-1.932-.535h-2.625V9.79h1.455V7.309h1.161l1.325,2.481h1.563V9.725l-1.529-2.77A2.11,2.11,0,0,0,273.341,6.217ZM271.9,5.91a1.239,1.239,0,0,1-.85.267h-1.175V4.143h1.17a1.215,1.215,0,0,1,.872.275,1,1,0,0,1,.284.754A.939.939,0,0,1,271.9,5.91Z"></path>
        </svg>

        {/* Divider */}
        <div className="mx-4 h-6 border-l border-gray-300"></div>

        {/* Title */}
        <Link
          to="/"
          className="text-xl font-bold text-gray-800 hover:text-blue-600"
        >
          Team Services Center
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <div
            className="relative cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Bell className="w-6 h-6 text-red-500" title="Notifications" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
              4
            </span>
          </div>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg z-10">
              <div className="p-3 text-base font-semibold border-b bg-red-50 flex justify-between">
                <span>Notifications</span>
                <span className="text-sm text-red-600">4 new</span>
              </div>
              <ul className="max-h-60 overflow-y-auto text-sm divide-y divide-gray-200">
                {/* Notification 1 */}
                <li className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-2 mt-0.5">
                      <svg
                        className="h-4 w-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Broker Approved Team Name
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">@John</span> approved "
                        <span className="text-blue-600">Happy Agent Sells</span>
                        "
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        30 minutes ago
                      </p>
                    </div>
                  </div>
                </li>

                {/* Notification 2 */}
                <li className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-2 mt-0.5">
                      <svg
                        className="h-4 w-4 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Broker Denied Team Name
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">@Sophie</span> denied "
                        <span className="text-red-600">Home Brokerage</span>"
                      </p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                </li>

                {/* Notification 3 */}
                <li className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-2 mt-0.5">
                      <svg
                        className="h-4 w-4 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Annual Review Due
                      </p>
                      <p className="text-gray-600">
                        For "
                        <span className="text-blue-600">
                          Sunshine & Homes Team
                        </span>
                        "
                      </p>
                      <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                    </div>
                  </div>
                </li>

                {/* Notification 4 */}
                <li className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-2 mt-0.5">
                      <svg
                        className="h-4 w-4 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Task Ready</p>
                      <p className="text-gray-600">
                        Follow up with "
                        <span className="text-blue-600">
                          California Mega Team Alpha
                        </span>
                        "
                      </p>
                      <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                    </div>
                  </div>
                </li>
              </ul>
              <div className="p-2 border-t">
                <button className="w-full py-2 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Button */}
        <div className="relative">
          <button
            title="Show user profile menu"
            type="button"
            className="flex items-center space-x-2 hover:bg-gray-100 rounded-full py-1 px-2 transition-colors"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <span className="font-medium text-sm">User</span>
            <svg
              className="w-3 h-3 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
              <div className="py-1">
                <a
                  href="#profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </a>
                <a
                  href="#settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <div className="border-t border-gray-100"></div>
                <a
                  href="#logout"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign out
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
