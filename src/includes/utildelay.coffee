module.exports = 
    load: (rt) ->
        sizet = rt.primitiveType("unsigned int")
        g = "global"

        rt.regFunc ((rt, _this, x) ->
                 val = Number.parseInt x
        ), g, "_delay_ms", [ sizet ], sizet
        rt.regFunc ((rt, _this, x) ->
                val = Number.parseInt x
        ), g, "_delay_us", [ sizet ], sizet

        
    