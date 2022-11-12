<?php

namespace app\index\model;

use think\Model;

class SportsBall extends Model
{
    public static function getSelectAll($where = null){
        
        $map['status'] = ['=', 0];
        if ($where) {
            $map = array_merge($map, $where);
        }
        
        return SportsBall::where($map)->order('match_rank asc')->select()->toArray();
        
    }
}

