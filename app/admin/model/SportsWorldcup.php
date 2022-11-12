<?php


namespace app\admin\model;


use app\common\model\TimeModel;

class SportsWorldcup extends TimeModel
{
    protected $deleteTime = 'delete_time';

    public function cate()
    {
        return $this->belongsTo('app\admin\model\SportsCate', 'cate_id', 'id');
    }

    public function getTagListTitleAttr()
    {
        $tags = $this->getAttr('tag');

        $list_tag = SportsTag::whereIn('id', $tags)->column('title');

        return $list_tag;
    }
}
