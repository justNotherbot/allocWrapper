const vscode = require('vscode');

function getTargetText(selection){
	if(selection == null){
		return "";
	}
	const regex_mc = /[*]+[ ]*[A-Za-z_0-9]+[ ]*=[ ]*[m,c]alloc[(].*[)][ ]*;/g;
	const regex_re = /[*]+[ ]*[A-Za-z_0-9]+[ ]*=[ ]*realloc[(].*[)][ ]*;/g;
	const found_mc = selection.match(regex_mc);
	const found_re = selection.match(regex_re);
	let fd_uni = [];
	if(found_mc != null){
		fd_uni = fd_uni.concat(found_mc);
	} 
	if(found_re != null){
		fd_uni = fd_uni.concat(found_re);
	}
	console.log(fd_uni);
	let tgtText = "";
	for (let index = 0; index < fd_uni.length; index++) {
		const expr_curr = fd_uni[index];
		const words = expr_curr.split("=");
		const varName = words[0].replace("*"," ").trim();
		tgtText = tgtText.concat(`\nif(${varName} == NULL){}\nfree(${varName});`);
	}
	return tgtText.concat("\n");
}

function activate(context) {
	const disposable = vscode.commands.registerCommand('cppu.allocWrapper', function () {
		const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        let tgtText = getTargetText(selectedText);
				if(tgtText){
					editor.edit((editBuilder) => {
						editBuilder.insert(new vscode.Position(editor.selection.end.line+1, 
							editor.selection.end.character), tgtText)});
				} else {
					vscode.window.showInformationMessage('No valid allocations found in the selection');
				}
      }
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
