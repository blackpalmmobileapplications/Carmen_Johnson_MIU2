/* Carmen Johnson
   MiU Project 2
   9/6/2012
*/


var items = JSON.parse(jsonObject);

$(document).ready(function() {
	// Keep track of the page position
	var pageScroll = window.pageYOffset;
	
	// Make sure we don't have any empty items
	items = jQuery.grep(items, function(n) { return n; });
	
	function initializeList() {
		// Sort the items alphabetically
		items.sort(function(a, b) {
			if(b == null)
				return -1;
			else if(a == null)
				return 1;
			
			for(var i = 0; i < a.name.length && i < b.name.length; i++) {
				if(a.name[i] < b.name[i])
					return -1;
				else if(b.name[i] < a.name[i])
					return 1;
			}
			
			if(a.name.length < b.name.length)
				return -1;
			else if(b.name.length < a.name.length)
				return 1;
			else
				return 0;
		});
		
		// Add the items to the list
		$("#itemList").empty();
		for(var i = 0; i < items.length; i++) {
			var item = items[i];
			if(item == null)
				continue;
			
			var link = document.createElement("a");
			link.href = "#viewItem";
			link.name = item.idno;
			link.setAttribute("class", "item-link");
			var listItem = document.createElement("li");
			listItem.setAttribute("data-filtertext", item.name + " " + item.category);
			var image = document.createElement("img");
			image.src = "images/" + item.category + ".png";
			var text = document.createElement("h1");
			text.setAttribute("class", "item-text");
			text.innerHTML = item.name;
			
			link.appendChild(image);
			link.appendChild(text);
			listItem.appendChild(link);
			$("#itemList").append(listItem);
		}
		$("#itemList").listview('refresh');
	}
	
	initializeList();
	
	var makeTitleCase = function(arg) {
		if (arg.length >= 1)
			return (arg.substr(0,1).toUpperCase() + arg.substr(1, arg.length));
		else return arg;
	};
	
	// Show an item
	$("#itemList").on("click", ".item-link", function() {
		// Save the scroll position
		pageScroll = window.pageYOffset;
		
		// Get the item they clicked on
		var itemID = $(this).attr('name');
		var item;
		for(var i = 0; i < items.length; i++) {
			if(items[i].idno == itemID) {
				item = items[i];
				break;
			}
		}
		
		$("#itemView img").attr("src", "images/" + item.category + ".png");
		$("#itemView [name='category'] span").text(makeTitleCase(item.category));
		$("#itemView [name='name'] span").text(item.name);
		$("#itemView [name='quantity'] span").text(item.quantity);
		$("#itemView [name='date'] span").text(item.date);
		$("#itemView [name='comments'] span").text(item.comments);
		if(item.important) {
			$("#itemView [name='important']").css("display", "block");
			$("#itemView [name='comments']").removeClass('ui-corner-bottom ui-li-last');
		}
		else {
			$("#itemView [name='important']").css("display", "none");
			$("#itemView [name='comments']").addClass('ui-corner-bottom ui-li-last');
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
		
		initializeList();
	});
	
	$(document).bind("pagechange", function(e, data) {
		// Only worry about the 'viewItem' page
		// Scroll to where the user was
		if(data.toPage[0] == $("#viewItem")[0]) {
			$.mobile.silentScroll(pageScroll);
		}
	});
});