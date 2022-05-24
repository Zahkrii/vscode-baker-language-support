// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Baker Language Support is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposableBold = vscode.commands.registerCommand('baker-language-support.bold', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello World from Baker Language Support!');

		const { activeTextEditor } = vscode.window;
		if (activeTextEditor && activeTextEditor.document.languageId === 'bakerlang') {
			const { document } = activeTextEditor;
			const editor = vscode.window.activeTextEditor;
			const edit = new vscode.WorkspaceEdit();
			if (editor) {
				edit.insert(document.uri, editor.selection.start, '<b>');
				edit.insert(document.uri, editor.selection.end, '</b>');
			}

			return vscode.workspace.applyEdit(edit);
		}
	});
	context.subscriptions.push(disposableBold);

	let disposableRed = vscode.commands.registerCommand('baker-language-support.red', () => {
		const { activeTextEditor } = vscode.window;
		if (activeTextEditor && activeTextEditor.document.languageId === 'bakerlang') {
			const { document } = activeTextEditor;
			const editor = vscode.window.activeTextEditor;
			const edit = new vscode.WorkspaceEdit();
			if (editor) {
				edit.insert(document.uri, editor.selection.start, '<red>');
				edit.insert(document.uri, editor.selection.end, '</red>');
			}

			return vscode.workspace.applyEdit(edit);
		}
	});
	context.subscriptions.push(disposableRed);

	let disposableFormat = vscode.languages.registerDocumentFormattingEditProvider('bakerlang', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			const wholeText = document.getText();
			const lastLine = document.lineAt(document.lineCount - 1);
			const textRange = new vscode.Range(new vscode.Position(0, 0), lastLine.range.end);
			var modified = wholeText;
			// Title
			if (!(/###/.test(document.lineAt(0).text))) {
				modified = '###' + modified;
			}
			// Node title
			if (/\n.(.)?、.*/.test(wholeText)) {
				var str = wholeText.match(/\n.(.)?、.*/g);
				if (str !== null)
					for (let item of str) {
						modified = modified.replace(/\n.(.)?、.*/, '\n<b>' + item.substring(1) + '</b>');
					}
			}
			// Dev news node title
			if (/\n【通讯节点.*】/.test(wholeText)) {
				var str = wholeText.match(/\n【通讯节点.*】/g);
				if (str !== null)
					for (let item of str) {
						modified = modified.replace(/\n【通讯节点.*】/, '\n<b>' + item.substring(1) + '</b>');
					}
			}
			// Space to '<br>'
			if (/\n\s/.test(wholeText)) {
				var str = wholeText.match(/\n\s/g);
				if (str !== null)
					for (let { } of str) {
						modified = modified.replace(/\n\s/, '\n<br>');
					}
			}
			return [vscode.TextEdit.replace(textRange, modified)];
		}
	});
	context.subscriptions.push(disposableFormat);

}

// this method is called when your extension is deactivated
export function deactivate() { }
