<?php

namespace app\admin\controller\sports;

use app\admin\model\SportsWorldcup;
use app\admin\traits\Curd;
use app\common\controller\AdminController;
use app\admin\service\annotation\ControllerAnnotation;
use app\admin\service\annotation\NodeAnotation;
use think\App;

/**
 * Class Worldcup
 * @package app\admin\controller\sports
 * @ControllerAnnotation(title="体育世界杯管理")
 */
class Worldcup extends AdminController
{

    use Curd;

    protected $relationSearch = true;
    protected $sort = [
        'id'   => 'asc',
    ];

    public function __construct(App $app)
    {
        parent::__construct($app);
        $this->model = new SportsWorldcup();
    }

    /**
     * @NodeAnotation(title="列表")
     */
    public function index()
    {
        if ($this->request->isAjax()) {
            if (input('selectFields')) {
                return $this->selectList();
            }
            list($page, $limit, $where) = $this->buildTableParames();
            $count = $this->model
                ->where($where)
                ->count();
            $list = $this->model
                ->where($where)
                ->page($page, $limit)
                ->order($this->sort)
                ->select();
            $data = [
                'code'  => 0,
                'msg'   => '',
                'count' => $count,
                'data'  => $list,
            ];
            return json($data);
        }
        return $this->fetch();
    }

    /**
     * @NodeAnotation(title="入库")
     */
    public function stock($id)
    {
        $row = $this->model->find($id);
        empty($row) && $this->error('数据不存在');
        if ($this->request->isPost()) {
            $post = $this->request->post();
            $rule = [];
            $this->validate($post, $rule);
            try {
                $post['total_stock'] = $row->total_stock + $post['stock'];
                $post['stock'] = $row->stock + $post['stock'];
                $save = $row->save($post);
            } catch (\Exception $e) {
                $this->error('保存失败');
            }
            $save ? $this->success('保存成功') : $this->error('保存失败');
        }
        $this->assign('row', $row);
        return $this->fetch();
    }

    public function read($id)
    {
        $row = $this->model->find($id);
        $this->assign('row', $row);
        return $this->fetch();
    }

    /**
     * @NodeAnotation(title="导出")
     */
    public function export()
    {
        list($page, $limit, $where) = $this->buildTableParames();

        $this->model = $this->model
            ->withJoin('cate', 'LEFT');

        $fields = $this->request->param('fields', '{}', null);
        $image_fields = $this->request->param('image_fields', '{}', null);
        $select_fields = $this->request->param('select_fields', '{}', null);
        $date_fields = $this->request->param('date_fields', '{}', null);

        $fields = json_decode($fields, true);
        $image_fields = json_decode($image_fields, true);
        $select_fields = json_decode($select_fields, true);
        $date_fields = json_decode($date_fields, true);

        $content = \app\common\tools\ExportTools::excel($this->model, $where, $fields, $image_fields, $select_fields, $date_fields);

        return download($content, $this->model->getName() . date('YmdHis') . '.xlsx', true);
    }
}
