/**
 * Flip Gallery jQuery Widget
 * Inspired by a transition from the Flux Slider library (http://www.joelambert.co.uk/flux)
 *
 * Copyright 2011, Joe Lambert.
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

(function($) {
	$.widget("ui.flipGallery", {
		options: {},
		_create: function() {
			
			var that = this;
			
			// Find all the images for the gallery
			that.images = that.element.find('img');
			
			// If we only have one image then don't proceed
			if(that.images.length <= 1)
				return;
				
			that.currentImageIndex = 0;
			
			// Get image dimensions
			that.height = that.images.first().height();
			that.width = that.images.first().width();
			
			// Make sure the gallery element remains this size
			that.element.width(that.width).height(that.height);
			
			// Allow sub elements to be absolutely positioned within the gallery
			that.element.css('position', 'relative');
			
			// Setup the element to support perspective
			that.element.css({
				'-webkit-perspective': 1100,
				'-webkit-perspective-origin': '50% 50%'
			})
			
			// Create an element to show the left hand slide of image A
			that.imageLeftA = $('<div/>', { 'class': 'imageLeftA'}).css({
				width: '100%',
				height: '100%',
				position: 'relative'
			});
			
			// Create an element to show the right hand side of image B
			that.imageRightB = $('<div/>', { 'class': 'imageRightB'}).css({
				// Full height, half width
				width: '100%',
				height: '100%',
				
				// Cover the right hand part of imageLeftA
				position: 'absolute',
				top: '0px',
				right: '0px',
				
				// Right align the background image
				backgroundPosition: 'right top'
			}).appendTo(this.imageLeftA);
			
			// Now create the 'page' that will flip over
			that.page = $('<div/>', { 'class': 'page' }).css({
				// Full height, half width
				width: '100%',
				height: '100%',
				
				// Cover the right hand part of the images
				position: 'absolute',
				top: '0px',
				right: '0px',
				
				// We need to tell this element to preserve the orientation of sub elements as it is transformed
				'-webkit-transform-style': 'preserve-3d'
			});
			
			that.imageRightA = $('<div/>', { 'class': 'imageRightA'}).css({
				// Fill the container (which is full height, half width)
				width: '100%',
				height: '100%',
				
				// Right align the background image
				backgroundPosition: 'right top',
				
				// Make sure the element starts at the top left of the page
				position: 'absolute',
				top: '0px',
				left: '0px',
				
				// We don't want to see the image when its facing away from us
				'-webkit-backface-visibility': 'hidden'
			}).appendTo(that.page);
			
			that.imageLeftB = $('<div/>', { 'class': 'imageLeftB'}).css({
				// Fill the container (which is full height, half width)
				width: '100%',
				height: '100%',
				
				// Make sure the element starts at the top left of the page
				position: 'absolute',
				top: '0px',
				left: '0px',
				
				// We need to rotate this panel as it should start with its back facing out of the screen
				'-webkit-transform': 'rotateY(180deg)',
				'-moz-transform': 'rotateY(180deg)',
				
				// We don't want to see the image when its facing away from us
				'-webkit-backface-visibility': 'hidden'
			}).appendTo(that.page);
			
			// Add our new elements to the DOM
			that.imageLeftA.appendTo(that.element);
			that.page.appendTo(that.element);
			
			// Remove the images from the DOM
			that.images.remove();
			
			that._setupImages();
		},
		_setupImages: function() {
			var that = this;
			
			var nextImageIndex = that.currentImageIndex + 1;
			
			// Range check the next image index
			if(nextImageIndex >= this.images.length)
				nextImageIndex = 0;

			// Setup the placeholder elements with the correct backgrounds
			that.element
				.add(that.imageLeftA)
				.add(that.imageRightA)
				.css('background-image', 'url('+ $( that.images.get(that.currentImageIndex) ).attr('src') + ')');
			
			that.imageRightB
				.add(that.imageLeftB)
				.css('background-image', 'url('+ $( that.images.get(nextImageIndex) ).attr('src') + ')');
		},
		turn: function() {
			var that = this;
			
			// Setup a function to trigger when the transition has finished
			var transitionEnd = function(event) {
				// Stop listening for transition events
				that.page.unbind('webkitTransitionEnd', transitionEnd);
				that.page.unbind('mozTransitionEnd', transitionEnd)
				
				that.currentImageIndex++;
				
				// Range check the new image index
				if(that.currentImageIndex >= that.images.length)
					that.currentImageIndex = 0;
				
				// Set the background of the gallery to the new image
				that.element.css('background-image', that.imageLeftB.css('background-image'));
				
				// Hide the created DOM elements to reveal the gallery background (new image)
				var elements = that.imageLeftA.add(that.page).hide();
					
				// Stop changes to the page from being animated
				that.page.css({
					'-webkit-transition-property': 'none'
				});
				
				setTimeout(function() {
					// Reset the elements for the next turn
					that.page.css('-webkit-transform', 'none');
					that._setupImages();
					elements.show();
				}, 50);
			}
			
			// Listen for when the transition has finished
			that.page.bind('webkitTransitionEnd', transitionEnd);
			that.page.bind('mozTransitionEnd', transitionEnd);
			
			// Setup the transition
			that.page.css({
				'-webkit-transition-property': '-webkit-transform',
				'-webkit-transition-duration': '1200ms',
				'-webkit-transition-timing-function': 'ease',
				
				// Make sure the rotation pivots around the left hand edge
				'-webkit-transform-origin': 'left'
			});
			
			// Use setTimeout() to ensure the above settings have taken effect before proceeding
			setTimeout(function() {
				that.page.css({
					// Flip from left to right around the Y axis
					'-webkit-transform': 'rotateY(-180deg)'
				});
			}, 50);
		}
	});
}(jQuery));