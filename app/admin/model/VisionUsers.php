<?php


namespace app\admin\model;


use app\common\model\TimeModel;

class VisionUsers extends TimeModel
{
    protected $deleteTime = 'delete_time';

    public function cate()
    {
        return $this->belongsTo('app\admin\model\VisionRecord', 'cate_id', 'id');
    }

    // public function getTagListTitleAttr()
    // {
    //     $tags = $this->getAttr('tag');

    //     $list_tag = MallTag::whereIn('id', $tags)->column('title');

    //     return $list_tag;
    // }
}
