"use strict";
var Memory;

Memory = function (start, size) { //(256,2048)
    this.datastart = start; //start location in RAM
    this.ramend = start + size - 1; //e.g.256 + 2048 -1 = 2303
    this.stackptr = ramend;

    this.dataptr = datastart; //available add in RAM
    this.bssstart = datastart;
    this.bssptr = datastart;
    this.heapstart = datastart;
    this.heapend =_datastart;
    this.heapptr = datastart;
    this.memory = [];
    return this;
}

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

//function memory_init(start, length)
//{
//    _ramend = length + start; //e.g. 2048 + 256 
//    _datastart = start; //e.g. 256 = 0x100
//    memory_clear();
//}
Memory.prototype.clear = function() {
    this.memory = 0; //blank the memory arrays
    SRAM.length = 0;

    this.dataptr = this.datastart;

    this.bssstart = this.datastart; // as new vars are added _bssstart needs to move and all vars in _bss need to move too!
    this.bssptr = this.datastart;

    this.heapstart = this.datastart;
    this.heapptr = this.datastart;
    this.heapend = this.datastart; //no heap to start with

    this.stackptr = this.ramend;
}
Memory.prototype.moveMemUp = function(memarea, size){
    //switch (memarea)
    //{
    //    case MemArea.Data:
    //        for (var index = 0; index < Memory.length; index++)
    //            if (Memory[index].MemArea === MemArea.BSS || Memory[index].MemArea === MemArea.Heap) {
    //                Memory[index].address += size;
    //            }
    //        for (var index = 0; index < Memory.length; index++)
    //            if (SRAM[index].MemArea === MemArea.BSS || Memory[index].MemArea === MemArea.Heap) {
    //                SRAM[index].address += size;
    //            }
    //        _bssstart += size;
    //        _bssptr += size;
    //        _heapstart += size;
    //        _heapptr += size;
    //        break;
    //    case MemArea.BSS:
    //        for (var index = 0; index < Memory.length; index++)
    //            if (Memory[index].MemArea === MemArea.Heap) {
    //                Memory[index].address += size;
    //            }
    //        for (var index = 0; index < Memory.length; index++)
    //            if (Memory[index].MemArea === MemArea.Heap) {
    //                SRAM[index].address += size;
    //            }

    //        _heapstart += size;
    //        _heapptr += size;
    //        break;
    //    default: //noneed to move heap or stack
    //        break;
    //}
}

Memory.prototype.variableExists = function(varname, scope, scopename)
{
    //var name = varname;
    //if (scope>0)
    //    name += " (" + scope + ":" + scopename + ")";
    //for (var index = 0; index < Memory.length; index++)
    //{
    //    if (name == Memory[index].name)
    //        return true;
    //}
    //return false;
}

//adds a variable and its equiv values in SRAM
Memory.prototype.declVariable = function(name, type, memarea, scope, scopename) {
    //if (VariableExists(name,scope,scopename)) //allready exists
    //{
    //    //error
    //    return false;
    //}
    //var addr = getVarAddress(memarea); //the addr of the next var in ram
    //name = (scope == 0 ? name : name + " (" + scope + ":" + scopename + ")");
    //switch (type)
    //{
    //    case VARTYPE.avrBit:
    //    case VARTYPE.uint8_t:
    //    case VARTYPE.int8_t:
    //        moveMemUp(memarea, 1);
    //        Memory.push({ name:name, type:type, MemArea:MemArea, scope:scope, scopename:scopename, address: addr, addrhex: makeHexAddrStr(addr), valuedec:0 });
    //        SRAM.push({ name: name, type: type, MemArea: MemArea, scope: scope, scopename: scopename, address: addr, addrhex: makeHexAddrStr(addr), valuedec: 0 });
    //        addr = nextAddress(MemArea);
    //        break;
    //    case VARTYPE.uint16_t:
    //    case VARTYPE.int16_t:
    //    case VARTYPE.voidptr:
    //    case VARTYPE.ptr1byteaddr:
    //    case VARTYPE.ptr2byteaddr:
    //    case VARTYPE.ptr4byteaddr:
    //        moveMemUp(MemArea, 2);
    //        Memory.push({ name: name, type: type, MemArea: MemArea, scope: scope, scopename: scopename, address: addr, addrhex: makeHexAddrStr(addr), valuedec: 0 });
    //        if (MemArea === MemArea.Stack) {
    //            SRAM.push({ name: name + "_1", type: type, MemArea: MemArea, scope: scope, scopename: scopename, address: addr, addrhex: makeHexAddrStr(addr), valuedec: 0 });
    //            addr = nextAddress(MemArea);
    //            SRAM.push({ name: name + "_0", type: type, MemArea: MemArea, scope: scope, scopename: scopename, address: addr, addrhex: makeHexAddrStr(addr), valuedec: 0 });
    //            addr = nextAddress(MemArea);
    //        }
    //        else {
    //            SRAM.push({ name: name + "_0", type: type, MemArea: MemArea, scope: scope, scopename: scopename, address: addr, addrhex: makeHexAddrStr(addr), valuedec: 0 });
    //            addr = nextAddress(MemArea);
    //            SRAM.push({ name: name + "_1", type: type, MemArea: MemArea, scope: scope, scopename: scopename, address: addr, addrhex: makeHexAddrStr(addr), valuedec: 0 });
    //            addr = nextAddress(MemArea);
    //        }

    //        break;
    //    case VARTYPE.uint32_t:
    //    case VARTYPE.int32_t:
    //    case VARTYPE.avrFloat:
    //        moveMemUp(MemArea, 4);
    //        Memory.push({ name: name, type: type, MemArea: MemArea, scope: scope, scopename: scopename, address: addr, addrhex: makeHexAddrStr(addr), valuedec: 0 });
    //        SRAM.push({ name: name + "_0", type: type, MemArea: MemArea, scope: scope, scopename: scopename, address: addr, addrhex: makeHexAddrStr(addr), valuedec: 0 });
    //        addr = nextAddress(MemArea);
    //        SRAM.push({ name: name + "_1", type: type, MemArea: MemArea, scope: scope, scopename: scopename, address: addr, addrhex: makeHexAddrStr(addr), valuedec: 0 });
    //        addr = nextAddress(MemArea);
    //        SRAM.push({ name: name + "_2", type: type, MemArea: MemArea, scope: scope, scopename: scopename, address: addr, addrhex: makeHexAddrStr(addr), valuedec: 0 });
    //        addr = nextAddress(MemArea);
    //        SRAM.push({ name: name + "_3", type: type, MemArea: MemArea, scope: scope, scopename: scopename, address: addr, addrhex: makeHexAddrStr(addr), valuedec: 0 });
    //        addr = nextAddress(MemArea);
    //        break;
    //}
    //return true;
}
Memory.prototype.makeHexAddrStr =function(addr)
{
    var hexaddress = addr.toString(16).toUpperCase();
    if (addr < 16)
        return "0x000" + hexaddress;
    else if (addr < 256)
        return "0x00" + hexaddress;
    else if (addr < 4096)
        return "0x0" + hexaddress;
    else
        return "0x" + hexaddress;
}
Memory.prototype.getVarType = function(str)
{
    if (str === "void")
        return VARTYPE.voidptr;
    else if (str === "bit")
        return VARTYPE.none;
    else if (str === "uint8_t")
        return VARTYPE.uint8_t;
    else if (str === "uint8")
        return VARTYPE.uint8_t;
    else if (str === "uchar")
        return VARTYPE.uint8_t;
    else if (str === "byte")
        return VARTYPE.uint8_t;
    else if (str === "int8_t")
        return VARTYPE.int8_t;
    else if (str === "int8")
        return VARTYPE.int8_t;
    else if (str === "char")
        return VARTYPE.int8_t;
    else if (str === "word")
        return VARTYPE.uint16_t;
    else if (str === "uint16_t")
        return VARTYPE.uint16_t;
    else if (str === "uint16")
        return VARTYPE.uint16_t;
    else if (str === "uint")
        return VARTYPE.uint16_t;
    else if (str === "int16_t")
        return VARTYPE.int16_t;
    else if (str === "int16")
        return VARTYPE.int16_t;
    else if (str === "int")
        return VARTYPE.int16_t;
    else if (str === "integer")
        return VARTYPE.int16_t;
    else if (str === "uint32_t")
        return VARTYPE.uint32_t;
    else if (str === "uint32")
        return VARTYPE.uint32_t;
    else if (str === "ulong")
        return VARTYPE.uint32_t;
    else if (str === "dword")
        return VARTYPE.uint32_t;
    else if (str === "int32_t")
        return VARTYPE.int32_t;
    else if (str === "int32")
        return VARTYPE.int32_t;
    else if (str === "long")
        return VARTYPE.int32_t;
    else if (str === "float")
        return VARTYPE.avrFloat;
    else if (str === "single")
        return VARTYPE.avrFloat;
    else if (str === "double")
        return VARTYPE.avrFloat;
    else if (str === "ptr1byteaddr")
        return VARTYPE.ptr1byteaddr;
    else if (str === "ptr2byteaddr")
        return VARTYPE.ptr2byteaddr;
    else if (str === "ptr4byteaddr")
        return VARTYPE.ptr41byteaddr;
    else
        return VARTYPE.none;

}
Memory.prototype.ArrayExists = function(name, scope, scopename) {
    VariableExists(name + "[" + 0 + "]", scope, scopename)
}

Memory.prototype.addStackPointerToMem = function(linenumber, memearea, scopelevel, scopename)
{
    declVariable("AddressPointer", VARTYPE.uint16_t, memearea, scopelevel, scopename);
    writeValue("AddressPointer", linenumber, scopelevel, scopename);
}
Memory.prototype.getVarAddress = function(m) {
    switch (m) {
        case MemArea.Data:
            return _dataptr;
        case MemArea.BSS:
            return _bssptr;
        case MemArea.Heap:
            return _heapptr;
        case MemArea.Stack:
            return _stackptr;
        default:
            return _dataptr;
    }
}
Memory.prototype.nextAddress = function(m) {
    switch (m) {
        case MemArea.Data:
            return ++_dataptr;
        case MemArea.BSS:
            return ++_bssptr;
        case MemArea.Heap:
            return ++_heapptr;
        case MemArea.Stack:
            return --_stackptr;
        default:
            return ++_dataptr;
    }
}
Memory.prototype.removeScope = function(scope)
{
    //remove each var that has this scope from the arrays
    for(var i = Memory.length - 1; i >= 0; i--) {
        if(Memory[i].scope === scope) {
            Memory.splice(i, 1);
        }
    }
    for(var i = SRAM.length - 1; i >= 0; i--) {
        if(SRAM[i].scope === scope) {
            SRAM.splice(i, 1);
        }
    }
}
Memory.prototype.readValue = function(varname, scope, scopename)
{
    if (scope > 0) varname += " (" + scope + ":" + scopename + ")";
    for (var i=0; i<Memory.length; i++)
        if (Memory[i].name===varname)
            return Memory[i].valuedec;
    return false;
}
Memory.prototype.readValueByAddress = function(addr)
{
    for (var i=0; i<Memory.length; i++)
        if (Memory[i].address === addr)
            return Memory[i].valuedec;
    return false;
}
Memory.prototype.getVarName = function(addr)
{
    for (var i=0; i<Memory.length; i++)
        if (Memory[i].address === addr)
            return Memory[i].name;
    return false;

}
Memory.prototype.getAddress = function(varname, scope, scopename)
{
    if (scope>0)
        varname += " ("+scope+":"+scopename+")"
    for (var i=0; i<Memory.length; i++)
        if (Memory[i].name === varname)
            return Memory[i].address;
}
Memory.prototype.getVarType = function(varname, scope, scopename)
{
    if (scope>0)
        varname += " ("+scope+":"+scopename+")";
    for (var i=0; i<Memory.length; i++)
        if (Memory[i].name === varname)
            return Memory[i].type;
}
Memory.prototype.writeValue = function(varname, value, scope, scopename) //prob need to a bit of work here doing type checking/casting??
{
    if (value === undefined)
        return;
    if (scope > 0)
        varname += " ("+scope+":"+scopename+")"; //why is there a space in here??
    
    for (var i=0; i<Memory.length; i++) //the easy bit write it into memory
        if (Memory[i].name === varname)
            memory[i].value=value;
    
    for (var i=0; i<SRAM.length; i++)
        if (SRAM[i].name === varname) //when either 2 or 4 bytes, this finds the first/lower byte
        {
            switch (SRAM[i].type)
            {
                case VARTYPE.uint8_t:
                    SRAM[i].value=value;
                    break;
                case VARTYPE.int8_t:
                    SRAM[i].value=value;
                    break;
                case VarType.voidptr: //all 16 bit
                case VarType.ptr1byteaddr:
                case VarType.ptr2byteaddr:
                case VarType.ptr4byteaddr:
                case VarType.uint16_t:
                    break;
                case VarType.int16_t:
                    break;
                case VarType.uint32_t:
                    break;
                case VarType.int32_t:
                    break;
                case VarType.avrFloat:
                    break;

            }
        }
}

Memory.prototype.writeStrValue = function(varname, arr,scope, scopename)
{
    if (arr==undefined || arr.length===0)
        return false;
    var length = arr.length;
    if (scope > 0) 
        varname += " (" + scope + ":" + scopename + ")";
    for (var i=0; i<arr.length;i++)
        writeValue(varname, arr[i],scope,scopename);
    writeValue(varname + "[" + i + "]", -1, scope, scopename);
    writeValue(varname + "[" + i + "]", 0, scope, scopename);
    return true;
}
Memory.prototype.writeValueIntoPtr = function(ptrname, value, scope, scopename)
{
    if (value===undefined)
        return false;
    var variable = getVariable(ptrname, scope, scopename);
    if (variable===false) //doesnt exist
        return false;
    var address = variable.address;
    var ptrtype = variable.type;

    var varname = getVarName(address);
    if (varname===false)
        return false;
    return writeValue(varname,value, scope,scopename)
}
Memory.prototype.readvalueViaPtr = function(ptrname, type, scope,scopename)
{
    //see if the ptr exists
    var found = VariableExists(ptrname, scope, scopename);
    if (found===false)
        return false;
    //get the type of the  pointer
    var ptrtype = getVarType(ptrname, scope,scopename)
    //dereference the ptr (find the address stored in ptrname)
    var variable = getVariable(ptrname, scope,scopename)
    //get the name of the variable this address represents
    var varname = getVarName(variable.address);
    if (varname===false)
        return false;
    //get the type of the variable 
    var vartype = getVarType(varname, scope, scopename);
    //typechecking of pointer with type of var pointed to -
    var ok = false;
    switch (ptrtype)
    {
        case VarType.ptr1byteaddr:
            if (vartype == VarType.uint8_t || vartype == VarType.int8_t || vartype == VarType.ptr1byteaddr) 
                ok = true;
            break;
        case VarType.ptr2byteaddr:
            if (vartype == VarType.uint16_t || vartype == VarType.int16_t || vartype == VarType.ptr2byteaddr) 
                ok = true;
            break;
        case VarType.ptr4byteaddr:
            if (vartype == VarType.uint32_t || vartype == VarType.int32_t || vartype == VarType.avrFloat || vartype == VarType.ptr4byteaddr) 
                ok = true;
            break;
        case VarType.voidptr:
            ok = true;
            break;
    }

    found = VariableExists(varname,scope, scopename)
    if (found===false)
        return false;
    return readValue(varname, scope, scopename);
}
Memory.prototype.getVariable = function(varname, scope, scopename)
{
    if (scope>0)
        varname += " (" + scope + ":" + scopename + ")";
    for (var i = 0; i<Memory.length; i++)
        if (Memory[i].name===varname)
            return Memory[i];
    return false;
}

