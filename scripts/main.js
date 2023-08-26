var nums = "0123456789", space = "          ";
var colors = ["#fcc", "#f5f577", "#cfc", "#aff", "#ccf", "#fcf"];
var rulers = [], value = "";
for (var i = 1; i <= 1; i++) {
    rulers.push({ color: colors[i], column: i * 10, lineStyle: "dashed" });
    for (var j = 1; j < i; j++) value += space;
    value += nums + "\n";
}

CodeMirror.fromTextArea(
    document.querySelector(".js-input"),
    {
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
        extraKeys: { "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); } },
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        theme: "dracula"
    }
)