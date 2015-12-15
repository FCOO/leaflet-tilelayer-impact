(function () {
    "use strict";
    /*jslint browser: true*/
    /*global $, L, console*/

    /*
     * Store containing various layers hosted by FCOO
     */
    L.Control.FcooLayerStore = L.Control.extend({

        options: {
            language: 'en',
        },

        initialize: function (options) {
            this._subdomains = ["tiles01", "tiles02", "tiles03", "tiles04"];
            this._fcoo_base = location.protocol + "//{s}.fcoo.dk/tiles/";
            this._tileSize = 512;
            L.Util.setOptions(this, options);

            // List of layers
            this.layers = this.listLayers();
        },

        getForeground: function () {
            // Foreground layer (colored land and transparent sea)
            if (this._foreground == undefined) {
                this._foreground = new L.TileLayer.Counting(this._fcoo_base + "tiles_frgrnd_" + this._tileSize + "_mercator_201508030000/{z}/{x}/{y}.png", {
                    maxZoom: 12,
                    tileSize: this._tileSize,
                    subdomains: this._subdomains,
                    zIndex: 800,
                    attribution: '<a href="' + location.protocol + '//fcoo.dk">Danish Defence Centre for Operational Oceanography</a>',
                    continuousWorld: false,
                    updateInterval: 50,
                    errorTileUrl: this._fcoo_base + "empty_" + this._tileSize + ".png"
                });
            }
            return this._foreground;
        },

        getBackground: function () {
            // Background layer (colored land and sea)
            var background = L.tileLayer(this._fcoo_base + "tiles_bckgrnd_" + this._tileSize + "_mercator_201508030000/{z}/{x}/{y}.png", {
                maxZoom: 12,
                tileSize: this._tileSize,
                subdomains: this._subdomains,
                attribution: '<a href="' + location.protocol + '//fcoo.dk">Danish Defence Centre for Operational Oceanography</a>',
                continuousWorld: false,
                updateInterval: 50
            });
            return background;
        },

        getTopLayer: function () {
            // Top layer (coastline + place names)
            var topLayer = L.tileLayer(this._fcoo_base + "tiles_top_" + this._tileSize + "_mercator_201508310000/{z}/{x}/{y}.png", {
                maxZoom: 12,
                tileSize: this._tileSize,
                subdomains: this._subdomains,
                zIndex: 1000,
                continuousWorld: false,
                updateInterval: 50,
                errorTileUrl: this._fcoo_base + "empty_" + this._tileSize + ".png"
            });
            return topLayer;
        },

        getEEZ: function () {
            // Exclusive Economic Zone layer
            var EEZ = new L.tileLayer(this._fcoo_base + "tiles_EEZ_" + this._tileSize + "_mercator_201504270000" + "/{z}/{x}/{y}.png", {
                maxZoom: 12,
                tileSize: this._tileSize,
                subdomains: this._subdomains,
                zIndex: 875,
                attribution: '<a href="' + location.protocol + '//fcoo.dk">Danish Defence Centre for Operational Oceanography</a>',
                continuousWorld: false,
                updateInterval: 50,
                errorTileUrl: this._fcoo_base + "empty_" + this._tileSize + ".png"
            });
            return EEZ;
        },

        getSAR: function () {
            // Search and Rescue layer (Greenland only)
            var SAR = new L.tileLayer(this._fcoo_base + "tiles_SAR_" + this._tileSize + "_mercator_201504270000" + "/{z}/{x}/{y}.png", {
                maxZoom: 12,
                tileSize: this._tileSize,
                subdomains: this._subdomains,
                zIndex: 875,
                attribution: '<a href="' + location.protocol + '//fcoo.dk">Danish Defence Centre for Operational Oceanography</a>',
                continuousWorld: false,
                updateInterval: 50,
                errorTileUrl: this._fcoo_base + "empty_" + this._tileSize + ".png"
            });
            return SAR;
        },

        getSolarTerminator: function () {
            // Solar Terminator layer
            return new L.Terminator();
        },

        getFiringAreas: function () {
            // Firing areas (Denmark only)
            var firingAreas = new L.tileLayer(this._fcoo_base + "tiles_skyde_" + this._tileSize + "_mercator_201508030000" + "/{z}/{x}/{y}.png", {
                minZoom: 7,
                maxZoom: 12,
                tileSize: this._tileSize,
                subdomains: this._subdomains,
                zIndex: 875,
                attribution: '<a href="' + location.protocol + '//fcoo.dk">Danish Defence Centre for Operational Oceanography</a>',
                continuousWorld: false,
                updateInterval: 50,
                errorTileUrl: this._fcoo_base + "empty_" + this._tileSize + ".png"
            });
            return firingAreas;
        },

        listLayers: function () {
            var datasets = [],
                blacklist = ["dataset", "wmsParams", "legendParams", "options"],
                i,
                j,
                k,
                m,
                provider,
                model,
                setup;
            for (i in this.model) {
                if (this.model.hasOwnProperty(i) && $.inArray(i, blacklist) === -1) {
                    provider = this.model[i];
                    for (j in provider) {
                        if (provider.hasOwnProperty(j) && $.inArray(j, blacklist) === -1) {
                            model = provider[j];
                            for (k in model) {
                                if (model.hasOwnProperty(k) && $.inArray(k, blacklist) === -1) {
                                    setup = model[k];
                                    for (m in setup) {
                                        if (setup.hasOwnProperty(m) && $.inArray(m, blacklist) === -1) {
                                            datasets[datasets.length] = [i, j, k, m].join('/');
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return datasets;
        },

        filterParams: function (obj) {
            var result = {},
                key,
                paramElems = ["dataset", "wmsParams", "legendParams", "options"];
            for (key in obj) {
                if (obj.hasOwnProperty(key) && $.inArray(key, paramElems) !== -1) {
                    result[key] = obj[key];
                }
            }
            return result;
        },

        filterLayers: function (obj) {
            var result = {},
                key,
                paramElems = ["dataset", "wmsParams", "legendParams", "options"];
            for (key in obj) {
                if (obj.hasOwnProperty(key) && $.inArray(key, paramElems) === -1) {
                    result[key] = obj[key];
                }
            }
            return result;
        },

        getLayerOptions: function (options) {
            var datastr = options.dataset + '/' + options.parameter,
                dataset = options.dataset.split('/'),
                provider = dataset[0],
                model = dataset[1],
                setup = dataset[2],
                parameter = options.parameter,
                wmsParams = {},
                legendParams = {},
                loptions = {},
                node = this.model,
                nodeParams = this.filterParams(node),
                path = [provider, model, setup, parameter],
                msg,
                i,
                edge,
                output;
            //dataset = null;
            if ($.inArray(datastr, this.layers) === -1) {
                msg = 'Cannot find layer corresponding to ' + datastr;
                console.error(msg);
                console.error('Available layers: ' + this.listLayers());
                throw new Error(msg);
            }
            // Get all settings by traversing model
            for (i in path) {
                if (path.hasOwnProperty(i)) {
                    edge = path[i];
                    node = node[edge];
                    nodeParams = this.filterParams(node);
                    if (nodeParams.hasOwnProperty('dataset')) {
                        dataset = nodeParams.dataset;
                    }
                    if (nodeParams.hasOwnProperty('wmsParams')) {
                        $.extend(wmsParams, nodeParams.wmsParams);
                    }
                    if (nodeParams.hasOwnProperty('legendParams')) {
                        $.extend(legendParams, nodeParams.legendParams);
                    }
                    if (nodeParams.hasOwnProperty('options')) {
                        $.extend(loptions, nodeParams.options);
                    }
                }
            }
            if (dataset === null) {
                console.error('Dataset attribute not defined');
            }
            // Exchange foreground attribute with real foreground layer
            if (loptions.hasOwnProperty('foreground')) {
                loptions.foreground = this.getForeground();
            }
            // Override with supplied options
            if (options.hasOwnProperty('wmsParams')) {
                $.extend(wmsParams, options.wmsParams);
            }
            if (options.hasOwnProperty('legendParams')) {
                $.extend(legendParams, options.legendParams);
            }
            if (options.hasOwnProperty('options')) {
                $.extend(loptions, options.options);
            }
            // If no colormap is specified we unset legendParams
            if (wmsParams.cmap === undefined) {
                legendParams = undefined;
            }
            loptions.language = this.options.language;
            output = {
                'dataset': dataset,
                'wmsParams': wmsParams,
                'legendParams': legendParams,
                'options': loptions
            };
            return output;
        },

        getLayer: function (options) {
            var o = this.getLayerOptions(options),
                layer = new L.TileLayer.WMS.Pydap(o.dataset, o.wmsParams, o.legendParams,
                        o.options);
            return layer;
        },

        model: {
            DMI: {
                HIRLAM: {
                    legendParams: {
                        updatesPerDay: 4
                    },
                    K05: {
                        dataset: 'DMI/HIRLAM/MAPS_DMI_K05_v005C.nc',
                        legendParams: {
                            attribution: '<a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / HIRLAM / K05'
                        },
                        options: {
                            zIndex: 850
                        },
                        visibility: {
                            wmsParams: {
                                layers: 'VIS',
                                cmap: 'AirVisibility_km_RYG_11colors'
                            },
                            options: {
                                attribution: 'Visibility forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        },
                        windSpeed: {
                            wmsParams: {
                                layers: 'windspeed',
                                cmap: 'Wind_ms_BGYRP_11colors'
                            },
                            options: {
                                attribution: 'Wind forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        },
                        windDirection: {
                            wmsParams: {
                                layers: 'UGRD:VGRD',
                                styles: 'vector_method=black_arrowbarbs,vector_spacing=80,vector_offset=20',
                                cmap: 'Wind_ms_BGYRP_11colors'
                            },
                            legendParams: {
                                longName: 'Wind speed',
                                show: false
                            },
                            options: {
                                zIndex: 900,
                                primadonna: false,
                                attribution: 'Wind forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        },
                        humidity: {
                            wmsParams: {
                                layers: 'SPFH',
                                cmap: 'Humidity_kg_kg_WYR_7colors'
                            },
                            options: {
                                attribution: 'Humidity forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        },
                        airTemperature: {
                            wmsParams: {
                                layers: 'TMP',
                                cmap: 'AirTempCold_C_BGYR_13colors'
                            },
                            options: {
                                attribution: 'Temperature forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        },
                        seaLevelPressure: {
                            wmsParams: {
                                layers: 'PRES',
                                cmap: 'SeaLevelPressure_hPa_BGYR_13colors',
                                styles: 'fill_method=contour'
                            },
                            legendParams: {
                                show: false
                            },
                            options: {
                                zIndex: 875,
                                primadonna: false,
                                attribution: 'Sea level pressure forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        },
                        totalCloudCover: {
                            wmsParams: {
                                layers: 'TCDC',
                                cmap: 'CloudCover_km_WGB_10colors'
                            },
                            options: {
                                primadonna: false,
                                attribution: 'Cloud cover forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        },
                        totalPrecipitation: {
                            wmsParams: {
                                layers: 'precip',
                                cmap: 'Precip_mm_per_h_GBP_9colors',
                            },
                            options: {
                                attribution: 'Precipitation forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>',
                            }
                        }
                    },
                    S03: {
                        dataset: 'DMI/HIRLAM/MAPS_DMI_S03_v005C.nc',
                        legendParams: {
                            attribution: '<a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / HIRLAM / S03'
                        },
                        options: {
                            zIndex: 850
                        },
                        visibility: {
                            wmsParams: {
                                layers: 'VIS',
                                cmap: 'AirVisibility_km_RYG_11colors'
                            },
                            options: {
                                attribution: 'Visibility forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        },
                        windSpeed: {
                            wmsParams: {
                                layers: 'windspeed',
                                cmap: 'Wind_ms_BGYRP_11colors'
                            },
                            options: {
                                attribution: 'Wind forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        },
                        windDirection: {
                            wmsParams: {
                                layers: 'UGRD:VGRD',
                                styles: 'vector_method=black_arrowbarbs,vector_spacing=80,vector_offset=20',
                                cmap: 'Wind_ms_BGYRP_11colors'
                            },
                            legendParams: {
                                longName: 'Wind speed',
                                show: false
                            },
                            options: {
                                zIndex: 1050,
                                primadonna: false,
                                attribution: 'Wind forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        },
                        humidity: {
                            wmsParams: {
                                layers: 'SPFH',
                                cmap: 'Humidity_kg_kg_WYR_7colors'
                            },
                            options: {
                                attribution: 'Humidity forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        },
                        airTemperature: {
                            wmsParams: {
                                layers: 'TMP',
                                cmap: 'AirTemp_C_BGYR_13colors'
                            },
                            options: {
                                attribution: 'Temperature forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        },
                        seaLevelPressure: {
                            wmsParams: {
                                layers: 'PRES',
                                cmap: 'SeaLevelPressure_hPa_BGYR_13colors',
                                styles: 'fill_method=contour'
                            },
                            legendParams: {
                                show: false
                            },
                            options: {
                                zIndex: 875,
                                primadonna: false,
                                attribution: 'Sea level pressure forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        },
                        totalCloudCover: {
                            wmsParams: {
                                layers: 'TCDC',
                                cmap: 'CloudCover_km_WGB_10colors'
                            },
                            options: {
                                primadonna: false,
                                attribution: 'Cloud cover forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        },
                        totalPrecipitation: {
                            wmsParams: {
                                layers: 'precip',
                                cmap: 'Precip_mm_per_h_GBP_9colors',
                            },
                            options: {
                                attribution: 'Precipitation forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>',
                            }
                        }
                    },
                    T15: {
                        dataset: 'DMI/HIRLAM/GETM_DMI_HIRLAM_T15_v004C.nc',
                        legendParams: {
                            attribution: '<a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / HIRLAM / T15'
                        },
                        options: {
                            zIndex: 850
                        },
                        windSpeed: {
                            wmsParams: {
                                layers: 'u10_v10',
                                cmap: 'Wind_ms_BGYRP_11colors'
                            },
                            options: {
                                attribution: 'Wind forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        },
                        windDirection: {
                            wmsParams: {
                                layers: 'u10:v10',
                                styles: 'vector_method=black_arrowbarbs,vector_spacing=80,vector_offset=20',
                                cmap: 'Wind_ms_BGYRP_11colors'
                            },
                            legendParams: {
                                longName: 'Wind speed',
                                show: false
                            },
                            options: {
                                zIndex: 900,
                                primadonna: false,
                                attribution: 'Wind forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        },
                        humidity: {
                            wmsParams: {
                                layers: 'sh',
                                cmap: 'Humidity_kg_kg_WYR_7colors'
                            },
                            options: {
                                attribution: 'Humidity forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        },
                        airTemperature: {
                            wmsParams: {
                                layers: 't2',
                                cmap: 'AirTemp_C_BGYR_13colors'
                            },
                            options: {
                                attribution: 'Temperature forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        },
                        seaLevelPressure: {
                            wmsParams: {
                                layers: 'slp',
                                cmap: 'SeaLevelPressure_hPa_BGYR_13colors',
                                styles: 'fill_method=contour'
                            },
                            legendParams: {
                                show: false
                            },
                            options: {
                                zIndex: 875,
                                primadonna: false,
                                attribution: 'Sea level pressure forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        },
                        totalCloudCover: {
                            wmsParams: {
                                layers: 'tcc',
                                cmap: 'CloudCover_km_WGB_10colors'
                            },
                            options: {
                                primadonna: false,
                                attribution: 'Cloud cover forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'
                            }
                        }
                    }
                },
                ICECHART: {
                    GREENLAND: {
                        dataset: 'DMI/ICECHART/DMI_ICECHART.nc',
                        legendParams: {
                            attribution: '<a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / ICE CHART'
                        },
                        options: {
                            zIndex: 100
                        },
                        iceConcentration: {
                            wmsParams: {
                                layers: 'ice_concentration',
                                cmap: 'IceConcentration_BW_10colors',
                                time: 'current'
                            },
                            options: {
                                attribution: 'Sea ice concentration from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>',
                            }
                        }
                    }
                }
            },
            ECMWF: {
                DXD: {
                    legendParams: {
                        updatesPerDay: 2
                    },
                    AFR: {
                        dataset: 'ECMWF/DXD/MAPS_ECMWF_DXD_AFR.nc',
                        legendParams: {
                            attribution: '<a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a> / IFS'
                        },
                        options: {
                            zIndex: 850
                        },
                        windSpeed: {
                            wmsParams: {
                                layers: 'windspeed',
                                cmap: 'Wind_ms_BGYRP_11colors'
                            },
                            options: {
                                attribution: 'Wind forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        windDirection: {
                            wmsParams: {
                                layers: 'U10:V10',
                                styles: 'vector_method=black_arrowbarbs,vector_spacing=80,vector_offset=20',
                                cmap: 'Wind_ms_BGYRP_11colors'
                            },
                            legendParams: {
                                longName: 'Wind speed',
                                show: false
                            },
                            options: {
                                zIndex: 1050,
                                primadonna: false,
                                attribution: 'Wind forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        airTemperature: {
                            wmsParams: {
                                layers: 'TMP2',
                                cmap: 'AirTempWarm_C_BGYR_13colors'
                            },
                            options: {
                                attribution: 'Temperature forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        seaLevelPressure: {
                            wmsParams: {
                                layers: 'PRES',
                                cmap: 'SeaLevelPressure_hPa_BGYR_13colors',
                                styles: 'fill_method=contour'
                            },
                            legendParams: {
                                show: false
                            },
                            options: {
                                zIndex: 875,
                                primadonna: false,
                                attribution: 'Sea level pressure forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        totalCloudCover: {
                            wmsParams: {
                                layers: 'TCC',
                                cmap: 'CloudCover_km_WGB_10colors'
                            },
                            options: {
                                primadonna: false,
                                attribution: 'Cloud cover forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        totalPrecipitation: {
                            wmsParams: {
                                layers: 'precip',
                                cmap: 'Precip_mm_per_h_GBP_9colors',
                            },
                            options: {
                                attribution: 'Precipitation forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        }
                    },
                    MEDITERRANEAN: {
                        dataset: 'ECMWF/DXD/MAPS_ECMWF_DXD_MEDITERRANEAN.nc',
                        legendParams: {
                            attribution: '<a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a> / IFS'
                        },
                        options: {
                            zIndex: 850
                        },
                        windSpeed: {
                            wmsParams: {
                                layers: 'windspeed',
                                cmap: 'Wind_ms_BGYRP_11colors'
                            },
                            options: {
                                attribution: 'Wind forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        windDirection: {
                            wmsParams: {
                                layers: 'U10:V10',
                                styles: 'vector_method=black_arrowbarbs,vector_spacing=80,vector_offset=20',
                                cmap: 'Wind_ms_BGYRP_11colors'
                            },
                            legendParams: {
                                longName: 'Wind speed',
                                show: false
                            },
                            options: {
                                zIndex: 1050,
                                primadonna: false,
                                attribution: 'Wind forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        airTemperature: {
                            wmsParams: {
                                layers: 'TMP2',
                                cmap: 'AirTempWarm_C_BGYR_13colors'
                            },
                            options: {
                                attribution: 'Temperature forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        seaLevelPressure: {
                            wmsParams: {
                                layers: 'PRES',
                                cmap: 'SeaLevelPressure_hPa_BGYR_13colors',
                                styles: 'fill_method=contour'
                            },
                            legendParams: {
                                show: false
                            },
                            options: {
                                zIndex: 875,
                                primadonna: false,
                                attribution: 'Sea level pressure forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        totalCloudCover: {
                            wmsParams: {
                                layers: 'TCC',
                                cmap: 'CloudCover_km_WGB_10colors'
                            },
                            options: {
                                primadonna: false,
                                attribution: 'Cloud cover forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        totalPrecipitation: {
                            wmsParams: {
                                layers: 'precip',
                                cmap: 'Precip_mm_per_h_GBP_9colors',
                            },
                            options: {
                                attribution: 'Precipitation forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        }
                    },
                    DENMARK: {
                        dataset: 'ECMWF/DXD/MAPS_ECMWF_DXD_DENMARK.nc',
                        legendParams: {
                            attribution: '<a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a> / IFS'
                        },
                        options: {
                            zIndex: 850
                        },
                        windSpeed: {
                            wmsParams: {
                                layers: 'windspeed',
                                cmap: 'Wind_ms_BGYRP_11colors'
                            },
                            options: {
                                attribution: 'Wind forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        windDirection: {
                            wmsParams: {
                                layers: 'U10:V10',
                                styles: 'vector_method=black_arrowbarbs,vector_spacing=80,vector_offset=20',
                                cmap: 'Wind_ms_BGYRP_11colors'
                            },
                            legendParams: {
                                longName: 'Wind speed',
                                show: false
                            },
                            options: {
                                zIndex: 1050,
                                primadonna: false,
                                attribution: 'Wind forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        airTemperature: {
                            wmsParams: {
                                layers: 'TMP2',
                                cmap: 'AirTemp_C_BGYR_13colors'
                            },
                            options: {
                                attribution: 'Temperature forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        seaLevelPressure: {
                            wmsParams: {
                                layers: 'PRES',
                                cmap: 'SeaLevelPressure_hPa_BGYR_13colors',
                                styles: 'fill_method=contour'
                            },
                            legendParams: {
                                show: false
                            },
                            options: {
                                zIndex: 875,
                                primadonna: false,
                                attribution: 'Sea level pressure forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        totalCloudCover: {
                            wmsParams: {
                                layers: 'TCC',
                                cmap: 'CloudCover_km_WGB_10colors'
                            },
                            options: {
                                primadonna: false,
                                attribution: 'Cloud cover forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        totalPrecipitation: {
                            wmsParams: {
                                layers: 'precip',
                                cmap: 'Precip_mm_per_h_GBP_9colors',
                            },
                            options: {
                                attribution: 'Precipitation forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        }
                    },
                    GREENLAND: {
                        dataset: 'ECMWF/DXD/MAPS_ECMWF_DXD_GREENLAND.nc',
                        legendParams: {
                            attribution: '<a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a> / IFS'
                        },
                        options: {
                            zIndex: 850
                        },
                        windSpeed: {
                            wmsParams: {
                                layers: 'windspeed',
                                cmap: 'Wind_ms_BGYRP_11colors'
                            },
                            options: {
                                attribution: 'Wind forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        windDirection: {
                            wmsParams: {
                                layers: 'U10:V10',
                                styles: 'vector_method=black_arrowbarbs,vector_spacing=80,vector_offset=20',
                                cmap: 'Wind_ms_BGYRP_11colors'
                            },
                            legendParams: {
                                longName: 'Wind speed',
                                show: false
                            },
                            options: {
                                zIndex: 1050,
                                primadonna: false,
                                attribution: 'Wind forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        airTemperature: {
                            wmsParams: {
                                layers: 'TMP2',
                                cmap: 'AirTempCold_C_BGYR_13colors'
                            },
                            options: {
                                attribution: 'Temperature forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        seaLevelPressure: {
                            wmsParams: {
                                layers: 'PRES',
                                cmap: 'SeaLevelPressure_hPa_BGYR_13colors',
                                styles: 'fill_method=contour'
                            },
                            legendParams: {
                                show: false
                            },
                            options: {
                                zIndex: 875,
                                primadonna: false,
                                attribution: 'Sea level pressure forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        totalCloudCover: {
                            wmsParams: {
                                layers: 'TCC',
                                cmap: 'CloudCover_km_WGB_10colors'
                            },
                            options: {
                                primadonna: false,
                                attribution: 'Cloud cover forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        totalPrecipitation: {
                            wmsParams: {
                                layers: 'precip',
                                cmap: 'Precip_mm_per_h_GBP_9colors',
                            },
                            options: {
                                attribution: 'Precipitation forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        },
                        iceConcentation: {
                            wmsParams: {
                                layers: 'CI',
                                cmap: 'IceConcentration_BW_10colors'
                            },
                            options: {
                                attribution: 'Sea ice concentration from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                            }
                        }
                    }
                },
                DXP: {
                    legendParams: {
                        updatesPerDay: 2
                    },
                    AFR: {
                        dataset: 'ECMWF/DXP/MAPS_ECMWF_DXP_AFR.nc',
                        legendParams: {
                            attribution: '<a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a> / WAM'
                        },
                        options: {
                            zIndex: 100,
                            foreground: true,
                            attribution: 'Wave forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                        },
                        waveHeight: {
                            wmsParams: {
                                layers: 'SWH',
                                cmap: 'Hs_m_GBP_11colors'
                            }
                        },
                        seaState: {
                            wmsParams: {
                                layers: 'SWH',
                                cmap: 'Hs_m_JET_10colors'
                            },
                            legendParams: {
                                longName: 'WMO Sea State Code',
                                units: '',
                                styles: 'horizontal,nolabel,centerlabels',
                                cmap: 'Hs_ss_JET_10colors'
                            },
                        },
                        waveDirection: {
                            wmsParams: {
                                layers: 'uwave:vwave',
                                styles: 'vector_method=black_vector,vector_spacing=60,vector_offset=10',
                            },
                            legendParams: {
                                show: false
                            },
                            options: {
                                zIndex: 900,
                                primadonna: false
                            }
                        },
                        wavePeriod: {
                            wmsParams: {
                                layers: 'MWP',
                                cmap: 'MeanPeriod_s_RGB_10colors',
                            }
                        }
                    },
                    MEDITERRANEAN: {
                        dataset: 'ECMWF/DXP/MAPS_ECMWF_DXP_MEDITERRANEAN.nc',
                        legendParams: {
                            attribution: '<a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a> / WAM'
                        },
                        options: {
                            zIndex: 100,
                            foreground: true,
                            attribution: 'Wave forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                        },
                        waveHeight: {
                            wmsParams: {
                                layers: 'SWH',
                                cmap: 'Hs_m_GBP_11colors'
                            }
                        },
                        seaState: {
                            wmsParams: {
                                layers: 'SWH',
                                cmap: 'Hs_m_JET_10colors'
                            },
                            legendParams: {
                                longName: 'WMO Sea State Code',
                                units: '',
                                styles: 'horizontal,nolabel,centerlabels',
                                cmap: 'Hs_ss_JET_10colors'
                            },
                        },
                        waveDirection: {
                            wmsParams: {
                                layers: 'uwave:vwave',
                                styles: 'vector_method=black_vector,vector_spacing=60,vector_offset=10',
                            },
                            legendParams: {
                                show: false
                            },
                            options: {
                                zIndex: 900,
                                primadonna: false
                            }
                        },
                        wavePeriod: {
                            wmsParams: {
                                layers: 'MWP',
                                cmap: 'MeanPeriod_s_RGB_10colors',
                            }
                        }
                    },
                    DENMARK: {
                        dataset: 'ECMWF/DXP/MAPS_ECMWF_DXP_DENMARK.nc',
                        legendParams: {
                            attribution: '<a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a> / WAM'
                        },
                        options: {
                            zIndex: 100,
                            foreground: true,
                            attribution: 'Wave forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                        },
                        waveHeight: {
                            wmsParams: {
                                layers: 'SWH',
                                cmap: 'Hs_m_GBP_11colors_denmark'
                            }
                        },
                        seaState: {
                            wmsParams: {
                                layers: 'SWH',
                                cmap: 'Hs_m_JET_10colors'
                            },
                            legendParams: {
                                longName: 'WMO Sea State Code',
                                units: '',
                                styles: 'horizontal,nolabel,centerlabels',
                                cmap: 'Hs_ss_JET_10colors'
                            },
                        },
                        waveDirection: {
                            wmsParams: {
                                layers: 'uwave:vwave',
                                styles: 'vector_method=black_vector,vector_spacing=60,vector_offset=10',
                            },
                            legendParams: {
                                show: false
                            },
                            options: {
                                zIndex: 900,
                                primadonna: false
                            }
                        },
                        wavePeriod: {
                            wmsParams: {
                                layers: 'MWP',
                                cmap: 'MeanPeriod_s_RGB_10colors',
                            }
                        }
                    },
                    GREENLAND: {
                        dataset: 'ECMWF/DXP/MAPS_ECMWF_DXP_GREENLAND.nc',
                        legendParams: {
                            attribution: '<a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a> / WAM'
                        },
                        options: {
                            zIndex: 100,
                            foreground: true,
                            attribution: 'Wave forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'
                        },
                        waveHeight: {
                            wmsParams: {
                                layers: 'SWH',
                                cmap: 'Hs_m_GBP_11colors'
                            }
                        },
                        seaState: {
                            wmsParams: {
                                layers: 'SWH',
                                cmap: 'Hs_m_JET_10colors'
                            },
                            legendParams: {
                                longName: 'WMO Sea State Code',
                                units: '',
                                styles: 'horizontal,nolabel,centerlabels',
                                cmap: 'Hs_ss_JET_10colors'
                            },
                        },
                        waveDirection: {
                            wmsParams: {
                                layers: 'uwave:vwave',
                                styles: 'vector_method=black_vector,vector_spacing=60,vector_offset=10',
                            },
                            legendParams: {
                                show: false
                            },
                            options: {
                                zIndex: 900,
                                primadonna: false
                            }
                        },
                        wavePeriod: {
                            wmsParams: {
                                layers: 'MWP',
                                cmap: 'MeanPeriod_s_RGB_10colors',
                            }
                        }
                    }
                }
            },
            FCOO: {
                legendParams: {
                    updatesPerDay: 4
                },
                GETM: {
                    DK_MERGED: {
                        legendParams: {
                            attribution: '<a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a> / GETM'
                        },
                        options: {
                            zIndex: 100,
                            foreground: true,
                        },
                        currentSpeed3D: {
                            dataset: 'FCOO/GETM/dk_nested.velocities.Z3D.nc',
                            wmsParams: {
                                layers: 'uu_vv_dk,uu_vv_idk',
                                cmap: 'Current_kn_WGYR_11colors',
                            },
                            options: {
                                attribution: 'Current forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                            }
                        },
                        currentDirection3D: {
                            dataset: 'FCOO/GETM/dk_nested.velocities.Z3D.nc',
                            wmsParams: {
                                layers: 'uu_dk:vv_dk,uu_idk:vv_idk',
                                styles: 'vector_method=black_vector,vector_color=0.1',
                                cmap: 'Current_kn_WGYR_11colors'
                            },
                            legendParams: {
                                longName: 'Current speed',
                                show: false
                            },
                            options: {
                                zIndex: 900,
                                primadonna: false,
                                attribution: 'Current forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                            }
                        },
                        salinity3D: {
                            dataset: 'FCOO/GETM/dk_nested.salt-temp.Z3D.nc',
                            wmsParams: {
                                layers: 'salt_dk,salt_idk',
                                cmap: 'PrSal_psu_GB_14colors',
                            },
                            options: {
                                attribution: 'Salinity forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                            }
                        },
                        temperature3D: {
                            dataset: 'FCOO/GETM/dk_nested.salt-temp.Z3D.nc',
                            wmsParams: {
                                layers: 'temp_dk,temp_idk',
                                cmap: 'SeaTemp_C_BGYR_14colors',
                            },
                            options: {
                                attribution: 'Temperature forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                            }
                        }
                    },
                    NSBALTIC_MERGED: {
                        legendParams: {
                            attribution: '<a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a> / GETM'
                        },
                        options: {
                            zIndex: 100,
                            foreground: true,
                        },
                        currentSpeed: {
                            dataset: 'FCOO/GETM/nsbalt_nested.velocities.nc',
                            wmsParams: {
                                layers: 'uu_vv_nsbalt,uu_vv_idk',
                                cmap: 'Current_kn_WGYR_11colors',
                            },
                            options: {
                                attribution: 'Current forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                            }
                        },
                        currentDirection: {
                            dataset: 'FCOO/GETM/nsbalt_nested.velocities.nc',
                            wmsParams: {
                                layers: 'uu_nsbalt:vv_nsbalt,uu_idk:vv_idk',
                                styles: 'vector_method=black_vector,vector_color=0.1',
                                cmap: 'Current_kn_WGYR_11colors'
                            },
                            legendParams: {
                                longName: 'Current speed',
                                show: false
                            },
                            options: {
                                zIndex: 900,
                                primadonna: false,
                                attribution: 'Current forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                            }
                        },
                        seaLevel: {
                            dataset: 'FCOO/GETM/nsbalt_nested.2Dvars.nc',
                            wmsParams: {
                                layers: 'elev_nsbalt,elev_idk',
                                cmap: 'SeaLvl_m_BWR_13colors',
                            },
                            options: {
                                attribution: 'Elevation forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                            }
                        },
                        sss: {
                            dataset: 'FCOO/GETM/nsbalt_nested.salt-temp.nc',
                            wmsParams: {
                                layers: 'salt_nsbalt,salt_idk',
                                cmap: 'PrSal_psu_GB_14colors',
                            },
                            options: {
                                attribution: 'Sea surface salinity forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                            }
                        },
                        sst: {
                            dataset: 'FCOO/GETM/nsbalt_nested.salt-temp.nc',
                            wmsParams: {
                                layers: 'temp_nsbalt,temp_idk',
                                cmap: 'SeaTemp_C_BGYR_14colors',
                            },
                            options: {
                                attribution: 'Sea surface temperature forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                            }
                        }
                    },
                    DKINNER: {
                        legendParams: {
                            attribution: '<a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a> / GETM'
                        },
                        options: {
                            zIndex: 100,
                            foreground: true,
                        },
                        currentSpeed: {
                            dataset: 'FCOO/GETM/idk.velocities.600m.surface.1h.DK600-v004C.nc',
                            wmsParams: {
                                layers: 'uu_vv',
                                cmap: 'Current_kn_WGYR_11colors',
                            },
                            options: {
                                attribution: 'Current forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                            }
                        },
                        currentDirection: {
                            dataset: 'FCOO/GETM/idk.velocities.600m.surface.1h.DK600-v004C.nc',
                            wmsParams: {
                                layers: 'uu:vv',
                                styles: 'vector_method=black_vector,vector_color=0.1',
                                cmap: 'Current_kn_WGYR_11colors'
                            },
                            legendParams: {
                                longName: 'Current speed',
                                show: false
                            },
                            options: {
                                zIndex: 900,
                                primadonna: false,
                                attribution: 'Current forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                            }
                        },
                        seaLevel: {
                            dataset: 'FCOO/GETM/idk.2Dvars.600m.2D.1h.DK600-v004C.nc',
                            wmsParams: {
                                layers: 'elev',
                                cmap: 'SeaLvl_m_BWR_13colors',
                            },
                            options: {
                                attribution: 'Elevation forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                            }
                        },
                        sss: {
                            dataset: 'FCOO/GETM/idk.salt-temp.600m.surface.1h.DK600-v004C.nc',
                            wmsParams: {
                                layers: 'salt',
                                cmap: 'PrSal_psu_GB_14colors',
                            },
                            options: {
                                attribution: 'Sea surface salinity forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                            }
                        },
                        sst: {
                            dataset: 'FCOO/GETM/idk.salt-temp.600m.surface.1h.DK600-v004C.nc',
                            wmsParams: {
                                layers: 'temp',
                                cmap: 'SeaTemp_C_BGYR_14colors',
                            },
                            options: {
                                attribution: 'Sea surface temperature forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                            }
                        }
                    },
                    NSBALTIC: {
                        legendParams: {
                            attribution: '<a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a> / GETM'
                        },
                        options: {
                            zIndex: 100,
                            foreground: true,
                        },
                        currentSpeed: {
                            dataset: 'FCOO/GETM/nsbalt.velocities.1nm.surface.1h.DK1NM-v002C.nc',
                            wmsParams: {
                                layers: 'uu_vv',
                                cmap: 'Current_kn_WGYR_11colors',
                            },
                            options: {
                                attribution: 'Current forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                            }
                        },
                        currentDirection: {
                            dataset: 'FCOO/GETM/nsbalt.velocities.1nm.surface.1h.DK1NM-v002C.nc',
                            wmsParams: {
                                layers: 'uu:vv',
                                styles: 'vector_method=black_vector,vector_color=0.1',
                                cmap: 'Current_kn_WGYR_11colors'
                            },
                            legendParams: {
                                longName: 'Current speed',
                                show: false
                            },
                            options: {
                                zIndex: 900,
                                primadonna: false,
                                attribution: 'Current forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                            }
                        },
                        seaLevel: {
                            dataset: 'FCOO/GETM/nsbalt.2Dvars.1nm.2D.1h.DK1NM-v002C.nc',
                            wmsParams: {
                                layers: 'elev',
                                cmap: 'SeaLvl_m_BWR_13colors',
                            },
                            options: {
                                attribution: 'Elevation forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                            }
                        },
                        sss: {
                            dataset: 'FCOO/GETM/nsbalt.salt-temp.1nm.surface.1h.DK1NM-v002C.nc',
                            wmsParams: {
                                layers: 'salt',
                                cmap: 'PrSal_psu_GB_14colors',
                            },
                            options: {
                                attribution: 'Sea surface salinity forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                            }
                        },
                        sst: {
                            dataset: 'FCOO/GETM/nsbalt.salt-temp.1nm.surface.1h.DK1NM-v002C.nc',
                            wmsParams: {
                                layers: 'temp',
                                cmap: 'SeaTemp_C_BGYR_14colors',
                            },
                            options: {
                                attribution: 'Sea surface temperature forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                            }
                        }
                    }
                },
                WW3: {
                    NSBALTIC_MERGED: {
                        dataset: 'FCOO/WW3/ww3.nsbalt_nested.nc',
                        legendParams: {
                            attribution: '<a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a> / WW3'
                        },
                        options: {
                            zIndex: 100,
                            foreground: true,
                            attribution: 'Wave forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                        },
                        waveHeight: {
                            wmsParams: {
                                layers: 'u_v_nsbalt,u_v_dkinner',
                                cmap: 'Hs_m_GBP_11colors_denmark'
                            }
                        },
                        seaState: {
                            wmsParams: {
                                layers: 'u_v_nsbalt,u_v_dkinner',
                                cmap: 'Hs_m_JET_10colors'
                            },
                            legendParams: {
                                longName: 'WMO Sea State Code',
                                units: '',
                                styles: 'horizontal,nolabel,centerlabels',
                                cmap: 'Hs_ss_JET_10colors'
                            },
                        },
                        waveDirection: {
                            wmsParams: {
                                layers: 'u_nsbalt:v_nsbalt,u_dkinner:v_dkinner',
                                styles: 'vector_method=black_vector,vector_spacing=60,vector_offset=10',
                            },
                            legendParams: {
                                show: false
                            },
                            options: {
                                zIndex: 900,
                                primadonna: false
                            }
                        },
                        wavePeriod: {
                            wmsParams: {
                                layers: 'TMN_nsbalt,TMN_dkinner',
                                cmap: 'MeanPeriod_s_RGB_10colors',
                            }
                        }
                    },
                    DKINNER: {
                        dataset: 'FCOO/WW3/ww3fcast_grd_DKinner_v006C.nc',
                        legendParams: {
                            attribution: '<a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a> / WW3'
                        },
                        options: {
                            zIndex: 100,
                            foreground: true,
                            attribution: 'Wave forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                        },
                        waveHeight: {
                            wmsParams: {
                                layers: 'u_v',
                                cmap: 'Hs_m_GBP_11colors_denmark'
                            }
                        },
                        seaState: {
                            wmsParams: {
                                layers: 'u_v',
                                cmap: 'Hs_m_JET_10colors'
                            },
                            legendParams: {
                                longName: 'WMO Sea State Code',
                                units: '',
                                styles: 'horizontal,nolabel,centerlabels',
                                cmap: 'Hs_ss_JET_10colors'
                            },
                        },
                        waveDirection: {
                            wmsParams: {
                                layers: 'u:v',
                                styles: 'vector_method=black_vector,vector_spacing=60,vector_offset=10',
                            },
                            legendParams: {
                                show: false
                            },
                            options: {
                                zIndex: 900,
                                primadonna: false
                            }
                        },
                        wavePeriod: {
                            wmsParams: {
                                layers: 'TMN',
                                cmap: 'MeanPeriod_s_RGB_10colors',
                            }
                        }
                    },
                    NSBALTIC: {
                        dataset: 'FCOO/WW3/ww3c_NSBALT3NM_v001C-FCAST.nc',
                        legendParams: {
                            attribution: '<a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a> / WW3'
                        },
                        options: {
                            zIndex: 100,
                            foreground: true,
                            attribution: 'Wave forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                        },
                        waveHeight: {
                            wmsParams: {
                                layers: 'u_v',
                                cmap: 'Hs_m_GBP_11colors_denmark'
                            }
                        },
                        seaState: {
                            wmsParams: {
                                layers: 'u_v',
                                cmap: 'Hs_m_JET_10colors'
                            },
                            legendParams: {
                                longName: 'WMO Sea State Code',
                                units: '',
                                styles: 'horizontal,nolabel,centerlabels',
                                cmap: 'Hs_ss_JET_10colors'
                            },
                        },
                        waveDirection: {
                            wmsParams: {
                                layers: 'u:v',
                                styles: 'vector_method=black_vector,vector_spacing=60,vector_offset=10',
                            },
                            legendParams: {
                                show: false
                            },
                            options: {
                                zIndex: 900,
                                primadonna: false
                            }
                        },
                        wavePeriod: {
                            wmsParams: {
                                layers: 'TMN',
                                cmap: 'MeanPeriod_s_RGB_10colors',
                            }
                        }
                    },
                    ARCTIC: {
                        dataset: 'FCOO/WW3/WW3_Arctic_geo9nm_v001C.nc',
                        legendParams: {
                            attribution: '<a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a> / WW3'
                        },
                        options: {
                            zIndex: 100,
                            foreground: true,
                            attribution: 'Wave forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'
                        },
                        waveHeight: {
                            wmsParams: {
                                layers: 'u_v',
                                cmap: 'Hs_m_GBP_11colors'
                            }
                        },
                        seaState: {
                            wmsParams: {
                                layers: 'u_v',
                                cmap: 'Hs_m_JET_10colors'
                            },
                            legendParams: {
                                longName: 'WMO Sea State Code',
                                units: '',
                                styles: 'horizontal,nolabel,centerlabels',
                                cmap: 'Hs_ss_JET_10colors'
                            },
                        },
                        waveDirection: {
                            wmsParams: {
                                layers: 'u:v',
                                styles: 'vector_method=black_vector,vector_spacing=60,vector_offset=10',
                            },
                            legendParams: {
                                show: false
                            },
                            options: {
                                zIndex: 900,
                                primadonna: false
                            }
                        },
                        wavePeriod: {
                            wmsParams: {
                                layers: 'TMN',
                                cmap: 'MeanPeriod_s_RGB_10colors',
                            }
                        }
                    },
                }
            },
            STENNIS: {
                ACNFS_ICE: {
                    legendParams: {
                        updatesPerDay: 1
                    },
                    GREENLAND: {
                        dataset: 'STENNIS/ACNFS/hycom-cice_ARCu0.08_fcast.nc',
                        legendParams: {
                            attribution: '<a href="http://www.usno.navy.mil/NAVO" alt="The Naval Oceanographic Office">NAVO</a> / ACNFS'
                        },
                        options: {
                            zIndex: 100
                        },
                        iceConcentration: {
                            wmsParams: {
                                layers: 'aice',
                                cmap: 'IceConcentration_BW_10colors',
                            },
                            options: {
                                attribution: 'Sea ice forecasts from <a href="http://www.usno.navy.mil/NAVO" alt="The Naval Oceanographic Office">NAVO</a>'
                            }
                        },
                        iceThickness: {
                            wmsParams: {
                                layers: 'hi',
                                cmap: 'IceThickness_BGYR_14colors',
                            },
                            options: {
                                attribution: 'Sea ice forecasts from <a href="http://www.usno.navy.mil/NAVO" alt="The Naval Oceanographic Office">NAVO</a>'
                            }
                        },
                        iceSpeed: {
                            wmsParams: {
                                layers: 'icespeed',
                                cmap: 'Current_kn_WGYR_11colors',
                            },
                            options: {
                                attribution: 'Sea ice forecasts from <a href="http://www.usno.navy.mil/NAVO" alt="The Naval Oceanographic Office">NAVO</a>'
                            }
                        },
                        iceDirection: {
                            wmsParams: {
                                layers: 'uvel:vvel',
                                styles: 'vector_method=black_vector,vector_offset=10,vector_color=0.3'
                            },
                            legendParams: {
                                show: false
                            },
                            options: {
                                zIndex: 900,
                                primadonna: false,
                                attribution: 'Sea ice forecasts from <a href="http://www.usno.navy.mil/NAVO" alt="The Naval Oceanographic Office">NAVO</a>'
                            }
                        }
                    }
                }
            },
            NOAA: {
                GFS: {
                    legendParams: {
                        attribution: '<a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a> / GFS'
                    },
                    options: {
                        zIndex: 900
                    },
                    Global: {
                        visibility: {
                            dataset: 'NOAA/GFS/NOAA_GFS_VISIBILITY.nc',
                            wmsParams: {
                                layers: 'vis',
                                cmap: 'AirVisibility_km_RYG_11colors'
                            },
                            options: {
                                attribution: 'Visibility forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'
                            }
                        }
                    }
                },
                HYCOM: {
                    legendParams: {
                        updatesPerDay: 1,
                        attribution: '<a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a> / HYCOM'
                    },
                    options: {
                        zIndex: 100,
                        foreground: true
                    },
                    GREENLAND: {
                        dataset: 'NOAA/HYCOM/NOAA_HYCOM_GREENLAND.nc',
                        currentSpeed: {
                            wmsParams: {
                                layers: 'u_velocity_v_velocity',
                                cmap: 'CurrentArctic_kn_WGYR_11colors'
                            },
                            options: {
                                attribution: 'Current forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'
                            }
                        },
                        currentDirection: {
                            wmsParams: {
                                layers: 'u_velocity:v_velocity',
                                styles: 'vector_method=black_vector,vector_color=0.1',
                                cmap: 'CurrentArctic_kn_WGYR_11colors'
                            },
                            legendParams: {
                                longName: 'Current speed',
                                show: false
                            },
                            options: {
                                zIndex: 900,
                                primadonna: false,
                                attribution: 'Current forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'
                            }
                        },
                        sss: {
                            wmsParams: {
                                layers: 'sss',
                                cmap: 'PrSalArctic_psu_GB_14colors'
                            },
                            options: {
                                attribution: 'Sea surface salinity forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'
                            }
                        },
                        sst: {
                            wmsParams: {
                                layers: 'sst',
                                cmap: 'SeaTempArctic_C_BGYR_14colors'
                            },
                            options: {
                                attribution: 'Sea surface temperature forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'
                            }
                        },
                    },
                    EAST_AFRICA: {
                        dataset: 'NOAA/HYCOM/NOAA_HYCOM_EAST_AFRICA.nc',
                        currentSpeed: {
                            wmsParams: {
                                layers: 'u_velocity_v_velocity',
                                cmap: 'CurrentArctic_kn_WGYR_11colors'
                            },
                            options: {
                                attribution: 'Current forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'
                            }
                        },
                        currentDirection: {
                            wmsParams: {
                                layers: 'u_velocity:v_velocity',
                                styles: 'vector_method=black_vector,vector_color=0.1',
                                cmap: 'CurrentArctic_kn_WGYR_11colors'
                            },
                            legendParams: {
                                longName: 'Current speed',
                                show: false
                            },
                            options: {
                                zIndex: 900,
                                primadonna: false,
                                attribution: 'Current forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'
                            }
                        },
                        sss: {
                            wmsParams: {
                                layers: 'sss',
                                cmap: 'PrSalArctic_psu_GB_14colors'
                            },
                            options: {
                                attribution: 'Sea surface salinity forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'
                            }
                        },
                        sst: {
                            wmsParams: {
                                layers: 'sst',
                                cmap: 'SeaTempWarm_C_BGYR_14colors'
                            },
                            options: {
                                attribution: 'Sea surface temperature forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'
                            }
                        },
                    },
                    MEDITERRANEAN: {
                        dataset: 'NOAA/HYCOM/NOAA_HYCOM_MEDSEA.nc',
                        currentSpeed: {
                            wmsParams: {
                                layers: 'u_velocity_v_velocity',
                                cmap: 'CurrentArctic_kn_WGYR_11colors'
                            },
                            options: {
                                attribution: 'Current forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'
                            }
                        },
                        currentDirection: {
                            wmsParams: {
                                layers: 'u_velocity:v_velocity',
                                styles: 'vector_method=black_vector,vector_color=0.1',
                                cmap: 'CurrentArctic_kn_WGYR_11colors'
                            },
                            legendParams: {
                                longName: 'Current speed',
                                show: false
                            },
                            options: {
                                zIndex: 900,
                                primadonna: false,
                                attribution: 'Current forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'
                            }
                        },
                        sss: {
                            wmsParams: {
                                layers: 'sss',
                                cmap: 'PrSalArctic_psu_GB_14colors'
                            },
                            options: {
                                attribution: 'Sea surface salinity forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'
                            }
                        },
                        sst: {
                            wmsParams: {
                                layers: 'sst',
                                cmap: 'SeaTemp_C_BGYR_14colors'
                            },
                            options: {
                                attribution: 'Sea surface temperature forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'
                            }
                        },
                    },
                }
            }
        }
    });
})();
