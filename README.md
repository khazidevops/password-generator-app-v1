# 🔐 Password Generator Web App

A secure and simple password generator with login, registration, and password management features. Built with:

- ✅ HTML + CSS + JavaScript (frontend)
- ✅ Node.js + Express (backend)
- ✅ PostgreSQL (database)
- ✅ Docker + Docker Compose (containerization)

---

## 🚀 Features

- ✅ User registration & login
- ✅ Password generator with custom options
- ✅ Save passwords with associated site URL & username
- ✅ Edit & delete saved credentials
- ✅ Copy passwords to clipboard
- ✅ Logout functionality
- ✅ Mobile responsive UI

---

## 🛠️ Tech Stack

| Layer        | Technology        |
|--------------|------------------|
| Frontend     | HTML, CSS, JS    |
| Backend      | Node.js, Express |
| Database     | PostgreSQL       |
| Auth         | Sessions (in-memory or cookie) |
| Containerization | Docker + Docker Compose |

---

## 🧪 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-username/password-generator-app.git
cd password-generator-app
```

### 2. Start with Docker Compose

```bash
docker-compose up --build
```

### 3. Access the app

Open your browser at:

```
http://localhost:8080
```

### 4. Default Admin Credentials

- **Username:** `admin`
- **Password:** `admin`

(Automatically created on first run)

---

## 🗃️ Project Structure

```
.
├── backend/
│   ├── server.js        # Express backend
│   ├── db.js            # DB connection and queries
│   └── ...              
├── frontend/
│   ├── index.html       # UI HTML
│   ├── style.css        # Styling
│   └── script.js        # App logic
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

## 🐳 Docker Services

| Service | Description        | Port    |
|---------|--------------------|---------|
| `web`   | Express + Static frontend | `3000` internally, exposed on `8080` |
| `db`    | PostgreSQL database | `5432` |

---

## 🧾 Environment Variables (Optional)

If you want to use `.env` (not required with Docker defaults):

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=passgen
```

---

## 🧹 Common Commands

### Rebuild containers
```bash
docker-compose up --build
```

### Tear down and clean data
```bash
docker-compose down -v
```

---

## 🛡️ Security Notes

- Passwords are hashed using `bcrypt`.
- Sessions or tokens should be used for production.
- PostgreSQL is exposed only internally via Docker network.

---

## 📸 Screenshot

![App UI](./screenshots/ui.png)

---

## ✍️ Author

**Khazi Naseeruddin** – DevOps Engineer  
Feel free to reach out for collaboration or improvements!

---

## 📄 License

MIT License. Use freely with credit.
