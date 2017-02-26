var data = [];
var filtered = [];
var item_field = ['date', 'start', 'max', 'min', 'end'];
var openFile = function(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function() {
        var text = reader.result;
        //var node = document.getElementById('output');
        //node.innerText = text;
        ParseData(text);

        //$('pre').text(text.replace(/ /g, "\t"));
    };
    reader.readAsText(input.files[0]);
};

function ParseData(text) {
    data = [];
    var arr = text.split('\n');
    for(var i=0; i<arr.length; i++) {
        var entry = arr[i].split(/\t/);
        if(entry.length<item_field.length)
            break;
        var item = {};
        for(var j=0; j<item_field.length; j++) {
            if(j==0) {
                item[item_field[j]] = new Date(entry[j]);
            }
            else {
                item[item_field[j]] = parseFloat(entry[j]);
            }
        }
        data.push(item);
    }

    //ModifyDate();
    //ExtractData();
    //PrintData(data);
    data_arr = data.slice();

    //setYear();
    OutputFirstAndLast();
    $('#output').html(JSON.stringify(data));

    //Five_to_Thirty();
}
// function ExtractData() { // 刪掉不想要的年份
// 	var idx;
// 	for(idx=0; idx<data.length; idx++) {
// 		if(data[idx]['date'].indexOf('2004/01')!=-1) {
// 			break;
// 		}
// 	}
// 	data.splice(0,idx);
// }
// function ModifyDate() { // 補零
// 	for(var i=0; i<data.length; i++) {
// 		var dateArr = data[i]['date'].split('/');
// 		var year =  dateArr[0];
// 		var month = parseInt(dateArr[1]);
// 		var day = parseInt(dateArr[2]);
//
// 		var newStr = year + '/';
// 		newStr += month<10 ? '0'+month : month;
// 		newStr += '/';
// 		newStr += day<10? '0'+day : day;
//
// 		data[i]['date'] = newStr;
// 	}
// 	//PrintData(data);
// }

// function Five_to_Thirty() {
// 	for(var i=0; i<data.length; i++) {
// 		if((i+1)%6==0) {
// 			var item = {};
// 			item['date'] = data[i]['date'];
// 			item['time'] = data[i]['time'];
// 			item['start'] = data[i-5]['start'];
// 			item['end'] = data[i]['end'];
//
// 			var max = 0, min = 9999999;
// 			for(var j=i-5; j<=i; j++) {
// 				if(data[j]['max'] > max)  max = data[j]['max'];
// 				if(data[j]['min'] < min)  min = data[j]['min'];
// 			}
// 			item['max'] = max;
// 			item['min'] = min;
//
// 			filtered.push(item);
// 		}
// 	}
// 	PrintData(filtered);
// }
function PrintData(to_print) {
    for(var i=0; i<to_print.length; i++) {
        var txt = '';
        for(var j=0; j<item_field.length; j++) {
            if(j>0) txt += ' ';
            txt += to_print[i][item_field[j]];

        }
        $('#output').append((i+1)+' '+txt+'<br/>');
    }
}
function OutputFirstAndLast() {
    var str1 = "第一筆: " + JSON.stringify(data_arr[0]);
    var str2 = 	"最後一筆: " + JSON.stringify(data_arr[data_arr.length-1]);
    $('#first-and-last').html(str1+'<br>'+str2);
}