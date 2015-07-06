module.exports = ->
    @config =
        limits:
            "char":
                max: 0x7f
                min: 0x00
                bytes: 1
            "signed char":
                max: 0x7f
                min: -0x80
                bytes: 1
            "unsigned char":
                max: 0xff
                min: 0x00
                bytes: 1
            "short":
                max: 0x7fff
                min: -0x8000
                bytes: 2
            "unsigned short":
                max: 0xffff
                min: 0x0000
                bytes: 2
            "int":#BC changed int from 4bytes to 2bytes
                max: 0x7fffffff
                min: -0x80000000
                bytes: 4
            "unsigned":
                max: 0xffffffff
                min: 0x00000000
                bytes: 4
            "long":
                max: 0x7fffffff
                min: -0x80000000
                bytes: 4
            "unsigned long":
                max: 0xffffffff
                min: 0x00000000
                bytes: 4
            "long long":
                max: 0x7fffffffffffffff
                min: -0x8000000000000000
                bytes: 8
            "unsigned long long":
                max: 0xffffffffffffffff
                min: 0x0000000000000000
                bytes: 8
            "float":
                max: 3.40282346638529e+038
                min: -3.40282346638529e+038
                bytes: 4
            "double":
                max: 3.40282346638529e+038
                min: -3.40282346638529e+038
                bytes: 4
            "pointer":
                max: undefined
                min: undefined
                bytes: 4
            "bool":
                max: 1
                min: 0
                bytes: 1
        loadedLibraries: []
    @config.limits["int8_t"] = @config.limits["signed char"]# BC addition
    @config.limits["uint8_t"] = @config.limits["unsigned char"]# BC addition@config.limits["short int"] = @config.limits["short"]
    @config.limits["avrreg"] = @config.limits["unsigned char"]# BC addition
    @config.limits["avrregbit"] = @config.limits["unsigned char"]# BC addition
    @config.limits["signed short"] = @config.limits["short"]
    @config.limits["signed short int"] = @config.limits["short"]
    @config.limits["unsigned short int"] = @config.limits["unsigned short"]
    @config.limits["int16_t"] = @config.limits["short"]#BC addition
    @config.limits["uint16_t"] = @config.limits["unsigned short"]#BC addition
    @config.limits["signed int"] = @config.limits["int"]
    @config.limits["unsigned int"] = @config.limits["unsigned"]
    @config.limits["long int"] = @config.limits["long"]
    @config.limits["long int"] = @config.limits["long"]
    @config.limits["int32_t"] = @config.limits["int"]#BC addition
    @config.limits["uint32_t"] = @config.limits["unsigned"]#BC addition
    @config.limits["signed long"] = @config.limits["long"]
    @config.limits["signed long int"] = @config.limits["long"]
    @config.limits["unsigned long int"] = @config.limits["unsigned long"]
    @config.limits["long long int"] = @config.limits["long long"]
    @config.limits["long long int"] = @config.limits["long long"]
    @config.limits["signed long long"] = @config.limits["long long"]
    @config.limits["signed long long int"] = @config.limits["long long"]
    @config.limits["int64_t"] = @config.limits["long long"]#BC addition
    @config.limits["uint64_t"] = @config.limits["unsigned long long"]#BC addition
    @config.limits["unsigned long long int"] = @config.limits["unsigned long long"]
    @config.limits["single"] = @config.limits["float"]# BC addition

    @numericTypeOrder = [
        "char"
        "signed char"
        "short"
        "short int"
        "signed short"
        "signed short int"
        "int"
        "signed int"
        "long"
        "long int"
        "long int"
        "signed long"
        "signed long int"
        "long long"
        "long long int"
        "long long int"
        "signed long long"
        "signed long long int"
        "float"
        "double"
    ]
    defaultOpHandler = 
        "o(*)": "#default": (rt, l, r) ->
            if !rt.isNumericType(r.t)
                rt.raiseException rt.makeTypeString(l.t) + " does not support * on " + rt.makeTypeString(r.t)
            ret = l.v * r.v
            rett = rt.promoteNumeric(l.t, r.t)
            rt.val rett, ret
        "o(/)": "#default": (rt, l, r) ->
            if !rt.isNumericType(r.t)
                rt.raiseException rt.makeTypeString(l.t) + " does not support / on " + rt.makeTypeString(r.t)
            ret = l.v / r.v
            if rt.isIntegerType(l.t) and rt.isIntegerType(r.t)
                ret = Math.floor(ret)
            rett = rt.promoteNumeric(l.t, r.t)
            rt.val rett, ret
        "o(%)": "#default": (rt, l, r) ->
            if !rt.isNumericType(r.t) or !rt.isIntegerType(l.t) or !rt.isIntegerType(r.t)
                rt.raiseException rt.makeTypeString(l.t) + " does not support % on " + rt.makeTypeString(r.t)
            ret = l.v % r.v
            rett = rt.promoteNumeric(l.t, r.t)
            rt.val rett, ret
        "o(+)": "#default": (rt, l, r) ->
            if r == undefined
                # unary
                l
            else
                if !rt.isNumericType(r.t)
                    rt.raiseException rt.makeTypeString(l.t) + " does not support + on " + rt.makeTypeString(r.t)
                if rt.isArrayType(r.t)
                    i = rt.cast(rt.intTypeLiteral, l).v
                    rt.val r.t, rt.makeArrayPointerValue(r.v.target, r.v.position + i)
                else
                    ret = l.v + r.v
                    rett = rt.promoteNumeric(l.t, r.t)
                    rt.val rett, ret
        "o(-)": "#default": (rt, l, r) ->
            if r == undefined
                # unary
                rett = if l.v > 0 then rt.getSignedType(l.t) else l.t
                rt.val rett, -l.v
            else
                # binary
                if !rt.isNumericType(r.t)
                    rt.raiseException rt.makeTypeString(l.t) + " does not support - on " + rt.makeTypeString(r.t)
                ret = l.v - r.v
                rett = rt.promoteNumeric(l.t, r.t)
                rt.val rett, ret
        "o(<<)": "#default": (rt, l, r) ->
            if !rt.isNumericType(r.t) or !rt.isIntegerType(l.t) or !rt.isIntegerType(r.t)
                rt.raiseException rt.makeTypeString(l.t) + " does not support << on " + rt.makeTypeString(r.t)
            ret = l.v << r.v
            rett = l.t
            rt.val rett, ret
        "o(>>)": "#default": (rt, l, r) ->
            if !rt.isNumericType(r.t) or !rt.isIntegerType(l.t) or !rt.isIntegerType(r.t)
                rt.raiseException rt.makeTypeString(l.t) + " does not support >> on " + rt.makeTypeString(r.t)
            ret = l.v >> r.v
            rett = l.t
            rt.val rett, ret
        "o(<)": "#default": (rt, l, r) ->
            if !rt.isNumericType(r.t)
                rt.raiseException rt.makeTypeString(l.t) + " does not support < on " + rt.makeTypeString(r.t)
            ret = l.v < r.v
            rett = rt.boolTypeLiteral
            rt.val rett, ret
        "o(<=)": "#default": (rt, l, r) ->
            if !rt.isNumericType(r.t)
                rt.raiseException rt.makeTypeString(l.t) + " does not support <= on " + rt.makeTypeString(r.t)
            ret = l.v <= r.v
            rett = rt.boolTypeLiteral
            rt.val rett, ret
        "o(>)": "#default": (rt, l, r) ->
            if !rt.isNumericType(r.t)
                rt.raiseException rt.makeTypeString(l.t) + " does not support > on " + rt.makeTypeString(r.t)
            ret = l.v > r.v
            rett = rt.boolTypeLiteral
            rt.val rett, ret
        "o(>=)": "#default": (rt, l, r) ->
            if !rt.isNumericType(r.t)
                rt.raiseException rt.makeTypeString(l.t) + " does not support >= on " + rt.makeTypeString(r.t)
            ret = l.v >= r.v
            rett = rt.boolTypeLiteral
            rt.val rett, ret
        "o(==)": "#default": (rt, l, r) ->
            if !rt.isNumericType(r.t)
                rt.raiseException rt.makeTypeString(l.t) + " does not support == on " + rt.makeTypeString(r.t)
            ret = l.v == r.v
            rett = rt.boolTypeLiteral
            rt.val rett, ret
        "o(!=)": "#default": (rt, l, r) ->
            if !rt.isNumericType(r.t)
                rt.raiseException rt.makeTypeString(l.t) + " does not support != on " + rt.makeTypeString(r.t)
            ret = l.v != r.v
            rett = rt.boolTypeLiteral
            rt.val rett, ret
        "o(&)": "#default": (rt, l, r) ->
            if r == undefined
                if l.array
                    rt.val rt.arrayPointerType(l.t, l.array.length), rt.makeArrayPointerValue(l.array, l.arrayIndex)
                else
                    t = rt.normalPointerType(l.t)
                    rt.val t, rt.makeNormalPointerValue(l)
            else
                if !rt.isIntegerType(l.t) or !rt.isNumericType(r.t) or !rt.isIntegerType(r.t)
                    rt.raiseException rt.makeTypeString(l.t) + " does not support & on " + rt.makeTypeString(r.t)
                ret = l.v & r.v
                rett = rt.promoteNumeric(l.t, r.t)
                rt.val rett, ret
        "o(^)": "#default": (rt, l, r) ->
            if !rt.isNumericType(r.t) or !rt.isIntegerType(l.t) or !rt.isIntegerType(r.t)
                rt.raiseException rt.makeTypeString(l.t) + " does not support ^ on " + rt.makeTypeString(r.t)
            ret = l.v ^ r.v
            rett = rt.promoteNumeric(l.t, r.t)
            rt.val rett, ret
        "o(|)": "#default": (rt, l, r) ->
            if !rt.isNumericType(r.t) or !rt.isIntegerType(l.t) or !rt.isIntegerType(r.t)
                rt.raiseException rt.makeTypeString(l.t) + " does not support | on " + rt.makeTypeString(r.t)
            ret = l.v | r.v
            rett = rt.promoteNumeric(l.t, r.t)
            rt.val rett, ret
        "o(,)": "#default": (rt, l, r) ->
            r
        "o(=)": "#default": (rt, l, r) ->
            if l.left
                l.v = rt.cast(l.t, r).v
                return l
            else
                rt.raiseException rt.makeValString(l) + " is not a left value"
            return
        "o(+=)": "#default": (rt, l, r) ->
            r = defaultOpHandler["o(+)"]["#default"](rt, l, r)
            defaultOpHandler["o(=)"]["#default"] rt, l, r
        "o(-=)": "#default": (rt, l, r) ->
            r = defaultOpHandler["o(-)"]["#default"](rt, l, r)
            defaultOpHandler["o(=)"]["#default"] rt, l, r
        "o(*=)": "#default": (rt, l, r) ->
            r = defaultOpHandler["o(*)"]["#default"](rt, l, r)
            defaultOpHandler["o(=)"]["#default"] rt, l, r
        "o(/=)": "#default": (rt, l, r) ->
            r = defaultOpHandler["o(/)"]["#default"](rt, l, r)
            defaultOpHandler["o(=)"]["#default"] rt, l, r
        "o(%=)": "#default": (rt, l, r) ->
            r = defaultOpHandler["o(%)"]["#default"](rt, l, r)
            defaultOpHandler["o(=)"]["#default"] rt, l, r
        "o(<<=)": "#default": (rt, l, r) ->
            r = defaultOpHandler["o(<<)"]["#default"](rt, l, r)
            defaultOpHandler["o(=)"]["#default"] rt, l, r
        "o(>>=)": "#default": (rt, l, r) ->
            r = defaultOpHandler["o(>>)"]["#default"](rt, l, r)
            defaultOpHandler["o(=)"]["#default"] rt, l, r
        "o(&=)": "#default": (rt, l, r) ->
            r = defaultOpHandler["o(&)"]["#default"](rt, l, r)
            defaultOpHandler["o(=)"]["#default"] rt, l, r
        "o(^=)": "#default": (rt, l, r) ->
            r = defaultOpHandler["o(^)"]["#default"](rt, l, r)
            defaultOpHandler["o(=)"]["#default"] rt, l, r
        "o(|=)": "#default": (rt, l, r) ->
            r = defaultOpHandler["o(|)"]["#default"](rt, l, r)
            defaultOpHandler["o(=)"]["#default"] rt, l, r
        "o(++)": "#default": (rt, l, dummy) ->
            if !rt.isNumericType(l.t)
                rt.raiseException rt.makeTypeString(l.t) + " does not support increment"
            if !l.left
                rt.raiseException rt.makeValString(l) + " is not a left value"
            if dummy
                b = l.v
                l.v = l.v + 1
                if rt.inrange(l.t, l.v)
                    return rt.val(l.t, b)
                rt.raiseException "overflow during post-increment #{rt.makeValString(l)}"
            else
                l.v = l.v + 1
                if rt.inrange(l.t, l.v)
                    return l
                rt.raiseException "overflow during pre-increment #{rt.makeValString(l)}"
            return
        "o(--)": "#default": (rt, l, dummy) ->
            if !rt.isNumericType(l.t)
                rt.raiseException rt.makeTypeString(l.t) + " does not support decrement"
            if !l.left
                rt.raiseException rt.makeValString(l) + " is not a left value"
            if dummy
                b = l.v
                l.v = l.v - 1
                if rt.inrange(l.t, l.v)
                    return rt.val(l.t, b)
                rt.raiseException "overflow during post-decrement"
            else
                l.v = l.v - 1
                b = l.v
                if rt.inrange(l.t, l.v)
                    return l
                rt.raiseException "overflow during pre-decrement"
            return
        "o(~)": "#default": (rt, l, dummy) ->
            if !rt.isIntegerType(l.t)
                rt.raiseException rt.makeTypeString(l.t) + " does not support ~ on itself"
            ret = ~l.v
            rett = if ret < 0 then rt.getSignedType(l.t) else l.t
            rt.val rett, ret
        "o(!)": "#default": (rt, l, dummy) ->
            if !rt.isIntegerType(l.t)
                rt.raiseException rt.makeTypeString(l.t) + " does not support ! on itself"
            ret = if l.v then 0 else 1
            rett = l.t
            rt.val rett, ret
    @types = "global": {}
    @types["(char)"] = defaultOpHandler
    @types["(int8_t)"] = defaultOpHandler#BC
    @types["(signed char)"] = defaultOpHandler
    @types["(uint8_t)"] = defaultOpHandler#BC
    @types["(avrreg)"] = defaultOpHandler#BC
    @types["(avrregbit)"] = defaultOpHandler#BC
    @types["(unsigned char)"] = defaultOpHandler
    @types["(short)"] = defaultOpHandler
    @types["(short int)"] = defaultOpHandler
    @types["(signed short)"] = defaultOpHandler
    @types["(signed short int)"] = defaultOpHandler
    @types["(int16_t)"] = defaultOpHandler#BC
    @types["(unsigned short)"] = defaultOpHandler
    @types["(unsigned short int)"] = defaultOpHandler
    @types["(int)"] = defaultOpHandler
    @types["(signed int)"] = defaultOpHandler
    @types["(uint16_t)"] = defaultOpHandler      #BC
    @types["(unsigned)"] = defaultOpHandler
    @types["(unsigned int)"] = defaultOpHandler
    @types["(long)"] = defaultOpHandler
    @types["(long int)"] = defaultOpHandler
    @types["(long int)"] = defaultOpHandler
    @types["(signed long)"] = defaultOpHandler
    @types["(signed long int)"] = defaultOpHandler
    @types["(int32_t)"] = defaultOpHandler      #BC
    @types["(unsigned long)"] = defaultOpHandler
    @types["(unsigned long int)"] = defaultOpHandler
    @types["(uint32_t)"] = defaultOpHandler      #BC
    @types["(long long)"] = defaultOpHandler
    @types["(long long int)"] = defaultOpHandler
    @types["(long long int)"] = defaultOpHandler
    @types["(signed long long)"] = defaultOpHandler
    @types["(signed long long int)"] = defaultOpHandler
    @types["(int64_t)"] = defaultOpHandler      #BC
    @types["(unsigned long long)"] = defaultOpHandler
    @types["(unsigned long long int)"] = defaultOpHandler
    @types["(uint64_t)"] = defaultOpHandler      #BC
    @types["(float)"] = defaultOpHandler
    @types["(double)"] = defaultOpHandler
    @types["(single)"] = defaultOpHandler
    @types["(bool)"] = defaultOpHandler
    @types["pointer"] =
        "o(==)": "#default": (rt, l, r) ->
            if rt.isTypeEqualTo(l.t, r.t)
                if l.t.ptrType == "array"
                    return l.v.target == r.v.target and (l.v.target == null or l.v.position == r.v.position)
                else
                    return l.v.target == r.v.target
            false
        "o(!=)": "#default": (rt, l, r) ->
            !rt.types["pointer"]["=="]["#default"](rt, l, r)
        "o(,)": "#default": (rt, l, r) ->
            r
        "o(=)": "#default": (rt, l, r) ->
            if !l.left
                rt.raiseException rt.makeValString(l) + " is not a left value"
            t = rt.cast(l.t, r)
            l.t = t.t
            l.v = t.v
            l
        "o(&)": "#default": (rt, l, r) ->
            if r == undefined
                if l.array
                    return rt.val(rt.arrayPointerType(l.t, l.array.length), rt.makeArrayPointerValue(l.array, l.arrayIndex))
                else
                    t = rt.normalPointerType(l.t)
                    return rt.val(t, rt.makeNormalPointerValue(l))
            else
                rt.raiseException "you cannot cast bitwise and on pointer"
            return
    @types["pointer_function"] =
        "o(())": "#default": (rt, l, bindThis, args) ->
            if l.t.type != "pointer" or l.t.ptrType != "function"
                rt.raiseException rt.makeTypeString(l.t.type) + " is not function"
            rt.getCompatibleFunc(l.v.defineType, l.v.name, args) rt, bindThis, args...
    @types["pointer_normal"] =
        "o(*)": "#default": (rt, l, r) ->
            if r == undefined
                return l.v.target
            else
                rt.raiseException "you cannot multiply a pointer"
            return
        "o(->)": "#default": (rt, l, r) ->
            rt.getMember l.v.target, r
    @types["pointer_array"] =
        "o(*)": "#default": (rt, l, r) ->
            if r == undefined
                arr = l.v.target
                if l.v.position >= arr.length
                    rt.raiseException "index out of bound " + l.v.position + " >= " + arr.length
                else if l.v.position < 0
                    rt.raiseException "negative index " + l.v.position
                ret = arr[l.v.position]
                ret.array = arr
                ret.arrayIndex = l.v.position
                return ret
            else
                rt.raiseException "you cannot multiply a pointer"
            return
        "o([])": "#default": (rt, l, r) ->
            r = rt.types["pointer_array"]["o(+)"]["#default"](rt, l, r)
            rt.types["pointer_array"]["o(*)"]["#default"] rt, r
        "o(->)": "#default": (rt, l, r) ->
            l = rt.types["pointer_array"]["o(*)"]["#default"](rt, l)
            rt.getMember l, r
        "o(-)": "#default": (rt, l, r) ->
            if rt.isNumericType(r.t)
                i = rt.cast(rt.intTypeLiteral, r).v
                return rt.val(l.t, rt.makeArrayPointerValue(l.v.target, l.v.position - i))
            else if rt.isArrayType(r.t)
                if l.v.target == r.v.target
                    return l.v.position - r.v.position
                else
                    rt.raiseException "you cannot perform minus on pointers pointing to different arrays"
            else
                rt.raiseException rt.makeTypeString(r.t) + " is not an array pointer type"
            return
        "o(<)": "#default": (rt, l, r) ->
            if rt.isArrayType(r.t)
                if l.v.target == r.v.target
                    return l.v.position < r.v.position
                else
                    rt.raiseException "you cannot perform compare on pointers pointing to different arrays"
            else
                rt.raiseException rt.makeTypeString(r.t) + " is not an array pointer type"
            return
        "o(>)": "#default": (rt, l, r) ->
            if rt.isArrayType(r.t)
                if l.v.target == r.v.target
                    return l.v.position > r.v.position
                else
                    rt.raiseException "you cannot perform compare on pointers pointing to different arrays"
            else
                rt.raiseException rt.makeTypeString(r.t) + " is not an array pointer type"
            return
        "o(<=)": "#default": (rt, l, r) ->
            if rt.isArrayType(r.t)
                if l.v.target == r.v.target
                    return l.v.position <= r.v.position
                else
                    rt.raiseException "you cannot perform compare on pointers pointing to different arrays"
            else
                rt.raiseException rt.makeTypeString(r.t) + " is not an array pointer type"
            return
        "o(>=)": "#default": (rt, l, r) ->
            if rt.isArrayType(r.t)
                if l.v.target == r.v.target
                    return l.v.position >= r.v.position
                else
                    rt.raiseException "you cannot perform compare on pointers pointing to different arrays"
            else
                rt.raiseException rt.makeTypeString(r.t) + " is not an array pointer type"
            return
        "o(+)": "#default": (rt, l, r) ->
            if rt.isNumericType(r.t)
                i = rt.cast(rt.intTypeLiteral, r).v
                return rt.val(l.t, rt.makeArrayPointerValue(l.v.target, l.v.position + i))
            else
                rt.raiseException "cannot add non-numeric to a pointer"
            return
        "o(+=)": "#default": (rt, l, r) ->
            r = rt.types["pointer_array"]["o(+)"]["#default"](rt, l, r)
            rt.types["pointer"]["="]["#default"] rt, l, r
        "o(-=)": "#default": (rt, l, r) ->
            r = rt.types["pointer_array"]["o(-)"]["#default"](rt, l, r)
            rt.types["pointer"]["="]["#default"] rt, l, r
        "o(++)": "#default": (rt, l, dummy) ->
            if !l.left
                rt.raiseException rt.makeValString(l) + " is not a left value"
            if dummy
                rt.val l.t, rt.makeArrayPointerValue(l.v.target, l.v.position++)
            else
                l.v.position++
                l
        "o(--)": "#default": (rt, l, dummy) ->
            if !l.left
                rt.raiseException rt.makeValString(l) + " is not a left value"
            if dummy
                rt.val l.t, rt.makeArrayPointerValue(l.v.target, l.v.position--)
            else
                l.v.position--
                l

    return this