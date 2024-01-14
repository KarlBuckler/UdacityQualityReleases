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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7975322490185082, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9038461538461539, 500, 1500, "PUT Activity"], "isController": false}, {"data": [0.7625, 500, 1500, "GET all Activity"], "isController": false}, {"data": [0.8921568627450981, 500, 1500, "DELETE User"], "isController": false}, {"data": [0.9551282051282052, 500, 1500, "GET Activitiy"], "isController": false}, {"data": [0.9385964912280702, 500, 1500, "DELETE CoverPhoto"], "isController": false}, {"data": [0.8307692307692308, 500, 1500, "GET Book"], "isController": false}, {"data": [0.8116883116883117, 500, 1500, "GET all Author"], "isController": false}, {"data": [0.9150943396226415, 500, 1500, "GET all User"], "isController": false}, {"data": [0.13846153846153847, 500, 1500, "PUT Book"], "isController": false}, {"data": [0.7466666666666667, 500, 1500, "PUT Author"], "isController": false}, {"data": [0.92, 500, 1500, "GET User"], "isController": false}, {"data": [0.9, 500, 1500, "POST Activity"], "isController": false}, {"data": [0.8103448275862069, 500, 1500, "POST CoverPhoto"], "isController": false}, {"data": [0.9533333333333334, 500, 1500, "GET Author"], "isController": false}, {"data": [0.9363636363636364, 500, 1500, "GET CoverPhoto"], "isController": false}, {"data": [0.96, 500, 1500, "DELETE Author"], "isController": false}, {"data": [0.9675324675324676, 500, 1500, "GET Author for Book"], "isController": false}, {"data": [0.9310344827586207, 500, 1500, "GET all CoverPhoto"], "isController": false}, {"data": [0.1506849315068493, 500, 1500, "GET all Book"], "isController": false}, {"data": [0.967948717948718, 500, 1500, "DELETE Activity"], "isController": false}, {"data": [0.7402597402597403, 500, 1500, "POST Author"], "isController": false}, {"data": [0.9153846153846154, 500, 1500, "DELETE Book"], "isController": false}, {"data": [0.8365384615384616, 500, 1500, "POST User"], "isController": false}, {"data": [0.84, 500, 1500, "PUT User"], "isController": false}, {"data": [0.13970588235294118, 500, 1500, "POST Book"], "isController": false}, {"data": [0.9482758620689655, 500, 1500, "GET CoverPhotos for Book"], "isController": false}, {"data": [0.8272727272727273, 500, 1500, "PUT CoverPhoto"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1783, 0, 0.0, 779.7420078519343, 46, 18768, 344.0, 1425.8000000000031, 3389.3999999999974, 8351.160000000013, 28.559072270630445, 3183.468144591315, 16.081762582689965], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["PUT Activity", 78, 0, 0.0, 393.94871794871796, 68, 1294, 331.0, 796.9000000000003, 955.1999999999998, 1294.0, 1.3002167027837974, 3.942746968244707, 0.4390868530171695], "isController": false}, {"data": ["GET all Activity", 80, 0, 0.0, 577.1750000000001, 129, 1736, 462.5, 1160.0000000000005, 1373.6000000000004, 1736.0, 1.3467333299665, 4.0863953104220325, 0.22620911401781055], "isController": false}, {"data": ["DELETE User", 51, 0, 0.0, 354.6862745098039, 89, 919, 308.0, 665.6000000000001, 802.5999999999997, 919.0, 0.8939840134623475, 0.1842095965239798, 0.22270856340274856], "isController": false}, {"data": ["GET Activitiy", 78, 0, 0.0, 292.62820512820514, 50, 821, 270.0, 478.90000000000043, 575.15, 821.0, 1.3161669169633667, 0.4533222141133591, 0.22448595139463073], "isController": false}, {"data": ["DELETE CoverPhoto", 57, 0, 0.0, 308.7894736842105, 81, 672, 279.0, 523.8000000000001, 655.0999999999999, 672.0, 0.9910285833507199, 0.20420608504590027, 0.2534111432036303], "isController": false}, {"data": ["GET Book", 65, 0, 0.0, 431.2153846153847, 146, 1037, 385.0, 700.3999999999999, 794.8, 1037.0, 1.1264578964698542, 5.1979533126527215, 0.18685729619777133], "isController": false}, {"data": ["GET all Author", 77, 0, 0.0, 494.38961038961037, 116, 2717, 377.0, 886.0000000000001, 1323.6999999999991, 2717.0, 1.3029867163042559, 62.267670831923176, 0.21504370610880785], "isController": false}, {"data": ["GET all User", 53, 0, 0.0, 349.26415094339615, 67, 1070, 315.0, 632.0, 793.3, 1070.0, 0.9259097500043675, 0.7088996523470938, 0.1510028596198529], "isController": false}, {"data": ["PUT Book", 65, 0, 0.0, 3849.6307692307696, 479, 14351, 3337.0, 8124.4, 9880.099999999999, 14351.0, 1.0775326160834175, 957.8521886863219, 4.997300340458863], "isController": false}, {"data": ["PUT Author", 75, 0, 0.0, 655.1200000000002, 58, 4010, 409.0, 1336.2000000000016, 2080.600000000001, 4010.0, 1.2540128410914928, 57.929188507390315, 0.39467115080758425], "isController": false}, {"data": ["GET User", 50, 0, 0.0, 331.14000000000004, 116, 1076, 291.0, 574.3, 622.1999999999998, 1076.0, 0.9157844609692662, 0.2775077326550423, 0.15122964096670208], "isController": false}, {"data": ["POST Activity", 80, 0, 0.0, 346.775, 51, 924, 303.0, 661.9, 733.4000000000001, 924.0, 1.3375466051395228, 4.05754036673856, 0.4508505176723345], "isController": false}, {"data": ["POST CoverPhoto", 58, 0, 0.0, 474.67241379310343, 82, 1878, 377.0, 1024.5000000000002, 1439.9999999999998, 1878.0, 1.011810268129721, 20.49212221752176, 0.34453884130279294], "isController": false}, {"data": ["GET Author", 75, 0, 0.0, 304.9466666666666, 48, 881, 275.0, 509.60000000000014, 766.2, 881.0, 1.271746871502696, 0.4139304237884492, 0.21346469948621427], "isController": false}, {"data": ["GET CoverPhoto", 55, 0, 0.0, 342.52727272727276, 84, 1591, 283.0, 597.4, 763.3999999999995, 1591.0, 0.9739167389726064, 0.3417700715386114, 0.16723630650930532], "isController": false}, {"data": ["DELETE Author", 75, 0, 0.0, 308.2799999999999, 49, 926, 268.0, 483.20000000000005, 786.6000000000003, 926.0, 1.2772697082715987, 0.26318741059112044, 0.32166241442292953], "isController": false}, {"data": ["GET Author for Book", 77, 0, 0.0, 284.2857142857143, 47, 930, 282.0, 448.2, 529.6999999999998, 930.0, 1.3130296881128183, 0.6355990911106185, 0.22296259250890985], "isController": false}, {"data": ["GET all CoverPhoto", 58, 0, 0.0, 337.93103448275866, 68, 1401, 297.5, 580.3000000000001, 668.4499999999991, 1401.0, 1.0237401818021359, 20.73373792030712, 0.17295610493336863], "isController": false}, {"data": ["GET all Book", 73, 0, 0.0, 3471.232876712329, 467, 18768, 2910.0, 6512.600000000003, 10898.799999999988, 18768.0, 1.1865674067813141, 1055.1317960952993, 0.19351245794187447], "isController": false}, {"data": ["DELETE Activity", 78, 0, 0.0, 314.6282051282051, 46, 1349, 296.0, 475.70000000000005, 784.7999999999998, 1349.0, 1.3215411202602418, 0.27230974255362406, 0.3363913826623971], "isController": false}, {"data": ["POST Author", 77, 0, 0.0, 617.4675324675326, 74, 2453, 440.0, 1290.8000000000002, 1931.3999999999983, 2453.0, 1.267656646142702, 59.89348070013335, 0.3978951189045471], "isController": false}, {"data": ["DELETE Book", 65, 0, 0.0, 329.076923076923, 57, 821, 286.0, 591.2, 681.8999999999996, 821.0, 1.1457782478406486, 0.23609297880310243, 0.2862896340119866], "isController": false}, {"data": ["POST User", 52, 0, 0.0, 459.67307692307696, 54, 1221, 335.5, 947.0000000000001, 1073.949999999999, 1221.0, 0.9080431669751685, 0.6952205497153634, 0.25910471527608003], "isController": false}, {"data": ["PUT User", 50, 0, 0.0, 449.86, 60, 1077, 344.5, 949.0999999999999, 1045.0499999999997, 1077.0, 0.908545781621936, 0.6956053640542946, 0.2593436835625897], "isController": false}, {"data": ["POST Book", 68, 0, 0.0, 3768.632352941176, 408, 14404, 2874.0, 8499.2, 10505.599999999995, 14404.0, 1.123372761514571, 998.7956879987032, 5.2509997294819275], "isController": false}, {"data": ["GET CoverPhotos for Book", 58, 0, 0.0, 297.8620689655174, 57, 828, 281.0, 504.0, 601.8, 828.0, 1.0279860335690612, 0.3627860193899435, 0.17351764524733698], "isController": false}, {"data": ["PUT CoverPhoto", 55, 0, 0.0, 471.4363636363635, 89, 1230, 412.0, 846.0, 1039.9999999999993, 1230.0, 0.9627840212862795, 19.499197087359523, 0.3286150078335609], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1783, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
