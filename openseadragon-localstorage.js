// OpenSeadragon Local storage plugin 0.0.1

(function() {

    var $ = window.OpenSeadragon;

    if (!$) {
        $ = require('openseadragon');
        if (!$) {
            throw new Error('OpenSeadragon is missing.');
        }
    }

    // ----------
    $.Viewer.prototype.localStorage = function() {
        var self = this;
		
		// Read storage infos to inint view on first use
		var params = {
			zoom:1,
			pan : {
				x: 0.5,
				y: 0.5
		}};
		
		if(window.localStorage.hasOwnProperty('openseadragon-zoom'))
		{
			params.zoom = parseFloat(window.localStorage.getItem('openseadragon-zoom'));
		}
		if(window.localStorage.hasOwnProperty('openseadragon-pan.x'))
		{
			params.pan.x = parseFloat(window.localStorage.getItem('openseadragon-pan.x'));
		}
		if(window.localStorage.hasOwnProperty('openseadragon-pan.y'))
		{
			params.pan.y = parseFloat(window.localStorage.getItem('openseadragon-pan.y'));
		}

		// Avoid openseadragon internal updates during start to trigger an update event
		var ignoreUpdates = true;
        var useStorage = function(paramsToUse) {
			ignoreUpdates = true;
            var zoom = self.viewport.getZoom();
            var pan = self.viewport.getCenter();
			
            if (paramsToUse.zoom !== undefined && paramsToUse.zoom !== zoom) {
                self.viewport.zoomTo(paramsToUse.zoom, null, true);
            }

            if (paramsToUse.pan.x !== undefined && paramsToUse.pan.y !== undefined && (paramsToUse.pan.x !== pan.x || paramsToUse.pan.y !== pan.y)) {
                self.viewport.panTo(new $.Point(paramsToUse.pan.x, paramsToUse.pan.y), true);
            }
			ignoreUpdates = false;
        };

        if (this.world.getItemCount() === 0) {
            this.addOnceHandler('open', function() {
                useStorage(params);
            });
        } else {
            useStorage(params);
        }


		// handle view updates to store paramters
        var updateTimeout;
        var updateStorage = function() {
			if(!ignoreUpdates)
			{
				var zoom = self.viewport.getZoom();
				var pan = self.viewport.getCenter();
				window.localStorage.setItem('openseadragon-zoom', zoom);
				window.localStorage.setItem('openseadragon-pan.x', pan.x);
				window.localStorage.setItem('openseadragon-pan.y', pan.y);
			}
        };
		
        this.addHandler('zoom', updateStorage);
        this.addHandler('pan', updateStorage);

    };

})();
