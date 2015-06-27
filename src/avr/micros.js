"use strict";

var microsjson = []; //the file with all the data on the microcontrollers 
var packagesjson = [];
var microsLoaded = false;
var packagesLoaded = false;
var micros = [];//all the different microcontrollers in the json

var bdMicro = null; //the node holding the micro
var olinks; //the incoming links to the microcontroller node
var ilinks = null;  //the incoming links to the microcontroller node

var microPartnumber = "xplained(ATmega328P)"; //removed from image when dropped from nodelist and placed here
var microPackage="xplained";   //leads to image name to load
var microRamSize = 2048;
var microRamStart = 256;
var microEepromSize=512;
var microCrystal=16000000;
//var microRegisters = [];  //name: n, address: a, description: d, bitnames:[,,,,,,,], valuedec
var microRegNames = ""; //just the reg names for ACE codeEditor
var microBitNames = []; // [,,,]
var bitNames = ""; // used to add to code on run
var microPins = [];
var microWidth=55;
var microHeight = 115;
var microAnchorPattern;

function openMicrosFile() {
    $.getJSON('json/avr8_micro.json', function (d) {
        microsjson = d;
    }).
    success(function () {
        microsLoaded = true;
        getAllMicros();
        initMicrosNodeList(microsNodeList, diagram);
    }).
    complete(function () {
        //alert("complete");
    }).
    error(function (jqXHR, textStatus, errorThrown) {
        alert('error ' + textStatus + ' ' + errorThrown);
    });
}
function openPackagesFile() {
    $.getJSON('json/avr8_packagedetails.json', function (d) {
        packagesjson = d;
    }).
    success(function () {
        packagesLoaded = true;
    }).
    complete(function () {
        //alert("complete");
    }).
    error(function (jqXHR, textStatus, errorThrown) {
        alert('error ' + textStatus + ' ' + errorThrown);
    });
}
//load micro partnumbers into micros[]
function getAllMicros()//from the json file
{
    var length = microsjson.micros.micro.length; //number of diff micros
    var i = 0;
    for (i=0; i < length; i++) {
        micros.push(microsjson.micros.micro[i].partnumber);
    }
}
//make nodelist out of micros[]
function initMicrosNodeList(microsNodeList, diagram) {
    var i;
    for (i = 0; i < micros.length; i++) {
        var node = new MindFusion.Diagramming.ShapeNode(diagram);
        node.setText(micros[i]);
        node.setId("micro") //same as in SysDes
        //node.setImageLocation("images/_img_xplained.png");
        node.setShape("Rectangle");
        //node.setBrush("Red");
        node.setTextAlignment(Alignment.Center);
        node.setLineAlignment(Alignment.Center);
        microsNodeList.addNode(node, micros[i]);
    }
}
//make all the details for a specific micro from json object
function makeMicroDetails(partnum)
{
    //zero all arrays - S.O. how-to-empty-an-array-in-javascript
    //microRegisters.length = 0;
    //microRegisters = Registers(microRegisters) //microRegisters.length = 0;
    //microRegNames="";
    microBitNames.length = 0;
    bitNames = "";
    microPins.length = 0;

    var length = microsjson.micros.micro.length; //number of diff micros
    var index = 0;
    var reg = 0; 
    var bit = 0;
    var pin = 0;
    var n;
    var a;
    var d;
    var bits;
    var exists = false;
    var na;
    var bn;
    var bitexists = false;

    for (index = 0; index < length; index++)
    {
        if (partnum === microsjson.micros.micro[index].partnumber) //found micro
        {
            microPackage = microsjson.micros.micro[index].package;
            microRamSize = microsjson.micros.micro[index].ramsize;
            microRamStart = microsjson.micros.micro[index].ramstart;
            microEepromSize = microsjson.micros.micro[index].eepromsize;
            microCrystal = microsjson.micros.micro[index].crystal;
            microWidth = microsjson.micros.micro[index].width; 
            microHeight = microsjson.micros.micro[index].height;
            for (reg=0; reg < microsjson.micros.micro[index].registers.regname.length; reg++)
            {
                n = microsjson.micros.micro[index].registers.regname[reg].name;
                a = microsjson.micros.micro[index].registers.regname[reg].address;
                d = microsjson.micros.micro[index].registers.regname[reg].description;
                bits = ["","","","","","","",""]; //holds the name for each bit of the register
                //get each bit for this register, add them to microBitnames
                exists = microsjson.micros.micro[index].registers.regname[reg].bitname;
                if (exists)
                    for (bit=0; bit< microsjson.micros.micro[index].registers.regname[reg].bitname.length;bit++)
                    {
                        na = microsjson.micros.micro[index].registers.regname[reg].bitname[bit].name;
                        bn = microsjson.micros.micro[index].registers.regname[reg].bitname[bit].bit;
                        bitexists = false;
                        for (var b = 0; b < microBitNames.length; b++)
                            if (na === microBitNames[b].name)
                                bitexists = true;
                        if (!bitexists)
                        {
                            bits[bn] = na;
                            microBitNames.push({ name: na, bit: bn }); //add it to each array
                            bitNames += "\n avrregbit " + na + " = " + bit +";";
                        }
                    }
                registers.addRegister(n, a, d, bits);
                microRegNames += "|" + n; //the names used by ACE
                //regDefines += "\n uint8_t " + n + " = 0;";
                //microRegisters.push({ name: n, address: a, description: d, bitnames:bits, value:0}); //all registers start life as 0b00000000
            }
           
            //get each pin and its functions
            microPins.length = microsjson.micros.micro[index].pins.pin.length + 1; //create new undefined array
            //microPins[0]="0"; //nothing in index0
            for (pin = 0; pin < microsjson.micros.micro[index].pins.pin.length; pin++)
            {
                microPins[pin] = microsjson.micros.micro[index].pins.pin[pin].f;
            }
            break;
        }
    }

    //update keywords in ACE 
    // stackoverflow.com/questions/22166784/dynamically-update-syntax-highlighting-mode-rules-for-the-ace-editor
    codeEditor.session.setMode({
        path: "ace/mode/c_cpp",
        v: Date.now()
    })
    registers.updateRegistersDisplay();
    var length = packagesjson.packages.package.length; //number of diff micros
    microAnchorPattern = new AnchorPattern([]);
    for (index=0;index<length;index++)
    {
        if (microPackage === packagesjson.packages.package[index].packname)
        {
            microWidth = packagesjson.packages.package[index].nodewidth;
            microHeight = packagesjson.packages.package[index].nodeheight;
            var x;
            var y;
            var i;
            var o;
            var ms;
            var col;
            var pt;
            var pin;
            //create anchor points
            for (var point=0;point<packagesjson.packages.package[index].anchorpoint.length;point++)
            {
                pin = packagesjson.packages.package[index].anchorpoint[point].pin - 1;
                x = packagesjson.packages.package[index].anchorpoint[point].x;
                y=packagesjson.packages.package[index].anchorpoint[point].y;
                i=packagesjson.packages.package[index].anchorpoint[point].i;
                o=packagesjson.packages.package[index].anchorpoint[point].o;
                ms="MarkStyle."+packagesjson.packages.package[index].anchorpoint[point].ms;
                col = packagesjson.packages.package[index].anchorpoint[point].col.toLowerCase();
                col = col.substr(0,col.length);
                pt = new AnchorPoint(x, y, i, o, 4, col ,2)//, ms, col, 2, microPins[pin][0]);
                pt.setTag(microPins[pin][0]);
                microAnchorPattern.points.push(pt);
            }
        }        
    }
}
function createAnchorPoint(x, y, inok, outok, style, col, size, tag) {
    var ap = new AnchorPoint(x, y, inok, outok, style, col, size, tag);
    ap.setTag(tag);
    return ap;
}
function containsBit(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}
//called when micro dropped onto diagram
function newMicro(partnum) {
    var deleteMicro = true;
    if (bdMicro != null)
        deleteMicro = confirm("This will clear the whole diagram  \r\n      and restart it with a new microcontroller");
    if (deleteMicro === false) {       
        return;
    }

    //otherwise clear diagram and add new micro
    diagram.clearAll();
    microPartnumber = partnum;
    makeMicroDetails(partnum);
    bdMicro = new MindFusion.Diagramming.ShapeNode(diagram);
    bdMicro.setShape("Rectangle");
    bdMicro.setImageLocation("images/_img_" + microPackage + ".png");
    bdMicro.setId("micro");
    bdMicro.setBounds(new Rect(60, 40, microWidth, microHeight));
    bdMicro.getImage(); //??
    bdMicro.setImageAlign(ImageAlign.Stretch);
    bdMicro.setAnchorPattern(microAnchorPattern);
    diagram.addItem(bdMicro);
    olinks = bdMicro.getOutgoingLinks();
    ilinks = bdMicro.getIncomingLinks();
    if (microPackage === "xplained")
        newXplained();
}
function newXplained() {
    //new LED
    var ledB5 = diagram.getFactory().createShapeNode(new Rect(140, 50, 20, 10));
    ledB5.setText("led_");
    ledB5.setId("led") //same as in SysDes
    ledB5.setImageLocation("images/_img_led.png");
    ledB5.setShape("Rectangle");
    ledB5.setAllowOutgoingLinks(false);
    ledB5.setBrush("Red");
    ledB5.setTextAlignment(Alignment.Center);
    ledB5.setLineAlignment(Alignment.Far);

    var ap = createAnchorPoint(0, 50, true, false, MarkStyle.Rectangle, blue, 2, "led")
    var pat = new AnchorPattern([ap]);
    ledB5.setAnchorPattern(pat);

    var ledB5link = diagram.getFactory().createDiagramLink(bdMicro, ledB5);
    ledB5link.setOriginAnchor(19);

    //new tactsw
    var swB7 = diagram.getFactory().createShapeNode(new Rect(100, 180, 20, 20));
    swB7.setText("tactSw_"); //use 'text' from XML file
    swB7.setAllowIncomingLinks(false); //default for binaryinputs
    swB7.setId("tact_switch__"); //use 'type' in XML file
    swB7.setImageLocation("images/_img_tact.png"); //'use 'image' from XML file
    swB7.setShape("Rectangle");
    swB7.setTextAlignment(Alignment.Center); //center of line
    swB7.setLineAlignment(Alignment.Far); //bottom line

    var swB7link = diagram.getFactory().createDiagramLink(swB7, bdMicro);
    swB7link.setDestinationAnchor(20);
    swB7link.route();
}

