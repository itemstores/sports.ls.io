<?php

namespace app\index\model;

use think\Model;

class SportsWorldcup extends Model
{
    public static function getSelectAll($where = null){
        
        $map['status'] = ['=', 0];
        //$map['id'] = ['=', 1];
        if ($where) {
            $map = array_merge($map, $where);
        }
        
        return SportsWorldcup::where($map)->orderRaw("match_time asc")->select()->toArray();
        
    }
}

