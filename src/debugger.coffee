Runtime = require "./rt"

Debugger = ->
    @src = ""
    @prevNode = null
    @done = false
    @conditions =
        isStatement: (prevNode, newStmt) ->
            newStmt?.type.indexOf "Statement" >= 0
        positionChanged: (prevNode, newStmt) ->
            prevNode?.eOffset isnt newStmt.eOffset or prevNode?.sOffset isnt newStmt.sOffset
        lineChanged: (prevNode, newStmt) ->
            prevNode?.sLine isnt newStmt.sLine

    @stopConditions =
        isStatement: false
        positionChanged: false
        lineChanged: true
    
    return this

Debugger::start = (rt, gen) ->
    @rt = rt
    @gen = gen

Debugger::continue = ->
    loop
        done = @next()
        return done if done isnt false
        curStmt = @nextNode()
        for name, active of @stopConditions when active
            if @conditions[name](@prevNode, curStmt)
                return false

Debugger::next = ->
    @prevNode = @nextNode()
    ngen = @gen.next()
    if ngen.done
        @done = true
        ngen.value
    else
        false

Debugger::nextLine = ->
    s = @nextNode()
    @src.slice(s.sOffset, s.eOffset).trim()

Debugger::nextNode = ->
    if @done
        sOffset: -1
        sLine: -1
        sColumn: -1
        eOffset: -1
        eLine: -1
        eColumn: -1
    else
        @rt.interp.currentNode

Debugger::variable = (name) ->
    if name
        v = @rt.readVar(name)
        type: @rt.makeTypeString(v.t)
        value: v.v
    else
        usedName = new Set()
        ret = []
        for scopeIndex in [@rt.scope.length - 1..0] by -1
            for name, val of @rt.scope[scopeIndex] when typeof val is "object" and "t" of val and "v" of val
                if not usedName.has(name)
                    usedName.add(name)
                    ret.push
                        name: name
                        type: @rt.makeTypeString(val.t)
                        value: @rt.makeValueString(val)
        ret

Debugger::Variables = ->
  usedName = new Set
  ret = []
  scopeName = 'global'
  scopeIndex = i = ref = 0
  while i < @rt.scope.length #changed to step from 0 upwards so thsat it can remember the last scopeName captured from the function
    ref1 = @rt.scope[scopeIndex]
    for name of ref1
      val = ref1[name]
      if @rt.scope[scopeIndex].$name.indexOf('function') > -1  # if name is something like "function main" or "function foo"
        scopeName = @rt.scope[scopeIndex].$name.replace('function ', '') #store the name of the function as that will be the scope used while inside the function
      if typeof val == 'object' and 't' of val and 'v' of val
        if val.t.name != "avrreg" and val.t.name != "avrregbit" and !(val.t.type =="pointer" and val.t.ptrType == "function")  and val.t.type != "class" and name != "endl"
            if !usedName.has(name)
              usedName.add name
              ret.push
                scopelevel: scopeIndex #add the level 0 to ...
                scopename: scopeName # add the scopeName
                gentype: val.t.type #add the general type e.g. primitive
                name: name
                type: @rt.makeTypeString(val.t)
                value: @rt.makeValueString(val)
    scopeIndex = i += 1
  ret


Debugger::Registers = ->
  ret = []
  scopeName = 'global'
  scopeIndex = i = ref = 0
  while i < @rt.scope.length 
    ref1 = @rt.scope[scopeIndex]
    for name of ref1
      val = ref1[name]
      if typeof val == 'object' and 't' of val and 'v' of val
        if val.t.name == "avrreg"
          ret.push
            name: name
            value: @rt.makeValueString(val)
    scopeIndex = i += 1
  ret


Debugger::WriteRegister = (name, value) ->
    v = @rt.readVar(name)
    #type: @rt.makeTypeString(v.t)
    v.v = value;





Debugger::Functions = ->
  ret = []
  scopeName = 'global'
  scopeIndex = i = ref = 0
  while i < @rt.scope.length 
    ref1 = @rt.scope[scopeIndex]
    for name of ref1
      val = ref1[name]
      if typeof val == 'object' and 't' of val and 'v' of val
        if val.t.type =="pointer" and val.t.ptrType == "function"
          ret.push
            name: name
            value: @rt.makeValueString(val)
    scopeIndex = i += 1
  ret
module.exports = Debugger