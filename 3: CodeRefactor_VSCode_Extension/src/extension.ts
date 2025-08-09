import * as vscode from 'vscode';
import { estimateTask } from './aiClient';

export function activate(context: vscode.ExtensionContext) {
  // Command to store API key
  context.subscriptions.push(vscode.commands.registerCommand('timeEstimator.setApiKey', async () => {
    const key = await vscode.window.showInputBox({ 
      prompt: 'Enter your AI API key', 
      password: true,
      placeHolder: 'sk-...'
    });
    if (key) {
      await context.secrets.store('timeEstimator.apiKey', key);
      vscode.window.showInformationMessage('API key saved securely.');
    }
  }));

  // Main command to estimate selection
  context.subscriptions.push(vscode.commands.registerCommand('timeEstimator.estimateSelection', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { 
      vscode.window.showErrorMessage('No active editor'); 
      return; 
    }

    const selection = editor.document.getText(editor.selection).trim();
    if (!selection) { 
      vscode.window.showErrorMessage('Please select a task or block of code first.'); 
      return; 
    }

    const apiKey = await context.secrets.get('timeEstimator.apiKey');
    if (!apiKey) {
      const action = await vscode.window.showErrorMessage(
        'No API key found. Please set your API key first.',
        'Set API Key'
      );
      if (action === 'Set API Key') {
        vscode.commands.executeCommand('timeEstimator.setApiKey');
      }
      return;
    }

    // Gather minimal metadata
    const metadata = {
      language: editor.document.languageId,
      loc: selection.split('\n').length,
      file: editor.document.fileName
    };

    // Show progress
    await vscode.window.withProgress({ 
      location: vscode.ProgressLocation.Notification, 
      title: 'Estimating time...', 
      cancellable: false 
    }, async () => {
      try {
        const estimate = await estimateTask(selection, metadata, apiKey);
        
        // Show options for displaying the result
        const pick = await vscode.window.showQuickPick([
          'Show JSON', 
          'Insert TODO comment', 
          'Open Detailed View'
        ], { 
          placeHolder: 'Choose how to show estimate' 
        });
        
        if (pick === 'Show JSON') {
          const pretty = JSON.stringify(estimate, null, 2);
          const doc = await vscode.workspace.openTextDocument({ 
            content: pretty, 
            language: 'json' 
          });
          vscode.window.showTextDocument(doc, { preview: false });
        } else if (pick === 'Insert TODO comment') {
          // Insert above selection
          const position = editor.selection.start;
          const etaComment = `// TODO ETA: ${estimate.total.average}h (opt:${estimate.total.optimistic} avg:${estimate.total.average} pess:${estimate.total.pessimistic})\n`;
          await editor.edit(editBuilder => {
            editBuilder.insert(position, etaComment);
          });
          vscode.window.showInformationMessage(`ETA inserted: ${estimate.total.average}h`);
        } else if (pick === 'Open Detailed View') {
          // Open webview for richer rendering (implemented in next step)
          showDetailedView(estimate, context);
        }
      } catch (err: any) {
        vscode.window.showErrorMessage('Estimation failed: ' + (err.message || String(err)));
      }
    });
  }));
}

function showDetailedView(estimate: any, context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    'timeEstimate',
    `Time Estimate: ${estimate.task}`,
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true
    }
  );

  panel.webview.html = getWebviewContent(estimate);
}

function getWebviewContent(estimate: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Time Estimate</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; }
        .header { background: #f3f3f3; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .subtask { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .time-estimate { display: flex; gap: 20px; margin: 10px 0; }
        .time-box { background: #e3f2fd; padding: 10px; border-radius: 3px; text-align: center; }
        .total { background: #4caf50; color: white; padding: 15px; border-radius: 5px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>${estimate.task}</h2>
        <p><strong>Language:</strong> ${estimate.metadata.language} | <strong>Lines:</strong> ${estimate.metadata.loc}</p>
    </div>
    
    <h3>Subtasks:</h3>
    ${estimate.subtasks.map((subtask: any) => `
        <div class="subtask">
            <h4>${subtask.title}</h4>
            <p>${subtask.description}</p>
            <div class="time-estimate">
                <div class="time-box">
                    <strong>Optimistic:</strong><br>${subtask.optimistic_hours}h
                </div>
                <div class="time-box">
                    <strong>Average:</strong><br>${subtask.average_hours}h
                </div>
                <div class="time-box">
                    <strong>Pessimistic:</strong><br>${subtask.pessimistic_hours}h
                </div>
            </div>
        </div>
    `).join('')}
    
    <div class="total">
        <h3>Total Estimate:</h3>
        <div class="time-estimate">
            <div class="time-box">
                <strong>Optimistic:</strong><br>${estimate.total.optimistic}h
            </div>
            <div class="time-box">
                <strong>Average:</strong><br>${estimate.total.average}h
            </div>
            <div class="time-box">
                <strong>Pessimistic:</strong><br>${estimate.total.pessimistic}h
            </div>
        </div>
    </div>
</body>
</html>`;
}

export function deactivate() {}
