// semantic初始化
$('#showopt').click(function(){
    getOptList();
    $('#optlist').sidebar('toggle');
});

// 添加参数
$('#add_request').click(function () {
    addRequestRow();
});
//添加请求参数
function addRequestRow(request) {
    var obj = typeof (request) == 'object' ? request : [{key: '', val: ''}];
    var strHtml = '';
    for (var item = 0; item < obj.length; item++) {
        strHtml += '<div class="fields">' +
            '<div class="inline field" data-tooltip="删除">' +
            '<i class="circular icon link remove red" onclick="removeOneRow(this)"></i>' +
            '</div>' +
            '<div class="param six wide field">' +
            '<input type="text" placeholder="KEY" value="' +
            obj[item]['key'] +
            '">' +
            '</div>' +
            '<div class="param nine wide field">' +
            '<input type="text" placeholder="VAL" value="' +
            obj[item]['val'] +
            '">' +
            '</div>' +
            '</div>';
    }
    $('#request_arr').append(strHtml);
}

//删除参数行
function removeOneRow(e) {
    e.closest('.fields').remove();
}
// 移除全部
$('#removeall_request').click(function () {
    $('#request_arr').children(".fields:eq(0)").siblings().remove();
    //addRequestRow();
});

//发送请求
$('#send').click(function () {
    $('.response').html('');
    $.post('action.php?func=' + $('#type').val(), getAllInfo(), function (data) {
        $('.response').html(data);
    });
});

//保存配置
$('#save').click(function () {
	var info = getAllInfo();
    var name = prompt('请输入配置名称（不允许包含特殊字符）');
    if (name) {
        var params = {'name': name, 'data': info};
        $.post('action.php?func=save', params, function (data) {
            data == 'ok' && alert('保存成功!');
        });
    }
});
//获取所有信息
function getAllInfo() {
    var info = {};
    info.url = $('#url').val();
    info.type = $('#type').val();
    info.sign = $('#sign').val();
    info.appid = $('#appid').val();
    info.appkey = $('#appkey').val();
    info.request = getRequestInfo();
    return info;
}

// 获取请求参数
function getRequestInfo() {
    var request = [];
    var requestEle = $('#request_arr').find('.fields');
    for (var i = 0; i < requestEle.length; i++) {
        if (i > 0) {
            var temp = {};
            var inputEle = $(requestEle[i]).find('input');
            if ('' !== inputEle[0].value) {
                temp.key = inputEle[0].value;
                temp.val = inputEle[1].value;
                request.push(temp);
            }
        }
    }
    return request;
}

//获取配置列表
function getOptList() {
    $.ajax({
        url: './action.php?func=lists',
        dataType: 'json',
        type: 'get',
        data:{},
        success: function(resopnse) {
            var html = '<div class="item"><a><i class="icon list layout"></i>配置列表</a></div>';
            for (var i = 0; i < resopnse.length; i++) {
                html += '<a class="item" data-content="' + resopnse[i] + '" onclick="loadAllInfo(this)">' + resopnse[i] + '</a>';
            }
            $('#optlist').html(html);
        }
    });
}

//加载配置
function loadAllInfo(e) {
    var filename = e.getAttribute('data-content');
    $('#param_form').addClass('loading');
    $('#result').empty().html('NULL').attr('rows', 2);
    $.post('action.php?func=read', {'name': filename}, function (data) {
    	$('#removeall_request').trigger('click');
    	addRequestRow(data.request);
    	$('#url').val(data.url);
    	$("#type").val(data.type);
    	$("#sign").val(data.sign);
    	$("#appid").val(data.appid);
    	$("#appkey").val(data.appkey);
    	var sign = $("#sign").val();
    	if(sign == 'yes'){
    		$('.sign_param').show();
    	}
    	$('#param_form').removeClass('loading');
    }, 'json');
}

//签名显示
$('#sign').change(function(){
	var issign = $('#sign').val();
	if(issign == 'yes'){
		$('.sign_param').show();
	}else if(issign == 'no'){
		$('.sign_param').hide();
	}
});

//批量请求
function multi() {
    var accordion = $('#accordion');
    $.post('action.php?func=lists', {}, function (data) {
        $.each(data, function (index, name) {
            var url = 'action.php?func=multi&t=' + new Date().getTime();
            $.post(url, {'name': name}, function (rsp) {
                var content =
                    '<div class="am-panel am-panel-default"><div class="am-panel-hd"><h4 class="' +
                    'am-panel-title" data-am-collapse="{parent: \'#accordion\', target: \'#accordion' + index + '\'}">' +
                    name + '</h4></div><div id="accordion' + index + '" class="am-panel-collapse am-collapse">' +
                    '<div class="am-panel-bd">' + rsp + '</div></div></div>';
                accordion.append(content);
            });
        });
    }, 'json');
}
//点击文本框复制其内容到剪贴板上
$(".copy_button").zclip({
	//alert(1);
    path: "rsc/ZeroClipboard.swf",
    copy: function(){
    return $(this).parent().find("#url").val();
    },
    afterCopy : function() {alert("success");/*复制成功*/}
});
