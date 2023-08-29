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

var editor = CodeMirror.fromTextArea(document.querySelector("#code_editor"), {
    lineNumbers: true,
    styleActiveLine: true,
    rulers: rulers,
    value: value + value + value,
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

var input = document.getElementById("select");
function selectTheme() {
    var theme = input.options[input.selectedIndex].textContent;
    editor.setOption("theme", theme);
    location.hash = "#" + theme;
}


const code_area = document.querySelector(".code_area");
const inspector = document.querySelector("#inspector");
const gutter = document.querySelector(".gutter");
var gutter_drag = false;

window.addEventListener('mousemove', e => {
    if (gutter_drag && e.clientX > 200 && e.clientX < 1000) {
        inspector.style.width = `${e.clientX}px`;
        code_area.style.width = `calc(100% - ${e.clientX}px)`;
    }
});

gutter.addEventListener('mousedown', _ => gutter_drag = true);
window.addEventListener('mouseup', _ => gutter_drag = false);