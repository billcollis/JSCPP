"use strict";

Range = ace.require("ace/range").Range;
var parserstate = PARSERSTATE.STOP;
var debug = false;
var code;
var input;
var output;
var result;
var linemarker;
var variables;
var config = {
    stdio: {
        write: function (s) {
            outputtxt.value += s;
        }
    },
    debug: debug
}
var mydebugger;


// BUTTON COMMANDS
function start()
{
    Memory_Clear();
    Registers_Clear();
}

function Step()
{
    //alert(browser)
    if (browser.indexOf("IE") >= 0 ) { //other older browswers tested too 
        alert("you need to use a modern desktop version of Firefox or Chrome");
        return;
    }
    if (parserstate === PARSERSTATE.STOP) {
        try {
            config.debug = true;
            outputtxt.value = "";
            var regsnbits  = registers.getRegisterDefines() + bitNames;
            code = codeEditor.getSession().getValue() + regsnbits ; 
            input = document.getElementById("inputtxt").value;
            mydebugger = JSCPP.run(code, input, config);
            parserstate = PARSERSTATE.STEP;
            //tokenEditor.setValue(mydebugger.src); //tokenditor not in code currently
        } catch (e) {
            resulttxt.value = e;
            resulttxt.value = mydebugger.stop();
            parserstate = PARSERSTATE.STOP
            return;
        }
    }
    if (parserstate === PARSERSTATE.STEP) {
        try {
            var done;
            done = mydebugger.next();
            showVariables();
            updateLineHighlight();
            if (!done) {
                resulttxt.value = mydebugger.nextLine();
            } else {
                parserstate = PARSERSTATE.STOP
                resulttxt.value = 'finished';
            }
        } catch (e) {
            resulttxt.value = e;
        }
    }
}
function Run()
{
}
function Stop()
{
    parserstate = PARSERSTATE.STOP;
    if (linemarker !== undefined)
        codeEditor.getSession().removeMarker(linemarker)
    debug = null;
}
function updateLineHighlight() {
    var s, r;
    s = mydebugger.nextNode();
    if (linemarker !== undefined)
        codeEditor.getSession().removeMarker(linemarker)
    r = new Range(s.sLine - 1, s.sColumn - 1, s.sLine - 1, s.eColumn - 1);
    linemarker = codeEditor.getSession().addMarker(r, 'debug-highlight', 'token');
}
function showVariables() {
    //intially just show in textarea
    variablestxt.value = ""
    variables = mydebugger.allVariables();
    for (var i = 0; i < variables.length; i++) {
        variablestxt.value += variables[i].scopelevel + " "
        variablestxt.value += variables[i].scopename + " "
        variablestxt.value += variables[i].gentype + " "
        variablestxt.value += variables[i].name + " "
        variablestxt.value += variables[i].type + " "
        variablestxt.value += variables[i].value
        variablestxt.value += '\n'
    }
    //should this just detect changes and pass them on to registers and memory?
    // changes might best be managed within JSCPP then it would only give back changed things?
    //if its a register then update the registers
}

var browser = (function () {
    var ua = navigator.userAgent, tem,
    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();