document.addEventListener('DOMContentLoaded',init,false);


function init(){
    renderVillagersPie(villagers);
    renderVillagersColumn(villagers);
    lineChart(switches);
    areaChart(games);
}

function renderVillagersPie(data){

    var gender_cnt = [['male',0],['female',0]];
    var hobbies_cnt = {};


    for (datum of data){
        /* count the number for males and females */
        let d = datum['Personality'];
        if (d.includes('♂')){
            let cnt = gender_cnt[0][1];
            gender_cnt[0] = ['male', cnt+1];
        } else {
            let cnt = gender_cnt[1][1];
            gender_cnt[1] = ['female', cnt+1];
        }

        /* count the number of hobbies for villagers */
        let hobby = datum['Hobbies'];
        if (!(hobby in hobbies_cnt)){
            hobbies_cnt[hobby] = 1;
        } else {
            hobbies_cnt[hobby] = Number(hobbies_cnt[hobby]) + 1;
        }
    }

    /* change the hobbies object into list */
    hobbies_list = []
    for(var hobby in hobbies_cnt){
        hobbies_list.push([hobby, hobbies_cnt[hobby]]);
    }

    
    Highcharts.chart('villagers_flex_item1',{
        chart: {
            type: 'pie',
            backgroundColor: 'white',
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.9)'
        },
        title: {
            text: 'Total Numbers of Villagers in Gender',
        },
        series: [{
            data: [{
                name:'Male',
                y:gender_cnt[0][1],
                color: '#4BB3B3'
            }, {
                name: 'Female',
                y:gender_cnt[1][1],
                color: '#F5E37D'
            }]
        }],
        legend: {
            enabled: true
        },
        plotOptions:{
            pie: {
                dataLabels: {
                    formatter: function(){
                        return (this.percentage).toFixed(2)+'%'
                    },
                    distance: -45,
                    style: {
                        textOutline: '0px',
                        fontSize: '13px'
                    }
                },
                showInLegend: true,
                tooltip: {
                    pointFormat: '{point.y}'
                },
                startAngle: 180
            }
        },
        credits: {
            enabled: false
        }
    });

    Highcharts.chart('villagers_flex_item2',{
        chart: {
            type: 'pie',
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.9)'
        },
        title: {
            text: 'Hobbies of Villagers'
        },
        legend: {
            enabled: true
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    formatter: function(){
                        return this.point.name
                    },
                    distance: -27,
                    style: {
                        textOutline: '0px',
                    }
                },
                tooltip: {
                    pointFormat: '{point.y}'
                },
                colors: ['#91C9E2','#A7E8BD','#D2D2BB','#FCBCB8','#F7C08D','#FFD972'],
                showInLegend: true,
                startAngle: 270
            }
        },
        series: [{
            type: 'pie',
            name: 'hobbies',
            data: hobbies_list
        }],
        credits: {
            enabled: false
        }
    })
}


function renderVillagersColumn(data){
    
    /* get the villagers species and their count */
    var villager_cnt = new Object();
    for (datum of data){
        let species = datum['Species'];
        if (!(species in villager_cnt)){
            villager_cnt[species] = 1;
        } else {
            villager_cnt[species] = Number(villager_cnt[species]) + 1;
        }
    }
    
    /* sort the count*/
    var sortable = [];
    for (var s in villager_cnt){
        sortable.push([s,villager_cnt[s]])
    };
    sortable.sort(function(a, b){
        return b[1] - a[1]
    });

    /* get the categories list */
    let cat = [];
    for (var i = 0; i < sortable.length; i++){
        cat.push(sortable[i][0])
    }

    /* draw the column chart for villagers */
    Highcharts.chart('villagers_column',{
        chart: {
            type: 'column',
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.9)'
        },
        title: {
            text: 'Species Counts of the Villagers'
        },
        xAxis: {
            categories: cat,
            title :{
                text: 'Species',
                style: {
                    fontWeight: 'bold'
                }
            }
        },
        yAxis: {
            title: {
                text: 'Counts',
                style: {
                    fontWeight: 'bold'
                }
            }
        },
        plotOptions: {
            column: {
                color: '#4BB3B3',
                pointWidth: 20,
                events: {
                    click: function(event){
                        drawVillagersTable(event.point.category, data)
                    }
                }
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            formatter: function(){
                return this.x + ': ' + this.y;
            }
        },
        series: [{
            data: sortable
        }],
        credits: {
            enabled: false
        }
    })

}

function drawVillagersTable(category,data){
    
    /* display the selected species title */
    document.getElementById('villagers_table_title').innerHTML = category;

    /* get the images list for selected species */
    images = [];
    names = [];
    for (datum of data){
        if (datum['Species'] == category){
            images.push(datum['Image']);
            names.push(datum['Name']);
        }
    }
    
    /* get the table element */
    var table = document.getElementById('villagers_table');

    /* remove the table if already existed */
    while (table.hasChildNodes()){
        table.removeChild(table.firstChild);
    }

    /* add images into table */
    let row_num = Math.ceil(images.length / 6);
    let index = 0;
    for(var i = 0; i < row_num; i++){
        var row = table.insertRow(i);
        for (var j = 0; j < 6; j++){
            if (index < images.length){
                var cell = row.insertCell(-1);
                cell.outerHTML = "<td><img src='" + images[index] + "' title='" + names[index] + "'></td>";
            }
            index += 1;
        }
    }
}

var buttonNorth = document.getElementById('northButton');
var buttonSouth = document.getElementById('southButton');
buttonNorth.addEventListener('click', function(){
   renderFishTimeLine(fishNorth,true);
   renderBugTimeLine(bugNorth, true);
});
buttonSouth.addEventListener('click', function(){
   renderFishTimeLine(fishSouth, false);
   renderBugTimeLine(bugSouth, false);
});


function renderFishTimeLine(data,north){
    let preimages = Object.values(fishImages);
    $(preimages).each(function(){
        var preimg = $('<img />').attr('src', this);
    });

    if (north){
        var timeline_title = 'Available Types of Fish in Each Month (North)';
        var timeline_data = [{
            name:'Jan',
            label: '31 types'
        },{
            name:'Feb',
            label: '31 types'
        },{
            name:'Mar',
            label: '35 types'
        },{
            name:'Apr',
            label: '39 types'
        },{
            name:'May',
            label: '44 types'
        },{
            name:'Jun',
            label: '55 types'
        },{
            name:'Jul',
            label: '58 types'
        },{
            name:'Aug',
            label: '60 types'
        },{
            name:'Sep',
            label: '63 types'
        },{
            name:'Oct',
            label: '42 types'
        },{
            name:'Nov',
            label: '37 types'
        },{
            name:'Dec',
            label: '32 types'
        }];
    } else {
        var timeline_title = 'Available Types of Fish in Each Month (South)';
        var timeline_data = [{
            name:'Jan',
            label: '58 types'
        },{
            name:'Feb',
            label: '60 types'
        },{
            name:'Mar',
            label: '63 types'
        },{
            name:'Apr',
            label: '42 types'
        },{
            name:'May',
            label: '37 types'
        },{
            name:'Jun',
            label: '32 types'
        },{
            name:'Jul',
            label: '31 types'
        },{
            name:'Aug',
            label: '31 types'
        },{
            name:'Sep',
            label: '35 types'
        },{
            name:'Oct',
            label: '39 types'
        },{
            name:'Nov',
            label: '44 types'
        },{
            name:'Dec',
            label: '55 types'
        }];
    }


    Highcharts.chart('collects_fish_time',{
        chart: {
            type:'timeline',
            inverted: true,
            height: 550,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.9)'
        },
        title: {
            text: timeline_title,
            style: {
                color: '#665d4a',
                fontWeight: 'normal'
            }
        },
        subtitle: {
            text: '80 types of fish in total'
        },
        xAxis: {
            visible: false
        },
        yAxis: {
            visible: false
        },
        plotOptions:{
            timeline: {
                marker: {
                    width: 25,
                    height: 25
                }
            }
        },
        series: [{
            data: timeline_data
        }],
        tooltip: {
            useHTML: true,
            formatter: function(){
                return drawCollectsTooltip(this.point.name,data)
            },
        },
        credits: {
            enabled: false
        }
    })
}

function renderBugTimeLine(data,north){
    let preimages = Object.values(bugImages);
    $(preimages).each(function(){
        var preimg = $('<img />').attr('src', this);
    });

    if (north){
        var timeline_title = 'Available Types of Bug in Each Month (North)';
        var timeline_data = [{
            name:'Jan',
            label: '20 types'
        },{
            name:'Feb',
            label: '21 types'
        },{
            name:'Mar',
            label: '27 types'
        },{
            name:'Apr',
            label: '36 types'
        },{
            name:'May',
            label: '43 types'
        },{
            name:'Jun',
            label: '48 types'
        },{
            name:'Jul',
            label: '61 types'
        },{
            name:'Aug',
            label: '63 types'
        },{
            name:'Sep',
            label: '51 types'
        },{
            name:'Oct',
            label: '34 types'
        },{
            name:'Nov',
            label: '27 types'
        },{
            name:'Dec',
            label: '20 types'
        }];
    } else {
        var timeline_title = 'Available Types of Bug in Each Month (South)';
        var timeline_data = [{
            name:'Jan',
            label: '61 types'
        },{
            name:'Feb',
            label: '63 types'
        },{
            name:'Mar',
            label: '51 types'
        },{
            name:'Apr',
            label: '34 types'
        },{
            name:'May',
            label: '27 types'
        },{
            name:'Jun',
            label: '20 types'
        },{
            name:'Jul',
            label: '20 types'
        },{
            name:'Aug',
            label: '21 types'
        },{
            name:'Sep',
            label: '27 types'
        },{
            name:'Oct',
            label: '36 types'
        },{
            name:'Nov',
            label: '43 types'
        },{
            name:'Dec',
            label: '48 types'
        }];
    }


    Highcharts.chart('collects_bug_time',{
        chart: {
            type:'timeline',
            inverted: true,
            height: 550,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.9)'
        },
        title: {
            text: timeline_title,
            style: {
                color: '#665d4a',
                fontWeight: 'normal'
            }
        },
        subtitle: {
            text: '80 types of bugs in total'
        },
        xAxis: {
            visible: false
        },
        yAxis: {
            visible: false
        },
        plotOptions:{
            timeline: {
                marker: {
                    width: 25,
                    height: 25
                }
            }
        },
        series: [{
            data: timeline_data
        }],
        tooltip: {
            useHTML: true,
            formatter: function(){
                return drawCollectsTooltip(this.point.name,data)
            },
        },
        credits: {
            enabled: false
        }
    })
}

/* draw the images on tooltips */
function drawCollectsTooltip(name,data){

    let images = '';
    let cnt = 0;
    let total = 0;
    /* store the images into html text */
    for (datum of data){
        if (Number(datum[name]) == 1){
            total += 1;
            cnt += 1;
            /* 6 images in one row */
            if (cnt == 6){
                images+='<td><img src="'+datum['Image']+'" height=35 /></td></tr><tr>';
                cnt = 0;
            } else{
                images+='<td><img src="'+datum['Image']+'" height=35 /></td>';
            }
        }
    }
    
    let result = '<p style="font-size:13px;font-weight:bold">'+name+': '+total+' in total</p><table><tr>'+images+'</tr></table>'

    return result;
}


function lineChart(switches){
	
	newData = extractData(switches);
	
	var chart = Highcharts.chart('line',{
        chart:{
            type:"line"
        },
        title:{
            text:"Interest Over Times of Searching: 'Switch'"
		},

		xAxis:{
            type:'datetime',
            title:{
                text:"Date"
            },
            labels:{
                align:'center',
                format:'{value:%b/%d/%y}',
			},
            
		},
		yAxis: {
            tickInterval:10,
		},
		legend:{
            layout: 'vertical',
            align: 'right',
            verticalAlign:'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true,
		},
		tooltip: {
			useHTML: true,
			formatter: function() {
				if((this.x >= Date.parse('2017-03-05'))&&(this.x <= Date.parse('2017-04-02'))){
					var game1 = 'The Legend of Zelda: Breath of the Wild';
					var game2 = 'Mario Kart 8 Deluxe'
					var img1 = '<img src = "https://gamespot1.cbsistatic.com/uploads/scale_medium/1197/11970954/3181241-ig-lozbreathofthewildrelease-20170112.jpg" height="82" width="122"/>'
					var img2 = '<img src = "https://cdn-cf.gamivo.com/image_cover.jpg?f=40001&n=7867014690560508.jpg&h=3fff81d693cb92d00132bf33cb8bc79d" height="82" width="122"/>'
					var time = convertTime(this.x)
					
					return img1+img2+'<br/>'+game1+'<br/>'+game2+'<br/>'+'Interest over time: '+this.y+'<br/>'+time;
				}else if((this.x >= Date.parse('2017-10-15'))&&(this.x <= Date.parse('2018-01-21'))){
					var img1 = '<img src = "https://upload.wikimedia.org/wikipedia/en/8/8d/Super_Mario_Odyssey.jpg" height="82" width="122"/>'
					var game = 'Super Mario Odyssey';
					var time = convertTime(this.x)
					return img1+'<br/>'+game+'<br/>'+'Interest over time: '+this.y+'<br/>'+time;
				}else if((this.x >= Date.parse('2018-10-28'))&&(this.x <= Date.parse('2019-01-27'))){
					var img1 = '<img src = "https://i.ytimg.com/vi/RWJU1bRu-OY/maxresdefault.jpg" height="82" width="122"/>'
					var img2 = '<img src = "https://upload.wikimedia.org/wikipedia/en/6/6c/Super_Mario_Party.jpg" height="82" width="122"/>'
					var game1 = "Pokémon: Let's Go, Pikachu! and Let's Go, Eevee!";
					var game2 = "Super Mario Party";
					var time = convertTime(this.x);
					return img1+img2+'<br/>'+game1+'<br/>'+game2+'<br/>'+'Interest over time: '+this.y+'<br/>'+time;
                }else if((this.x >= Date.parse('2019-08-18'))&&(this.x <= Date.parse('2019-10-06'))){
                    var img = '<img src = "https://upload.wikimedia.org/wikipedia/en/3/38/Luigi%27s_Mansion_3.jpg" height="82" width="122"/>'
					var game = "Luigi's Mansion 3"
					var time = convertTime(this.x);
					return img+'<br/>'+game+'<br/>'+'Interest over time: '+this.y+'<br/>'+time;
                }else if((this.x >= Date.parse('2019-10-27'))&&(this.x <= Date.parse('2020-01-19'))){
                    var img = '<img src = "https://pokemonletsgo.pokemon.com/assets/icons/share_icon-fb_en-us.jpg" height="82" width="122"/>'
					var game = 'Pokémon Sword and Shield';
					var time = convertTime(this.x);
					return img+'<br/>'+game+'<br/>'+'Interest over time: '+this.y+'<br/>'+time;
                }else if((this.x >= Date.parse('2020-03-08'))&&(this.x <= Date.parse('2020-05-31'))){
                    var img = '<img src = "https://i2.wp.com/jsuchanticleer.com/wp-content/uploads/2019/10/animal-crossing.jpg?fit=354%2C198&ssl=1" height="82" width="122"/>'
					var game = "Animal Crossing: New Horizons";
					var time = convertTime(this.x);
					return img+'<br/>'+game+'<br/>'+'Interest over time: '+this.y+'<br/>'+time;
                }
				else{
					var time = convertTime(this.x);
					return 'Interest over time: '+this.y+'<br/>'+time;
				}

			}
		  },
		series:[{
			data: newData,
			name: "Switch"
        }],
        credits:{
            enabled: false,
        }
	});
	
}


function areaChart(games){
	var animal = [];
	var pokemon = [];
	var mario = [];
	for(var i = 0;i < games.length;i++){
        animal.push([games[i].Week, games[i]["animal crossing: (Worldwide)"]]);
        pokemon.push([games[i].Week, games[i]["pokemon: (Worldwide)"]]);
        mario.push([games[i].Week, games[i]["mario: (Worldwide)"]]);
	}
	var xAxis = getDate(games)
	
	Highcharts.chart('container',{
		chart: {
			type: 'area'
		},
		title:{
			text: "Interest Over Times of Seaching among Three Games"
		},
		xAxis:{
			categories: xAxis,
			label:{
                align:'left'
            },
            tickmarkPlacement:'on',
            title: {
                text: 'Month'
            },
            lineWidth:1.5,
			lineColor: '#000000',
			labels:{
                format:'{value:%b/%d/%y}',
			},
			plotLines: [{
				value: 10.5,
            	color: 'darkblue',
				width: 2, 
				zIndex: 5,
				label:{
					formatter: function () {
						return 'Switch Released: 03/20/2020';
					}
				}
			  }]
		},
		yAxis: {
            tickInterval:10,
		},
		plotOptions: {
			area: {
				stacking: 'percent',
				lineColor: '#ffffff',
				lineWidth: 1,
				marker: {
					lineWidth: 1,
					lineColor: '#ffffff'
				},
			},
			series: {
				marker: {
					enabled: false
				}
			}
		},
		series:[{
				name:'Animal Crossing',
				data: animal,
				color: "rgba(245, 227, 125, 0.8)"
			},{
				name:'Pokemon',
				data: pokemon,
				color: "rgba(75,185,130,0.8)"
				
			},{
				name: 'Mario',
				data: mario,
				color: "rgba(97,181,223,0.8)"
            }],
        credits:{
            enabled: false
        }
	})
}
function getDate(games){
    let date = [];
    for(var i = 0;i < games.length;i++){
		date.push(convertTime(Date.parse(games[i].Week)));
		 
    }
    return date;
}
function convertTime(unixTime){
	
	var date = new Date(unixTime)
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  	var year = date.getFullYear();
  	var month = months[date.getMonth()];
	var day = date.getDate();
	var time = month + ' ' + day + ' ' + year;  
	return time;
}
function extractData(data){
    let searchSwitch = [];
    for(var i = 0;i < data.length;i++){
        //date single
		let dateS = Date.parse(data[i].Week);
		let search = data[i]['switch: (Worldwide)'];
        
        searchSwitch.push([dateS,search]);
    }
    return searchSwitch;
}