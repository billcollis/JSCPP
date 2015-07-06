(function() {
  var Debugger, Runtime;

  Runtime = require("./rt");

  Debugger = function() {
    this.src = "";
    this.prevNode = null;
    this.done = false;
    this.conditions = {
      isStatement: function(prevNode, newStmt) {
        return newStmt != null ? newStmt.type.indexOf("Statement" >= 0) : void 0;
      },
      positionChanged: function(prevNode, newStmt) {
        return (prevNode != null ? prevNode.eOffset : void 0) !== newStmt.eOffset || (prevNode != null ? prevNode.sOffset : void 0) !== newStmt.sOffset;
      },
      lineChanged: function(prevNode, newStmt) {
        return (prevNode != null ? prevNode.sLine : void 0) !== newStmt.sLine;
      }
    };
    this.stopConditions = {
      isStatement: false,
      positionChanged: false,
      lineChanged: true
    };
    return this;
  };

  Debugger.prototype.start = function(rt, gen) {
    this.rt = rt;
    return this.gen = gen;
  };

  Debugger.prototype["continue"] = function() {
    var active, curStmt, done, name, _ref;
    while (true) {
      done = this.next();
      if (done !== false) {
        return done;
      }
      curStmt = this.nextNode();
      _ref = this.stopConditions;
      for (name in _ref) {
        active = _ref[name];
        if (active) {
          if (this.conditions[name](this.prevNode, curStmt)) {
            return false;
          }
        }
      }
    }
  };

  Debugger.prototype.next = function() {
    var ngen;
    this.prevNode = this.nextNode();
    ngen = this.gen.next();
    if (ngen.done) {
      this.done = true;
      return ngen.value;
    } else {
      return false;
    }
  };

  Debugger.prototype.nextLine = function() {
    var s;
    s = this.nextNode();
    return this.src.slice(s.sOffset, s.eOffset).trim();
  };

  Debugger.prototype.nextNode = function() {
    if (this.done) {
      return {
        sOffset: -1,
        sLine: -1,
        sColumn: -1,
        eOffset: -1,
        eLine: -1,
        eColumn: -1
      };
    } else {
      return this.rt.interp.currentNode;
    }
  };

  Debugger.prototype.variable = function(name) {
    var ret, scopeIndex, usedName, v, val, _i, _ref, _ref1;
    if (name) {
      v = this.rt.readVar(name);
      return {
        type: this.rt.makeTypeString(v.t),
        value: v.v
      };
    } else {
      usedName = new Set();
      ret = [];
      for (scopeIndex = _i = _ref = this.rt.scope.length - 1; _i >= 0; scopeIndex = _i += -1) {
        _ref1 = this.rt.scope[scopeIndex];
        for (name in _ref1) {
          val = _ref1[name];
          if (typeof val === "object" && "t" in val && "v" in val) {
            if (!usedName.has(name)) {
              usedName.add(name);
              ret.push({
                name: name,
                type: this.rt.makeTypeString(val.t),
                value: this.rt.makeValueString(val)
              });
            }
          }
        }
      }
      return ret;
    }
  };

  Debugger.prototype.Variables = function() {
    var i, name, ref, ref1, ret, scopeIndex, scopeName, usedName, val;
    usedName = new Set;
    ret = [];
    scopeName = 'global';
    scopeIndex = i = ref = 0;
    while (i < this.rt.scope.length) {
      ref1 = this.rt.scope[scopeIndex];
      for (name in ref1) {
        val = ref1[name];
        if (this.rt.scope[scopeIndex].$name.indexOf('function') > -1) {
          scopeName = this.rt.scope[scopeIndex].$name.replace('function ', '');
        }
        if (typeof val === 'object' && 't' in val && 'v' in val) {
          if (val.t.name !== "avrreg" && val.t.name !== "avrregbit" && !(val.t.type === "pointer" && val.t.ptrType === "function") && val.t.type !== "class" && name !== "endl") {
            if (!usedName.has(name)) {
              usedName.add(name);
              ret.push({
                scopelevel: scopeIndex,
                scopename: scopeName,
                gentype: val.t.type,
                name: name,
                type: this.rt.makeTypeString(val.t),
                value: this.rt.makeValueString(val)
              });
            }
          }
        }
      }
      scopeIndex = i += 1;
    }
    return ret;
  };

  Debugger.prototype.Registers = function() {
    var i, name, ref, ref1, ret, scopeIndex, scopeName, val;
    ret = [];
    scopeName = 'global';
    scopeIndex = i = ref = 0;
    while (i < this.rt.scope.length) {
      ref1 = this.rt.scope[scopeIndex];
      for (name in ref1) {
        val = ref1[name];
        if (typeof val === 'object' && 't' in val && 'v' in val) {
          if (val.t.name === "avrreg") {
            ret.push({
              name: name,
              value: this.rt.makeValueString(val)
            });
          }
        }
      }
      scopeIndex = i += 1;
    }
    return ret;
  };

  Debugger.prototype.WriteRegister = function(name, value) {
    var v;
    v = this.rt.readVar(name);
    return v.v = value;
  };

  Debugger.prototype.Functions = function() {
    var i, name, ref, ref1, ret, scopeIndex, scopeName, val;
    ret = [];
    scopeName = 'global';
    scopeIndex = i = ref = 0;
    while (i < this.rt.scope.length) {
      ref1 = this.rt.scope[scopeIndex];
      for (name in ref1) {
        val = ref1[name];
        if (typeof val === 'object' && 't' in val && 'v' in val) {
          if (val.t.type === "pointer" && val.t.ptrType === "function") {
            ret.push({
              name: name,
              value: this.rt.makeValueString(val)
            });
          }
        }
      }
      scopeIndex = i += 1;
    }
    return ret;
  };

  module.exports = Debugger;

}).call(this);
