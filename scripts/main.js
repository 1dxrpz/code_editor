var ngui = undefined;
var nwin = undefined;

try {
	ngui = require('nw.gui');
	nwin = ngui.Window.get();
} catch(e) {
	console.log("DEBUG VERSION");
}

function AppMinimize() {
	if (nwin != undefined)
		nwin.minimize();
}
var isMaximized = false;

if (nwin != undefined) {
	nwin.on("maximize", () => {
		isMaximized = true;
	});
	nwin.on("restore", () => {
		isMaximized = false;
	});
}

function AppMaximize() {
	if (nwin != undefined)
		isMaximized ? nwin.restore() : nwin.maximize();
}

function AppClose() {
	if (nwin != undefined)
		window.close();
}

function AppFullscreen() {
	//isMaximized ? nwin.restore() : nwin.maximize();
	nwin.toggleFullscreen();
}

var contextMenu = document.querySelector(".find_context_menu");
document.body.addEventListener('keydown', e => {
	if (e.altKey && 'f'.indexOf(e.key) !== -1) {
		e.preventDefault();
		contextMenu.setAttribute('shown', true);
		document.querySelector(".find_context_menu>.input>input").focus();
	}
	if	(e.keyCode == 27 && contextMenu.getAttribute('shown')) {
		e.preventDefault();
		contextMenu.setAttribute('shown', false);
	}
});
var editor;
$(document).ready(function () {
	var loader = document.querySelector("#loader");
	
	setTimeout(() => loader.setAttribute("data-loaded", "true"), 1000);
	setTimeout(() => loader.style.zIndex = -1, 1200);
	

	//if (nwin != undefined)
	//ngui.Shell.openExternal('cmd.exe');

	var layout = [{
		type: 'layoutGroup',
		orientation: 'horizontal',
		items: [
		{
			type: 'tabbedGroup',
			width: '30%',
			items: [{
				type: 'layoutPanel',
				title: 'Solution Explorer',
				contentContainer: 'SolutionExplorerPanel'
			}]
		},
		{
			type: 'layoutGroup',
			orientation: 'vertical',
			width: '70%',
			items: [{
				type: 'documentGroup',
				height: '50%',
				minHeight: '20%',
				items: [{
					type: 'documentPanel',
					title: 'Document 1',
					contentContainer: 'Document1Panel'
				}, {
					type: 'documentPanel',
					title: '⚙️ Settings',
					contentContainer: 'Document2Panel'
				}]
			}, {
				type: 'tabbedGroup',
				height: '50%',
				pinnedHeight: '10%',
				items: [
				{
					type: 'layoutPanel',
					title: 'Terminal',
					contentContainer: 'TerminalPanel',
					selected: true
				}, {
					type: 'layoutPanel',
					title: 'Error List',
					contentContainer: 'ErrorListPanel'
				}, {
					type: 'layoutPanel',
					title: 'Output',
					contentContainer: 'OutputPanel'
				}]
			}]
		}]
	}];
	$('#jqxDockingLayout').jqxDockingLayout({
		width: "100%",
		height: "calc(100% - 0px)",
		layout: layout,
		theme: "metrodark"
	});


	var nums = "0123456789", space = "          ";
	var colors = ["#fcc", "#f5f577", "#cfc", "#aff", "#ccf", "#fcf"];
	var rulers = [], value = "";
	for (var i = 1; i <= 1; i++) {
		rulers.push({ color: colors[i], column: i * 10, lineStyle: "dashed" });
		for (var j = 1; j < i; j++) value += space;
			value += nums + "\n";
	}

	CodeMirror.commands.autocomplete = function (cm) {
		cm.showHint();
	}

	editor = CodeMirror.fromTextArea(document.querySelector("#code_editor"), {
		lineNumbers: true,
		styleActiveLine: true,
		rulers: rulers,
		
		smartIndent: true,
		matchBrackets: true,
		indentWithTabs: true,
		indentUnit: 4,
		tabSize: 4,
		autofocus: true,
		mode: "text/x-csrc",
		viewportMargin: Infinity,
		electricChars: true,
		autoCloseBrackets: true,
		lineWrapping: true,
		extraKeys: {
			"Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); },
			"Ctrl-Space": "autocomplete"
		},
		foldGutter: true,
		gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
		theme: "shadowfox"
	});

	var theme_selection = document.getElementById("theme_selection");
	theme_selection.addEventListener("change", selectTheme);
	function selectTheme(e) {
		var theme = theme_selection.options[theme_selection.selectedIndex].textContent;
		editor.setOption("theme", theme);
		location.hash = "#" + theme;
	}

	const code_area = document.querySelector(".code_area");

	var current_line_info = document.querySelector(".current_line");
	editor.on("cursorActivity", () => {
		var cursor = editor.getCursor();
		current_line_info.innerHTML = `Line ${cursor.line + 1} Column ${cursor.ch}`
	});
});


function ChangeMode(e) {
	editor.setOption("mode", e.value);
}