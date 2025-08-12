# **Codegenie - VS Code Extension**

**AI-powered code understanding, documentation, and time estimation**

Codegenie supercharges your development workflow by breaking down selected code or text into **subtasks**, **providing time estimates**, **explaining code flow**, **generating concise descriptions**, and **writing detailed documentation**. Choose between **OpenAI** or **Gemini** as your AI provider.

---

## **Features**

✨ **Break down code into subtasks** with **optimistic**, **average**, and **pessimistic** time estimates

🧠 **Understand code flow** — get a clear explanation of how the selected code works

📝 **Generate concise descriptions** for any code snippet

📄 **Auto-generate detailed documentation** from selected code

🔄 **Choose your AI model** — OpenAI or Google Gemini

📊 **Multiple output formats** — JSON, TODO comments, or rich webview

🔒 **Privacy-focused** — only selected text and minimal metadata are sent

💾 **Secure API key storage** using VS Code’s secret storage

🎨 **Modern, interactive UI** for better insights


---

## **Prerequisites**

* **Node.js** 18+ (for `fetch` and modern tooling)
* **VS Code** (latest version recommended)
* **OpenAI** or **Gemini API key**

---

## **Installation**

### **For Development**

```bash
git clone <repository-url>
cd codegenie
npm install
npm run compile
```

Open the project in VS Code and press **F5** to launch the Extension Development Host.

### **For Users**

* Install from the VS Code Marketplace (coming soon)
* Set your API key via Command Palette: **Codegenie: Set API Key**
* Select code → right-click → choose your desired action

---

## **Usage**

### **1. Set Your API Key**

* Open Command Palette (**Ctrl+Shift+P** / **Cmd+Shift+P**)
* Search for **Codegenie: Set API Key**
* Enter your **OpenAI** or **Gemini** API key

### **2. Available Actions**

When you select a block of code and right-click, you can:

* **Estimate Time** (with breakdown of subtasks)
* **Explain Code Flow** (step-by-step explanation)
* **Generate Description** (concise summary)
* **Write Documentation** (detailed doc comments)

---

## **Example Output**

### **Input Code**

```typescript
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### **Possible Outputs**

#### **Time Estimation (JSON)**

```json
{
  "task": "Calculate total from items array",
  "metadata": {
    "language": "typescript",
    "loc": 3,
    "file": "src/utils.ts"
  },
  "subtasks": [
    {
      "id": "1",
      "title": "Understand the reduce function",
      "description": "Analyze the reduce implementation and edge cases",
      "optimistic_hours": 0.1,
      "average_hours": 0.25,
      "pessimistic_hours": 0.5
    }
  ],
  "total": {
    "optimistic": 0.1,
    "average": 0.25,
    "pessimistic": 0.5
  }
}
```

#### **Code Flow Explanation**

> This function calculates the total price by using `reduce` to sum up all `item.price` values from the `items` array.

#### **Brief Description**

> Calculates the total price of all items in the list.

#### **Documentation**

```typescript
/**
 * Calculates the total price of all items.
 *
 * @param items - Array of items with price properties.
 * @returns The sum of all item prices.
 */
```

---

## **Configuration**

You can change AI provider and model in **Codegenie Settings** or in `src/aiClient.ts`.

```json
{
  "model": "gpt-4o-mini", // Or Gemini model name
  "temperature": 0.15,
  "max_tokens": 1200
}
```

---

## **Architecture**

1. User selects code or text in VS Code
2. **Codegenie Extension**

   * Context menu commands
   * Secure API key storage
   * QuickPick & WebView UI
3. **AI Client**

   * Sends structured prompt + metadata to OpenAI or Gemini
   * Receives structured JSON or text response
4. **Output Rendering**

   * JSON, TODO comments, or rich UI

---

## **Roadmap**

* [ ] GitHub/Jira integration
* [ ] Local model support
* [ ] Time estimate calibration with actual tracking
* [ ] Batch estimation for multiple TODOs
* [ ] Export estimates to CSV/PDF
* [ ] Monte Carlo simulation for risk analysis
* [ ] Team collaboration features

---

## **Security & Privacy**

* API keys stored securely in VS Code SecretStorage
* Only selected text + minimal metadata sent to AI provider
* No code executed or logged

---

## **Contributing**

1. Fork the repo
2. Create a feature branch
3. Implement changes
4. Add tests if needed
5. Submit PR

