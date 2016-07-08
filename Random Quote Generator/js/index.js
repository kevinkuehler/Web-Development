$.getJSON("https://raw.githubusercontent.com/kevinkuehler/Web-Development/master/_assets/json/quotes.json", function(data) {
	/* 
		 gets one JSON object randomly
		 returns: JSON object (text,author)
	*/
	var jsonQuoteData; // holds current quote

	function getQuote() {
		return data[Math.floor(Math.random() * data.length)];
	}
	/* writes the code into HTML */
	function postNewQuote() {
		jsonQuoteData = getQuote();
		document.getElementById("quote").innerHTML = "<span id='custom-quotation-mark'><i class='fa fa-quote-left'> </i></span>" + jsonQuoteData.text;
		document.getElementById("author").innerHTML = "&#8212" + " " +
			jsonQuoteData.author;
	}

	/* on start */
	postNewQuote();

	/* buttons click */
	$("#quote-button").click(function() {
		postNewQuote();
	});

	$("#post-twitter").click(function() {
		centeredWindow("https://twitter.com/intent/tweet?text=" + jsonQuoteData.text + "%0A%E2%80%93" + jsonQuoteData.author, "Tweet this quote", '600', '320');
	});

	$("#post-facebook").click(function() {
		FB.ui({
			method: 'feed',
			name: "Random Quote Generator",
			link: 'http://codepen.io/kevinkuehler/full/bZREpr',
			description: jsonQuoteData.text,
			caption: "—" + jsonQuoteData.author,
		}, function(response) {});
	});
});

function centeredWindow(url, title, w, h) {
	var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }
}