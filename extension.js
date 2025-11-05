const vscode = require('vscode');

function getTargetText(selection){
	/* 
		Function: getTargetText
		Description:
		Finds all valid malloc,calloc,realloc calls and adds free() for each of them.
		Also adds if(var == NULL){} statements for each allocation.
		Valid calls are of the form:
		type* ptr = malloc(....)  ;  // Any text
		Allowed variable names:
		Variable name can only consist of upper/lower case english characters, digits or 
		'_' symbols. Variable must be a pointer.
		General requirements:
		An allocation call must end with ';'.
		Parameters:
		selection - selected text. Can be null.
		Return:
		Target text. Contains if statements and free() calls.
	*/

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
	let tgtText = "";
	for (let index = 0; index < fd_uni.length; index++) {
		const expr_curr = fd_uni[index];
		const words = expr_curr.split("=");
		const var_name = words[0].replaceAll("*"," ").trim();
		tgtText = tgtText.concat(`\nif(${var_name} == NULL){}\nfree(${var_name});`);
	}
	return tgtText.concat("\n");
}

function activate(context) {
	/*
		Function: activate
		Description:
		This is the main function of the extension. 
		It places target text at the end of the selection.
		If nothing is selected, a message is triggered.
		Parameters:
		context: editor context
		Return:
		The function doesn't return anything.
	*/
	const disposable = vscode.commands.registerCommand('cppu.allocWrapper', function () {
		const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        let tgt_text = getTargetText(selectedText);
				if(tgt_text){
					editor.edit((editBuilder) => {
						editBuilder.insert(new vscode.Position(editor.selection.end.line+1, 
							editor.selection.end.character), tgt_text)});
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
