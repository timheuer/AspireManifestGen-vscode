// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('aspire-gen.generate', async (uri) => {

		// if the uri is undefined, get the uri for the document in the active editor
		if (!uri) {
			uri = vscode.window.activeTextEditor?.document.uri;
		}

		// Get the workspace folder containing the URI
		const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);

		if (workspaceFolder) {
			// Update the workspace folders with the desired folder as the first element
			vscode.workspace.updateWorkspaceFolders(0, null, { uri: workspaceFolder.uri });
		}

		// Get the active terminal or create a new one
		const terminal = vscode.window.activeTerminal || vscode.window.createTerminal();
		const manifestFile = workspaceFolder ? vscode.Uri.joinPath(workspaceFolder.uri, '.aspire') : undefined;
		terminal.show();
		terminal.sendText(`cd ${workspaceFolder?.uri.fsPath}`);
		if (uri) {
			terminal.sendText(`dotnet msbuild /t:GenerateAspireManifest /p:AspireManifestPublishOutputPath=${manifestFile?.fsPath} ${uri.fsPath}`);
		}

		await waitForFileCreation(manifestFile?.fsPath || '');

		// Open the manifestFile in an editor
		if (manifestFile) {
			await vscode.window.showTextDocument(manifestFile);
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }

function waitForFileCreation(filePath: string): Promise<void> {
	const outputChannel = vscode.window.createOutputChannel('.NET Aspire');
	return new Promise((resolve) => {
		const interval = setInterval(() => {
			outputChannel.appendLine('Checking for file existence...');
			if (fs.existsSync(filePath)) {
				outputChannel.appendLine('Created file!');
				clearInterval(interval);
				resolve();
			}
		}, 1000); // Check every second for file existence
	});
}