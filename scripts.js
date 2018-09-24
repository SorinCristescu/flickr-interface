
$(document).ready(() => {
    let div = $("div")[0];
    // API Key
	const apiKey = '452fecafef004fa999973727f08ebff9';
	let flickerAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + apiKey + '&nojsoncallback=1';
	$('#prevPageBtn, #getMoreBtn').hide();

	function removeDiv() {
		$('.results').remove();
		$('small').remove();
	}

	// Search photos on flickr
	function getImages(pageNum) {
		removeDiv();
    // Get JSON from flickr API
		$.getJSON(flickerAPI, {
				text: $("#search-text").val(),
				tag_mode: "photo",
				format: "json",
				extras: "views, url_q",
				per_page: 20,
				page: pageNum
			})
			.done((data) => {
				photos = data.photos;
				$.data(div, "photos", photos);

				// Create results section where the images are the same size with view count on the image
				$.each(photos.photo, (p, photo) => {
					let resultsClass = $("<div>").addClass('results').appendTo("#images");
					$("<img class='image'>").attr("src", photo.url_q).appendTo(resultsClass);
                    $("<div>").addClass('.count').appendTo(resultsClass).text(photo.views);
				});
				$('<small>(' + (photos.pages * photos.perpage) + ' total results)</small>').appendTo('.title');
				$('.title h4').text('Search Results for ' + $("#search-text").val());
				if (data.photos.pages !== pageNum) {
					$('#getMoreBtn').show();
				};
			});
	};

	function searching() {
		$('#prevPageBtn, #getMoreBtn').hide();
		getImages(1);
	};

	$("#btn-sort").click(() => {
		let photoArray = photos.photo;

		// Sort images by most views
		function SortByViews(a, b) {
			let aName = Number(a.views);
			let bName = Number(b.views);
			return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
		}
		photoArray.sort(SortByViews);

		// Replace original list with sorted list
		$('.results').remove();
		$.each(photoArray, (p, photo) => {
			let resultsClass = $("<div>").addClass('results').appendTo("#images");
			$("<img class='image'>>").attr("src", photo.url_q).appendTo(resultsClass);
			$("<div>").addClass('count').appendTo(resultsClass).text(photo.views);
		});
	});
        // Show next page
	$("#getMoreBtn").click(() => {
		$('#prevPageBtn').show();
		next = photos.page + 1;
		getImages(next);
    });
        // Show previous page
    $("#prevPageBtn").click(() => {
		previous = photos.page - 1;
		if (previous == 1) {
			$('#prevPageBtn').hide();
		}
		getImages(previous);
	});

	$('#btn-clear').click(() => {
		// Clear filter and results
		removeDiv();
		$('#search-text').val('');
		$('#getMoreBtn').hide();
		$('.title h4').text('Search Photos');
	});

    $('#search-text').keyup(_.debounce(searching, 400));

});