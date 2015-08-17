(function (){
    "use strict";
    /*jslint browser: true*/
    /*global $, console*/

    /**
     * A JavaScript library for proxying metadata requests to WMS server.
     */
    var WmsAjaxProxy = {
        requests: [],
        deferredAjax: function (request) {
            this.requests.push(request);
        },
        doAjax: function () {
            var mergedRequests = this.mergeRequests();
            for (var key in mergedRequests) {
                if (mergedRequests.hasOwnProperty(key)) {
                    $.ajax(mergedRequests[key]);
                }
            }
        },
        mergeRequests: function () {
            // Merges requests for same dataset in requests list
            var reqDict = {};
            var arrayLength = this.requests.length;
            // Collect requests to same url
            for (var i = 0; i < arrayLength; i++) {
                var req = this.requests[i];
                if (! reqDict.hasOwnProperty(req.url)) {
                    reqDict[req.url] = [req];
                } else {
                    reqDict[req.url].push(req);
                }
            }

            // Create merged requests
            var merDict = {};
            for (var key in reqDict) {
                if (reqDict.hasOwnProperty(key)) {
                    merDict[key] = {};
                    if (reqDict[key].length == 1) {
                        // When we only have one request we simply perform that request
                        merDict[key] = reqDict[key][0];
                    } else {
                        // When we have multiple requests we merge them, make a single
                        // request and call all appropriate callbacks with the proper
                        // context
                        var reqs = reqDict[key];
                        var reqsLength = reqs.length;
                        merDict[key].url = reqs[0].url;
                        merDict[key].beforeSend = reqs[0].beforeSend;
                        merDict[key].cache = reqs[0].cache;
                        merDict[key].dataType = reqs[0].dataType;
                        merDict[key].async = reqs[0].async;
                        merDict[key].data = reqs[0].data;
                        merDict[key].context = [];
                        var layers = [];
                        // TODO: Check data contents identical
                        for (var i = 0; i < reqsLength; i++) {
                            merDict[key].context.push({
                                context: reqs[i].context,
                                success: reqs[i].success,
                                error: reqs[i].error
                            });
                            if (layers.indexOf(reqs[i].data.LAYERS) == -1) {
                                layers.push(reqs[i].data.LAYERS);
                            }
                        }
                        merDict[key].data.LAYERS = layers.join();
                        merDict[key].success = function (json, textStatus, jqXHR) {
                            var thisLength = this.length;
                            for (var i = 0; i < thisLength; i++) {
                                this[i].success.call(this[i].context, json, textStatus, jqXHR);
                            }
                        }
                        merDict[key].error = function (jqXHR, textStatus, err) {
                            var thisLength = this.length;
                            for (var i = 0; i < thisLength; i++) {
                                this[i].error.call(this[i].context, jqXHR, textStatus, err);
                            }
                        }
                    }
                }
            }
            return merDict;
        }
    };
    window.WmsAjaxProxy = WmsAjaxProxy;
})();
