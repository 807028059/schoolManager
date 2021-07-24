$(".indexMenu li").on('click', function (e) {
    e.preventDefault();
    $(".indexMenu").find("li").removeClass("active");
    $(this).addClass("active");
    $("#bodyHtml").load($(this).attr("menu"));
});

//校验参数
function checkParam(param) {
    if (param == null || param == "" || param == undefined || param == "undefined") {
        return false;
    }
    return true;
}

// 由映射关系获取值
function returnMapping(objMap,keyValue,defaultValue) {
    for(var key in objMap){
        if(key==keyValue){
            return objMap[key]
        }
    }
    return defaultValue;
}

/**
 * 公用方法：使用AJAX获取数据
 * @param {[type]} param [参数]
 * @param {[type]} url [路径]
 * @param {[type]} callBack [成功的回调函数]
 */
function ajaxGet(param, url, callBack) {
    param = param == ""?"":JSON.stringify(param);
    $.ajax({
        type: "GET",
        url: url,
        data: param,
        dataType: "json",
        contentType: "application/json",
        success: callBack,
        error: function(xhr) {
            swal("哦呦，出错啦", {
                icon: "error",
            });
        }
    });
}
/**
 * 公用方法：使用AJAX提交数据
 * @param {[type]} param [参数]
 * @param {[type]} url [路径]
 * @param {[type]} callBack [成功的回调函数]
 */
function ajaxPost(param, url, callBack) {
    param = param == ""?"":JSON.stringify(param);
    $.ajax({
        type: "POST",
        url: url,
        data: param,
        dataType: "json",
        contentType: "application/json",
        success: callBack,
        error: function(xhr) {
            swal("哦呦，出错啦", {
                icon: "error",
            });
        }
    });
}


function initEcharts(_id,_name,_x,_y) {
    //var LINECHART1 = $('#lineChartExample1');
    var LINECHART1 = $('#'+_id);
    var myLineChart = new Chart(LINECHART1, {
        type: 'line',
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        display: false
                    }
                }],
                yAxes: [{
                    ticks: {
                        max: 40,
                        min: 0,
                        stepSize: 0.5
                    },
                    display: false,
                    gridLines: {
                        display: false
                    }
                }]
            },
            legend: {
                display: false
            }
        },
        data: {
            labels: _x,
            datasets: [
                {
                    label: _name,
                    fill: true,
                    lineTension: 0,
                    backgroundColor: "transparent",
                    borderColor: '#6ccef0',
                    pointBorderColor: '#59c2e6',
                    pointHoverBackgroundColor: '#59c2e6',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    borderWidth: 3,
                    pointBackgroundColor: "#59c2e6",
                    pointBorderWidth: 0,
                    pointHoverRadius: 4,
                    pointHoverBorderColor: "#fff",
                    pointHoverBorderWidth: 0,
                    pointRadius: 4,
                    pointHitRadius: 0,
                    data: _y,
                    spanGaps: false
                }
            ]
        }
    });
}
