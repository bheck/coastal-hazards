// TODO - Back end and front-end verification for uploaded shapefiles

var Shorelines = {
    addShorelines : function(featureName, featureNamespace) {
        var coloredShorelines = Object.extended({});
	
        var colorFeatures = function(divId) {
            return function(event) {
                //			var wasEmpty = Object.isEmpty(coloredShorelines);
                event.features.each(function(el, i, arr) {
                    var index;
                    if (Object.has(coloredShorelines, el.attributes.Date_)) {
                        index = coloredShorelines[el.attributes.Date_].index;
                    } else {
                        index = i % SHORELINE_COLORS.length;
                        coloredShorelines[el.attributes.Date_] = {
                            index : index,
                            attributes : el.attributes
                        };
                    }
                    el.style = {
                        strokeWidth: 2,
                        strokeColor: SHORELINE_COLORS[index]
                    };
                });
                event.object.redraw();
                this.map.zoomToExtent(this.getDataExtent());
			
                var html = [];
                html.push("<div class='well'><h4>Features</h4><table class='tablesorter'><thead><tr><td>Selected</td><td>color</td>");
			
                var headerAttributes = Object.keys(coloredShorelines.values()[0].attributes, function(k, v) {
                    html.push("<td>" + k +"</td>");
                })
			
                html.push("</tr></thead><tbody>");
                coloredShorelines.each(function(key, val) {
                    html.push("<tr><td><input type='checkbox'></td><td style='background-color:" + SHORELINE_COLORS[val.index] + ";'>" + SHORELINE_COLORS[val.index] + "</td>");
                    Object.each(headerAttributes, function(i, el) {
                        html.push("<td>" + val.attributes[el] + "</td>");
                    });
                    html.push("</tr>");
                })
			
                html.push("</tbody></table></div>");
			
                //			if (!wasEmpty) {
                $("#color-legend").html(html.join(''));
                $("table.tablesorter").tablesorter();
            //			}
            };
        };
	
        var layer = new OpenLayers.Layer.Vector(featureName, {
            strategies: [new OpenLayers.Strategy.BBOX()],
            protocol: new OpenLayers.Protocol.WFS({
                url:  "geoserver/sample/wfs",
                featureType: featureName,
                featureNS: featureNamespace,
                geometryName: "the_geom"
            })
        });
        layer.events.register("featuresadded", null, colorFeatures());

        map.getMap().addLayer(layer);
	
    },
    populateFeaturesList : function(caps) {
        $('#shorelines-list').children().remove();
        
        for (var index = 0;index <  caps.featureTypeList.featureTypes.length;index++) { 
            var featureType = caps.featureTypeList.featureTypes[index];
            
            if (featureType.featureNS === CONFIG.namespace.sample || featureType.featureNS === CONFIG.namespace.input) {
                var title = featureType.title;
                var shortenedTitle = title.has(permSession.getCurrentSessionKey()) 
                ?  title.remove(permSession.getCurrentSessionKey() + '_') 
                : title;
                
                if (featureType.featureNS === CONFIG.namespace.input && !title.has(permSession.getCurrentSessionKey())) {
                    continue;
                }
                
                if (title.substr(title.lastIndexOf('_') + 1) == 'shorelines') {
                    $('#shorelines-list')
                    .append($("<option></option>")
                        .attr("value",title)
                        .text(shortenedTitle));
                } 
            }
        }
        
        $('#shorelines-list').change(function(index, option) {
            
            $("#shorelines-list option:not(:selected)").each(function (index, option) {
                var featureType = geoserver.capabilities.featureTypeList.featureTypes.find(function(featureType) {
                    return featureType.name === option.value
                })
                map.removeLayerByName(featureType.name);
            });
            
            $("#shorelines-list option:selected").each(function (index, option) {
                var featureType = geoserver.capabilities.featureTypeList.featureTypes.find(function(featureType) {
                    return featureType.name === option.value
                })
                Shorelines.addShorelines(featureType.name, featureType.featureNS);
            });
        }) 
    },
    initializeUploader : function() {
        var uploader = new qq.FineUploader({
            element: document.getElementById('shoreline-uploader'),
            request: {
                endpoint: 'server/upload'
            },
            validation: {
                allowedExtensions: ['zip']
            },
            multiple : false,
            autoUpload: true,
            text: {
                uploadButton: '<i class="icon-upload icon-white"></i>Upload Shorelines'
            },
            template: '<div class="qq-uploader span4">' +
            '<pre class="qq-upload-drop-area span4"><span>{dragZoneText}</span></pre>' +
            '<div class="qq-upload-button btn btn-success" style="width: auto;">{uploadButtonText}</div>' +
            '<ul class="qq-upload-list hidden" style="margin-top: 10px; text-align: center;"></ul>' +
            '</div>',
            classes: {
                success: 'alert alert-success',
                fail: 'alert alert-error'
            },
            debug: true,
            callbacks: {
                onComplete: function(id, fileName, responseJSON) {
                    if (responseJSON.success) {
                        if (responseJSON.success != 'true') {
                            LOG.info('FAIL!!!')
                        } else {
                            LOG.info("file-token :" + responseJSON['file-token']);
                        
                            permSession.addFileToSession({
                                token : responseJSON['file-token'], 
                                name : responseJSON['file-name']
                            });
                            permSession.save();
                            var geoserver = new Geoserver();
                            var importName = permSession.getCurrentSessionKey() + '_' + responseJSON['file-name'].split('.')[0] + '_shorelines';
                            var importArgs = {
                                token : responseJSON['file-token'],
                                importName : importName, 
                                workspace : 'ch-input',
                                callbacks : [function(data) {
                                    new Geoserver().getCapabilities({
                                        callbacks : [
                                        function(caps) {
                                            $('#shorelines-list').children().remove();
                                            $(caps.featureTypeList.featureTypes).each(function(index, item, arr) { 
                                                var title = item.title;
                                                var shortenedTitle = title.has(permSession.getCurrentSessionKey()) ? 
                                                title.remove(permSession.getCurrentSessionKey() + '_') : 
                                                title;
                                                if (title.has(permSession.getCurrentSessionKey()));
                                                if (title.substr(title.lastIndexOf('_') + 1) == 'shorelines') {
                                                    $('#shorelines-list')
                                                    .append($("<option></option>")
                                                        .attr("value",title)
                                                        .text(shortenedTitle));
                                                } 
                                            });
                                        }
                                        ]
                                    })
                                //                                
                                }]
                            }
                            geoserver.importFile(importArgs);
                        }
                    }
                }
            }
        })
    }
    
}