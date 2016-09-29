//添加参数
$('#add').click(function () {
    var div = $('.param:first');
    var copy = div.clone();
    copy.find(':text').val('');
    copy.insertBefore(div);
    return copy;
});


// 添加参数
$('#add_request').click(function () {
    addRequestRow();
});
//添加请求参数
function addRequestRow(request) {
    var obj = typeof (request) == 'object' ? request : [{name: '', required: 1, type: 'string', desc: ''}];
    var strHtml = '';
    for (var item = 0; item < obj.length; item++) {
        strHtml += '<div class="fields">' +
            '<div class="inline field" data-tooltip="删除">' +
            '<i class="circular icon link remove red" onclick="removeOneRow(this)"></i>' +
            '</div>' +
            '<div class="four wide field">' +
            '<input type="text" placeholder="参数名" value="' +
            obj[item]['name'] +
            '">' +
            '</div>' +
            '<div class="three wide field">' +
            '<select class="ui fluid dropdown">';
        strHtml += '<option value="0" ' + (obj[item]['required'] == 0 ? ' selected' :'') +'>否</option>'
            + '<option value="1" ' + (obj[item]['required'] == 1 ? ' selected' :'') +'>是</option>';
        strHtml += '</select>' +
            '</div>' +
            '<div class="three wide field">' +
            '<select class="ui fluid dropdown"> ';
        strHtml +=
            '<option value="string"' + (obj[item]['type'] == 'string' ? ' selected' :'') +  '>string</option>'
            + '<option value="integer"' + (obj[item]['type'] == 'integer' ? ' selected' :'') + '>integer</option>'
            + '<option value="json"' + (obj[item]['type'] == 'json' ? ' selected' :'') + '>json</option>'
            + '<option value="array"' + (obj[item]['type'] == 'array' ? ' selected' :'') + '>array</option>';
        strHtml += '</select>' +
            '</div>' +
            '<div class="six wide field">' +
            '<input type="text" placeholder="描述" value="' +
            obj[item]['desc'] +
            '">' +
            '</div>' +
            '</div>';
    }
    $('#request_arr').append(strHtml);
    $('.ui.dropdown').dropdown();
}





//发送请求
$('#send').click(function () {
    $('.response').html('');
    var params = {url: $('#url').val()};
    var sign = $('#sign').val();
    if(sign == 'yes'){
    	params['appid']  = $('#appid').val();
    	params['appkey'] = $('#appkey').val();
    }
    $('.param').map(function () {
        if (key = $(this).find('input[name=key]').val()) {
            params[key] = $(this).find('input[name=val]').val();
        }
    });
    $.post('action.php?func=' + $('#type').val(), params, function (data) {
        $('.response').html(data);
    });
});

//保存配置
$('#save').click(function () {
    var name = prompt('请输入配置名称（不允许包含特殊字符）');
    if (name) {
        var params = {'name': name, 'data': $('#form').serialize()};
        $.post('action.php?func=save', params, function (data) {
            data == 'ok' && alert('保存成功!');
        });
    }
});

//显示列表
$('#lists').click(function () {
    $.post('action.php?func=lists', {}, function (data) {
        var content = '';
        $.each(data, function (index, name) {
            content += '<p class="read">' + name + '</p>';
        });
        $('#list-content').html(content);
    }, 'json');
});

//读取配置
$('#sidebar').on('click', '.read', function () {
    $('.param').each(function (index, param) {
        index && param.remove(); //清空参数
    });
    $.post('action.php?func=read', {'name': $(this).text()}, function (data) {
        $('#url').val(data.url);
        $("#type").val(data.type);
        $("#sign").val(data.sign);
        $("#appid").val(data.appid);
        $("#appkey").val(data.appkey);
        var sign = $("#sign").val();
        if(sign == 'yes'){
        	$('#sign_param').show();
        }
        $(data.param).each(function (index, param) {
            index && $('#add').click();
            var div = $('.param:first');
            div.find('input[name=key]').val(param.key);
            div.find('input[name=val]').val(param.val);
        });
    }, 'json');
});
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