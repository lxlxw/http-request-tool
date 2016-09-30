<?php
include 'base.php';
$_GET['func']();

/**
 * GET请求
 */
function get()
{
    $url = url();
    $arrHeader = [];
    $sendParam = checkParam($_POST, $arrHeader);
    $sendParam && $url = implode('?', [$url, http_build_query($sendParam)]);
    $data = http($url,'GET',[],[],$arrHeader);
    $data = isJson($data) ? json_decode($data, TRUE) : $data;
    dump($data);
}

/**
 * POST请求
 */
function post()
{
    $url = url();
    $arrHeader = [];
    $sendParam = checkParam($_POST, $arrHeader);
    $data = http($url, 'POST', $sendParam, [], $arrHeader);
    $data = isJson($data) ? json_decode($data, TRUE) : $data;
    dump($data);
}

/**
 * 保存配置
 */
function save()
{
    $params = $_POST['data'];
    $data = [];
    foreach ($params as $k => $param){
        if(is_array($param)){
            foreach ($param as $key => $val){
                $param[$key]['key'] = htmlspecialchars($val['key']);
                $param[$key]['val'] = htmlspecialchars($val['val']);
            }
        }
        $data[$k] = $param;
    }
    unset($params);
    echo file_put_contents("data/" . urlencode($_POST['name']) . '.txt', json_encode($data)) ? 'ok' : '';
}

/**
 * 配置列表
 */
function lists()
{
    $files = glob('data/*.txt');
    $data = [];
    foreach ($files as $file) {
        $data[] = substr(basename($file), 0, -4);
    }
    echo json_encode($data);
}

/**
 * 读取配置
 */
function read()
{
    $data = file_get_contents("data/{$_POST['name']}.txt");
    echo $data;
}

/**
 * 批量请求
 */
function multi()
{
    $name = $_POST['name'];
    $data = file_get_contents("data/$name.txt");
    $data = json_decode($data, TRUE);
    unset($_POST);
    $_POST['url'] = $data['url'];
    foreach ($data['param'] as $param) {
        $_POST[$param['key']] = $param['val'];
    }
    $data['type']();
}