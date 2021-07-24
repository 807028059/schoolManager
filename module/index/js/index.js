var examId = "";
var studentId = "";
var courseId = "";
var courseName = "";

$(function () {
    getTopData();
    //获取年级，班级
    getSelect();
    //获取考试
    getAllExams();
})

function getSelectInfo() {
    showExamClazzCharts();
    getPassingRate();
    getSelectStudent();
}

//获取年级班级选项
function getSelect() {
    ajaxGet("", "/schoolManager/clazz/getSelect", function (res) {
        if (res.resCode == "0") {
            var grades = res.busiResp.grade;
            var clazzs = res.busiResp.clazz;
            //默认选择第一个年级
            var gradehtml = "";
            if (grades.length != 0) {
                for(var i = 0;i<grades.length;i++){
                    gradehtml += "<option>"+grades[i]+"</option>";
                }
            }
            $("#searchGrade").html(gradehtml);
            //默认选择第一个班级
            var clazzhtml = "";
            if (clazzs.length != 0) {
                for(var i = 0;i<clazzs.length;i++){
                    clazzhtml += "<option>"+clazzs[i]+"</option>";
                }
            }
            $("#searchClazz").html(clazzhtml);
            //获取班级考试折线图
            showExamClazzCharts();
            //获取下拉框学生
            getSelectStudent();
        }
    });
}

//获取下拉框学生列表
function getSelectStudent() {
    var searchGrade = $("#searchGrade").val();
    var searchClazz = $("#searchClazz").val();
    var param = {
        grade: searchGrade,
        clazz: searchClazz
    };
    ajaxPost(param, "/schoolManager/student/getSelectStudent", function (res) {
        if (res.resCode == "0") {
            var results = res.busiResp;
            var studentHtml = "";
            if(results.length > 0){
                for(var i = 0;i<results.length;i++){
                    studentHtml += "<option value='"+results[i].id+"'>"+results[i].name+"</option>";
                }
                $("#searchStudent").html(studentHtml);
                studentId = results[0].id;
                //获取学生成绩
                getStudentScore();
                //获取科目及成绩
                getAllCourse();
            }else{
                $("#searchStudent").html("<option>请先添加学生</option>");
            }
        }else{
            swal(res.resMsg, {
                icon: "error",
            });
        }
    });
}

//获取所有考试
function getAllExams() {
    ajaxGet("", "/schoolManager/exam/getAllExam", function (res) {
        if (res.resCode == "0") {
            var exams = res.busiResp;
            var examshtml = "";
            if (exams.length != 0) {
                for(var i = 0;i<exams.length;i++){
                    examshtml += "<option value='"+exams[i].id+"'>"+exams[i].exam+"</option>";
                }
                $("#searchExam").html(examshtml);
                examId = exams[0].id;
                getPassingRate();
            }else{
                $("#searchExam").html("<option>请先添加考试</option>");
            }
        }
    });
}

function getTopData() {
    ajaxGet("", "/schoolManager/index/getTopData", function (res) {
        if (res.resCode == "0") {
            var result = res.busiResp;
            $("#clazzs").html(result.clazzs);
            $("#students").html(result.students);
            $("#courses").html(result.courses);
            $("#exams").html(result.exams);
        }
    });
}

function showExamClazzCharts() {
    var searchGrade = $("#searchGrade").val();
    var searchClazz = $("#searchClazz").val();
    var param = {
        grade: searchGrade,
        clazz: searchClazz
    };
    ajaxPost(param, "/schoolManager/index/getClazzExamData", function (res) {
        if (res.resCode == "0") {
            var results = res.busiResp;
            var _x = [];
            var _y = [];
            for(var i = 0;i<results.length;i++){
                _x.push(results[i].exam);
                _y.push(results[i].total);
            }
            initEcharts("lineChartExample1","平均分",_x,_y);
        }else{
            swal(res.resMsg, {
                icon: "error",
            });
        }
    });
}


//获取考试及格率分析
function getPassingRate() {
    var searchGrade = $("#searchGrade").val();
    var searchClazz = $("#searchClazz").val();
    var param = {
        grade: searchGrade,
        clazz: searchClazz,
        examId: examId
    };
    ajaxPost(param, "/schoolManager/index/getPassingRate", function (res) {
        if (res.resCode == "0") {
            var results = res.busiResp;
            var html = "";
            if(results.length > 0){
                for(var i = 0;i<results.length;i++){
                    html += "<label class='col-sm-2 form-control-label'>"+results[i].course+"</label>" +
                        "    <div class='col-sm-8 mr-3'>" +
                        "        <span>及格人数："+results[i].pnum+"，及格率："+results[i].passRate+"%</span>" +
                        "    </div>";
                }
                $("#passRate").html(html);
            }else{
                $("#passRate").html("暂无数据");
            }
        }else{
            swal(res.resMsg, {
                icon: "error",
            });
        }
    });
}

//获取学生考试成绩
function getStudentScore() {
    ajaxGet("", "/schoolManager/index/getStudentScore?studentId="+studentId, function (res) {
        if (res.resCode == "0") {
            var results = res.busiResp;
            var _x = [];
            var _y = [];
            for(var i = 0;i<results.length;i++){
                _x.push(results[i].exam);
                _y.push(results[i].total);
            }
            initEcharts("lineChartExample","总分",_x,_y);
        }
    });
}

function getAllCourse() {
    ajaxGet("", "/schoolManager/course/getSelectCourse", function (res) {
        var course = res.busiResp;
        var coursehtml = "";
        if (course.length != 0) {
            for(var i = 0;i<course.length;i++){
                coursehtml += "<option value='"+course[i].id+"'>"+course[i].course+"</option>";
            }
            $("#searchCourse").html(coursehtml);
            courseId = course[0].id;
            courseName = course[0].course;
            getCourseScore();
        }else{
            $("#searchExam").html("<option>请先添加考试</option>");
        }
    });
}

//获取学生科目成绩
function getCourseScore() {
    var params = {
        studentId:studentId,
        courseId:courseId
    };
    ajaxPost(params, "/schoolManager/index/getCourseScore", function (res) {
        if (res.resCode == "0") {
            var results = res.busiResp;
            var _x = [];
            var _y = [];
            for(var i = 0;i<results.length;i++){
                _x.push(results[i].exam);
                _y.push(results[i].score);
            }
            initEcharts("lineChartExample2",courseName,_x,_y);
        }
    });
}

//考试选项
function selectOnExams(obj) {
    examId = obj.options[obj.selectedIndex].value;
    getPassingRate();
}

//学生选项
function selectOnStudent(obj) {
    studentId = obj.options[obj.selectedIndex].value;
    getStudentScore();
    getAllCourse();
}

//科目选项
function selectOnCourse(obj) {
    courseName = obj.options[obj.selectedIndex].text;
    courseId = obj.options[obj.selectedIndex].value;
    getCourseScore();
}