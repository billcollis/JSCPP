module.exports = 
    load: (rt) ->
        sizet = rt.primitiveType("unsigned int")
        g = "global"

        rt.regFunc ((rt, _this, x) ->
                 val = Number.parseInt x
        ), g, "delay_ms", [ sizet ], sizet


        
    