var dataStartYear, dataEndYear;
$(document).ready(function() {
	setYear();
	/** listener for radio */
	 $('input:radio[name=optradio]').change(function() {
		changeData(this.value);
	});
	
	/** 年份選擇 */
	$('#startYear').change(function(){
		changeYear();
	});
});
function changeData(type) {
	switch(type) {
		case "0":
			data_arr = data_arr_m.slice();  
			$('#minUnit').val(0.1);
			$('#unitCost').val(0.3);
			$('#networth-rate').val(100);
			$('#fix-point').val(1);
			break;
		case "1":
			data_arr = data_arr_sh.slice();
			$('#minUnit').val(1);
			$('#unitCost').val(3);
			$('#networth-rate').val(10);
			$('#fix-point').val(0);
			break;
		case "2":
			data_arr = data_arr_oil.slice();
			$('#minUnit').val(0.01);
			$('#unitCost').val(0.03);
			$('#networth-rate').val(1000);
			$('#fix-point').val(2);
			break;
		case "3":
			data_arr = data_arr_euro.slice();
			$('#minUnit').val(1);
			$('#unitCost').val(3);
			$('#networth-rate').val(10);
			$('#fix-point').val(0);
			break;
	}
	setYear();
	OutputFirstAndLast();
	clear_test();
	$('#input-file').val('');
}

/** 設定可選擇年份 */
function setYear() {
	dataStartYear =  getYear(0);
	dataEndYear = getYear(data_arr.length-1);
	$('#startYear option').remove();
	$('#endYear option').remove();
	for(var i=dataStartYear; i<=dataEndYear; i++) {
		$('#startYear').append('<option>'+i+'</option>');
		$('#endYear').append('<option>'+i+'</option>');
	}
	$('#startYear').val("2005");
	changeYear();
}
function changeYear() {
	var startYear = parseInt($('#startYear').val());
	$('#endYear option').remove();
	for(var i=startYear; i<=dataEndYear; i++) {
		$('#endYear').append('<option>'+i+'</option>');
	}
	$('#endYear option').last().attr('selected', true);
}
		

function run_init() {
	$('tbody').html('');
	$('.line-chart').html('');
	$('.deal-line-chart').html('');
	networthData = [];
	dealNetworthData = [];
}
		
function getMonth(idx) {
	var d = new Date(data_arr[idx]['date']);
	return d.getMonth()+1;
}
function getYear(idx) {
	var d = new Date(data_arr[idx]['date']);
	return d.getFullYear();
}
function getDay(idx) {
	var d = new Date(data_arr[idx]['date']);
	return d.getDay()%7;
}
function dateFormat(d) {
	var d = new Date(d);
	var year = d.getFullYear().toString();
	var month = (d.getMonth()+1).toString();
	var date = d.getDate().toString();
	month = month.length>1 ? month : "0"+month;
	date = date.length>1? date : "0"+date;
	return year+'/'+month+'/'+date;
}
// 算兩個日期差幾天
function dateDiff(date1, date2) {
	var d1 = new Date(date1);
	var d2 = new Date(date2);
	return (d2 - d1)/(24*60*60*1000);
}

var networthData = []; // for line chart
var dealNetworthData = [];
/**輸出淨值 */
function outputNetworth(hasChanged, i, networth, networthRate, MDD1, dealCnt) {
	
	var money = parseFloat( (networth*networthRate).toFixed(0) );
	
	var str = '<td>'+dateFormat(data_arr[i]['date'])+'</td>'+
			  '<td>'+money+'</td>'+
			  '<td>'+MDD1.toFixed(0)+'</td>';
	$('#networth-table tbody').append('<tr>' + str + '</tr>');
	
	networthData.push({"date": dateFormat(data_arr[i]['date']), "networth": money});
	
	if(hasChanged) {
		str = '<td>'+dealCnt+'</td>'+
		  '<td>'+(networth*networthRate).toFixed(0)+'</td>';
		$('#deal-networth-table tbody').append('<tr>' + str + '</tr>');
		
		dealNetworthData.push({"no": dealCnt, "networth":money});
	}
}

/** 輸出月獲利 */
function outputMonth(curYear,curMonth, networth, networthRate, lastMonthNet) {
	var str =  '<td>'+curYear+'/'+curMonth+'</td>'+
			   '<td>'+((networth-lastMonthNet)*networthRate).toFixed(0)+'</td>';
	$('#monthly-table tbody').append('<tr>' + str + '</tr>');
}

		
/** 輸出年獲利 */
function outputYear(curYear, networth, networthRate, lastYearNet) {
	var str =  '<td>'+curYear+'</td>'+
		       '<td>'+((networth-lastYearNet)*networthRate).toFixed(0)+'</td>';
	$('#annual-table tbody').append('<tr>' + str + '</tr>');
}

function outputStatistics(isEnter, isClear, i, networth, networthRate, networth_arr, MDD1,
													dealCnt, curMonth, curYear, netStats ) {
	outputNetworth(isEnter||isClear, i, networth, networthRate, MDD1, dealCnt);

	if(curMonth != getMonth(i-1)) { // i-1 為月底
		netStats.lastMonthNet = networth_arr[i-1];
	}
	if(i==data_arr.length-1 || curMonth != getMonth(i+1)) { // i為月底
		outputMonth(curYear, curMonth, networth, networthRate, netStats.lastMonthNet);
	}

	if(curYear != getYear(i-1)) { // i-1 為年底
		netStats.lastYearNet = networth_arr[i-1];
	}
	if(i==data_arr.length-1 || curYear != getYear(i+1)) { // i為年底
		outputYear(curYear, networth, networthRate, netStats.lastYearNet);
	}
}