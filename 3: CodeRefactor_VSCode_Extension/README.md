# Time Estimator - VS Code Extension

AI-powered time estimation for tasks, code blocks, and tickets. This extension breaks down selected code or text into subtasks and provides optimistic, average, and pessimistic time estimates.

## Features

- 🤖 AI-powered time estimation using OpenAI GPT-4
- 📊 Breaks tasks into subtasks with detailed estimates
- 💾 Secure API key storage using VS Code's secret storage
- 🎯 Multiple output formats: JSON, TODO comments, or detailed webview
- 🔒 Privacy-focused: only sends selected text and minimal metadata
- 🎨 Modern UI with detailed breakdown view

## Prerequisites

- Node.js 18+ (for `fetch` support and modern tooling)
- VS Code (for extension development)
- OpenAI API key (or compatible API provider)

## Installation

### For Development

1. Clone this repository:
```bash
git clone <repository-url>
cd vscode-time-estimator
```

2. Install dependencies:
```bash
npm install
```

3. Compile the extension:
```bash
npm run compile
```

4. Open the project in VS Code and press `F5` to launch the Extension Development Host.

### For Users

1. Install the extension from the VS Code marketplace (when published)
2. Set your API key using the command palette: `Time Estimator: Set API Key`
3. Select code or text and right-click to estimate time

## Usage

### Setting up API Key

1. Open VS Code command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "Time Estimator: Set API Key"
3. Enter your OpenAI API key (starts with `sk-`)

### Estimating Time

1. Select a block of code or text in your editor
2. Right-click and choose "Estimate Time for Selection"
3. Choose how to display the results:
   - **Show JSON**: Opens a new tab with the raw JSON response
   - **Insert TODO comment**: Adds a TODO comment with the estimate above the selection
   - **Open Detailed View**: Opens a rich webview with breakdown and visualizations

### Example Output

When you select code like:
```typescript
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

You'll get an estimate like:
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

## Configuration

### API Provider

The extension is configured to use OpenAI's API by default. To use a different provider:

1. Edit `src/aiClient.ts`
2. Update the `fetch` call to use your preferred API endpoint
3. Adjust the request format as needed

### Model Settings

You can customize the AI model and settings in `src/aiClient.ts`:

```typescript
{
  model: 'gpt-4o-mini', // Change to your preferred model
  temperature: 0.15,    // Lower = more consistent
  max_tokens: 1200      // Adjust based on your needs
}
```

## Architecture

```
User selects code/ticket in VS Code
          ↓
VS Code Extension (TypeScript)
  • Command + context menu
  • Secret storage for API key
  • UI: QuickPick, WebView
          ↓
AI Client (calls OpenAI API)
  • Sends prompt + metadata
  • Receives structured JSON estimate
          ↓
Extension parses JSON → displays UI
```

## Development

### Project Structure

```
src/
├── extension.ts          # Main extension entry point
├── aiClient.ts          # AI integration and JSON parsing
└── types.ts             # TypeScript interfaces (if needed)

out/                     # Compiled JavaScript
package.json             # Extension manifest
tsconfig.json           # TypeScript configuration
```

### Building

```bash
# Compile TypeScript
npm run compile

# Watch for changes
npm run watch
```

### Testing

1. Press `F5` in VS Code to launch Extension Development Host
2. Open a file with code
3. Select some code and test the estimation feature

## Troubleshooting

### Common Issues

**"No API key found"**
- Run "Time Estimator: Set API Key" from command palette
- Ensure the key starts with `sk-` for OpenAI

**"Estimation failed"**
- Check your internet connection
- Verify your API key is valid
- Check the output panel for detailed error messages

**"Failed to extract JSON"**
- The AI response might be malformed
- Try selecting a smaller code block
- Check the raw response in the output panel

### Debug Mode

1. Open VS Code Developer Tools (`Help > Toggle Developer Tools`)
2. Look for console logs and errors
3. Check the "Output" panel for extension-specific logs

## Security & Privacy

- API keys are stored securely using VS Code's `SecretStorage`
- Only selected text and minimal metadata are sent to the AI provider
- No code is executed or logged
- Consider using environment variables for API keys in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Roadmap

- [ ] GitHub/Jira integration
- [ ] Local model support
- [ ] Calibration with actual time tracking
- [ ] Batch estimation for multiple TODOs
- [ ] Export estimates to CSV/PDF
- [ ] Monte Carlo simulation for risk analysis
- [ ] Team collaboration features

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed information
