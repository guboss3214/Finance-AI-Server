## Backend

### 📂 Folder: `server`

**Technologies:**
- Node.js + TypeScript
- Express
- OpenAI API
- CORS

### ⚡ Key features:
- AI transaction categorization
- Anomaly & High Alert detection
- Personalized financial insights generation

### 🛠 API Route

**POST** `/api/insights`

- **Description:**  
  Аналізує список транзакцій, категоризує їх, виділяє аномалії та генерує фінансові інсайти за допомогою AI.

- **Request Body:**

```json
{
  "demoTransactions": [
    { "id": 1, "description": "Uber trip Kyiv", "amount": -320 },
    { "id": 2, "description": "McDonald's", "amount": -189 }
  ]
}
```
### Response:
```json
{
  "transactions": [
    {
      "id": 1,
      "description": "Uber trip Kyiv",
      "amount": -320,
      "category": "Transport",
      "anomaly": true,
      "alertReason": "Transport payment unusually high 🔥"
    },
    {
      "id": 2,
      "description": "McDonald's",
      "amount": -189,
      "category": "Food"
    }
  ],
  "insights": [
    "You spent unusually high on Transport 🚗",
    "Multiple subscriptions detected 📺",
    "Consider reviewing large payments 🔥"
  ]
}
```
## Notes:

> transactions — оригінальні транзакції з доданими категоріями та позначками аномалій.

> anomaly — true, якщо AI виявив підозрілу транзакцію.

> alertReason — причина High Alert (якщо є).

> insights — 3–5 коротких фінансових рекомендацій, згенерованих AI.

### 🚀 Local launch:

```bash
cd server
npm install
npm run dev
```
### ⚙️ Environment variables
- Create a .env file in the server folder with the following content:

```bash
PORT=5000
CLIENT_URL=http://localhost:5173/
OPENAI_API_KEY=your_openai_api_key_here
PORT — порт, на якому запускається бекенд (за замовчуванням 5000)
```
- CLIENT_URL — URL фронтенду для CORS

- OPENAI_API_KEY — ваш ключ OpenAI для доступу до GPT-5 Mini