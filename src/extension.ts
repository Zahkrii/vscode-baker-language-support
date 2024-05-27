// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const path = require('node:path');

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

	const provideCompletionItems = async () => {
		const pngs = await vscode.workspace.findFiles("input/*.png");
		const jpgs = await vscode.workspace.findFiles("input/*.jpg");
		const imgs = [...pngs, ...jpgs];

		if (!imgs.length) {
			return;
		}

		return imgs.map((file) => {

			const basename = path.basename(file.path);

			const completionItem = new vscode.CompletionItem(
				basename,
				vscode.CompletionItemKind.File
			);
			completionItem.insertText = '{{' + basename;

			return completionItem;
		});
	};

	let disposableCompletion = vscode.languages.registerCompletionItemProvider('bakerlang', {
		provideCompletionItems
	}, '{');
	context.subscriptions.push(disposableCompletion);

	let disposableFormat = vscode.languages.registerDocumentFormattingEditProvider('bakerlang', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			const wholeText = document.getText();
			const lastLine = document.lineAt(document.lineCount - 1);
			const textRange = new vscode.Range(new vscode.Position(0, 0), lastLine.range.end);
			var modified = wholeText;
			//#region 标题与空格
			// Title，example：[活动预告]SideStory「XXXX」限时活动即将开启
			if (!(/###/.test(document.lineAt(0).text))) {
				modified = '###' + modified;
			}
			// Node title，example：一、全新SideStory「XXXX」，活动关卡开启
			if (/\n.(.)?、.*/.test(wholeText)) {
				var str = wholeText.match(/\n.(.)?、.*/g);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(/\n.(.)?、.*/, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			// Dev news node title，example：【通讯节点·一】
			if (/\n【通讯节点.*】/.test(wholeText)) {
				var str = wholeText.match(/\n【通讯节点.*】/g);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(/\n【通讯节点.*】/, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			// Space to '<br>'
			if (/\n\s/.test(wholeText)) {
				var str = wholeText.match(/\n\s/g);
				if (str !== null) {
					for (let { } of str) {
						modified = modified.replace(/\n\s/, '\n<br>');
					}
				}
			}
			//#endregion

			//#region 活动干员
			// 新增一星干员1，示例：【★：PhonoR-0】
			let regex1sOp1 = new RegExp('【★：[^】]*】(?!</red>)', 'g');
			if (regex1sOp1.test(wholeText)) {
				var str = wholeText.match(regex1sOp1);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regex1sOp1, '<red>' + item + '</red>');
					}
				}
			}
			// 新增四星干员1，示例：【★★★★：砾】
			let regex4sOp1 = new RegExp('【★★★★：[^】]*】(?!</red>)', 'g');
			if (regex4sOp1.test(wholeText)) {
				var str = wholeText.match(regex4sOp1);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regex4sOp1, '<red>' + item + '</red>');
					}
				}
			}
			// 新增五星干员1，示例：【★★★★★：华法琳】
			let regex5sOp1 = new RegExp('【★★★★★：[^】]*】(?!</red>)', 'g');
			if (regex5sOp1.test(wholeText)) {
				var str = wholeText.match(regex5sOp1);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regex5sOp1, '<red>' + item + '</red>');
					}
				}
			}
			// 新增六星干员1，示例：【★★★★★★：阿斯卡纶】
			let regex6sOp1 = new RegExp('【★★★★★★：[^】]*】(?!</red>)', 'g');
			if (regex6sOp1.test(wholeText)) {
				var str = wholeText.match(regex6sOp1);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regex6sOp1, '<red>' + item + '</red>');
					}
				}
			}
			//#endregion

			//#region 新增干员
			let regexNewOp = new RegExp('\n新增干员：', 'g');
			if (regexNewOp.test(wholeText)) {
				var str = wholeText.match(regexNewOp);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexNewOp, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			// 新增一星干员2，示例：★：PhonoR-0
			let regex1sOp2 = new RegExp('\n((?<!<red>.*)★[：:][^】）)\n]*\n){1,}', 'g');
			if (regex1sOp2.test(wholeText)) {
				var str = wholeText.match(regex1sOp2);
				if (str !== null) {
					for (let item of str) {
						let items = item.split('\n');
						items = items.filter((it) => it !== '');
						let newstr = '\n';
						for (let it of items) {
							newstr = newstr + '<red>' + it.replace('\r', '') + '</red>\n';
						}
						modified = modified.replace(regex1sOp2, newstr);
					}
				}
			}
			// 新增四星干员2，示例：★★★★：砾
			let regex4sOp2 = new RegExp('\n((?<!<red>.*)★★★★[：:][^】）)\n]*\n){1,}', 'g');
			if (regex4sOp2.test(wholeText)) {
				var str = wholeText.match(regex4sOp2);
				if (str !== null) {
					for (let item of str) {
						let items = item.split('\n');
						items = items.filter((it) => it !== '');
						let newstr = '\n';
						for (let it of items) {
							newstr = newstr + '<red>' + it.replace('\r', '') + '</red>\n';
						}
						modified = modified.replace(regex4sOp2, newstr);
					}
				}
			}
			// 新增五星干员2，示例：★★★★★：华法琳
			let regex5sOp2 = new RegExp('\n((?<!<red>.*)★★★★★[：:][^】）)\n]*\n){1,}', 'g');
			if (regex5sOp2.test(wholeText)) {
				var str = wholeText.match(regex5sOp2);
				if (str !== null) {
					for (let item of str) {
						let items = item.split('\n');
						items = items.filter((it) => it !== '');
						let newstr = '\n';
						for (let it of items) {
							newstr = newstr + '<red>' + it.replace('\r', '') + '</red>\n';
						}
						modified = modified.replace(regex5sOp2, newstr);
					}
				}
			}
			// 新增六星干员2，示例：★★★★★★：阿斯卡纶
			let regex6sOp2 = new RegExp('\n((?<!<red>.*)★★★★★★[：:][^】）)\n]*\n){1,}', 'g');
			if (regex6sOp2.test(wholeText)) {
				var str = wholeText.match(regex6sOp2);
				if (str !== null) {
					for (let item of str) {
						let items = item.split('\n');
						items = items.filter((it) => it !== '');
						let newstr = '\n';
						for (let it of items) {
							newstr = newstr + '<red>' + it.replace('\r', '') + '</red>\n';
						}
						modified = modified.replace(regex6sOp2, newstr);
					}
				}
			}
			//#endregion

			//#region 卡池干员
			// 新增四星干员3，示例：★★★★：砾（占4★出率的20%）
			let regex4sOp3 = new RegExp('(?<!<red>.*)★★★★[：:].*[(（]占4★出率的.*[）)]', 'g');
			if (regex4sOp3.test(wholeText)) {
				var str = wholeText.match(regex4sOp3);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regex4sOp3, '<red>' + item + '</red>');
					}
				}
			}
			// 新增五星干员3，示例：★★★★★：华法琳（占5★出率的50%）
			let regex5sOp3 = new RegExp('(?<!<red>.*)★★★★★[：:].*[(（]占5★出率的.*[）)]', 'g');
			if (regex5sOp3.test(wholeText)) {
				var str = wholeText.match(regex5sOp3);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regex5sOp3, '<red>' + item + '</red>');
					}
				}
			}
			// 新增六星干员3，示例：★★★★★★：阿斯卡纶（占6★出率的50%）
			let regex6sOp3 = new RegExp('(?<!<red>.*)★★★★★★[：:].*[(（]占6★出率的.*[）)]', 'g');
			if (regex6sOp3.test(wholeText)) {
				var str = wholeText.match(regex6sOp3);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regex6sOp3, '<red>' + item + '</red>');
					}
				}
			}
			//#endregion

			//#region 前路回响/联合行动
			// 前路回响/联合行动六星干员，示例：★★★★★★(6★出率：2%)：白铁/伊内丝/赫德雷(占5★出率的60%)
			let regex6sOpEcho = new RegExp('(?<!<red>.*)★★★★★★[(（]6★出率[：:].*[）)][：:].*', 'g');
			if (regex6sOpEcho.test(wholeText)) {
				var str = wholeText.match(regex6sOpEcho);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regex6sOpEcho, '<red>' + item + '</red>');
					}
				}
			}
			// 前路回响/联合行动五星干员，示例：★★★★★(5★出率：8%)：XX/XX/XX(占5★出率的60%)
			let regex5sOpEcho = new RegExp('(?<!<red>.*)★★★★★[(（]5★出率[：:].*[）)][：:].*', 'g');
			if (regex5sOpEcho.test(wholeText)) {
				var str = wholeText.match(regex5sOpEcho);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regex5sOpEcho, '<red>' + item + '</red>');
					}
				}
			}
			// 前路回响四星干员
			let regex4sOpEcho = new RegExp('(?<!<red>.*)★★★★[(（]4★出率[：:].*[）)][：:].*', 'g');
			if (regex4sOpEcho.test(wholeText)) {
				var str = wholeText.match(regex4sOpEcho);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regex4sOpEcho, '<red>' + item + '</red>');
					}
				}
			}
			//#endregion

			//#region 公开招募
			// 公开招募新增六星干员，示例：★★★★★★ 阿斯卡纶
			let regexPub6s = new RegExp('\n((?<!<red>.*)★★★★★★ [^】）)\n]*[\r\n]){1,}', 'g');
			if (regexPub6s.test(wholeText)) {
				var str = wholeText.match(regexPub6s);
				if (str !== null) {
					for (let item of str) {
						let items = item.split('\n');
						items = items.filter((it) => it !== '');
						let newstr = '\n';
						for (let it of items) {
							newstr = newstr + '<red>' + it.replace('\r', '') + '</red>';
						}
						modified = modified.replace(regexPub6s, newstr);
					}
				}
			}
			// 公开招募新增五星干员
			let regexPub5s = new RegExp('\n((?<!<red>.*)★★★★★ [^】）)\n]*[\r\n]){1,}', 'g');
			if (regexPub5s.test(wholeText)) {
				var str = wholeText.match(regexPub5s);
				if (str !== null) {
					for (let item of str) {
						let items = item.split('\n');
						items = items.filter((it) => it !== '');
						let newstr = '\n';
						for (let it of items) {
							newstr = newstr + '<red>' + it.replace('\r', '') + '</red';
						}
						modified = modified.replace(regexPub5s, newstr);
					}
				}
			}
			// 公开招募新增四星干员
			let regexPub4s = new RegExp('\n((?<!<red>.*)★★★★ [^】）)\n]*[\r\n]){1,}', 'g');
			if (regexPub4s.test(wholeText)) {
				var str = wholeText.match(regexPub4s);
				if (str !== null) {
					for (let item of str) {
						let items = item.split('\n');
						items = items.filter((it) => it !== '');
						let newstr = '\n';
						for (let it of items) {
							newstr = newstr + '<red>' + it.replace('\r', '') + '</red>';
						}
						modified = modified.replace(regexPub4s, newstr);
					}
				}
			}
			let regexPub1s = new RegExp('\n((?<!<red>.*)★ [^】）)\n]*[\r\n]){1,}', 'g');
			if (regexPub1s.test(wholeText)) {
				var str = wholeText.match(regexPub1s);
				if (str !== null) {
					for (let item of str) {
						let items = item.split('\n');
						items = items.filter((it) => it !== '');
						let newstr = '\n';
						for (let it of items) {
							newstr = newstr + '<red>' + it.replace('\r', '') + '</red>';
						}
						modified = modified.replace(regexPub1s, newstr);
					}
				}
			}
			//#endregion

			//#region 信物
			// 新增干员信物，示例：【华法琳】信物
			let regexOpToken = new RegExp('【[^】]*】信物(?!</red>)', 'g');
			if (regexOpToken.test(wholeText)) {
				var str = wholeText.match(regexOpToken);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexOpToken, '<red>' + item + '</red>');
					}
				}
			}
			let regexSpeToken = new RegExp('特种皇家信物(?!</red>)', 'g');
			if (regexSpeToken.test(wholeText)) {
				var str = wholeText.match(regexSpeToken);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexSpeToken, '<red>' + item + '</red>');
					}
				}
			}
			let regexMdToken = new RegExp('医疗皇家信物(?!</red>)', 'g');
			if (regexMdToken.test(wholeText)) {
				var str = wholeText.match(regexMdToken);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexMdToken, '<red>' + item + '</red>');
					}
				}
			}
			let regexGdToken = new RegExp('近卫皇家信物(?!</red>)', 'g');
			if (regexGdToken.test(wholeText)) {
				var str = wholeText.match(regexGdToken);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexGdToken, '<red>' + item + '</red>');
					}
				}
			}
			let regexSppToken = new RegExp('辅助皇家信物(?!</red>)', 'g');
			if (regexSppToken.test(wholeText)) {
				var str = wholeText.match(regexSppToken);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexSppToken, '<red>' + item + '</red>');
					}
				}
			}
			let regexVdToken = new RegExp('先锋皇家信物(?!</red>)', 'g');
			if (regexVdToken.test(wholeText)) {
				var str = wholeText.match(regexVdToken);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexVdToken, '<red>' + item + '</red>');
					}
				}
			}
			let regexDfToken = new RegExp('重装皇家信物(?!</red>)', 'g');
			if (regexDfToken.test(wholeText)) {
				var str = wholeText.match(regexDfToken);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexDfToken, '<red>' + item + '</red>');
					}
				}
			}
			let regexSniToken = new RegExp('狙击皇家信物(?!</red>)', 'g');
			if (regexSniToken.test(wholeText)) {
				var str = wholeText.match(regexSniToken);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexSniToken, '<red>' + item + '</red>');
					}
				}
			}
			let regexCtToken = new RegExp('术师皇家信物(?!</red>)', 'g');
			if (regexCtToken.test(wholeText)) {
				var str = wholeText.match(regexCtToken);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexCtToken, '<red>' + item + '</red>');
					}
				}
			}
			//#endregion

			//#region 庆典道具
			// 周年庆典干员凭证
			let regexOpCert = new RegExp('周年庆典干员凭证(?!</red>)', 'g');
			if (regexOpCert.test(wholeText)) {
				var str = wholeText.match(regexOpCert);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexOpCert, '<red>' + item + '</red>');
					}
				}
			}
			// 资深干员特训装置
			let regex5sOpTr1 = new RegExp('资深干员特训装置(?!</red>)', 'g');
			if (regex5sOpTr1.test(wholeText)) {
				var str = wholeText.match(regex5sOpTr1);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regex5sOpTr1, '<red>' + item + '</red>');
					}
				}
			}
			// 资深干员特训邀请函
			let regex5sOpTr2 = new RegExp('资深干员特训邀请函(?!</red>)', 'g');
			if (regex5sOpTr2.test(wholeText)) {
				var str = wholeText.match(regex5sOpTr2);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regex5sOpTr2, '<red>' + item + '</red>');
					}
				}
			}
			// 高级资深干员特训装置
			let regex6sOpTr1 = new RegExp('高级资深干员特训装置(?!</red>)', 'g');
			if (regex6sOpTr1.test(wholeText)) {
				var str = wholeText.match(regex6sOpTr1);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regex6sOpTr1, '<red>' + item + '</red>');
					}
				}
			}
			// 高级资深干员特训邀请函
			let regex6sOpTr2 = new RegExp('高级资深干员特训邀请函(?!</red>)', 'g');
			if (regex6sOpTr2.test(wholeText)) {
				var str = wholeText.match(regex6sOpTr2);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regex6sOpTr2, '<red>' + item + '</red>');
					}
				}
			}
			//#endregion

			//#region 其他道具
			// 新增家具，示例：【莱茵科技生态园】家具（部分）
			let regexFurni = new RegExp('【[^】]*】家具（部分）(?!</red>)', 'g');
			if (regexFurni.test(wholeText)) {
				var str = wholeText.match(regexFurni);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexFurni, '<red>' + item + '</red>');
					}
				}
			}
			// 寻访凭证
			let regexCert = new RegExp('寻访凭证(?!</red>)', 'g');
			if (regexCert.test(wholeText)) {
				var str = wholeText.match(regexCert);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexCert, '<red>' + item + '</red>');
					}
				}
			}
			// 名片主题
			let regexCard = new RegExp('名片主题【.*】', 'g');
			if (regexCard.test(wholeText)) {
				var str = wholeText.match(regexCard);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexCard, '名片主题<red>' + item.substring(4) + '</red>');
					}
				}
			}
			//#endregion

			//#region 时装
			// 时装1，示例：【忒斯特收藏系列 -“报童”- 阿米娅】
			let regexSkin1 = new RegExp('时装【.*】', 'g');
			if (regexSkin1.test(wholeText)) {
				var str = wholeText.match(regexSkin1);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexSkin1, '时装<red>' + item.substring(2) + '</red>');
					}
				}
			}
			// 时装2，示例：◆【玛尔特】系列 -“下一顿午茶”- 斯卡蒂
			let regexSkin2 = new RegExp('\n(◆【.*[\r\n]){1,}', 'g');
			if (regexSkin2.test(wholeText)) {
				var str = wholeText.match(regexSkin2);
				if (str !== null) {
					for (let item of str) {
						let items = item.split('\n');
						items = items.filter((it) => it !== '');
						items = items.filter((it) => it !== '<br>');
						let newstr = '\n';
						for (let it of items) {
							newstr = newstr + '<red>' + it.replace('\r', '') + '</red>';
						}
						modified = modified.replace(regexSkin2, newstr);
					}
				}
			}
			// 时装3，示例：【玛尔特】系列 -“下一顿午茶”- 斯卡蒂
			let regexSkin3 = new RegExp('\n((?<!<red>)【.*[\r\n]){1,}', 'g');
			if (regexSkin3.test(wholeText)) {
				var str = wholeText.match(regexSkin3);
				if (str !== null) {
					for (let item of str) {
						let items = item.split('\n');
						items = items.filter((it) => it !== '');
						let newstr = '\n';
						for (let it of items) {
							newstr = newstr + '<red>' + it.replace('\r', '') + '</red>\n';
						}
						modified = modified.replace(regexSkin3, newstr);
					}
				}
			}
			// 风尚回顾，示例：活动期间，【0011/飙系列 -“无拘无束”- 刻俄柏】【时代系列 -“识芳”- 琴柳】【0011制造系列 -“暮影藤萝”- 炎狱炎熔】等
			let regexSkinRe = new RegExp('活动期间，【.*】等', 'g');
			if (regexSkinRe.test(wholeText)) {
				var str = wholeText.match(regexSkinRe);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexSkin1, '活动期间，<red>' + item.substring(5).replace('】等', '】') + '</red>等');
					}
				}
			}
			//#endregion

			//#region 芯片礼包
			let regexChipBundleMd = new RegExp('\n\\[医疗芯片礼包\\]', 'g');
			if (regexChipBundleMd.test(wholeText)) {
				var str = wholeText.match(regexChipBundleMd);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexChipBundleMd, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexChipBundleVd = new RegExp('\n\\[先锋芯片礼包\\]', 'g');
			if (regexChipBundleVd.test(wholeText)) {
				var str = wholeText.match(regexChipBundleVd);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexChipBundleVd, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexChipBundleSpe = new RegExp('\n\\[特种芯片礼包\\]', 'g');
			if (regexChipBundleSpe.test(wholeText)) {
				var str = wholeText.match(regexChipBundleSpe);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexChipBundleSpe, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexChipBundleDf = new RegExp('\n\\[重装芯片礼包\\]', 'g');
			if (regexChipBundleDf.test(wholeText)) {
				var str = wholeText.match(regexChipBundleDf);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexChipBundleDf, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexChipBundleGd = new RegExp('\n\\[近卫芯片礼包\\]', 'g');
			if (regexChipBundleGd.test(wholeText)) {
				var str = wholeText.match(regexChipBundleGd);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexChipBundleGd, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexChipBundleSpp = new RegExp('\n\\[辅助芯片礼包\\]', 'g');
			if (regexChipBundleSpp.test(wholeText)) {
				var str = wholeText.match(regexChipBundleSpp);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexChipBundleSpp, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexChipBundleSni = new RegExp('\n\\[狙击芯片礼包\\]', 'g');
			if (regexChipBundleSni.test(wholeText)) {
				var str = wholeText.match(regexChipBundleSni);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexChipBundleSni, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexChipBundleCt = new RegExp('\n\\[术师芯片礼包\\]', 'g');
			if (regexChipBundleCt.test(wholeText)) {
				var str = wholeText.match(regexChipBundleCt);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexChipBundleCt, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			//#endregion

			//#region 特训礼包
			let regexTrBundle5s1 = new RegExp('\n\\[资深干员特训礼包\\]', 'g');
			if (regexTrBundle5s1.test(wholeText)) {
				var str = wholeText.match(regexTrBundle5s1);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexTrBundle5s1, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexTrBundle5s2 = new RegExp('\n\\[特训意向礼包\\]', 'g');
			if (regexTrBundle5s2.test(wholeText)) {
				var str = wholeText.match(regexTrBundle5s2);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexTrBundle5s2, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexTrBundle6s1 = new RegExp('\n\\[高级资深干员特训礼包\\]', 'g');
			if (regexTrBundle6s1.test(wholeText)) {
				var str = wholeText.match(regexTrBundle6s1);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexTrBundle6s1, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexTrBundle6s2 = new RegExp('\n\\[高级特训意向礼包\\]', 'g');
			if (regexTrBundle6s2.test(wholeText)) {
				var str = wholeText.match(regexTrBundle6s2);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexTrBundle6s2, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			//#endregion

			//#region 危机合约礼包
			let regexCcBundle1 = new RegExp('\n\\[危机支援数据包\\]', 'g');
			if (regexCcBundle1.test(wholeText)) {
				var str = wholeText.match(regexCcBundle1);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexCcBundle1, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexCcBundle2 = new RegExp('\n\\[危机支援数据整合箱\\]', 'g');
			if (regexCcBundle2.test(wholeText)) {
				var str = wholeText.match(regexCcBundle2);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexCcBundle2, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexCcBundle3 = new RegExp('\n\\[危机支援资金箱\\]', 'g');
			if (regexCcBundle3.test(wholeText)) {
				var str = wholeText.match(regexCcBundle3);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexCcBundle3, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			//#endregion

			//#region 新年礼包
			let regexSprBundle1 = new RegExp('\n\\[新年寻访组合包·中坚\\]', 'g');
			if (regexSprBundle1.test(wholeText)) {
				var str = wholeText.match(regexSprBundle1);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexSprBundle1, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexSprBundle2 = new RegExp('\n\\[新年寻访组合包\\]', 'g');
			if (regexSprBundle2.test(wholeText)) {
				var str = wholeText.match(regexSprBundle2);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexSprBundle2, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexSprBundle3 = new RegExp('\n\\[新年组合包\\]', 'g');
			if (regexSprBundle3.test(wholeText)) {
				var str = wholeText.match(regexSprBundle3);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexSprBundle3, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexSprBundle4 = new RegExp('\n\\[新春养成组合包\\]', 'g');
			if (regexSprBundle4.test(wholeText)) {
				var str = wholeText.match(regexSprBundle4);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexSprBundle4, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexSprBundle5 = new RegExp('\n\\[迎春组合包\\]', 'g');
			if (regexSprBundle5.test(wholeText)) {
				var str = wholeText.match(regexSprBundle5);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexSprBundle5, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			//#endregion

			//#region 其他通用礼包
			let regexBundle1 = new RegExp('\n\\[鸭爵的零钱包\\]', 'g');
			if (regexBundle1.test(wholeText)) {
				var str = wholeText.match(regexBundle1);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexBundle1, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexBundle2 = new RegExp('\n\\[调用凭证组合包\\]', 'g');
			if (regexBundle2.test(wholeText)) {
				var str = wholeText.match(regexBundle2);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexBundle2, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexBundle3 = new RegExp('\n\\[ID信息更新礼包\\]', 'g');
			if (regexBundle3.test(wholeText)) {
				var str = wholeText.match(regexBundle3);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexBundle3, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexBundle4 = new RegExp('\n\\[罗德岛周年组合包\\]', 'g');
			if (regexBundle4.test(wholeText)) {
				var str = wholeText.match(regexBundle4);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexBundle4, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexBundle5 = new RegExp('\n\\[\d*音律联觉纪念礼包\\]', 'g');
			if (regexBundle5.test(wholeText)) {
				var str = wholeText.match(regexBundle5);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexBundle5, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexBundle6 = new RegExp('\n\\[ID信息更新礼包\\][ (（]免费[）)]', 'g');
			if (regexBundle6.test(wholeText)) {
				var str = wholeText.match(regexBundle6);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexBundle6, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			//#endregion

			//#region 中坚甄选
			let regexKernel1 = new RegExp('在当期甄选的干员范围内自主选择并锁定(?!</red>)', 'g');
			if (regexKernel1.test(wholeText)) {
				var str = wholeText.match(regexKernel1);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexKernel1, '<red>' + item + '</red>');
					}
				}
			}
			let regexKernel2 = new RegExp('当期甄选的干员范围：(?!</red>)', 'g');
			if (regexKernel2.test(wholeText)) {
				var str = wholeText.match(regexKernel2);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexKernel2, '<red>' + item + '</red>');
					}
				}
			}
			// 中坚甄选六星，示例：★★★★★★（出率2%）：早露/温蒂/棘刺/夜莺/阿/赫拉格
			let regexKernel6s = new RegExp('\n★★★★★★[(（]出率2%[）)][：:][^<]*\n(?!</red>)', 'g');
			if (regexKernel6s.test(wholeText)) {
				var str = wholeText.match(regexKernel6s);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexKernel6s, '\n<red>' + item + '</red>\n');
					}
				}
			}
			// 中坚甄选五星，示例：★★★★★（出率8%）：极境/爱丽丝/莱恩哈特/贾维/拉普兰德
			let regexKernel5s = new RegExp('\n★★★★★[(（]出率8%[）)][：:][^<]*\n(?!</red>)', 'g');
			if (regexKernel5s.test(wholeText)) {
				var str = wholeText.match(regexKernel5s);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexKernel5s, '\n<red>' + item + '</red>\n');
					}
				}
			}
			//#endregion

			//#region 正文格式
			let regexEventTime = new RegExp('\n活动时间：', 'g');
			if (regexEventTime.test(wholeText)) {
				var str = wholeText.match(regexEventTime);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexEventTime, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexEventContent = new RegExp('\n活动内容：', 'g');
			if (regexEventContent.test(wholeText)) {
				var str = wholeText.match(regexEventContent);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexEventContent, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexUpdateTime = new RegExp('\n更新时间：', 'g');
			if (regexUpdateTime.test(wholeText)) {
				var str = wholeText.match(regexUpdateTime);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexUpdateTime, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexResetTime = new RegExp('\n重置时间：', 'g');
			if (regexResetTime.test(wholeText)) {
				var str = wholeText.match(regexResetTime);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexResetTime, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexUpdateDetail = new RegExp('\n更新说明：', 'g');
			if (regexUpdateDetail.test(wholeText)) {
				var str = wholeText.match(regexUpdateDetail);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexUpdateDetail, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexUnlock = new RegExp('\n解锁条件：', 'g');
			if (regexUnlock.test(wholeText)) {
				var str = wholeText.match(regexUnlock);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexUnlock, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexEventDetail = new RegExp('\n活动说明：', 'g');
			if (regexEventDetail.test(wholeText)) {
				var str = wholeText.match(regexEventDetail);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexEventDetail, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexObtain = new RegExp('\n获取方式：', 'g');
			if (regexObtain.test(wholeText)) {
				var str = wholeText.match(regexObtain);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexObtain, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexNotice = new RegExp('\n注意[：:]', 'g');
			if (regexNotice.test(wholeText)) {
				var str = wholeText.match(regexNotice);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexNotice, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexSaleTime = new RegExp('\n售卖时间：', 'g');
			if (regexSaleTime.test(wholeText)) {
				var str = wholeText.match(regexSaleTime);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexSaleTime, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexBundleDetail = new RegExp('\n组合包内容：', 'g');
			if (regexBundleDetail.test(wholeText)) {
				var str = wholeText.match(regexBundleDetail);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexBundleDetail, '\n<b>' + item.replace('\n', '') + '</b>');
					}
				}
			}
			//#endregion

			//#region 活动部分
			// 主线再战激励
			let regex1San = new RegExp('1点理智(?!</red>)', 'g');
			if (regex1San.test(wholeText)) {
				var str = wholeText.match(regex1San);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regex1San, '<red>' + item + '</red>');
					}
				}
			}
			let regexEventSplit = new RegExp('\n活动关卡将进行分段式开启：', 'g');
			if (regexEventSplit.test(wholeText)) {
				var str = wholeText.match(regexEventSplit);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexEventSplit, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexEventReward = new RegExp('\n主要奖励：', 'g');
			if (regexEventReward.test(wholeText)) {
				var str = wholeText.match(regexEventReward);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexEventReward, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexEventOpen = new RegExp('\n开放时间：', 'g');
			if (regexEventOpen.test(wholeText)) {
				var str = wholeText.match(regexEventOpen);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexEventOpen, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexEventExchange = new RegExp('\n兑换说明：', 'g');
			if (regexEventExchange.test(wholeText)) {
				var str = wholeText.match(regexEventExchange);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexEventExchange, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexEventItem = new RegExp('\n主要物品：', 'g');
			if (regexEventItem.test(wholeText)) {
				var str = wholeText.match(regexEventItem);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexEventItem, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			//#endregion

			//#region 矿区
			let regexMine1 = new RegExp('源石粗矿(?!</red>)', 'g');
			if (regexMine1.test(wholeText)) {
				var str = wholeText.match(regexMine1);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexMine1, '<red>' + item + '</red>');
					}
				}
			}
			let regexMine2 = new RegExp('源石矿(?!</red>)', 'g');
			if (regexMine2.test(wholeText)) {
				var str = wholeText.match(regexMine2);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexMine2, '<red>' + item + '</red>');
					}
				}
			}
			let regexMine3 = new RegExp('源石矿脉(?!</red>)', 'g');
			if (regexMine3.test(wholeText)) {
				var str = wholeText.match(regexMine3);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexMine3, '<red>' + item + '</red>');
					}
				}
			}
			//#endregion

			//#region 邮件
			let regexMail1 = new RegExp('\n邮件发放时间：', 'g');
			if (regexMail1.test(wholeText)) {
				var str = wholeText.match(regexMail1);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexMail1, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexMail2 = new RegExp('\n邮件领取时间：', 'g');
			if (regexMail2.test(wholeText)) {
				var str = wholeText.match(regexMail2);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexMail2, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			let regexMail3 = new RegExp('\n邮件发放范围：', 'g');
			if (regexMail3.test(wholeText)) {
				var str = wholeText.match(regexMail3);
				if (str !== null) {
					for (let item of str) {
						modified = modified.replace(regexMail3, '\n<b>' + item.substring(1) + '</b>');
					}
				}
			}
			//#endregion

			return [vscode.TextEdit.replace(textRange, modified)];
		}
	});
	context.subscriptions.push(disposableFormat);

}

// this method is called when your extension is deactivated
export function deactivate() { }
