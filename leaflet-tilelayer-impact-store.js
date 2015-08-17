(function () {
    "use strict";
    /*jslint browser: true*/
    /*global $, L, console*/

    /*
     * Store containing WMS layers hosted by FCOO at http(s)://api.fcoo.dk/webmap
     */
    L.Control.ImpactLayerStore = L.Control.FcooLayerStore.extend({
        getLayer: function (options) {
            var o = this.getLayerOptions(options);
            var layers = Object.keys(o.legendParams.parameters).join(':');
            o.wmsParams.layers = layers;
            o.legendParams.name = options.parameter.charAt(0).toUpperCase() +
                                  options.parameter.substring(1);
            var layer = new L.TileLayer.WMS.Impact(o.dataset, o.wmsParams, o.legendParams, o.options);
            //layer = new L.TileLayer.WMS.Fcoo(o.dataset, o.wmsParams, o.legendParams,
                        //o.options);
            return layer;
        },

        model: {
            DMI: {
                options: {
                    zIndex: 100
                },
                wmsParams: {
                    cmap: 'Green_Red_3colors'
                },
                legendParams: {
                    attribution: '<a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / HIRLAM / S03'
                },
                HIRLAM: {
                    S03: {
                        dataset: 'DMI/HIRLAM/MAPS_DMI_S03_v005C.nc',
                        nbc_smoke: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 15,
                                            values: [ 2.5, 9 ],
                                        }
                                    },
                                    precip: {
                                        longname: 'Precipitation',
                                        units: 'mm/h',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 10,
                                            values: [ 2.5, 7.5 ],
                                        }
                                    },
                                    VIS: {
                                        longname: 'Visibility',
                                        units: 'km',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.2,
                                            min: -2,
                                            max: 0,
                                            values: [ -1, -0.4 ],
                                        }
                                    },
                                    TMP: {
                                        longname: 'Temperature (2m)',
                                        units: 'degC',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 35,
                                            max: 50,
                                            values: [ 43, 44],
                                        }
                                    }
                                }
                            }
                        },
                        personnel_land: {
                            legendParams: {
                                parameters: {
                                    precip: {
                                        longname: 'Precipitation',
                                        units: 'mm/h',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 10,
                                            values: [ 2.5, 7.5 ],
                                        }
                                    },
                                    TMP: {
                                        longname: 'Temperature (2m)',
                                        units: 'degC',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 20,
                                            max: 40,
                                            values: [ 30, 35 ],
                                        }
                                    }
                                }
                            }
                        },
                        personnel_airborne: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 3,
                                            max: 15,
                                            values: [ 6.5, 9 ],
                                        }
                                    },
                                    precip: {
                                        longname: 'Precipitation',
                                        units: 'mm/h',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.1,
                                            min: 0,
                                            max: 4,
                                            values: [ 0.1, 2.5 ],
                                        }
                                    },
                                    CBH: {
                                        longname: 'Cloud base height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 25,
                                            min: -500,
                                            max: 0,
                                            values: [ -300, 0 ],
                                        }
                                    }
                                }
                            }
                        },
                        cross_country_manoeuvres: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 3,
                                            max: 25,
                                            values: [ 10, 15 ],
                                        }
                                    },
                                    precip: {
                                        longname: 'Precipitation',
                                        units: 'mm/h',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 20,
                                            values: [ 3, 13 ],
                                        }
                                    },
                                    CBH: {
                                        longname: 'Cloud base height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 25,
                                            min: -2000,
                                            max: 0,
                                            values: [ -900, -300 ],
                                        }
                                    },
                                    VIS: {
                                        longname: 'Visibility',
                                        units: 'km',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.2,
                                            min: -5,
                                            max: 0,
                                            values: [ -3.2, -1.0 ],
                                        }
                                    }
                                }
                            }
                        },
                        bridging: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 3,
                                            max: 25,
                                            values: [ 5, 18 ],
                                        }
                                    }
                                }
                            }
                        },
                        armor_gun_sighting: {
                            legendParams: {
                                parameters: {
                                    VIS: {
                                        longname: 'Visibility',
                                        units: 'km',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.2,
                                            min: -4,
                                            max: 0,
                                            values: [ -2, -1 ],
                                        }
                                    }
                                }
                            }
                        },
                        paradrop: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.25,
                                            min: 0,
                                            max: 15,
                                            values: [ 6.75, 9.25 ],
                                        }
                                    }
                                }
                            }
                        },
                        artillery: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 5,
                                            max: 30,
                                            values: [ 15, 18 ],
                                        }
                                    },
                                    precip: {
                                        longname: 'Precipitation',
                                        units: 'mm/h',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 15,
                                            values: [ 2.5, 7.5 ],
                                        }
                                    },
                                    CBH: {
                                        longname: 'Cloud base height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 25,
                                            min: -1000,
                                            max: 0,
                                            values: [ -450, -175 ],
                                        }
                                    },
                                    VIS: {
                                        longname: 'Visibility',
                                        units: 'km',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.25,
                                            min: -5,
                                            max: 0,
                                            values: [ -3.0, -1.0 ],
                                        }
                                    },
                                    TMP: {
                                        longname: 'Temperature (2m)',
                                        units: 'degC',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 40,
                                            max: 60,
                                            values: [ 50, 52],
                                        }
                                    }
                                }
                            }
                        },
                        air_defence: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 5,
                                            max: 25,
                                            values: [ 10, 15 ],
                                        }
                                    },
                                    CBH: {
                                        longname: 'Cloud base height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 50,
                                            min: -3000,
                                            max: 0,
                                            values: [ -1500, -750 ],
                                        }
                                    },
                                    VIS: {
                                        longname: 'Visibility',
                                        units: 'km',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.25,
                                            min: -10,
                                            max: 0,
                                            values: [ -5.0, -5.0 ],
                                        }
                                    },
                                    TMP: {
                                        longname: 'Temperature (2m)',
                                        units: 'degC',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 40,
                                            max: 60,
                                            values: [ 47, 49],
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            ECMWF: {
                options: {
                    zIndex: 100
                },
                wmsParams: {
                    cmap: 'Green_Red_3colors'
                },
                legendParams: {
                    attribution: '<p>Data source: <a href="http://ecmwf.org" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a></p>'
                },
                DXD_DXP: {
                    DENMARK: {
                        dataset: 'FCOO/IMPACT/IMPACT_ECMWF_DENMARK_v005C.nc',
                        helo: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 18, 23 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 10,
                                            values: [ 3, 4 ],
                                        }
                                    },
                                    CBH: {
                                        longname: 'Cloud base height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 10,
                                            min: -300,
                                            max: 0,
                                            values: [ -150, -60 ],
                                        }
                                    }
                                }
                            }
                        },
                        RHIB: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 20, 25 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 10,
                                            values: [ 3.5, 5 ],
                                        }
                                    }
                                }
                            }
                        },
                        LCP: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 13, 18 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 6,
                                            values: [ 1.5, 2 ],
                                        }
                                    }
                                }
                            }
                        },
                        RAS: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 10,
                                            max: 35,
                                            values: [ 20, 25 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 1,
                                            max: 10,
                                            values: [ 4, 5 ],
                                        }
                                    }
                                }
                            }
                        },
                        boarding: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 10,
                                            max: 35,
                                            values: [ 18, 20 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 6,
                                            values: [ 2.5, 3 ],
                                        }
                                    }
                                }
                            }
                        },
                        UAV: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 25,
                                            values: [ 10, 13 ],
                                        }
                                    },
                                    CBH: {
                                        longname: 'Cloud base height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 10,
                                            min: -200,
                                            max: 0,
                                            values: [ -130, -30 ],
                                        }
                                    }
                                }
                            }
                        },
                        skiff: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 30,
                                            values: [ 11, 16 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 6,
                                            values: [ 1.5, 2 ],
                                        }
                                    }
                                }
                            }
                        },
                        dhow: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 30,
                                            values: [ 18, 26 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 2.5, 3 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_120: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 30,
                                            values: [ 13, 17 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 2, 3.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_500: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 35,
                                            values: [ 19, 23 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 2.5, 3.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_1000: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 21, 26 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 3, 4.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_2000: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 45,
                                            values: [ 26, 35 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 4.5, 5.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        generic: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 50,
                                            values: [ 15, 25 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 16,
                                            values: [ 3, 5 ],
                                        }
                                    },
                                    CBH: {
                                        longname: 'Cloud base height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 20,
                                            min: -1000,
                                            max: 0,
                                            values: [ -200, -100 ],
                                        }
                                    },
                                    precip: {
                                        longname: 'Precipitation',
                                        units: 'mm/h',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 50,
                                            values: [ 4, 16 ],
                                        }
                                    }
                                }
                            }
                        },
                    },
                    GREENLAND: {
                        dataset: 'FCOO/IMPACT/IMPACT_ECMWF_GREENLAND_v005C.nc',
                        helo: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 18, 23 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 10,
                                            values: [ 3, 4 ],
                                        }
                                    },
                                    CBH: {
                                        longname: 'Cloud base height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 10,
                                            min: -300,
                                            max: 0,
                                            values: [ -150, -60 ],
                                        }
                                    }
                                }
                            }
                        },
                        RHIB: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 20, 25 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 10,
                                            values: [ 3.5, 5 ],
                                        }
                                    }
                                }
                            }
                        },
                        LCP: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 13, 18 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 6,
                                            values: [ 1.5, 2 ],
                                        }
                                    }
                                }
                            }
                        },
                        RAS: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 10,
                                            max: 35,
                                            values: [ 20, 25 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 1,
                                            max: 10,
                                            values: [ 4, 5 ],
                                        }
                                    }
                                }
                            }
                        },
                        boarding: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 10,
                                            max: 35,
                                            values: [ 18, 20 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 6,
                                            values: [ 2.5, 3 ],
                                        }
                                    }
                                }
                            }
                        },
                        UAV: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 25,
                                            values: [ 10, 13 ],
                                        }
                                    },
                                    CBH: {
                                        longname: 'Cloud base height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 10,
                                            min: -200,
                                            max: 0,
                                            values: [ -130, -30 ],
                                        }
                                    }
                                }
                            }
                        },
                        skiff: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 30,
                                            values: [ 11, 16 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 6,
                                            values: [ 1.5, 2 ],
                                        }
                                    }
                                }
                            }
                        },
                        dhow: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 30,
                                            values: [ 18, 26 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 2.5, 3 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_120: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 30,
                                            values: [ 13, 17 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 2, 3.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_500: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 35,
                                            values: [ 19, 23 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 2.5, 3.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_1000: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 21, 26 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 3, 4.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_2000: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 45,
                                            values: [ 26, 35 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 4.5, 5.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        generic: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 50,
                                            values: [ 15, 25 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 16,
                                            values: [ 3, 5 ],
                                        }
                                    },
                                    CBH: {
                                        longname: 'Cloud base height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 20,
                                            min: -1000,
                                            max: 0,
                                            values: [ -200, -100 ],
                                        }
                                    },
                                    precip: {
                                        longname: 'Precipitation',
                                        units: 'mm/h',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 50,
                                            values: [ 4, 16 ],
                                        }
                                    }
                                }
                            }
                        }
                    },
                    AFR: {
                        dataset: 'FCOO/IMPACT/IMPACT_ECMWF_AFR_v005C.nc',
                        helo: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 18, 23 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 10,
                                            values: [ 3, 4 ],
                                        }
                                    },
                                    CBH: {
                                        longname: 'Cloud base height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 10,
                                            min: -300,
                                            max: 0,
                                            values: [ -150, -60 ],
                                        }
                                    }
                                }
                            }
                        },
                        RHIB: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 20, 25 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 10,
                                            values: [ 3.5, 5 ],
                                        }
                                    }
                                }
                            }
                        },
                        LCP: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 13, 18 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 6,
                                            values: [ 1.5, 2 ],
                                        }
                                    }
                                }
                            }
                        },
                        RAS: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 10,
                                            max: 35,
                                            values: [ 20, 25 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 1,
                                            max: 10,
                                            values: [ 4, 5 ],
                                        }
                                    }
                                }
                            }
                        },
                        boarding: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 10,
                                            max: 35,
                                            values: [ 18, 20 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 6,
                                            values: [ 2.5, 3 ],
                                        }
                                    }
                                }
                            }
                        },
                        UAV: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 25,
                                            values: [ 10, 13 ],
                                        }
                                    },
                                    CBH: {
                                        longname: 'Cloud base height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 10,
                                            min: -200,
                                            max: 0,
                                            values: [ -130, -30 ],
                                        }
                                    }
                                }
                            }
                        },
                        skiff: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 30,
                                            values: [ 11, 16 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 6,
                                            values: [ 1.5, 2 ],
                                        }
                                    }
                                }
                            }
                        },
                        dhow: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 30,
                                            values: [ 18, 26 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 2.5, 3 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_120: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 30,
                                            values: [ 13, 17 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 2, 3.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_500: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 35,
                                            values: [ 19, 23 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 2.5, 3.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_1000: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 21, 26 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 3, 4.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_2000: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 45,
                                            values: [ 26, 35 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 4.5, 5.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        generic: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 50,
                                            values: [ 15, 25 ],
                                        }
                                    },
                                    SWH: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 16,
                                            values: [ 3, 5 ],
                                        }
                                    },
                                    CBH: {
                                        longname: 'Cloud base height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 20,
                                            min: -1000,
                                            max: 0,
                                            values: [ -200, -100 ],
                                        }
                                    },
                                    precip: {
                                        longname: 'Precipitation',
                                        units: 'mm/h',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 50,
                                            values: [ 4, 16 ],
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            DMI_FCOO: {
                options: {
                    zIndex: 100
                },
                wmsParams: {
                    cmap: 'Green_Red_3colors'
                },
                legendParams: {
                    attribution: '<p>Data source: <a href="http://fcoo.dk" alt="Danish Defence Centre">FCOO</a> and <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a></p>'
                },
                HIRLAM_WW3: {
                    DENMARK: {
                        dataset: 'FCOO/IMPACT/IMPACT_DMI_FCOO_DENMARK_v005C.nc',
                        helo: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 18, 23 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 10,
                                            values: [ 3, 4 ],
                                        }
                                    },
                                    CBH: {
                                        longname: 'Cloud base height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 10,
                                            min: -300,
                                            max: 0,
                                            values: [ -150, -60 ],
                                        }
                                    },
                                    VIS: {
                                        longname: 'Visibility',
                                        units: 'km',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.25,
                                            min: -6,
                                            max: 0,
                                            values: [ -2, -1 ],
                                        }
                                    }
                                }
                            }
                        },
                        RHIB: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 20, 25 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 10,
                                            values: [ 3.5, 5 ],
                                        }
                                    },
                                    VIS: {
                                        longname: 'Visibility',
                                        units: 'km',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.25,
                                            min: -6,
                                            max: 0,
                                            values: [ -2, -1 ],
                                        }
                                    }
                                }
                            }
                        },
                        LCP: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 13, 18 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 6,
                                            values: [ 1.5, 2 ],
                                        }
                                    }
                                }
                            }
                        },
                        RAS: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 10,
                                            max: 35,
                                            values: [ 20, 25 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 1,
                                            max: 10,
                                            values: [ 4, 5 ],
                                        }
                                    },
                                    VIS: {
                                        longname: 'Visibility',
                                        units: 'km',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.25,
                                            min: -6,
                                            max: 0,
                                            values: [ -3, -2 ],
                                        }
                                    }
                                }
                            }
                        },
                        boarding: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 10,
                                            max: 35,
                                            values: [ 18, 20 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 6,
                                            values: [ 2.5, 3 ],
                                        }
                                    },
                                    VIS: {
                                        longname: 'Visibility',
                                        units: 'km',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.25,
                                            min: -6,
                                            max: 0,
                                            values: [ -3, -2 ],
                                        }
                                    }
                                }
                            }
                        },
                        UAV: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 25,
                                            values: [ 10, 13 ],
                                        }
                                    },
                                    CBH: {
                                        longname: 'Cloud base height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 10,
                                            min: -200,
                                            max: 0,
                                            values: [ -130, -30 ],
                                        }
                                    },
                                    VIS: {
                                        longname: 'Visibility',
                                        units: 'km',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.25,
                                            min: -6,
                                            max: 0,
                                            values: [ -3, -2 ],
                                        }
                                    }
                                }
                            }
                        },
                        skiff: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 30,
                                            values: [ 11, 16 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 6,
                                            values: [ 1.5, 2 ],
                                        }
                                    }
                                }
                            }
                        },
                        dhow: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 30,
                                            values: [ 18, 26 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 2.5, 3 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_120: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 30,
                                            values: [ 13, 17 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 2, 3.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_500: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 35,
                                            values: [ 19, 23 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 2.5, 3.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_1000: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 21, 26 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 3, 4.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_2000: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 45,
                                            values: [ 26, 35 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 4.5, 5.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        generic: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 50,
                                            values: [ 15, 25 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 16,
                                            values: [ 3, 5 ],
                                        }
                                    },
                                    CBH: {
                                        longname: 'Cloud base height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 20,
                                            min: -1000,
                                            max: 0,
                                            values: [ -200, -100 ],
                                        }
                                    },
                                    precip: {
                                        longname: 'Precipitation',
                                        units: 'mm/h',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 50,
                                            values: [ 4, 16 ],
                                        }
                                    },
                                    VIS: {
                                        longname: 'Visibility',
                                        units: 'km',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: -20,
                                            max: 0,
                                            values: [ -4, -2 ],
                                        }
                                    }
                                }
                            }
                        }
                    },
                    GREENLAND: {
                        dataset: 'FCOO/IMPACT/IMPACT_DMI_FCOO_GREENLAND_v005C.nc',
                        helo: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 18, 23 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 10,
                                            values: [ 3, 4 ],
                                        }
                                    },
                                    CBH: {
                                        longname: 'Cloud base height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 10,
                                            min: -300,
                                            max: 0,
                                            values: [ -150, -60 ],
                                        }
                                    },
                                    VIS: {
                                        longname: 'Visibility',
                                        units: 'km',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.25,
                                            min: -6,
                                            max: 0,
                                            values: [ -2, -1 ],
                                        }
                                    }
                                }
                            }
                        },
                        RHIB: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 20, 25 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 10,
                                            values: [ 3.5, 5 ],
                                        }
                                    },
                                    VIS: {
                                        longname: 'Visibility',
                                        units: 'km',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.25,
                                            min: -6,
                                            max: 0,
                                            values: [ -2, -1 ],
                                        }
                                    }
                                }
                            }
                        },
                        LCP: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 13, 18 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 6,
                                            values: [ 1.5, 2 ],
                                        }
                                    }
                                }
                            }
                        },
                        RAS: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 10,
                                            max: 35,
                                            values: [ 20, 25 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 1,
                                            max: 10,
                                            values: [ 4, 5 ],
                                        }
                                    },
                                    VIS: {
                                        longname: 'Visibility',
                                        units: 'km',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.25,
                                            min: -6,
                                            max: 0,
                                            values: [ -3, -2 ],
                                        }
                                    }
                                }
                            }
                        },
                        boarding: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 10,
                                            max: 35,
                                            values: [ 18, 20 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 6,
                                            values: [ 2.5, 3 ],
                                        }
                                    },
                                    VIS: {
                                        longname: 'Visibility',
                                        units: 'km',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.25,
                                            min: -6,
                                            max: 0,
                                            values: [ -3, -2 ],
                                        }
                                    }
                                }
                            }
                        },
                        UAV: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 25,
                                            values: [ 10, 13 ],
                                        }
                                    },
                                    CBH: {
                                        longname: 'Cloud base height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 10,
                                            min: -200,
                                            max: 0,
                                            values: [ -130, -30 ],
                                        }
                                    },
                                    VIS: {
                                        longname: 'Visibility',
                                        units: 'km',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.25,
                                            min: -6,
                                            max: 0,
                                            values: [ -3, -2 ],
                                        }
                                    }
                                }
                            }
                        },
                        skiff: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 30,
                                            values: [ 11, 16 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 6,
                                            values: [ 1.5, 2 ],
                                        }
                                    }
                                }
                            }
                        },
                        dhow: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 30,
                                            values: [ 18, 26 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 2.5, 3 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_120: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 30,
                                            values: [ 13, 17 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 2, 3.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_500: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 35,
                                            values: [ 19, 23 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 2.5, 3.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_1000: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 40,
                                            values: [ 21, 26 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 3, 4.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        fishingboat_2000: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 45,
                                            values: [ 26, 35 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 8,
                                            values: [ 4.5, 5.5 ],
                                        }
                                    }
                                }
                            }
                        },
                        generic: {
                            legendParams: {
                                parameters: {
                                    windspeed: {
                                        longname: 'Wind speed',
                                        units: 'm/s',
                                        sliderOptions: {
                                            range: true,
                                            step: 1,
                                            min: 0,
                                            max: 50,
                                            values: [ 15, 25 ],
                                        }
                                    },
                                    Hs: {
                                        longname: 'Significant wave height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 16,
                                            values: [ 3, 5 ],
                                        }
                                    },
                                    CBH: {
                                        longname: 'Cloud base height',
                                        units: 'm',
                                        sliderOptions: {
                                            range: true,
                                            step: 20,
                                            min: -1000,
                                            max: 0,
                                            values: [ -200, -100 ],
                                        }
                                    },
                                    precip: {
                                        longname: 'Precipitation',
                                        units: 'mm/h',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: 0,
                                            max: 50,
                                            values: [ 4, 16 ],
                                        }
                                    },
                                    VIS: {
                                        longname: 'Visibility',
                                        units: 'km',
                                        sliderOptions: {
                                            range: true,
                                            step: 0.5,
                                            min: -20,
                                            max: 0,
                                            values: [ -4, -2 ],
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
})();
