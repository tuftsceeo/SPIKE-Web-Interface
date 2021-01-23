/*
Project Name: SPIKE Prime Web Interface
File name: micropyUtils.js
Author: Jeremy Jung
Last update: 10/22/20
Description: utility class to convert javascript variables to python variablse 
            for EN1 Simple Robotics final projects
Credits/inspirations:
History:
    Created by Jeremy on 10/18/20
(C) Tufts Center for Engineering Education and Outreach (CEEO)
NOTE:
strings need to be in single quotes
*/

var micropyUtils = {};

micropyUtils.storedVariables = {}; // all variables declared in window
micropyUtils.beginVariables = {}; // all variables declared in window before code

// automatically initialize microPyUtils to exclude predeclared variables when window loads
// this initializes after global variable declarations but before hoisted functions in <script> are executed
window.onload = function() {
    console.log("onload")
    //micropyUtils.init();
}

// this initializes after global variable declarations but before hoisted functions in <script> are executed
// this runs earlier than onload
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMCONtent")
    //micropyUtils.init();
})
//////////////////////////////////////////
//                                      //
//           Public Functions           //
//                                      //
//////////////////////////////////////////

// remember global variables declared BEFORE user code
micropyUtils.remember = function() {
    for (var name in window) {
        micropyUtils.beginVariables[name] = window[name];
    }
    console.log("remembered predeclared variables ", micropyUtils.beginVariables)
}

/* parse and add all local variable declarations to micropyUtils.storedVariables

var aString = "hi" or var aString = 'hi' > {aString: "hi"}


*/
// micropyUtils.addLocalVariables = function() {
//     // get the function definition of caller
//     var thisFunction = arguments.callee.caller.toString();
    
//     console.log(thisFunction);
    
//     // split function scope by newlines
//     var newLineRule = /\n/g
//     var arrayLines = thisFunction.split(newLineRule);
    
//     // filter lines that dont contain var, or contains function
//     var arrayVarLines = [];
//     for ( var index in arrayLines ) {
//         if ( arrayLines[index].indexOf("var") > -1 ) {
//             // filter out functions and objects
//             if (arrayLines[index].indexOf("function") == -1 && arrayLines[index].indexOf("{") == -1 && arrayLines[index].indexOf("}") == -1) {
//                 arrayVarLines.push(arrayLines[index]);
//             }
//         }
//     }
    
//     var parseRule = /[[ ]/g
//     for ( var index in arrayVarLines ) {
//         // process line
//         var processedLine = micropyUtils.processString(arrayVarLines[index]);
        
//         // get [datatype] object = value format
//         var listParsedLine = processedLine.split(parseRule);
//         //listParsedLine = listParsedLine.split(/[=]/g)
        
//         var keyValue = micropyUtils.checkString(listParsedLine);
        
//         // insert into variables 
//         for ( var name in keyValue ) {
//             micropyUtils.storedVariables[name] = keyValue[name];
//         }
//     }
    
// }

// initialize utility object (find window variables to exclude from conversion)
micropyUtils.init = function () {
    var excludeVariables = {};
    
    // get variables to exclude
    for (var compare in micropyUtils.beginVariables) {
        // if variables found on remember() are defined, these are not user-generated variables, so flag them predeclared
        if (typeof micropyUtils.beginVariables[compare] !== "undefined") {
            excludeVariables[compare] = "predeclared"
        }
    }
    
    // append window variables to micropyUtils.storedVariables, but exclude those predeclared
    for (var name in window) {
        if (excludeVariables[name] != "predeclared") {
            micropyUtils.storedVariables[name] = window[name];
        }
    }
    console.log("stored Variabls in init: ", micropyUtils.storedVariables);
}

micropyUtils.makeMicroPyDeclarations = function () {
    // initialize microPyUtils
    micropyUtils.init();

    /* add local variables of the caller of this function */
    // get the function definition of caller
    /* parse and add all local variable declarations to micropyUtils.storedVariables

    var aString = "hi" or var aString = 'hi' > {aString: "hi"}


    */
    var thisFunction = arguments.callee.caller.toString();

    console.log(thisFunction);

    // split function scope by newlines
    var newLineRule = /\n/g
    var arrayLines = thisFunction.split(newLineRule);

    // filter lines that dont contain var, or contains function
    var arrayVarLines = [];
    for (var index in arrayLines) {
        if (arrayLines[index].indexOf("var") > -1) {
            // filter out functions and objects
            if (arrayLines[index].indexOf("function") == -1 && arrayLines[index].indexOf("{") == -1 && arrayLines[index].indexOf("}") == -1) {
                arrayVarLines.push(arrayLines[index]);
            }
        }
    }

    var parseRule = /[[ ]/g
    for (var index in arrayVarLines) {
        // process line
        var processedLine = micropyUtils.processString(arrayVarLines[index]);

        // get [datatype] object = value format
        var listParsedLine = processedLine.split(parseRule);
        //listParsedLine = listParsedLine.split(/[=]/g)

        var keyValue = micropyUtils.checkString(listParsedLine);

        // insert into variables 
        for (var name in keyValue) {
            micropyUtils.storedVariables[name] = keyValue[name];
        }
    }

    /* generate lines of micropy variable declarations */
    var lines = [];
    for ( var name in micropyUtils.storedVariables ) {
        var variableName = name;
        if (typeof micropyUtils.storedVariables[name] !== "function" && typeof micropyUtils.storedVariables[name] !== "object" ) {
            var variableValue = micropyUtils.convertToString(micropyUtils.storedVariables[name]);
            lines.push("" + variableName + " = " + variableValue);

        }
    }
    
    return lines
}

//////////////////////////////////////////
//                                      //
//          Private Functions           //
//                                      //
//////////////////////////////////////////

// add local variables in which scope the utility tool is being used
micropyUtils.addVariables = function (object) {
    for (var name in object) {
        micropyUtils.storedVariables[name] = object[name];
    }
}


// filter out unparsable variable declarations and process valid ones
micropyUtils.processString = function(input) {
    var result = input.trim();
    var removeRule = /[;]/g
    result = result.replace(removeRule, "");
    var doubleQuotes = /[",']/g
    result = result.replace(doubleQuotes, "");
    return result;
}

// return key value pair of variable declaration
micropyUtils.checkString = function(list) {
    var result = {}; // {variable name: variable value}
    // check if list starts with var
    if (list[0] == "var") {
        var variableName = list[1];
        // check assignment operator
        if (list[2] == "=") {
            // assume the right hand side of assignment operator is only one term
            var value = list[3];
            
            result[variableName] = micropyUtils.convertFromString(value);
            
            return result;
        }
        else {
            return undefined;
        }
    }
    else {
        return undefined;
    }
}

// convert string value to correct data type value
micropyUtils.convertFromString = function (value) {
    // value is not a number
    if ( isNaN(parseInt(value)) ) {
        // value is a bool
        if ( value.indexOf("true") > -1 ) {
            return true;
        }
        else if (value.indexOf("false") > -1 ) {
            return false;
        }
        // value is a string
        else {
            return value;
        }
    }
    else {
        // value is a number
        var number = Number(value);
        return number;
    }
}

// convert datatype value to string value
micropyUtils.convertToString = function (value) {
    // value is a string, enclose with single quots and return
    if (typeof value == "string" ) {
        return "'" + value + "'";
    }
    else {
        // value is a number
        if ( Number(value) ) {
            return "" + value;
        }
        // value is boolean
        else {
            return "" + value;
        }
    }
}

//////////////////////////////////////////
//                                      //
//                  Main                //
//                                      //
//////////////////////////////////////////

// remember predeclared variables when this file is loaded
micropyUtils.remember();