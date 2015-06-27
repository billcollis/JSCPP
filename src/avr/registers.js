"use strict";
var Registers;
Registers = function()
{
    this.registers = [];
    //this.bitnames = "";
    //name: n, 
    //address: a,   (number)
    //addrhex:h,    (string)
    //description: d, 
    //bitnames: [, , , , , , , ], 
    //valuedec,     (number)
    //valuehex, 
    //valuebin
    return this;
}
Registers.prototype.getRegisters = function () {
    return this.registers;
}
Registers.prototype.clear = function ()
{
    for (var index = 0; index < this.registers.length; index++)
    {
        this.registers[index].valuedec = 0;
        this.registers[index].valuebin = "0b00000000";
        this.registers[index].valuehex = "0x00";
    }
    //need to read inputs here??? or will they be set somewhere else e.g. at run/step they are read
    updateRegistersDisplay();
}

Registers.prototype.setRegValue = function (regName, val)
{
    //truncate more than 8 bits?
    for (var index = 0; index < this.registers.length; index++) {
        if (regName === this.registers[index].name) {
            this.registers[index].valuedec = val;
            var valbin = val.toString(2); //un padded bin string
            while (valbin.length < 8)
                valbin = "0" + valbin;
            valbin = "0x" + valbin;
            this.registers[index].valuebin = valbin;
            var valhex = val.toString(16).toUpperCase();
            if (val < 16)
                valhex = "0x0" + valhex;
            else
                valhex = "0x" + valhex;
            this.registers[index].valuehex = valhex;
            updateRegistersDisplay();
            return true;
        }
    }
    return false; //could not find registersiter
}

Registers.prototype.exists = function (regName)
{
    for (var index = 0; index < this.registers.length; index++) {
        if (regName === this.registers[index].name) {
            return true;
        }
    }
    return false;
}

Registers.prototype.getRegisterValue = function (regName)
{
    for (var index = 0; index < this.registers.length; index++) {
        if (regName === this.registers[index].name) {
            return this.registers[index].valuedec;
        }
    }
    return false; //doesnt exist
}

Registers.prototype.setBitValue = function (regName, bit, newvalue) {
    //error check for bit > 7?
    for (var index = 0; index < this.registers.length; index++) {
        if (regName === this.registers[index].name) {
            var val = this.registers[index].valuedec;
            if (newvalue = 1)
                val |= (1 << bit);
            else
                val &= ~(1 << bit);
            this.registers[index].valuedec = val;
            var valbin = val.toString(2); //un padded bin string
            while (valbin.length < 8)
                valbin = "0" + valbin;
            valbin = "0x" + valbin;
            this.registers[index].valuebin = valbin;
            var valhex = val.toString(16).toUpperCase();
            if (val < 16)
                valhex = "0x0" + valhex;
            else
                valhex = "0x" + valhex;
            this.registers[index].valuehex = valhex;
            this.updateRegistersDisplay();            
            return true;//able to assign
        }
    }
    return false; //unable to find the address to assign to 
}

Registers.prototype.getRegisterDefines = function () {
    //returns a string formatted with names and values for JSCPP
    //built here so that values for inputs that are high are carried into JSCPP
    var str = "";
    for (var index = 0; index < this.registers.length; index++) {
        str += "\n avrreg " + this.registers[index].name + " = " + this.registers[index].valuedec +";";
        }
        return str;
}

Registers.prototype.updateRegistersDisplay = function ()
{
    $("#regs-jqxgrid").jqxGrid('updatebounddata');
    //recolor LEDs
    //add changes to JSCPP
}

Registers.prototype.addRegister = function (regName, addr, desc, bits)
{
    //as a micro is read in from the json file its registers are added here
    //all values are set to 0
    var hexaddress = addr.toString(16).toUpperCase();
    if (addr < 16)                          //shouldn't need this as registers start at 0x32
        hexaddress = "0x0" + hexaddress;
    else
        hexaddress = "0x" + hexaddress;

    this.registers.push({
        name: regName,
        address: addr,
        addrhex: hexaddress,    //string we created above
        description: desc,         //string
        bitnames: bits,         //an array of strings
        valuedec: 0,            //all registers start life as 0
        valuehex: "0x00",
        valuebin: "0b00000000"
    });
    
}

