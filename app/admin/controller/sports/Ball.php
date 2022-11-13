<?php


namespace app\admin\controller\sports;


use app\admin\model\SportsBall;
use app\admin\traits\Curd;
use app\common\controller\AdminController;
use app\admin\service\annotation\ControllerAnnotation;
use app\admin\service\annotation\NodeAnotation;
use think\App;

/**
 * Class Admin
 * @package app\admin\controller\system
 * @ControllerAnnotation(title="体育分类管理")
 */
class Ball extends AdminController
{

    use Curd;
    
    /**
     * @var array 数据排序
     */
    protected $sort = [
        'id'   => 'asc',
    ];

    public function __construct(App $app)
    {
        parent::__construct($app);
        $this->model = new \app\admin\model\SportsBall();
    }

}