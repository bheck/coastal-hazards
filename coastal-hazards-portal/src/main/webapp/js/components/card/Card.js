CCH.Objects.Card = function(args) {
	CCH.LOG.info('Card.js::constructor:Card class is initializing.');
	var me = (this === window) ? {} : this;

	me.item = args.item;
	me.bbox = me.item.bbox;
	me.type = me.item.type;
	me.summary = me.item.summary;
	me.name = me.item.name;
	me.attr = me.item.attr;
	me.service = me.item.service;
	me.htmlEntity = null;
	me.size = args.size;
	me.pinned = false;
	me.pinButton = null;
	me.tweetButton = null;

	return $.extend(me, {
		init: function() {
			return me;
		},
		create: function() {
			me.container = $('<div />').addClass('description-container container-fluid');
			var titleRow = $('<div />').addClass('description-title-row row-fluid');
			var descriptionRow = $('<div />').addClass('description-description-row row-fluid');
			me.pinButton = $('<button />').addClass('btn  span1').attr('type', 'button').append($('<i />').addClass('slide-menu-icon-zoom-in icon-eye-open slide-button muted'));
			me.tweetButton = $('<a />').
					addClass('twitter-share-button').
					attr({
				'data-lang': 'en',
				'data-count': 'none',
				'data-hashtags': 'cch',
				'data-text': me.name,
				'data-url': 'http://go.usa.gov/random',
				'data-counturl': window.location.href + 'sid=SomeRandomSessionId'
			});

			[me.pinButton, me.tweetButton].each(function(button) {
				button.on({
					'mouseover': function(evt) {
						$(this).find('i').removeClass('muted');
					},
					'mouseout': function(evt) {
						$(this).find('i').addClass('muted');
					}
				});
			});

			me.tweetButton.on({
				'click': function(evt) {
					$(me).trigger('card-button-tweet-clicked');
				}
			});

			me.pinButton.on({
				'click': function() {
					$(me).trigger('card-button-pin-clicked');
				}
			});

			if (me.type === 'storms') {
				me.container.addClass('description-container-storms');
			} else if (me.type === 'vulnerability') {
				me.container.addClass('description-container-vulnerability');
			} else {
				me.container.addClass('description-container-historical');
			}

			var titleColumn = $('<span />').addClass('description-title span10').html(me.name);

			titleRow.append(me.pinButton, titleColumn, me.tweetButton);

			// TODO description should come from summary service (URL in item)
			descriptionRow.append($('<p />').addClass('slide-vertical-description unselectable').html(me.summary.medium));

			me.container.append(titleRow, descriptionRow);
			if (me.size === 'large') {
				me.container.addClass('description-container-large');
			} else if (me.size === 'small') {
				me.container.addClass('description-container-small');
			}

			me.container.data('card', me);

			return me.container;
		},
		getAllCards: function() {
			var descriptionContainers = $('.description-container');
			var cards = [];
			for (var contIdx = 0; contIdx < descriptionContainers.length; contIdx++) {
				cards.push($(descriptionContainers[contIdx]).data('card'));
			}
			return cards;
		},
		pin: function() {
			me.pinButton.addClass('slider-card-pinned');
			me.pinned = true;
			$(me).trigger('card-pinned', me);
		},
		unpin: function() {
			me.pinButton.removeClass('slider-card-pinned');
			me.pinned = false;
			$(me).trigger('card-unpinned', me);
		}
	});
};