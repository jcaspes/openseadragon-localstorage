// OpenSeadragon Local storage plugin 0.0.1

(function() {

    var $ = window.OpenSeadragon;

    if (!$) {
        $ = require('openseadragon');
        if (!$) {
            throw new Error('OpenSeadragon is missing.');
        }
    }
	
	function storageGetItem(key)
	{
		if(window.localStorage && window.localStorage.hasOwnProperty(key))
		{
			return window.localStorage.getItem(key);
		}
		return null;
	}
	
	function storageGetFloatItem(viewerId, key, defaultValue)
	{
		var computedKey = 'openseadragon-' + viewerId + '-' + key;
		var value = storageGetItem(computedKey);
		if(value != null && !isNaN(value))
		{
			return parseFloat(value);
		}
		return defaultValue;
	}
	
	function storageSetItem(viewerId, key, value)
	{
		var computedKey = 'openseadragon-' + viewerId + '-' + key;
		if(window.localStorage)
		{
			window.localStorage.setItem(computedKey, value);
		}
	}
    // ----------
    $.Viewer.prototype.localStorage = function() {
        var self = this;
		
		// Read storage infos to inint view on first use
		var params = {
			zoom: storageGetFloatItem(self.id, 'zoom', 1.0),
			pan : {
				x: storageGetFloatItem(self.id, 'pan.x', 0.5),
				y: storageGetFloatItem(self.id, 'pan.y', 0.5),
		}};

		// Avoid openseadragon internal updates during start to trigger an update event
		var ignoreUpdates = true;
        var useStorage = function(paramsToUse) {
			ignoreUpdates = true;
            var zoom = self.viewport.getZoom();
            var pan = self.viewport.getCenter();
			
            if (paramsToUse.zoom !== zoom) {
                self.viewport.zoomTo(paramsToUse.zoom, null, true);
            }

            if (paramsToUse.pan.x !== pan.x || paramsToUse.pan.y !== pan.y) {
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
				storageSetItem(self.id, 'zoom', zoom);
				storageSetItem(self.id, 'pan.x', pan.x);
				storageSetItem(self.id, 'pan.y', pan.y);
			}
        };
		
        this.addHandler('zoom', updateStorage);
        this.addHandler('pan', updateStorage);

    };

})();
