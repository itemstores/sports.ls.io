<?php
namespace app\index\controller;

use app\BaseController;
use think\facade\View;

class Developer extends BaseController
{
    public function __construct()
    {
        
    }
    /**
     * developer 时区
     */
    public function index()
    {
        $timeZone = [];

        date_default_timezone_set('Asia/Shanghai');
        $time=time();
        $timeZone["Shanghai"] = date("Y-m-d H:i:s",$time);

        date_default_timezone_set('Asia/Qatar');
        $time=time();
        $timeZone["Qatar"] = date("Y-m-d H:i:s",$time);

        View::assign(["timeZone" => $timeZone]);
        return View::fetch();
    }
    
}
