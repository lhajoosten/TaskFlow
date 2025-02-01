# 🚀 TaskFlow - Task Management & Workflow Automation System

![GitHub repo size](https://img.shields.io/github/repo-size/lhajoosten/TaskFlow?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/lhajoosten/TaskFlow?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/lhajoosten/TaskFlow?style=flat-square)
![GitHub pull requests](https://img.shields.io/github/issues-pr/lhajoosten/TaskFlow?style=flat-square)

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/lhajoosten/TaskFlow/ci-backend.yml?label=Backend%20CI&style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/lhajoosten/TaskFlow/docker.yml?label=Docker%20Build&style=flat-square)

![GitHub contributors](https://img.shields.io/github/contributors/lhajoosten/TaskFlow?style=flat-square)
![GitHub License](https://img.shields.io/github/license/lhajoosten/TaskFlow?style=flat-square)

![Docker](https://img.shields.io/badge/Docker-Enabled-blue?style=flat-square)
![GitHub top language](https://img.shields.io/github/languages/top/lhajoosten/TaskFlow?style=flat-square)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/lhajoosten/TaskFlow?style=flat-square)



**TaskFlow** is a modern **Task Management & Workflow Automation System** built with **.NET 9 & Angular 17**, designed to help teams **organize, assign, and track tasks** efficiently.

🔹 **Built with:** `.NET 9` | `Angular 17` | `SQL Server` | `Docker` | `GitHub Actions`  
🔹 **Key Features:** `Task CRUD` | `Custom Workflows` | `User Roles` | `Notifications` | `CI/CD`

---

## 🎯 **Features**
✅ **Task Creation, Assignment & Tracking**  
✅ **Custom Workflows & Status Management**  
✅ **User Authentication & Role-Based Access Control**  
✅ **Real-Time Notifications & Updates** *(via SignalR/WebSockets)*  
✅ **API-First Approach with Swagger UI**  

📌 **Upcoming Features:**
- Task Dependencies & Subtasks
- Third-Party Integrations
- Advanced Reporting & Analytics

---

## 🚀 **Live Demo**
📢 **Coming Soon!** (Deployment in progress...)  

---

## 🔧 **Getting Started**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/lhajoosten/TaskFlow.git
cd TaskFlow
```

### **2️⃣ Setup & Run with Docker**
```sh
docker-compose up --build
```

### **3️⃣ Access the Services**
- **Backend API** → [http://localhost:5000](http://localhost:5000)
- **Frontend** → [http://localhost:4200](http://localhost:4200)
- **Database (SQL Server)** → `localhost:1433`

🔹 **For manual setup instructions, check the [Getting Started Guide](https://github.com/lhajoosten/TaskFlow/wiki/Getting-Started)**.

---

## 📂 **Project Structure**
```
TaskFlow/
│── .github/workflows/   # CI/CD Pipelines
│── src/                 # Backend & Frontend Source Code
│   │── TaskFlow.Api/         # .NET API Project
│   │── TaskFlow.Application/ # Business Logic
│   │── TaskFlow.Domain/      # Domain Models
│   │── TaskFlow.Infrastructure/ # Database & Repositories
│   │── TaskFlow.Web/          # Angular Frontend
│── tests/               # Unit & Integration Tests
│── docker/              # Docker Configuration
│── TaskFlow.sln         # Solution File
│── README.md            # This file!
│── LICENSE              # License details
```

---

## 🛠️ **Development & Contribution**
We welcome contributions! 🛠️  
Read our **[Contribution Guide](https://github.com/lhajoosten/TaskFlow/wiki/Contributing)** before submitting a pull request.

🔹 **GitHub Flow Branching Strategy:**
1. **`main` branch** → Stable version.
2. **Feature branches** → `feature/branch-name`
3. **Bugfix branches** → `bugfix/branch-name`
```sh
git checkout -b feature/add-task-creation
```

---

## 🔍 **CI/CD & Testing**
✅ **GitHub Actions** → Automated builds, tests, and code quality checks.  
✅ **Code Coverage** → Report generated using **`XPlat Code Coverage`**.  
✅ **Dockerized Deployment** → Ready for cloud environments.  

Run all backend tests:
```sh
dotnet test tests/TaskFlow.Api.Tests
dotnet test tests/TaskFlow.Application.Tests
dotnet test tests/TaskFlow.Domain.Tests
```
Run frontend tests:
```sh
cd src/TaskFlow.Web
ng test
```

---

## 📅 **Project Roadmap**
✅ **Phase 1: Core Features**
- [x] **Set up CI/CD with GitHub Actions**
- [x] **Dockerize backend & frontend**
- [x] **Implement Task CRUD operations**
- [ ] **User authentication & roles**
- [ ] **Task assignment & workflow automation**
- [ ] **Notifications & real-time updates**

🚀 **Phase 2: Advanced Features**
- [ ] API Rate Limiting & Security Enhancements  
- [ ] Integration with Third-Party Services  
- [ ] Advanced Reporting & Analytics  

---

## 📚 **Additional Documentation**
- 📖 **[Project Wiki](https://github.com/lhajoosten/TaskFlow/wiki)**
- 📌 **[API Documentation](https://github.com/lhajoosten/TaskFlow/wiki/API-Docs)**
- 🔧 **[Getting Started Guide](https://github.com/lhajoosten/TaskFlow/wiki/Getting-Started)**
- 🏗️ **[Architecture & Design](https://github.com/lhajoosten/TaskFlow/wiki/Architecture)**

---

## ⚖️ **License**
This project is licensed under the **MIT License**. See the **[LICENSE](LICENSE)** file for more details.

---

## 📬 **Contact & Support**
📧 **Email:** lhajoosten@outlook.com 
🌐 **Website:** coming soon  

🔹 **Found a bug?** Open an **[issue](https://github.com/lhajoosten/TaskFlow/issues)**!  
🔹 **Have a feature request?** Suggest it in **[discussions](https://github.com/lhajoosten/TaskFlow/discussions)**!  
🔹 **Want to contribute?** Check our **[Contribution Guide](https://github.com/lhajoosten/TaskFlow/wiki/Contributing)**!  

✨ **Happy Coding!** ✨ 🚀
