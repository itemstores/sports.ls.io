<?php
namespace app\index\controller;

use app\BaseController;
use think\facade\View;
use app\index\model\VisionUsers;
use app\index\model\VisionRecord;

class Vision extends BaseController
{
    public function __construct()
    {
    }
    /**
     * index 世界杯首页
     */
    public function index()
    {
        $phone = isset($_GET['phone']) && !empty($_GET['phone']) ? intval($_GET['phone']) : '';

        $users = new VisionUsers();
        $record = new VisionRecord();

        $users_result = $users->where(['phone' => $phone])->select()->toArray();

        if (!empty($users_result[0]['id'])) {
            $record_result = $record->where(['vision_users_id'=>$users_result[0]['id']])->order('create_time desc')->select()->toArray();
        }

        $occupation = $record->occupation; //职业
        $vision_type = $record->vision_type; //配镜类型
        $glasses = $record->glasses; //戴镜历史
        $frame = $record->frame; //镜架材料

        View::assign(["version"=>time(), 'phone' => $phone, 'users'=>$users_result[0], 'record'=>$record_result, 'occupation'=>$occupation, 'vision_type'=>$vision_type, 'glasses'=>$glasses, 'frame'=>$frame]);
        return View::fetch();
    }
    
}
