var regions = [["US-Fremont","US West"], ["US-Atlanta", "US East"], ["BR-Brazil", "South America"], ["EU-London", "Europe"], ["RU-Russia", "Russia"], ["JP-Tokyo", "East Asia"], ["CN-China", "China"], ["SG-Singapore", "Oceana"]];
var serverIPs = [];
var retryCount = 0;

$("body").ready(function ()
{
	createUI();
	
	//Get server info
	
	for(var i = 0; i < regions.length; i++)
	{
		for(var j = 0; j < retryCount; j++)
		{
			//grab ips
			$.ajax({
				type: "POST",
				url: "http://m.agar.io/",
				data: regions[i][0],
				tempJ: j,
				tempI: i,
				success: function(data)
				{
					if($.inArray(data.split("\n")[0], serverIPs) == -1)
					{
						serverIPs.push(data.split("\n")[0]);
						var serverListElement = $("#server");
						var listItem = $("#region").children()[1].cloneNode(true);
						
						$(serverListElement.children()[0]).text("-- Select Server --");
						addServer(serverListElement, listItem, "ws://" + data.split("\n")[0]);
					}
				},
				error: function(data)
				{
				}
			});
		}
	}
});

function addServer(list, toClone, server)
{
	var item = toClone.cloneNode();
	item.textContent = server;
	$(item).attr("value", server);
	list.append(item);
}


function regionChanged(data)
{
	if($("#region").val() === null) return;
	var value = $("#region").val() + $("#gamemode").val();
		$.ajax({
			type: "POST",
			url: "http://m.agar.io/",
			data: value,
			success: function(data)
			{
				console.log(data);
				$("#enterip").val("ws://" + data.split("\n")[0]);
				connect($("#enterip").val());
				$("#playBtn").removeAttr("disabled");
				$("#retryBtn").removeAttr("disabled");
			},
			error: function(data)
			{
			}
		});
}

function createUI()
{
	//modify region selection event
	var itemNode = $("#region").children()[1].cloneNode(true);
	var titleNode = $("#region").children()[0].cloneNode(true);
	var parent = $("#region").parent();
	$("#region").remove();
	
	var newRegion = $('<select id="region" class="form-control">');
	
	newRegion.append(titleNode);
	for(var i = 0; i < regions.length; i++)
	{
		var item = $(itemNode.cloneNode());
		item.text(regions[i][1]);
		item.val(regions[i][0]);
		newRegion.append(item);
	}
	
	newRegion.attr("onchange", "(" + regionChanged + ")()");
	
	parent.find("br").remove();
	parent.append(newRegion);
	
	//modify gamemode selection event
	/*var tempGamemode = $("#gamemode").clone();
	$("#gamemode").remove();
	
	var newGamemode = $('<select id="gamemode" class="form-control">');
	
	for(var i = 0; i < tempGamemode.children().length; i++)
	{
		newGamemode.append($(tempGamemode.children()[i]).clone());
	}
	
	newGamemode.attr("onchange", "(" + regionChanged + ")()");
	
	parent.append(newGamemode);
	
	parent.append("<br/>");
	parent.append("<br/>");*/
	
	/*
	//create selection dropdown
	var serverListElement = $('<select id="server" class="form-control">');
	var listItemTitle = newRegion.children()[0].cloneNode(true);
	listItemTitle.textContent = "-- Loading Server List --";
	//clear clones elements
	serverListElement.empty();
	//change functionality
	serverListElement.attr("onchange", "connect($('#server').val()); $('.needs-ip').removeAttr('disabled');$('#playBtn').removeAttr('disabled'); $('#enterip').val($('#server').val());");
	
	
	serverListElement.append(listItemTitle);
	
	$("#region").parent().append("</br>");
	$("#region").parent().append(serverListElement);
	*/
	
	//create a retry button for IP connecting
	var uiDiv = $("#playBtn").parent();
	var retryButton = uiDiv.find("#playBtn").next().clone(false);
	retryButton.attr("id", "retryBtn").text("Find New Session");
	
	retryButton.attr("onclick", "connect($('#enterip').val());");
	retryButton.attr("disabled", "");
	retryButton.attr("class", "btn btn-play btn-primary needs-ip");
	$("#playBtn").parent().append("</br>");
	$("#playBtn").parent().append(retryButton);
	$("#playBtn").parent().append("</br>");
	$("#playBtn").parent().append("</br>");
	
	
	//create a select server text area
	var typeIp = $("<input id='enterip' class='form-control' placeholder='IP'/>");
	typeIp.attr("onchange", "connect($('#enterip').val()); $('#playBtn').removeAttr('disabled');$('#retryBtn').removeAttr('disabled');");
	$("#nick").parent().append("</br>");
	$("#nick").parent().append(typeIp);
	
}

function fillList()
{
	var serverListElement = $("#server");
	var listItem = $("#region").children()[1].cloneNode(true);
	
	$(serverListElement.children()[0]).text("-- Select Server --");
	//Fill in title and options
	for(var i = 0; i < serverIPs.length; i++)
		addServer(serverListElement, listItem, "ws://" + serverIPs[i]);
}