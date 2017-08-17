
// IF JS IS ENABLED, REMOVE 'no-js' AND ADD 'js' CLASS
jQuery('html').removeClass('no-js').addClass('js');

jQuery(document).ready(function($) {

	//FITVIDS
	$("body").fitVids();

	//RESPONSIVE MENU
	$('#mobile-nav').meanmenu();

	//DROPDOWNS - SUPERFISH
	$('nav ul').superfish({
		delay: 100,
		animation: { opacity:'show', height:'show' },
		speed: 150,
		cssArrows: false,
		disableHI: true
	});

	//BODY PRELOADER
	setTimeout(function(){
		$('body').addClass('loaded');
	}, 1000);

	//BODY FADEOUT ON A CLICK
	if (!$('ul').hasClass("nav")) {
		$('.nav a, .entry-title a').click(function() {
			event.preventDefault();
			newLocation = this.href;
			$('body').fadeOut(300, newpage);
		});
	}

	function newpage() {
		window.location = newLocation;
	}

	//HEADER PARALLAX
	(function(){
		var parallax = document.querySelectorAll(".parallax"),
		speed = 0.6;
		window.onscroll = function(){
			[].slice.call(parallax).forEach(function(el,i){
				var windowYOffset = window.pageYOffset,
				elBackgrounPos = "0 " + (windowYOffset * speed) + "px";
				el.style.backgroundPosition = elBackgrounPos;
			});
		};
	})();

	//FORM VALIDATION
	if (jQuery().validate) { jQuery("#commentform").validate(); }

	//JS HEIGHT MATCHING - VARIOUS ELEMENTS
	$(function(){
		$(window).load(function(){
			var pageHeight = jQuery(window).height();
			$('.page-item.no-content.bg-img, .page-item.parallax').css({ "height": pageHeight + 'px' });
			! function(a) {
				$(".mean-container a.meanmenu-reveal").css({"height": a(".header").outerHeight(),});
				$(".single-post-content, .mean-container .mean-nav, #masonry-container, .single-attachment .entry-content-media").css({"margin-top": a(".header").outerHeight(),});
				$(".contact-alert").css({"margin-top": a(".contact-alert").outerHeight() -  a(".contact-alert").outerHeight() * 2,});
			}(window.jQuery);
		});
		$(window).resize(function(){
			var pageHeight = jQuery(window).height();
			$('.page-item.no-content.bg-img, .page-item.parallax').css({ "height": pageHeight + 'px' });
			! function(a) {
				$(".mean-container a.meanmenu-reveal").css({"height": a(".header").outerHeight(),});
				$(".single-post-content, .mean-container .mean-nav, #masonry-container, .single-attachment .entry-content-media").css({"margin-top": a(".header").outerHeight(),});
				$(".contact-alert").css({"margin-top": a(".contact-alert").outerHeight() -  a(".contact-alert").outerHeight() * 2,});
			}(window.jQuery);
		});
	});

	//FADEIN BLOGROLL LOADING EFFECT
	jQuery(window).load(function() {
		setTimeout(function(){
			timer = setInterval(function(){
				$notLoaded = jQuery("#masonry-container article").not(".loaded");
				$notLoaded.eq(Math.floor(Math.random()*$notLoaded.length)).fadeIn().addClass("loaded");
				if ($notLoaded.length == 0) { clearInterval(timer); }
			}, 75);

		 },1150);
	});

	// Map init

	var MYMAP = {
		map: null,
		bounds: null,
		init: function(selector, latLng, zoom) {
			var myOptions = {
				zoom:zoom,
				minZoom: 1,
				maxZoom: 21,
				center: latLng,
				zoomControl: true,
				panControl: true,
				mapTypeControl: true,
				streetViewControl: true,
				draggable: true,
				disableDoubleClickZoom: false,
				scrollwheel: true,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			this.map = new google.maps.Map(jQuery(selector)[0], myOptions);
			this.bounds = new google.maps.LatLngBounds();
			google.maps.event.addListener(MYMAP.map, 'click', function() {
				infoWindow.close();
			});
		},
		placeMarkers: function(filename,map_id,radius,searched_center,distance_type) {
			var check1 = 0;
			var dec_marker_array = jQuery.parseJSON(db_marker_array);
			jQuery.each(dec_marker_array, function(i, val) {
				var wpmgza_map_id = val.map_id;
				if (wpmgza_map_id == map_id) {
					var wpmgza_address = val.address;
					var wpmgza_anim = val.anim;
					var wpmgza_infoopen = val.infoopen;
					var lat = val.lat;
					var lng = val.lng;
					var point = new google.maps.LatLng(parseFloat(lat),parseFloat(lng));
					var current_lat = val.lat;
					var current_lng = val.lng;
					var show_marker_radius = true;
					if (radius !== null) {
						if (check1 > 0 ) { } else {
							point = new google.maps.LatLng(parseFloat(searched_center.lat()),parseFloat(searched_center.lng()));
							MYMAP.bounds.extend(point);
							var marker = new google.maps.Marker({
								position: point,
								map: MYMAP.map,
								animation: google.maps.Animation.BOUNCE
							});
							if (distance_type === "1") {
								var populationOptions = {
									strokeColor: '#FF0000',
									strokeOpacity: 0.25,
									strokeWeight: 2,
									fillColor: '#FF0000',
									fillOpacity: 0.15,
									map: MYMAP.map,
									center: point,
									radius: parseInt(radius / 0.000621371)
								};
							} else {
								var populationOptions = {
									strokeColor: '#FF0000',
									strokeOpacity: 0.25,
									strokeWeight: 2,
									fillColor: '#FF0000',
									fillOpacity: 0.15,
									map: MYMAP.map,
									center: point,
									radius: parseInt(radius / 0.001)
								};
							}
							cityCircle = new google.maps.Circle(populationOptions);
							check1 = check1 + 1;
						}
					var R = 0;
					if (distance_type === "1") {
						R = 3958.7558657440545;
					} else {
						R = 6378.16;
					}
					var dLat = toRad(searched_center.lat()-current_lat);
					var dLon = toRad(searched_center.lng()-current_lng);
					var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(current_lat)) * Math.cos(toRad(searched_center.lat())) * Math.sin(dLon/2) * Math.sin(dLon/2);
					var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
					var d = R * c;

					if (d < radius) { show_marker_radius = true; } else { show_marker_radius = false; }
				}

				point = new google.maps.LatLng(parseFloat(lat),parseFloat(lng));
				MYMAP.bounds.extend(point);
				if (show_marker_radius === true) {
					if (wpmgza_anim === "1") {
						marker = new google.maps.Marker({
							position: point,
							map: MYMAP.map,
							animation: google.maps.Animation.BOUNCE
						});
					} else if (wpmgza_anim === "2") {
						marker = new google.maps.Marker({
							position: point,
							map: MYMAP.map,
							animation: google.maps.Animation.DROP
						});
					} else {
						var marker = new google.maps.Marker({
							position: point,
							map: MYMAP.map
						});
					}
					var d_string = "";
						if (radius !== null) {
							if (distance_type === "1") {
								d_string = "<p style='min-width:100px; display:block;'>"+Math.round(d,2)+"miles away </p>";
							} else {
								d_string = "<p style='min-width:100px; display:block;'>"+Math.round(d,2)+"km away </p>";
							}
						} else { d_string = ''; }

						var html='<p style=\'min-width:100px; display:block;\'>'+wpmgza_address+'</p>'+d_string;
						if (wpmgza_infoopen === "1") {
							infoWindow.setContent(html);
							infoWindow.open(MYMAP.map, marker);
						}
						google.maps.event.addListener(marker, 'click', function() {
							infoWindow.close();
							infoWindow.setContent(html);
							infoWindow.open(MYMAP.map, marker);
						});
					}
				}
			});
		}
	}

	var db_marker_array = JSON.stringify([{
		"map_id":"1",
		"marker_id":"5",
		"title":"하림각 AW Convention Center",
		"address":"종로구 자하문로 225<br>255 Jahamun-ro, Jongno-gu",
		"desc":"하림각 AW Convention Center",
		"pic":"",
		"icon":"",
		"linkd":"",
		"lat":"37.59709658983338",
		"lng":"126.96254092450545",
		"anim":"0",
		"retina":"0",
		"category":"",
		"infoopen":"0"
	}]);

	jQuery("#wpgmza_map").css({ height:'400px', width:'100%' });
	var myLatLng = new google.maps.LatLng(37.596118,126.963590);
	MYMAP.init('#wpgmza_map', myLatLng, 17);
	MYMAP.placeMarkers(null,1,null,null,null);

	var infoWindow = new google.maps.InfoWindow();
	infoWindow.setOptions({maxWidth:250});

	google.maps.event.addDomListener(window, 'resize', function() {
		var myLatLng = new google.maps.LatLng(37.596118,126.963590);
		MYMAP.map.setCenter(myLatLng);
	});

	function clearLocations() {
		infoWindow.close();
	}

	function toRad(Value) {
		/** Converts numeric degrees to radians */
		return Value * Math.PI / 180;
	}

});
