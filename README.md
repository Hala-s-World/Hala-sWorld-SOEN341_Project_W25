# ChatHaven - SOEN341 Project (Winter 2025)

## 📌 Project Overview  
**ChatHaven** is a seamless and intuitive communication platform designed for **team collaboration, community engagement, and private conversations**. The application features **text channels**, **direct messaging**, and **role-based user permissions**, ensuring an organized and efficient communication experience.  

This project follows an **Agile Scrum development methodology** and is structured across **four sprints**, with each sprint focusing on implementing and refining core functionalities.  

---

## 🎯 Objectives  
- Develop a **functional middle-fidelity prototype** for real-time communication.  
- Implement **user authentication & management** for role-based access.  
- Ensure an **intuitive user experience** using React and Supabase.  
- Utilize **GitHub for version control**, issue tracking, and collaboration.  

---

## 🛠️ Tech Stack  
| Component  | Technology  |
|------------|------------|
| **Frontend**  | React.js  |
| **Backend**  | Supabase  |
| **Database**  | Supabase PostgreSQL  |
| **Version Control**  | Git & GitHub  |
| **Project Management**  | GitHub Issues & Agile Scrum  |

---

## 👥 Team Members  
| Name  | Role  |
|--------|------|
| **Hala Belamri**  | Full-Stack Developer  |
| **Haytham Sadeddine**  | Full-Stack Developer  |
| **Shayaan Khan**  | Full-Stack Developer  |
| **Steven Ly**  | Full-Stack Developer  |
| **Thi Hong Mai Nguyen**  | Full-Stack Developer  |
| **Mohamed Hossein Lakkis**  | Full-Stack Developer  |

All team members actively contribute to **frontend, backend, and database development**.

---

## 🚀 Project Features  

### 🔹 Baseline Features  
✔ **Text Channels for Group Communication**  
- Users can join specific channels (e.g., "General," "Project Help," "Social").  
- Messages in a channel are visible to all users in that channel.  

✔ **Direct Messaging (DM) Between Users**  
- Users can send private messages to each other.  
- DM conversations remain private between the involved users.  

✔ **Role-Based User Permissions**  
- **Admins** can create/delete channels and moderate messages.  
- **Members** can send and view messages in assigned channels.  

### 🔹 Additional Features (To Be Defined in Future Sprints)  
- A **fourth feature** will be proposed by the team mid-semester. 
---

## 📌 Development Methodology  
ChatHaven follows an **Agile Scrum approach**, utilizing **incremental development through four sprints**.  

### 🔹 Sprint Breakdown  
✔ **Sprint 1:**  
- Implement **User Authentication & Management**  
- Setup **React & Supabase**  
- Establish **GitHub repository & workflow**  

✔ **Sprint 2:**  
- Expand **user features** (Channel creation, notifications, etc.)  

✔ **Sprint 3:**  
- Enhance **UI & user experience** (Custom themes, accessibility)  

✔ **Sprint 4:**  
- Finalize & optimize (**Bug fixes, performance improvements**)  

---

## ⚙️ Setup & Installation  

### 🔹 Prerequisites  
Ensure you have the following installed on your system:  
- **Node.js** (Latest LTS version)  
- **npm** or **yarn**  
- **Git**  

### 🔹 Clone the Repository  
```bash
git clone https://github.com/hlbels/Hala-sWorld-SOEN341_Project_W25.git
```
### 🔹 Install Dependencies
```bash
npm install
```

### 🔹 Environment Variables  
Create a `.env` file in the root directory and add the necessary **Supabase credentials**:  
```bash
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 🔹 Start the Development Server
```bash
npm start
```

