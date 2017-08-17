
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
				if (marker_pull === '1') {
					jQuery.get(filename, function(xml){
						jQuery(xml).find("marker").each(function(){
							var wpmgza_map_id = jQuery(this).find('map_id').text();
								if (wpmgza_map_id == map_id) {
									var wpmgza_address = jQuery(this).find('address').text();
									var lat = jQuery(this).find('lat').text();
									var lng = jQuery(this).find('lng').text();
									var wpmgza_anim = jQuery(this).find('anim').text();
									var wpmgza_infoopen = jQuery(this).find('infoopen').text();
									var current_lat = jQuery(this).find('lat').text();
									var current_lng = jQuery(this).find('lng').text();
									var show_marker_radius = true;
									if (radius !== null) {
										if (check1 > 0 ) { } else {
											var point = new google.maps.LatLng(parseFloat(searched_center.lat()),parseFloat(searched_center.lng()));
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

						var point = new google.maps.LatLng(parseFloat(lat),parseFloat(lng));
						MYMAP.bounds.extend(point);
						if (show_marker_radius === true) {
							if (wpmgza_anim === "1") {
								var marker = new google.maps.Marker({
															position: point,
															map: MYMAP.map,
															animation: google.maps.Animation.BOUNCE
										});
							} else if (wpmgza_anim === "2") {
								var marker = new google.maps.Marker({
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
		});
				} else {
					if (db_marker_array.length > 0) {
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
											var point = new google.maps.LatLng(parseFloat(searched_center.lat()),parseFloat(searched_center.lng()));
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

								var point = new google.maps.LatLng(parseFloat(lat),parseFloat(lng));
								MYMAP.bounds.extend(point);
								if (show_marker_radius === true) {
										if (wpmgza_anim === "1") {
										var marker = new google.maps.Marker({
														position: point,
														map: MYMAP.map,
														animation: google.maps.Animation.BOUNCE
												});
										}
										else if (wpmgza_anim === "2") {
												var marker = new google.maps.Marker({
																position: point,
																map: MYMAP.map,
																animation: google.maps.Animation.DROP
												});
										}
										else {
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
			}
	}

	var marker_pull = '0';
	var db_marker_array = JSON.stringify([{"map_id":"1","marker_id":"5","title":"","address":"37.59709658983338, 126.96254092450545","desc":"","pic":"","icon":"","linkd":"","lat":"37.59709658983338","lng":"126.96254092450545","anim":"0","retina":"0","category":"","infoopen":"0"}]);


	if (/1\.(0|1|2|3|4|5|6|7)\.(0|1|2|3|4|5|6|7|8|9)/.test(jQuery.fn.jquery)) {
			setTimeout(function(){
					document.getElementById('wpgmza_map').innerHTML = 'Error: Your version of jQuery is outdated. WP Google Maps requires jQuery version 1.7+ to function correctly. Go to Maps->Settings and check the box that allows you to over-ride your current jQuery to try eliminate this problem.';
			}, 3000);
	} else {

			jQuery("#wpgmza_map").css({
					height:'400px',
					width:'100\%'
			});
			var myLatLng = new google.maps.LatLng(37.596118,126.963590);
			MYMAP.init('#wpgmza_map', myLatLng, 17);
			UniqueCode=Math.round(Math.random()*10000);
			MYMAP.placeMarkers('http://localhost:8888/_wedding/wp-content/uploads/wp-google-maps/1markers.xml?u='+UniqueCode,1,null,null,null);

			jQuery('body').on('tabsactivate', function(event, ui) {
					MYMAP.init('#wpgmza_map', myLatLng, 17);
					UniqueCode=Math.round(Math.random()*10000);
					MYMAP.placeMarkers('http://localhost:8888/_wedding/wp-content/uploads/wp-google-maps/1markers.xml?u='+UniqueCode,1,null,null,null);
			});


			jQuery('body').on('click', '.wpb_tabs_nav li', function(event, ui) {
					MYMAP.init('#wpgmza_map', myLatLng, 17);
					UniqueCode=Math.round(Math.random()*10000);
					MYMAP.placeMarkers('http://localhost:8888/_wedding/wp-content/uploads/wp-google-maps/1markers.xml?u='+UniqueCode,1,null,null,null);
			});
			/* tab compatibility */

			jQuery('body').on('click', '.ui-tabs-nav li', function(event, ui) {
					MYMAP.init('#wpgmza_map', myLatLng, 17);
					UniqueCode=Math.round(Math.random()*10000);
					MYMAP.placeMarkers('http://localhost:8888/_wedding/wp-content/uploads/wp-google-maps/1markers.xml?u='+UniqueCode,1,null,null,null);
			});
			jQuery('body').on('click', '.tp-tabs li a', function(event, ui) {
					MYMAP.init('#wpgmza_map', myLatLng, 17);
					UniqueCode=Math.round(Math.random()*10000);
					MYMAP.placeMarkers('http://localhost:8888/_wedding/wp-content/uploads/wp-google-maps/1markers.xml?u='+UniqueCode,1,null,null,null);
			});
			jQuery('body').on('click', '.nav-tabs li a', function(event, ui) {
					MYMAP.init('#wpgmza_map', myLatLng, 17);
					UniqueCode=Math.round(Math.random()*10000);
					MYMAP.placeMarkers('http://localhost:8888/_wedding/wp-content/uploads/wp-google-maps/1markers.xml?u='+UniqueCode,1,null,null,null);
			});

			jQuery('body').on('click', '.x-accordion-heading', function(){
					MYMAP.init('#wpgmza_map', myLatLng, 17);
					UniqueCode=Math.round(Math.random()*10000);
					MYMAP.placeMarkers('http://localhost:8888/_wedding/wp-content/uploads/wp-google-maps/1markers.xml?u='+UniqueCode,1,null,null,null);
			});
			jQuery('body').on('click', '.x-nav-tabs li', function (event, ui) {
					MYMAP.init('#wpgmza_map', myLatLng, 17);
					UniqueCode=Math.round(Math.random()*10000);
					MYMAP.placeMarkers('http://localhost:8888/_wedding/wp-content/uploads/wp-google-maps/1markers.xml?u='+UniqueCode,1,null,null,null);
			});
			jQuery('body').on('click', '.tab-title', function (event, ui) {
					MYMAP.init('#wpgmza_map', myLatLng, 17);
					UniqueCode=Math.round(Math.random()*10000);
					MYMAP.placeMarkers('http://localhost:8888/_wedding/wp-content/uploads/wp-google-maps/1markers.xml?u='+UniqueCode,1,null,null,null);
			});
			jQuery('body').on('click', '.tab-link', function (event, ui) {
					MYMAP.init('#wpgmza_map', myLatLng, 17);
					UniqueCode=Math.round(Math.random()*10000);
					MYMAP.placeMarkers('http://localhost:8888/_wedding/wp-content/uploads/wp-google-maps/1markers.xml?u='+UniqueCode,1,null,null,null);
			});
			jQuery('body').on('click', '.et_pb_tabs_controls li', function (event, ui) {
					MYMAP.init('#wpgmza_map', myLatLng, 17);
					UniqueCode=Math.round(Math.random()*10000);
					MYMAP.placeMarkers('http://localhost:8888/_wedding/wp-content/uploads/wp-google-maps/1markers.xml?u='+UniqueCode,1,null,null,null);
			});
			jQuery('body').on('click', '.fusion-tab-heading', function (event, ui) {
					MYMAP.init('#wpgmza_map', myLatLng, 17);
					UniqueCode=Math.round(Math.random()*10000);
					MYMAP.placeMarkers('http://localhost:8888/_wedding/wp-content/uploads/wp-google-maps/1markers.xml?u='+UniqueCode,1,null,null,null);
			});
			jQuery('body').on('click', '.et_pb_tab', function (event, ui) {
					MYMAP.init('#wpgmza_map', myLatLng, 17);
					UniqueCode=Math.round(Math.random()*10000);
					MYMAP.placeMarkers('http://localhost:8888/_wedding/wp-content/uploads/wp-google-maps/1markers.xml?u='+UniqueCode,1,null,null,null);
			});


			/* compatibility for GDL tabs */
			jQuery('body').on('click', '.gdl-tabs li', function(event, ui) {
					for(var entry in wpgmaps_localize) {
							InitMap(wpgmaps_localize[entry]['id'],'all',false);
					}
			});

			jQuery('body').on('click', '#tabnav  li', function(event, ui) {
					for(var entry in wpgmaps_localize) {
							InitMap(wpgmaps_localize[entry]['id'],'all',false);
					}
			});
	};


	var infoWindow = new google.maps.InfoWindow();
	infoWindow.setOptions({maxWidth:250});

	google.maps.event.addDomListener(window, 'resize', function() {
		var myLatLng = new google.maps.LatLng(37.596118,126.963590);
		MYMAP.map.setCenter(myLatLng);
	});

	function searchLocations(map_id) {
		var address = document.getElementById("addressInput").value;
		var geocoder = new google.maps.Geocoder();

		geocoder.geocode({address: address}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
						 searchLocationsNear(map_id,results[0].geometry.location);
				} else {
						 alert(address + ' not found');
				}
			});
		}

	function clearLocations() {
			infoWindow.close();
	}

	function searchLocationsNear(mapid,center_searched) {
			clearLocations();
			var distance_type = document.getElementById("wpgmza_distance_type").value;
			var radius = document.getElementById('radiusSelect').value;
			if (distance_type === "1") {
					if (radius === "1") { zoomie = 14; }
					else if (radius === "5") { zoomie = 12; }
					else if (radius === "10") { zoomie = 11; }
					else if (radius === "25") { zoomie = 9; }
					else if (radius === "50") { zoomie = 8; }
					else if (radius === "75") { zoomie = 8; }
					else if (radius === "100") { zoomie = 7; }
					else if (radius === "150") { zoomie = 7; }
					else if (radius === "200") { zoomie = 6; }
					else if (radius === "300") { zoomie = 6; }
					else { zoomie = 14; }
			} else {
					if (radius === "1") { zoomie = 14; }
					else if (radius === "5") { zoomie = 12; }
					else if (radius === "10") { zoomie = 11; }
					else if (radius === "25") { zoomie = 10; }
					else if (radius === "50") { zoomie = 9; }
					else if (radius === "75") { zoomie = 8; }
					else if (radius === "100") { zoomie = 8; }
					else if (radius === "150") { zoomie = 7; }
					else if (radius === "200") { zoomie = 7; }
					else if (radius === "300") { zoomie = 6; }
					else { zoomie = 14; }
			}
			MYMAP.init("#wpgmza_map", center_searched, zoomie, 3);
			MYMAP.placeMarkers('http://localhost:8888/_wedding/wp-content/uploads/wp-google-maps/1markers.xml?u='+UniqueCode,mapid,radius,center_searched,distance_type);
	}

	function toRad(Value) {
			/** Converts numeric degrees to radians */
			return Value * Math.PI / 180;
	}

});
