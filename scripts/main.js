$(document).ready(function () {
    var layout = [{
        type: 'layoutGroup',
        orientation: 'horizontal',
        items: [{
            type: 'autoHideGroup',
            alignment: 'left',
            width: 80,
            unpinnedWidth: 200,
            items: [{
                type: 'layoutPanel',
                title: 'Toolbox',
                contentContainer: 'ToolboxPanel'
            }, {
                type: 'layoutPanel',
                title: 'Help',
                contentContainer: 'HelpPanel'
            }]
        }, {
            type: 'layoutGroup',
            orientation: 'vertical',
            width: window.innerWidth - 200,
            items: [{
                type: 'documentGroup',
                height: 400,
                minHeight: 200,
                items: [{
                    type: 'documentPanel',
                    title: 'Document 1',
                    contentContainer: 'Document1Panel'
                }, {
                    type: 'documentPanel',
                    title: 'Document 2',
                    contentContainer: 'Document2Panel'
                }]
            }, {
                type: 'tabbedGroup',
                height: 200,
                pinnedHeight: 30,
                items: [{
                    type: 'layoutPanel',
                    title: 'Error List',
                    contentContainer: 'ErrorListPanel'
                }]
            }]
        }, {
            type: 'tabbedGroup',
            width: 220,
            minWidth: 200,
            items: [{
                type: 'layoutPanel',
                title: 'Solution Explorer',
                contentContainer: 'SolutionExplorerPanel'
            }, {
                type: 'layoutPanel',
                title: 'Properties',
                contentContainer: 'PropertiesPanel'
            }]
        }]
    }, {
        type: 'floatGroup',
        width: 500,
        height: 200,
        position: {
            x: 350,
            y: 250
        },
        items: [{
            type: 'layoutPanel',
            title: 'Output',
            contentContainer: 'OutputPanel'
        }]
    }];
    $('#jqxDockingLayout').jqxDockingLayout({ width: window.innerWidth, height: window.innerHeight - 20, layout: layout });


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

    var theme_selection = document.getElementById("theme_selection");
    theme_selection.addEventListener("change", selectTheme);
    function selectTheme(e) {
        var theme = theme_selection.options[theme_selection.selectedIndex].textContent;
        editor.setOption("theme", theme);
        location.hash = "#" + theme;
    }

    const code_area = document.querySelector(".code_area");
});