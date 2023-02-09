<?php

namespace app\index\model;

use think\Model;

class VisionRecord extends Model
{
    protected $model;

    //职业
    public $occupation = [
        5 => '大学',
        4 => '高中',
        3 => '中学',
        2 => '小学',
        1 => '幼小',
        0 => '其他'
    ];

    //配镜类型
    public $vision_type = [
        4 => '花眼',
        3 => '弱视',
        2 => '远视',
        1 => '近视',
        0 => '其他'
    ];

    //戴镜历史
    public $glasses = [
        2 => '有',
        1 => '无',
        0 => '其他'
    ];

    //镜架材料
    public $frame = [
        4 => '钛材镜架',
        3 => '合金镜架',
        2 => '记忆镜架',
        1 => '板材镜架',
        0 => '其他'
    ];
}

