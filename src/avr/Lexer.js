"use strict";
//turns ace tokens into my parser tokens

var linenum;
var tok;
var op;
var tokencounter = 0;
var tokentype;
var tokenvalue;
var tokenpos = 0;
var token;
var Tokens = []; //the list of parseable Tokens 
var acetokens = []; //the list of Tokens from the aceeditor
var toknIndex = 0;



//parseable Tokens
function lexer_GenTokens() {
    lexer_GenACETokens();
    Tokens.length = 0;
    //redefine Tokens 
    tokencounter = 0;
    for (tok = 0; tok < acetokens.length ; tok++) //foreach line
    {
        tokentype = acetokens[tok].type.trim();
        tokenvalue = acetokens[tok].value.trim();
        linenum = acetokens[tok].line;
        tokenpos = acetokens[tok].tokenpos;

        if (tokentype === TokenType.tCR)
        {
            lexer_AddToTokens();
            //addLF token??
        }
        else if (tokentype === "text" && tokenvalue.trim() === "") {
            //do nothing with these
        }
        else if (tokentype === "constant.numeric.hex")//convert 0x.. to number
        {
            tokentype = TokenType.tIntConst;
            tokenvalue = parseInt(tokenvalue, 16);
            lexer_AddToTokens();
        }
        else if (tokentype === "constant.numeric.binary") //convert 0b.. to number
        {
            tokentype = TokenType.tIntConst;
            tokenvalue = parseInt(tokenvalue, 2);
            lexer_AddToTokens();
        }
        else if (tokentype === "constant.numeric.float")//separate integer & float convert to number
        {
            if (tokenvalue.indexOf('.')>-1 || tokenvalue.toLowerCase().indexOf('e')>-1 )
            {
                tokentype = TokenType.tFloatConst;
                tokenvalue = parseFloat(tokenvalue);
                lexer_AddToTokens();
            }
            else
            {
                tokentype = TokenType.tIntConst;
                tokenvalue = parseInt(tokenvalue);
                lexer_AddToTokens();
            }
        }
        else if (tokentype === "string") //will have '' or "" around it
        {
            tokentype = TokenType.tStringConst;
            lexer_AddToTokens();
        }
        else if (tokentype.indexOf("comment") > -1) {
            tokentype = TokenType.tComment;
            lexer_AddToTokens();
        }
        else if (tokentype.indexOf("identifier") > -1) { //could be tRegBit or TRegAddress
            var found=false;
            for (var index=0; index<microRegisters.length; index++)
            {
                if (tokenvalue === microRegisters[index].name)
                {
                    tokentype = TokenType.tRegAddress;
                    found=true;
                    break;
                }                  
            }
            if (!found)
                for (var index = 0; index < microBitNames.length; index++)
                {
                    if (tokenvalue === microBitNames[index].name)
                    {
                        tokentype = TokenType.tRegBit;
                        found = true;
                        break;
                    }
                }
            if (!found)
                tokentype = TokenType.tVarIdent;
            lexer_AddToTokens();
        }
        else if (tokentype.indexOf("paren") > -1) {
            tokentype = parenTable[tokenvalue.trim()]; //lookup
            lexer_AddToTokens();
        }
        else if (tokentype === "keyword.operator") {
            tokentype = operatorsTable[tokenvalue]; //lookup 
            lexer_AddToTokens();
        }
        else if (tokentype === "storage.type") {
            tokentype = TokenType.tType;
            lexer_AddToTokens();
        }
        else if (tokentype === "keyword.control") {
            tokentype = keywordControlTable[tokenvalue]; //lookup
            lexer_AddToTokens();
        }
        else if (tokentype === "keyword")//define, include, const
        {
            tokentype = keywordTable[tokenvalue]; //lookup
            if (tokentype === "tDefine") //will be followed by X Tokens with ident and data in it
            {
                //add the tDefine
                lexer_AddToTokens(); //keyword:#define has become tDefine:#define
                lexer_GetNextACEToken();

                //split
                var pos = tokenvalue.trim().indexOf(" ");
                var ident = tokenvalue.substr(0, pos + 1).trim();
                lexer_AddToTokensTokentypeValue(TokenType.tDefineIdent, ident);
                
                var rest = tokenvalue.substr(pos + 1, tokenvalue.length).trim();
                //some defines get split - why?? - get all Tokens upto tCR
                while (tokentype !== "tCR") {
                    lexer_GetNextACEToken();
                    if (tokentype === "comment")
                        break;
                    if (tokentype === "comment.doc")
                        break;
                    if (tokentype === "tCR")
                        break;
                    rest += tokenvalue;
                }

                lexer_AddToTokensTokentypeValue("tStringOfTokens", rest);
            }
            else if (tokentype === TokenType.tInclude) {
                lexer_GetNextACEToken();
                lexer_AddToTokensTokentype(TokenType.tInclude);
            }
            else if (tokentype === TokenType.tConst) {
                tokenvalue = codeEditor.session.getTokens(linenum)[tok + 1].value;
                tokenEditor.insert(tokencounter + " " + linenum + ":" + tokenpos + " " + tokentype + "," + tokenvalue); //show what you got
                tokenEditor.insert('\n');
                tokencounter++;
                tok++; //skip line with include filename
            }
        }
        else {
            //anything else?
        }
    }
    lexer_AddToTokensTokentype(TokenType.tEOF)
}
function lexer_AddToTokens() {
    Tokens.push({
        Count: tokencounter,
        Line: linenum,
        Position: tokenpos,
        Type: tokentype,
        Value: tokenvalue
    });
    tokencounter++;
}
function lexer_AddToTokensTokentype(type) {
    Tokens.push({
        Count: tokencounter,
        Line: linenum,
        Position: tokenpos,
        Type: type,
        Value: tokenvalue
    });
    tokencounter++;
}
function lexer_AddToTokensTokentypeValue(type,value) {
    Tokens.push({
        Count: tokencounter,
        Line: linenum,
        Position: tokenpos,
        Type: type,
        Value: value
    });
    tokencounter++;
}
function lexer_GenDispTokens()
{
    lexer_GenTokens();
    lexer_DispTokens();
}
function lexer_DispTokens()
{
    tokenEditor.setValue("");
    for (tok = 0; tok < Tokens.length ; tok++) //foreach line
    {
        tokenEditor.insert(
            Tokens[tok].Count + " " +
            Tokens[tok].Line + ":" +
            Tokens[tok].Position + " " +
            Tokens[tok].Type + "," +
            Tokens[tok].Value);
        tokenEditor.insert('\n');
    }
}

//ACE tokens
function lexer_GenDispACETokens()
{
    lexer_GenACETokens();
    lexer_DispACETokens();
}
function lexer_GenACETokens() {
    //display ACE Tokens
    //creates an array of the ace Tokens first then displays it - why did I do it this way??
    aceEditor.setValue("");
    acetokens.length = 0;
    tokencounter = 1;
    //bring in all the Tokens from the codeEditor into the array Tokens
    for (linenum = 0; linenum < codeEditor.session.getLength() ; linenum++) //foreach line
    {
        for (tok = 0; tok < codeEditor.session.getTokens(linenum).length; tok++) //foreach token on a line
        {
            tokentype = codeEditor.session.getTokens(linenum)[tok].type;
            tokenvalue = codeEditor.session.getTokens(linenum)[tok].value;
            acetokens.push({ tokencount: tokencounter, line: linenum + 1, tokenpos: tok, type: tokentype, value: tokenvalue })
            tokencounter++;
        }
        tokentype = "tCR";
        tokenvalue = "CR";
        acetokens.push({ tokencount: tokencounter, line: linenum + 1, tokenpos: tok, type: tokentype, value: tokenvalue })
        tokencounter++;
    }
}
function lexer_DispACETokens()
{
    //display all the Tokens
    for (tok = 0; tok < acetokens.length ; tok++) //foreach line
    {
        aceEditor.insert(acetokens[tok].tokencount + ":");
        aceEditor.insert(acetokens[tok].line + ":");
        aceEditor.insert(acetokens[tok].tokenpos + " ");
        aceEditor.insert(acetokens[tok].type + ":");
        aceEditor.insert(acetokens[tok].value + ":");
        aceEditor.insert('\n');
    }

}
function lexer_GetNextACEToken() //from Tokens
{
    tok++;
    tokentype = acetokens[tok].type.trim();
    tokenvalue = acetokens[tok].value.trim();
    linenum = acetokens[tok].line;
    tokenpos = acetokens[tok].tokenpos;
}


var parenTable = {
    '(': TokenType.tOpenBracket,
    ')': TokenType.tCloseBracket,
    '{': TokenType.tOpenBrace,
    '}': TokenType.tOpenBrace,
    '[': TokenType.tOpenSquareBracket,
    ']': TokenType.tOpenSquareBracket,
}

var operatorsTable = {
    '+': TokenType.tAdd,
    '++': TokenType.tIncrement,
    '+=': TokenType.tAddAssign,
    '-': TokenType.tSubtract,
    '--': TokenType.tDecrement,
    '-=': TokenType.tSubtractAssign,
    '*': TokenType.tMultiply,
    '*=': TokenType.tMultiplyAssign,
    '/': TokenType.tDivide,
    '/=': TokenType.tDivideAssign,
    '%': TokenType.tModulus,
    '%=': TokenType.tModulusAssign,
    '=': TokenType.tAssign,
    ';': TokenType.tSemicolon,
    ' ': '',
    ':': TokenType.tColon,
    '|': TokenType.tBitwiseOr,
    '||': TokenType.tLogicalOr,
    '|=': TokenType.tBitwiseOrAssign,
    '&=': TokenType.tAndAssign,
    '~': TokenType.tBitwiseNot,
    '!': TokenType.tLogicalNot,
    '&': TokenType.tBitwiseAnd,
    '&&': TokenType.tLogicalAnd,
    '<': TokenType.tLessThan,
    '<<': TokenType.tShiftLeft,
    '<<=': TokenType.tShiftLeftAssign,
    '>': TokenType.tGreaterThan,
    '>>': TokenType.tShiftRight,
    '>>=': TokenType.tShiftRightAssign
};
var keywordTable = {
    '#include': 'tInclude',
    '#define': 'tDefine',
    'const': 'tConst',
};
var keywordControlTable = {
    'while': 'tWhile',
    'break': 'tBreak',
    'case': 'tCase',
    'continue': 'tContinue',
    'default': 'tDefault',
    'do': 'tDo',
    'else': 'tElse',
    'for': 'tFor',
    'goto': 'tGoto',
    'if': 'tIf',
    '_Pragma': 'tPragma',
    'return': 'tReturn',
    'switch': 'tSwitch',
};

//function getNextToknSkipWS()
//{
//    tok++;
//    while (tok < codeEditor.session.getTokens(linenum).length && codeEditor.session.getTokens(linenum)[tok].value === " ")
//    {
//        tok++;
//    }
//    if (tok < codeEditor.session.getTokens(linenum).length) {
//        tokentype = codeEditor.session.getTokens(linenum)[tok].type;
//        tokenvalue = codeEditor.session.getTokens(linenum)[tok].value;
//        return true;
//    }
//    else
//        return false;
//}

//not used
//var tokensLoaded = false;
//var tokensjson; //the loaded json//function openTokensFile() {
//    // to get json files to work with VisualStudio
//    // http://bistw.blogspot.co.nz/2013/07/visual-studio-iis-express-using-json.html
//    $.getJSON('lib/json/Tokens.json', function (d) {
//        tokensjson = d;

//    }).
//    success(function () {
//        //document.getElementById("btnTokenise").disabled = false;
//        tokensLoaded = true;
//    }).
//    complete(function () {
//        //alert("complete");
//    }).
//    error(function (jqXHR, textStatus, errorThrown) {
//        alert('error ' + textStatus + ' ' + errorThrown);
//    });
//}

