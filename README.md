# Team Services Center

A modern, responsive web application for managing real estate teams, agents, and tasks within a brokerage system for needs tied specifically to the Teams Services department.

## Please note this is all mock data.

---

### 🚀 Features

- **Dashboard Overview**: View key metrics, team summaries, and alerts at a glance  
- **Team Management**: Comprehensive team listings with filtering and detailed profiles  
- **Agent Profiles**: Detailed agent information with history and performance metrics  
- **Task Tracking**: Assign, track, and manage tasks associated with teams  
- **AI Assistant**: Integrated ChatGPT-powered assistant for generating reports and answering questions  
- **Interactive Filtering**: Filter teams by region, type, state, and more  
- **Responsive Design**: Seamlessly works across desktop and mobile devices  

---

### 💻 Tech Stack

- **Frontend**: React, TailwindCSS, [shadcn/ui](https://ui.shadcn.com)  
- **Routing**: React Router  
- **State Management**: React Hooks  
- **AI Integration**: OpenAI API (ChatGPT)  
- **Charts & Visualization**: Custom-built data visualization components  
- **Icons**: Lucide React  

---

### 📋 Project Structure
client/
├── src/
│ ├── components/ # Reusable UI components
│ │ ├── ui/ # Base UI components
│ │ ├── NavBar.jsx # Navigation component
│ │ └── AIAssistant.jsx # AI assistant component
│ ├── pages/ # Page components
│ │ ├── Home.jsx # Dashboard/home page
│ │ ├── TeamDetail.jsx # Team details page
│ │ ├── AgentDetail.jsx # Agent profile page
│ │ └── TaskDetail.jsx # Task details page
│ ├── images/ # Static images
│ ├── App.jsx # Main application component
│ └── main.jsx # Entry point
└── public/ # Static assets

### 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/team-services-center.git
   cd team-services-center/client
2. **Install Dependancies: **
   ``` npm install ```
3. **Create a .env file in the Client directory and add your the given domain + endpoint**
    ``` VITE_OPENAI_API_KEY=DOMAIN AND ENDPOINT HERE ```
4. **Start the development server**
   ``` npm run dev ```

### 🚀 Usage

#### **Dashboard Navigation**
Displays key metrics and team summaries.  
Use filters to refine by:
- **COE Region** (1–13)
- **Team Type** (Mega, Standard, Self-Organized, etc.)
- **Primary & Additional States**
- **Market**
- **Certification Status**

#### **Team Management**
- Filter and view team listings  
- Click into teams for detailed info, history, and location mapping  

#### **Task Management**
- Toggle between **Teams** and **Tasks** views  
- Assign, manage, and track team-related tasks  

#### **AI Assistant**
- Click the AI icon to open the assistant  
- Ask natural language questions like:  
  > _"Create a report of all COE1 teams"_  
- Export reports in multiple formats  

---

### 🔮 Future Enhancements

- User authentication & role-based access control  
- Real-time notifications  
- Enhanced reporting & visualization    
- CRM system integrations  
- Advanced analytics
