/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7114814814814815, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.77, 500, 1500, "PUT Activity"], "isController": false}, {"data": [0.83, 500, 1500, "GET all Activity"], "isController": false}, {"data": [0.97, 500, 1500, "DELETE User"], "isController": false}, {"data": [0.86, 500, 1500, "GET Activitiy"], "isController": false}, {"data": [0.89, 500, 1500, "DELETE CoverPhoto"], "isController": false}, {"data": [0.7, 500, 1500, "GET Book"], "isController": false}, {"data": [0.56, 500, 1500, "GET all Author"], "isController": false}, {"data": [0.92, 500, 1500, "GET all User"], "isController": false}, {"data": [0.02, 500, 1500, "PUT Book"], "isController": false}, {"data": [0.39, 500, 1500, "PUT Author"], "isController": false}, {"data": [0.98, 500, 1500, "GET User"], "isController": false}, {"data": [0.81, 500, 1500, "POST Activity"], "isController": false}, {"data": [0.77, 500, 1500, "POST CoverPhoto"], "isController": false}, {"data": [0.81, 500, 1500, "GET Author"], "isController": false}, {"data": [0.94, 500, 1500, "GET CoverPhoto"], "isController": false}, {"data": [0.72, 500, 1500, "DELETE Author"], "isController": false}, {"data": [0.85, 500, 1500, "GET Author for Book"], "isController": false}, {"data": [0.77, 500, 1500, "GET all CoverPhoto"], "isController": false}, {"data": [0.0, 500, 1500, "GET all Book"], "isController": false}, {"data": [0.81, 500, 1500, "DELETE Activity"], "isController": false}, {"data": [0.44, 500, 1500, "POST Author"], "isController": false}, {"data": [0.82, 500, 1500, "DELETE Book"], "isController": false}, {"data": [0.95, 500, 1500, "POST User"], "isController": false}, {"data": [0.91, 500, 1500, "PUT User"], "isController": false}, {"data": [0.0, 500, 1500, "POST Book"], "isController": false}, {"data": [0.87, 500, 1500, "GET CoverPhotos for Book"], "isController": false}, {"data": [0.85, 500, 1500, "PUT CoverPhoto"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1350, 0, 0.0, 1396.279259259259, 47, 20981, 354.5, 4034.6000000000085, 8240.800000000003, 14118.510000000002, 27.61922297919352, 2951.335244781757, 15.241359722477956], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["PUT Activity", 50, 0, 0.0, 533.4200000000001, 50, 2047, 243.0, 1483.1999999999996, 1805.3499999999985, 2047.0, 8.773469029654326, 26.616854382347782, 2.962588008861204], "isController": false}, {"data": ["GET all Activity", 50, 0, 0.0, 607.04, 210, 2661, 276.5, 2351.5999999999985, 2570.6999999999994, 2661.0, 14.025245441795231, 42.55785413744741, 2.355802945301543], "isController": false}, {"data": ["DELETE User", 50, 0, 0.0, 272.5400000000001, 49, 1645, 258.0, 435.8999999999999, 842.6999999999964, 1645.0, 1.6471750947125678, 0.3394081493987811, 0.4103460611925548], "isController": false}, {"data": ["GET Activitiy", 50, 0, 0.0, 409.71999999999997, 52, 1592, 147.0, 1401.4999999999998, 1497.7999999999993, 1592.0, 9.238728750923872, 3.181948101441242, 1.57563631744272], "isController": false}, {"data": ["DELETE CoverPhoto", 50, 0, 0.0, 415.54, 52, 2394, 266.5, 982.9, 1450.6999999999996, 2394.0, 1.5525539512498059, 0.31991101925166904, 0.3969625737463127], "isController": false}, {"data": ["GET Book", 50, 0, 0.0, 775.9000000000002, 238, 2464, 437.0, 2049.6, 2362.6499999999996, 2464.0, 1.3144404427035412, 6.310957175530376, 0.21798659763663608], "isController": false}, {"data": ["GET all Author", 50, 0, 0.0, 917.08, 136, 2621, 782.0, 1782.0999999999997, 2585.6499999999996, 2621.0, 7.141836880445651, 331.0870489483645, 1.1786820632766748], "isController": false}, {"data": ["GET all User", 50, 0, 0.0, 326.8400000000001, 50, 1507, 218.0, 804.8, 1376.1999999999996, 1507.0, 1.6165535079211122, 1.2376737795021016, 0.26363714435822827], "isController": false}, {"data": ["PUT Book", 50, 0, 0.0, 7447.960000000001, 1159, 14799, 7661.5, 10258.2, 11865.799999999997, 14799.0, 1.282676175572715, 1138.7071235425592, 5.821195341961468], "isController": false}, {"data": ["PUT Author", 50, 0, 0.0, 1101.0199999999998, 444, 2510, 1000.5, 1817.8, 2323.249999999999, 2510.0, 4.394445420987871, 197.026162056161, 1.381503779223062], "isController": false}, {"data": ["GET User", 50, 0, 0.0, 277.3999999999999, 59, 1477, 255.5, 400.3, 737.9499999999972, 1477.0, 1.6592002654720426, 0.5027830491952878, 0.273994887589182], "isController": false}, {"data": ["POST Activity", 50, 0, 0.0, 478.72, 49, 1828, 148.5, 1423.4, 1639.6499999999987, 1828.0, 13.535462912831619, 41.07167027612344, 4.562138349350298], "isController": false}, {"data": ["POST CoverPhoto", 50, 0, 0.0, 631.3599999999999, 66, 3510, 296.5, 1843.8, 2555.4999999999955, 3510.0, 1.5245761678253444, 30.877133930204902, 0.5190705421392853], "isController": false}, {"data": ["GET Author", 50, 0, 0.0, 547.6399999999999, 101, 1462, 343.5, 1364.5999999999997, 1421.8, 1462.0, 4.967709885742672, 1.61518489195231, 0.8335467896174864], "isController": false}, {"data": ["GET CoverPhoto", 50, 0, 0.0, 356.47999999999996, 62, 1435, 289.5, 839.0999999999999, 1232.7999999999993, 1435.0, 1.590583744234134, 0.5580712183871481, 0.2731019862414506], "isController": false}, {"data": ["DELETE Author", 50, 0, 0.0, 587.1000000000003, 117, 1453, 586.5, 1010.5999999999999, 1142.7999999999997, 1453.0, 5.14562107646393, 1.0602793429041886, 1.2955508065761037], "isController": false}, {"data": ["GET Author for Book", 50, 0, 0.0, 430.43999999999994, 59, 1283, 370.5, 1060.0, 1143.8499999999995, 1283.0, 8.257638315441783, 3.877219240297275, 1.4017018476465732], "isController": false}, {"data": ["GET all CoverPhoto", 50, 0, 0.0, 640.36, 61, 2664, 318.0, 2202.7, 2367.6499999999996, 2664.0, 1.5054346189744978, 30.489461487218858, 0.25433612215096496], "isController": false}, {"data": ["GET all Book", 50, 0, 0.0, 9335.18, 2428, 20981, 7481.5, 17845.5, 18997.249999999996, 20981.0, 1.6136319628219196, 1436.308370614955, 0.2631606814367779], "isController": false}, {"data": ["DELETE Activity", 50, 0, 0.0, 409.36000000000007, 47, 1580, 126.5, 1195.7999999999997, 1250.7499999999998, 1580.0, 11.876484560570072, 2.447205314726841, 3.022936460807601], "isController": false}, {"data": ["POST Author", 50, 0, 0.0, 1149.7199999999998, 130, 2322, 1190.5, 2020.0, 2109.1, 2322.0, 5.957345406886692, 272.5433164169546, 1.8680699317883949], "isController": false}, {"data": ["DELETE Book", 50, 0, 0.0, 613.5000000000001, 81, 2467, 346.0, 1428.1999999999998, 2364.0499999999993, 2467.0, 1.3160665403242788, 0.27118167969572543, 0.3287852952595283], "isController": false}, {"data": ["POST User", 50, 0, 0.0, 319.12, 49, 2472, 259.5, 479.0, 1299.3999999999999, 2472.0, 1.624167614097775, 1.2435033295436089, 0.4634587664446971], "isController": false}, {"data": ["PUT User", 50, 0, 0.0, 361.9800000000001, 57, 3139, 276.0, 640.4, 1538.8499999999938, 3139.0, 1.6644474034620504, 1.2743425432756326, 0.4751152109687084], "isController": false}, {"data": ["POST Book", 50, 0, 0.0, 7810.800000000002, 2514, 15569, 6635.5, 13593.0, 14665.499999999996, 15569.0, 1.1974900608324952, 1066.0292745156153, 5.4336345395051975], "isController": false}, {"data": ["GET CoverPhotos for Book", 50, 0, 0.0, 458.37999999999994, 51, 1532, 299.0, 1235.7, 1343.9, 1532.0, 1.4794650254467985, 0.5219737542904486, 0.2496886188454255], "isController": false}, {"data": ["PUT CoverPhoto", 50, 0, 0.0, 484.94, 65, 3165, 293.5, 1068.5999999999997, 2214.449999999999, 3165.0, 1.6026668376177962, 32.4586987747612, 0.5469413604237451], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1350, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
