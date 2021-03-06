var CCH = CCH || {};
$(document).ready(function() {
	splashUpdate("Loading Main module...");

	splashUpdate("Initializing Logging...");
	initializeLogging({
		LOG4JS_LOG_THRESHOLD: CCH.CONFIG.development ? 'debug' : 'info'
	});

	CCH.LOG = LOG;

	splashUpdate("Initializing Session...");
	CCH.session = new CCH.Objects.Session();

	splashUpdate("Initializing Card Subsystem...");
	CCH.cards = new CCH.Objects.Cards().init();

	splashUpdate("Initializing Search Subsystem...");
	CCH.search = new CCH.Objects.Search({
		itemSearchModalWindow: $('#item-search-modal'),
		searchbar: $('.app-navbar-search-form'),
		geocodeEndoint: CCH.CONFIG.data.sources.geocoding.endpoint,
		modalContainer: $('#item-search-modal'),
		north: $('#item-search-map-input-north'),
		south: $('#item-search-map-input-south'),
		east: $('#item-search-map-input-east'),
		west: $('#item-search-map-input-west'),
		popularityInput: $("#item-search-popularity-input"),
		popularityRange: $("#slider-popularity-range"),
		searchContainer: $('#app-navbar-item-search-container'),
		slider: $("#slider-popularity-range"),
		submitButton: $('#item-search-submit'),
		keywordInput: $('#item-search-keyword-input'),
		themeInput: $('#item-search-theme-input')
	}).init();

	splashUpdate("Initializing UI...");
	CCH.ui = CCH.Objects.UI({
		itemSearchModalWindow: $('#item-search-modal'),
		applicationContainer: $('#application-container'),
		headerRow: $('#header-row'),
		footerRow: $('#footer-row'),
		mapdiv: $('#map'),
		descriptionDiv: $('#description-wrapper'),
		navbarPinButton: $('#app-navbar-pin-control-button'),
		navbarDropdownIcon: $('#app-navbar-pin-control-icon'),
		navbarClearMenuItem: $('#app-navbar-pin-control-clear'),
		navbarShareMenuListItem: $('#app-navbar-pin-control-share-li'),
		mapSearchContainer: $('#map-search-container')
	}).init();

	splashUpdate("Initializing Map...");
	CCH.map = new CCH.Objects.Map({
		mapDiv: 'map'
	}).init();

	splashUpdate("Initializing OWS Services");
	CCH.ows = new CCH.Objects.OWS().init();


	splashUpdate("Starting Application...");
	$('#application-overlay').fadeOut(2000, function() {
		$('#application-overlay').remove();
		splashUpdate = undefined;

		CCH.CONFIG.popularity.populate({
			callbacks: {
				success: [
					function() {
						if (CCH.CONFIG.popularity.results) {
							$(window).trigger('cch.data.items.loaded');
						}
					}
				]
			}
		});

		var sid = CCH.session.getIncomingSid();
		if (sid) {
			CCH.session.updateFromServer({
				sid: sid,
				callbacks: {
					success:
							[
								function() {
//								splashUpdate("Applying session information to application...");
								}
							],
					error: []
				}
			});
		}

	});
});