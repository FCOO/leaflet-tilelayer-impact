(function (){
"use strict";
/*jslint browser: true*/
/*global $, L*/

/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * Web Map Service layers without hassle.
 */
L.TileLayer.WMS.Impact = L.TileLayer.WMS.Pydap.extend({
    //baseUrl: "http://webmap-dev01.fcoo.dk:8080/{dataset}.wms",
    baseUrl: location.protocol + "//{s}.fcoo.dk/webmap/impact/{dataset}.wms",

        onAdd: function(map) {
            var that = this;
            this._map = map;

            // Subscribe to datetime updates
            map.on('datetimechange', this.setParamsListener, this);

            if (that.options.foreground !== null) {
                that.options.foreground.addTo(map);
            }

            var gotMetadata = function () {
                if (that._gotMetadata) {
                    L.TileLayer.WMS.prototype.onAdd.call(that, map);
                    // Add legend when required info available
                    if (that.legendParams.show) {
                        that._legendControl = that._getLegendControl();
                        if (that._legendControl !== null) {
                            var legendId = that._legendId;
                            if (that.legendParams.show) {
                                that.legendParams.imageUrl = that._fcootileurl + that.getLegendUrl();
                            }
                            if (that.legendParams.show && that.legendParams.imageUrl !== null) {
                                if (that.legendParams.longName === undefined) {
                                    that.legendParams.longName = that._long_name;
                                }
                                if (that.legendParams.units === undefined) {
                                    that.legendParams.units = that._units;
                                }
                                var legendOptions = {
                                    'imageUrl': that.legendParams.imageUrl,
                                    'attribution': that.legendParams.attribution,
                                    'lastUpdated': that._last_modified,
                                    'epoch': that._epoch,
                                    'updatesPerDay': that.legendParams.updatesPerDay,
                                    'longName': that.legendParams.longName,
                                    'units': that.legendParams.units
                                };
                                that._legendId = that._legendControl.addLegend(
                                                that, that.legendParams);
                            }
                        }
                    }

                    // Subscribe to levelchange events for layers with level attribute
                    if (that.levels !== undefined) {
                        map.on('levelchange', function(evt) {
                            that.setParams({level: evt.index}, false, false);
                        });
                    }

                    // Check if time information is available and set current time
                    // to first time step if this is the case. Add layer to map
                    // after that
                    if (that.wmsParams.time == undefined) {
                        var strtime = moment(that.timesteps[0]);
                        strtime = strtime.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                        that.wmsParams.time = strtime;
                    }
                } else {
                    setTimeout(gotMetadata, 10);
                }
            }
            gotMetadata();
        },

    /*
     * Make an impact layer control instead of the default legend control.
     */
    _getLegendControl: function() {
        if (typeof this._map._fcoo_impactlegendcontrol == 'undefined' || !this._map._fcoo_impactlegendcontrol) {
            this._map._fcoo_impactlegendcontrol = new L.Control.Impact({
                position: this.legendParams.position,
                language: this.options.language
            });
            this._map.addControl(this._map._fcoo_impactlegendcontrol);
        }
        return this._map._fcoo_impactlegendcontrol;
    }
});

L.Control.Impact = L.Control.extend({
    options: {
        position: "bottomleft"
    },

    initialize: function(options) {
        L.Util.setOptions(this, options);
        this._container = L.DomUtil.create('div', 'fcoo-impact-legend-container');
        //this._container.style.display = 'none';
        this._legendCounter = 0;
        this._legendContainer = [];
        this._legendType = 'impact';
        L.DomEvent.disableClickPropagation(this._container);
    },

    onAdd: function(map) {
        this._map = map;
        return this._container;
    },

    //addLegend: function(layer, legendParameters, legendImagePath, legendAttribution) {
    addLegend: function(layer, options) {
        var param;
        var legendId = this._legendCounter++;
        var name = options.name;
        if (layer._name_en !== undefined) {
            name = layer._name_en;      
        }
        var legendLayer = new L.Control.Impact.LegendLayer(this._map, this._container, {
            name: name,
            layer: layer,
            attribution: options.attribution
        });
        for (param in options.parameters) {
            var paramOptions = $.extend({
                shortname: param,
                layer: layer
            },
            options.parameters[param]);
            legendLayer.addParameter(paramOptions);
        }
        this._legendContainer[legendId] = legendLayer;
        this._redrawLegend();
        this._container.style.display = 'block';
        return legendId;
    },

    removeLegend: function(legendId) {
        if (typeof this._legendContainer[legendId] != 'undefined') {
            delete this._legendContainer[legendId];
        }
        // reset counter if no legend is in collection
        if (this._legendContainer.length === 0) {
            this._legendCounter = 0;
            this._container.style.display = 'none';
        }
        this._map.off('legendupdate', this._redrawLegend, this);
        this._redrawLegend();

    },

    getUrlSettings: function() {
        /* Converts settings to URL params. */
        var params = [];
        for (var idx in this._legendContainer) {
            var llayer = this._legendContainer[idx];
            var name = llayer.options.name;
            for (var jdx in llayer._parameterContainer) {
                var param = llayer._parameterContainer[jdx];
                var isEnabled = param.options.enabled;
                if (isEnabled) {
                    var shortname = param.options.shortname;
                    params[params.length] = name + '.' + shortname;
                }
            }
        }
        return params;
    },

    _redrawLegend: function() {
        this._container.innerHTML = ''; // clear container
        for (var idx in this._legendContainer) {
            var legendLayer = this._legendContainer[idx];
            legendLayer._redrawLegendLayer(this._container, this.options.position);
        }
    }
});
L.Control.Impact.LegendParameter = L.Control.extend({
    options: {
        shortname: null,
        longname:  null,
        units: null,
        layer: null,
        baseexpr: 'a*x+b',
        enabled: true,
        sliderOptions: {},
    },

    initialize: function(map, options) {
        L.Util.setOptions(this, options);
        this._map = map;
    },

    _getExpression: function() {
        // Find y = a*x + b params
        var values = this.options.sliderOptions.values;
        var a = 80.0 / (Math.abs(values[1]) - Math.abs(values[0]));
        var b = 90.0 - a*Math.abs(values[1]);
        if (b < 0) {
            b = -b;
            b = '-' + b;
        } else {
            b = '+' + b;
        }
        var expr = this.options.baseexpr;
        if (this.options.enabled) {
            if (values[1] != values[0]) {
                expr = expr.replace('a', a).replace('+b', b)
                           .replace('x', this.options.shortname);
            } else {
                // Special handling of case where slider values equal
                if (values[0] >= 0) {
                    expr = '50*sign(' + this.options.shortname + '-' +
                           Math.abs(values[0]) +') + 50';
                } else {
                    expr = '50*sign(' + Math.abs(values[0]) + '-' + 
                           this.options.shortname +') + 50';
                }
            }
        } else {
            //expr = expr.replace('a*x+b', '0*' + this.options.shortname);
            expr = expr.replace('a*x+b', '');
        }
        return expr;
    },

    _redrawLegendParameter: function(container, containerName) {
        var myParam = this; // Used in closure below
        var myMap = this._map; // Used in closure below

        // Initialize slider text
        var opr1,
            opr2;
        var sname = this.options.shortname;
        var lname = this.options.longname;
        var units = this.options.units;
        var slideroptions = this.options.sliderOptions;
        var values = slideroptions.values;
        if (values[0] > 0) {
            opr1 = '<';
            opr2 = '>';
        } else {
            opr1 = '>';
            opr2 = '<';
        }

        // Add slider for selecting parameters
        var slider_container = L.DomUtil.create('div', 'fcoo-impact-legend-slider');
        var containerNameSafe = containerName.replace(/ /g, '_');
        var slider_info = $('<label class="fcoo-impact-legend-slider-info" />');
        slider_info.prop('for', 'fcoo-impact-legend-slider-enabled-' + containerNameSafe + '_' + sname);
        $(slider_container).append(slider_info);
        var slider_check = $('<input type="checkbox" id="fcoo-impact-legend-slider-enabled-' +
                             containerNameSafe + '_' + sname + 
                             '" name="fcoo-impact-legend-slider-enabled-' +
                             containerNameSafe + '_' + sname + 
                             '" class="fcoo-impact-legend-slider-enabled">');
        slider_check.attr('checked', this.options.enabled);
        $(slider_container).append(slider_check);

        slider_info.html(slider_info.html() + lname + ":&nbsp;");
        var $slider_info_green = $('<span id="fcoo-impact-legend-slider-info-green-' +
                              containerNameSafe + '_' + sname + 
                              '" class="fcoo-impact-legend-slider-info-green"></span>');
        var $slider_info_red = $('<span id="fcoo-impact-legend-slider-info-red-' +
                              containerNameSafe + '_' + sname +
                              '" class="fcoo-impact-legend-slider-info-red"></span>');
        slider_info.append($slider_info_green);
        slider_info.append($slider_info_red);
        var slider_div = $(L.DomUtil.create('div', 
            'fcoo-impact-legend-slider-div ui-slider-handle leaflet-control', slider_container));
        slider_div.attr("id", "fcoo-impact-legend-slider-div-" + 
                        containerNameSafe + "_" + sname);
   
        var slider_green = $('<div class="slider-green"></div>');
        $slider_info_green.html(opr1 + ' ' + Math.abs(values[0]) + " " + units);
        $slider_info_red.html(opr2 + ' ' + Math.abs(values[1]) + " " + units);

        var baseoptions = {
            /*jshint unused: true*/
            slide: function(e, ui) {
            /*jshint unused: false*/
                if (ui.values[0] > 0) {
                    opr1 = '<';
                    opr2 = '>';
                } else {
                    opr1 = '>';
                    opr2 = '<';
                }
                $slider_info_green.html(opr1 + ' ' + Math.abs(ui.values[0]) + " " + units);
                $slider_info_red.html(opr2 + ' ' + Math.abs(ui.values[1]) + " " + units);
                // Update green part of slider
                slider_green.css('width', 100*(ui.values[0] - 
                    slider_div.slider("option", "min"))/
                   (slider_div.slider("option", "max") - 
                    slider_div.slider("option", "min")) +'%');
            },
            change: function(e, ui) {
                myParam.options.sliderOptions.values = ui.values;
                myMap.fire('legendupdate');
            }
        };
        var my_slideroptions = $.extend(baseoptions, slideroptions);
        slider_div.slider(my_slideroptions).append(slider_green);
        slider_green.css('width', 100*(slider_div.slider("values", 0) - 
                                       slider_div.slider("option", "min")) /
                                      (slider_div.slider("option", "max") - 
                                       slider_div.slider("option", "min")) +
                                       '%');

        $(container).append(slider_container);

        // Make it possible to enable/disable parameter
        $('body').on('click', '#fcoo-impact-legend-slider-enabled-' + containerNameSafe + '_' + sname, function () {
            myParam.options.enabled = !myParam.options.enabled;
            myMap.fire('legendupdate');
        });

    }

});

L.Control.Impact.LegendLayer = L.Control.extend({
    options: {
        name: null,
        attribution: null,
        layer: null,
    },

    initialize: function(map, container, options) {
        L.Util.setOptions(this, options);
        this._map = map;
        this._container = container;
        this._parameterCounter = 0;
        this._parameterContainer = [];
        this._map.on('legendupdate', this._updateExpression, this);
    },

    getUrlSettings: function() {
        /* Converts settings to URL params. */
        var values = [];
        var name = this.options.name;
        for (var jdx in this._parameterContainer) {
            var param = this._parameterContainer[jdx];
            var isEnabled = param.options.enabled;
            var shortname = param.options.shortname;
            values[values.length] = name + '.' + shortname + '(' +
                param.options.sliderOptions.values[0] + '_' + 
                param.options.sliderOptions.values[1] + '_' +
                isEnabled + ')';
        }
        return values;
    },

    addParameter: function(param_options) {
        var parameterId = this._parameterCounter++;
        this._parameterContainer[parameterId] =
            new L.Control.Impact.LegendParameter(this._map, param_options);
    },

    _updateExpression: function() {
        var expr = '';
        for (var idx in this._parameterContainer) {
            var paramExpr = this._parameterContainer[idx]._getExpression();
            if (expr === '') {
                expr = paramExpr;
            } else if (paramExpr !== '') {
                expr = 'fmax(' + expr + ',' + paramExpr + ')';
            }
        }
        // Only update if at least one parameter is enabled
        if (expr !== '') {
            expr = 'fmin(100,fmax(0,' + expr + '))';
            this.options.layer.setParams({expr: expr}, false, false);
        }
    },

    removeParameter: function(parameterId) {
        if (typeof this._parameterContainer[parameterId] != 'undefined') {
            delete this._parameterContainer[parameterId];
        }
        // reset counter if no parameter is in collection
        if (this._legendContainer.length === 0) {
            this._legendCounter = 0;
            this._container.style.display = 'none';
        }
    },

    _redrawLegendLayer: function() {
        var isLeft = this.options.position.indexOf('left') !== -1;
        var cssFloat = isLeft ? 'left' : 'right';
        var attribution = this.options.attribution;
        var item = L.DomUtil.create('div', 'fcoo-impact-legend-item leaflet-control');
        item.style.cssFloat = cssFloat;
        var title = L.DomUtil.create('p', 'fcoo-impact-legend-item-title', item);
        var name = this.options.name;
        title.innerHTML = name;

        for (var jdx in this._parameterContainer) {
            var legendParam = this._parameterContainer[jdx];
            legendParam._redrawLegendParameter(item, name);
        }

        if (attribution !== null) {
            var attrelem = L.DomUtil.create('div', '', item);
            attrelem.innerHTML = '<br/><p>' + attribution + '</p>';
        }
        $(this._container).append(item);
  
        // Update the layer itself
        this._updateExpression();
    }
});

})();
