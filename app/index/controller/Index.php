<?php
namespace app\index\controller;

use app\BaseController;
use think\facade\View;
use think\facade\Log;
use app\index\model\SportsWorldcup;
use app\index\model\SportsBall;

class Index extends BaseController
{
    public function __construct()
    {
        $this->model = new SportsWorldcup();
        $this->ballModel = new SportsBall();
    }
    /**
     * index 世界杯首页
     */
    public function index()
    {
        // $timeZone = getTimeZone();
        // print_r($timeZone); exit;

        $ball = $this->ballModel::getSelectAll();
        
        $match_ball = [];
        if ($ball) foreach ($ball as $key=>$value){
            if ($value['group_name'] == 'A') {
                $match_ball[0][] = $value;
            }
            if ($value['group_name'] == 'B') {
                $match_ball[1][] = $value;
            }
            if ($value['group_name'] == 'C') {
                $match_ball[2][] = $value;
            }
            if ($value['group_name'] == 'D') {
                $match_ball[3][] = $value;
            }
            if ($value['group_name'] == 'E') {
                $match_ball[4][] = $value;
            }
            if ($value['group_name'] == 'F') {
                $match_ball[5][] = $value;
            }
            if ($value['group_name'] == 'G') {
                $match_ball[6][] = $value;
            }
            if ($value['group_name'] == 'H') {
                $match_ball[7][] = $value;
            }
        }
        if ($match_ball) foreach ($match_ball as $k=>$val) {
           $sort = array_column($match_ball[$k], 'match_rank');
           array_multisort($sort, SORT_ASC, $match_ball[$k]);
        }

        $result = $this->model::getSelectAll();
        
        $worldcup = [];
        if ($result) foreach ($result as $key=>$value){
            $worldcup[$key][] = $value['id'];
            $worldcup[$key][] = $value['schedule'];
            $worldcup[$key][] = str_replace('-', '/', $value['match_time']); //比赛时间
            if($value['match_state']>1){
                $worldcup[$key][] = $value['match_state']; //比赛状态(0未开始1进行中2已结束)
            } else {
                $worldcup[$key][] = matchState($value['match_time']); //比赛状态(0未开始1进行中2已结束)
            }
            if (in_array($value['group_name'], ['A','B','C','D','E','F','G','H'])) {
                $worldcup[$key][] = '分组赛^'.$value['group_name']; //小组
            } else {
                $worldcup[$key][] = $value['group_name'].'^'; //小组
            }
            $worldcup[$key][] = $value['home_flag']; //主队logo标识
            $worldcup[$key][] = $value['home_team']; //主队
            $worldcup[$key][] = $value['away_flag']; //主队logo标识
            $worldcup[$key][] = $value['away_team']; //主队
            $worldcup[$key][] = $value['home_let_init']; //主队让分初始值
            $worldcup[$key][] = $value['home_let_score']; //主队让分具体值
            $worldcup[$key][] = $value['home_let_odds']; //主队让分赔率值
            $worldcup[$key][] = $value['home_size_init']; //主队大小初始值
            $worldcup[$key][] = $value['home_size_score']; //主队大小具体值
            $worldcup[$key][] = $value['home_size_odds']; //主队大小赔率值
            $worldcup[$key][] = "0";
            $worldcup[$key][] = "0";
            $worldcup[$key][] = "";
            $worldcup[$key][] = "";
            $worldcup[$key][] = "../../";
            $worldcup[$key][] = "../../";
            $worldcup[$key][] = "";
            $worldcup[$key][] = "";
            $worldcup[$key][] = $value['away_let_init']; //主队让分初始值
            $worldcup[$key][] = $value['away_let_score']; //主队让分具体值
            $worldcup[$key][] = $value['away_let_odds']; //主队让分赔率值
            $worldcup[$key][] = $value['away_size_init']; //主队大小初始值
            $worldcup[$key][] = $value['away_size_score']; //主队大小具体值
            $worldcup[$key][] = $value['away_size_odds']; //主队大小赔率值
            $worldcup[$key][] = $value['open_state']; //开盘状态(0未开盘1赛前盘2已关盘)
            $worldcup[$key][] = $value['home_team_en']; //主队英文
            $worldcup[$key][] = $value['away_team_en']; //主队英文
            $worldcup[$key][] = $value['group_name_en']; //小组英文
            $worldcup[$key][] = date('Y/m/d', strtotime($value['match_time'])); //比赛时间取年月日,前端时间筛选用
            $worldcup[$key][] = date('Y/m/d H:i:s', strtotime($value['match_time'])); //比赛时间取年月日,前端时间筛选用
            $worldcup[$key][] = $value['home_goals']; //主队赛果
            $worldcup[$key][] = $value['away_goals']; //客队赛果
        }
        $worldcup = json_encode($worldcup, JSON_UNESCAPED_UNICODE);
        $worldcup = str_replace(['\\', '"'], ['', "'"], $worldcup);

        $timeZone = getTimeZone();
        $timeZone = json_encode($timeZone, JSON_UNESCAPED_UNICODE);
        $timeZone = str_replace(['\\', '"'], ['', "'"], $timeZone);
        
        View::assign(["version"=>time(), "ball"=>$match_ball, "worldcup"=>$worldcup, "timeZone"=>$timeZone]);
        return View::fetch();
    }
    
}









