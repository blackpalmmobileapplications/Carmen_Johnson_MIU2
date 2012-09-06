/* Carmen Johnson
   MiU Project 2
   9/6/2012
*/


var items = JSON.parse(jsonObject);

$(document).ready(function() {
	var makeTitleCase = function(arg) {
		if (arg.length >= 1)
			return (arg.substr(0,1).toUpperCase() + arg.substr(1, arg.length));
		else return arg;
	};
	
	// Keep track of the page position
	var pageScroll = window.pageYOffset;
	
	// Keep track of the current 'page' in the items
	var page = 0;
	var pageLength = 9;
	
	// Keep track of the row heights
	var rowHeight = 0;
	
	// Make sure we don't have any empty items
	items = jQuery.grep(items, function(n) { return n; });
	
	function initializeList() {
		// Enable/disable the previous button
		if(page > 0) {
			$("#prevPage").removeClass("ui-disabled");
		}
		else {
			$("#prevPage").addClass("ui-disabled");
		}
		// Enable/disable the next button
		if(items.length - (page * pageLength) > pageLength) {
			$("#nextPage").removeClass("ui-disabled");
		}
		else {
			$("#nextPage").addClass("ui-disabled");
		}
		
		// Sort the items by date to do a News Stream
		items.sort(function(a, b) {
			if(b == null)
				return -1;
			else if(a == null)
				return 1;
			
			a = a.date.split("-");
			b = b.date.split("-");
			var aDate = new Date(a[2], a[1], a[0], 0, 0, 0, 0);
			var bDate = new Date(b[2], b[1], b[0], 0, 0, 0, 0);
			
			if(aDate > bDate)
				return -1;
			else if(bDate > aDate)
				return 1;
			else
				return 0;
		});
		
		// Add the items to the list
		$("#itemList").empty();
		for(var i = page * pageLength; i < (page * pageLength) + pageLength; i++) {
			var item = items[i];
			if(item == null)
				continue;
			
			var link = document.createElement("a");
			link.name = item.idno;
			link.setAttribute("class", "item-link");
			var listItem = document.createElement("li");
			listItem.setAttribute("data-filtertext", item.name + " " + item.category);
			var image = document.createElement("img");
			image.src = "images/" + item.category + ".png";
			
			var infoContainer = document.createElement("div");
			infoContainer.setAttribute("class", "info-container");
			var infoList = document.createElement("ul");
			
			var category = document.createElement("li");
			category.innerHTML = "<label>Category:</label><p>" + makeTitleCase(item.category) + "</p>";
			infoList.appendChild(category);
			
			var name = document.createElement("li");
			name.innerHTML = "<label>Name:</label><p>" + item.name + "</p>";
			infoList.appendChild(name);
			
			var quantity = document.createElement("li");
			quantity.innerHTML = "<label>Quantity:</label><p>" + item.quantity + "</p>";
			infoList.appendChild(quantity);
			
			var date = document.createElement("li");
			date.innerHTML = "<label>Date:</label><p>" + item.date + "</p>";
			infoList.appendChild(date);
			
			var comments = document.createElement("li");
			comments.innerHTML = "<label>Comments:</label><p>" + item.comments + "</p>";
			infoList.appendChild(comments);
			
			if(item.important) {
				var important = document.createElement("li");
				important.innerHTML = "Important";
				infoList.appendChild(important);
			}
			
			infoContainer.appendChild(infoList);
			link.appendChild(image);
			link.appendChild(infoContainer);
			listItem.appendChild(link);
			$("#itemList").append(listItem);
		}
		$("#itemList").listview('refresh');
	}
	
	initializeList();
	
	// Show an item
	$("#itemList").on("click", ".item-link", function(e) {
		if($(this).children("img").css("display") !== "none") {
			$(this).children("img").css('display', 'none');
			$(this).children(".info-container").css("display", "block");
			
			$(this).css("height", "auto");
			if($(this).height() > rowHeight) {
				rowHeight = $(this).height();
			}
			
			$(".item-link").css("height", rowHeight);
		}
		else {
			$(this).children("img").css('display', 'inline');
			$(this).children(".info-container").css("display", "none");
			
			if($("#itemList img:visible").length == $("#itemList img").length) {
				$(".item-link").css("height", "auto");
				rowHeight = 0;
			}
		}
	});
	
	// Add a new item
	$("#save").click(function() {
		var newID = items[items.length-1].idno + 1;
		var today = new Date();
		
		items.push({
			category: $("#category").val(),
			name: $("#itemName").val(),
			quantity: $("#quantity").val(),
			idno: newID,
			date: (today.getDate()) + "-" + (today.getMonth() + 1) + "-" + (today.getFullYear()),
			comments: $("#comments").val(),
			important: $("#important").is(":checked")
		});
		
		page = 0;
		initializeList();
	});
	
	// Go to the previous page
	$("#prevPage").click(function() {
		if(page > 0) {
			page--;
			initializeList();
		}
	});
	
	// Go to the next page
	$("#nextPage").click(function() {
		if((page + 1) * pageLength < items.length) {
			page++;
			initializeList();
		}
	});
});