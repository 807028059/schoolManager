var pageNum = 1;
var pageSize = 10;
var isFinshInit = false;
var isFirst = true;
var TotalCount = 0;//总条数

$(function () {
    console.log(1)
    initExam();

    var LINECHART1 = $('#lineChartExample1');
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
            labels: ["A", "B", "C", "D", "E", "F", "G"],
            datasets: [
                {
                    label: "Total Overdue",
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
                    data: [20, 28, 30, 22, 24, 10, 7],
                    spanGaps: false
                }
            ]
        }
    });
});

//初始化参数
function initParam() {
    pageNum = 1;
    pageSize = 10;
    isFinshInit = false;
    isFirst = true;
    TotalCount = 0;//总条数
}

//查询
function initExam() {
    initParam();
    getExamList(pageNum,pageSize);
}

function getExamList(_pageNum,_pageSize) {
    var _exam = $("#searchExam").val() == "请选择"?"":$("#searchExam").val();
    var param = {
        pageNum: _pageNum,
        pageSize: _pageSize,
        exam: _exam
    };
    ajaxPost(param, "/schoolManager/exam/getExam", function (res) {
        if (res.resCode == "0") {
            var results = res.busiResp.records;
            if (results.length == 0) {
                $("#noData").show();
                $("#fenye").html("");
                return false;
            }
            TotalCount = res.busiResp.total;
            if (isFinshInit) {     // true 已完成第一次加载
                appendToTable(results)
            } else {                 // false 第一次加载
                appendToTable(results)
                showingAppPages(pageSize, pageNum);
            }
        }else{
            swal(res.resMsg, {
                icon: "error",
            });
        }
    });
}

function appendToTable(results) {
    var html = "";
    for (var i = 0; i < results.length; i++) {
        var buttonHtml = "";
        buttonHtml += "<a Exam='oprate-button' style='color:blue' onclick='showModal("+JSON.stringify(results[i])+")'>修改</a>";
        html += "<tr>" +
            "       <th scope='row'>" + (i + 1) + "</th>" +
            "       <td>" + results[i].exam + "</td>" +
            "       <td>" +
            "           <button onclick='showEcharts("+results[i].id+")' type='button' data-toggle='modal' data-target='#myModal_chart' class='modalButton list-btn btn-primary'>查看</button>" +
            "       </td>" +
            "       <td>" + results[i].createTime + "</td>" +
            "       <td>" +
            "           <a class='oprate-button' style='color:blue' onclick='showModal("+JSON.stringify(results[i])+")'>修改</a>" +
            "           <a class='oprate-button' style='color:blue' onclick='delExam("+results[i].id+")'>删除</a>" +
            "       </td>" +
            "    </tr>";
    }
    $("#examHtml").html(html);
}

//分页
function showingAppPages(limit, curr) {
    var laypage = layui.laypage;
    laypage.render({
        elem: 'fenye'                        // 对应  id
        , limit: limit                      // 每页显示多少条数量 appPageSize
        , limits: [10, 20, 50] // 每页显示多少条数量 pagesize
        , curr: curr                        // 默认选中的页码
        //, groups: groups                    // 页码组          页面显示的页码数量
        , count: TotalCount              //  总共多少条 ，这个需要根据ajax先查询总共有多少条
        , prev: " "
        , next: " "
        , theme: '#6610f2'                  // 颜色
        , layout: ['count', 'limit', 'prev', 'page', 'next'] // 布局 //,'limit'
        , jump: function (obj) {
            pageNum = obj.curr
            pageSize = obj.limit
            jumpRefresh(obj.curr)
        }
    });
}

//分页
function jumpRefresh(pageNum) {
    if (isFinshInit) {
        getExamList(pageNum, pageSize);
    } else {
        isFinshInit = true;
    }
}

//弹框显示
function showModal(_obj) {
    $("#exam").val(_obj.exam);
    $("#eid").val(_obj.id);
    $(".modalButton").click();
}

//添加修改
function svOrUp() {
    var id = $("#eid").val();
    var exam = $("#exam").val();
    var param = {
        id:id,
        exam: exam
    };
    $(".closeButton").click();
    ajaxPost(param, "/schoolManager/exam/svOrUp", function (res) {
        //置空
        $("#eid").val("");
        $("#exam").val("");
        if (res.resCode == "0") {
            swal("操作成功", {
                icon: "success",
            }).then(initExam());
        }else{
            swal(res.resMsg, {
                icon: "error",
            });
        }
    });
}

function delExam(_id) {
    swal({
        title: "确认弹框",
        text: "确认删除此考试么？删除后此考试下的学生成绩将一并删除！",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((flag) => {
        if (flag) {
            ajaxGet("", "/schoolManager/exam/delExam?examId="+_id, function (res) {
                if (res.resCode == "0") {
                    swal("操作成功", {
                        icon: "success",
                    }).then(initExam());
                }else{
                    swal(res.resMsg, {
                        icon: "error",
                    });
                }
            });
        }
    })
}

//查看选中考试的班级 平均分 折线图
function showEcharts(_id) {
    ajaxGet(param, "/schoolManager/exam/getEchartsData", function (res) {
        if (res.resCode == "0") {

        }else{
            swal(res.resMsg, {
                icon: "error",
            });
        }
    });
}


