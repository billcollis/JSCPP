module.exports = 
    load: (rt) ->
        sizet = rt.primitiveType("uint8_t")
        g = "global"

        rt.regFunc ((rt, _this, x) ->
                 val = 1 << x
        ), g, "_BV", [ sizet ], sizet


        
    