// csrf
var csrftoken = $.cookie('csrftoken');

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

// Grab elements, create settings, etc.
var video = document.getElementById('video');

// Get access to the camera!
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({video: true}).then(function (stream) {
        //video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream;
        video.play();
    });
}
// Legacy code below: getUserMedia
else if (navigator.getUserMedia) { // Standard
    navigator.getUserMedia({video: true}, function (stream) {
        video.src = stream;
        video.play();
    }, errBack);
} else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia({video: true}, function (stream) {
        video.src = window.webkitURL.createObjectURL(stream);
        video.play();
    }, errBack);
} else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
    navigator.mozGetUserMedia({video: true}, function (stream) {
        video.srcObject = stream;
        video.play();
    }, errBack);
}

// Elements for taking the snapshot
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

// Trigger photo take
document.getElementById("snap").addEventListener("click", function () {
    context.drawImage(video, 0, 0, 300, 225);
})

document.getElementById("saveimg").onclick = function () {
    downLoad(saveAsPNG(canvas));
}

document.getElementById("analysis").onclick = function () {
    upLoad(saveAsPNG(canvas))
}

function downLoad(url) {
    alert(url);
    var oA = document.createElement("a");
    oA.download = '';// 设置下载的文件名，默认是'下载'
    oA.href = url;
    document.body.appendChild(oA);
    oA.click();
    oA.remove(); // 下载之后把创建的元素删除
}

var output_img = new Image();
var emotion = ['愤怒', '快乐', '悲伤', '惊讶', '平静']

function upLoad(base64Data) {
    //导出base64格式的图片数据
    //console.log(base64Data)
    //封装blob对象
    //var png = dataURItoBlob(base64Data);
    //组装formdata
    layer.msg("上传中，请等待结果。");
    var formdata = new FormData();
    if (document.getElementById('image_up').value == "") {
        // 无文件用canvas
        formdata.append("image", base64Data);
        formdata.append('type', '1');
    }else{
        // 有文件直接上传
        formdata.append('image', $('#image_up')[0].files[0]);
        formdata.append('type', '2');
    }
    formdata.append("title", "face.png");
    $.ajax({
        // url: "{% url 'fermodel:recognize' %}",
        url: "/fermodel/recognize/",
        type: "POST",
        data: formdata,
        datatype: 'json',
        // 告诉jQuery不要去处理发送的数据, 发送对象。
        processData: false,
        // 告诉jQuery不要去设置Content-Type请求头
        contentType: false,
        // 获取POST所需的csrftoken
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function (data) {
            if (data["5"] != -1) {
                emotion_id = data["5"]
                getlllist = false
                // layer.msg("识别成功，是"+emotion[data["5"]]+"表情。");
                layer.msg("识别成功！");
                document.getElementById("result").innerHTML = emotion[data["5"]];
                document.getElementById("angry").innerHTML = (data["0"] * 100).toFixed(2);
                document.getElementById("happy").innerHTML = (data["1"] * 100).toFixed(2);
                document.getElementById("sad").innerHTML = (data["2"] * 100).toFixed(2);
                document.getElementById("surprise").innerHTML = (data["3"] * 100).toFixed(2);
                document.getElementById("natural").innerHTML = (data["4"] * 100).toFixed(2);
            } else {
                layer.msg("未识别到人脸，请调整角度。");
            }
        },
    })
}

function saveAsPNG(canvas) {
    // 导出base64格式的图片数据
    base64Data = canvas.toDataURL("image/png", 0.8);
    return base64Data;
}
