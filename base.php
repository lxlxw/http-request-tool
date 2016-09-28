<?php
function url()
{
    $url = $_POST['url'];
    unset($_POST['url']);
    return $url;
}

function dump($data)
{
    //$data = sprintf('<pre>%s</pre>', htmlspecialchars(print_r($data, TRUE)));
    $data = sprintf('<pre>%s</pre>', print_r($data, TRUE));
    echo $data;
}

function isJson($str)
{
    json_decode($str);
    return json_last_error() == JSON_ERROR_NONE;
}

function checkParam($param,& $p_arrHeader)
{
    if(!empty($param['appid']) && !empty($param['appkey'])){
        $appkey = $param['appkey'];
        unset($param['appkey']);
        $sign = getAuthSignStr($param,$appkey);
        
        $p_arrHeader = [
            'appid' => $param['appid'],
            'sign'  => $sign,
        ];
        //unset($param['appid']);
    }
    return $param;
}

function getAuthSignStr($arrInput,$appkey) {
    $strTrans = '';
    if (isset($arrInput['sign'])) {
        unset($arrInput['sign']);
    }
    if (ksort($arrInput)) {

        foreach ($arrInput as $key => $value) {
            $strVal = trim($value);
            if ($strVal === null || $strVal === '') {
                continue;
            }
            $strTrans .= $key . $strVal;
        }
        $strSign = md5($strTrans . $appkey);
    }
    return strtoupper($strSign);
}

function http($url, $method = 'GET', $params = [], $options = [], $arrHeader = [])
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
    
    foreach($arrHeader as $n => $v){
        $header[] = $n . ':' .$v;
    }
    
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    if ($method == 'POST') {
        $options[CURLOPT_POST] = TRUE;
        $options[CURLOPT_POSTFIELDS] = $params;
    }
    curl_setopt_array($ch, $options);
    $result = curl_exec($ch);
    return (curl_errno($ch) == 0) ? $result : FALSE;
}