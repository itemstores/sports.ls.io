<?php


namespace app\admin\controller\Vision;


use app\admin\model\VisionUsers;
use app\admin\model\VisionRecord;
use app\admin\traits\Curd;
use app\common\controller\AdminController;
use app\admin\service\annotation\ControllerAnnotation;
use app\admin\service\annotation\NodeAnotation;
use think\App;

/**
 * Class Users
 * @package app\admin\controller\mall
 * @ControllerAnnotation(title="店铺运营管理")
 */
class Users extends AdminController
{

    use Curd;

    protected $relationSearch = true;

    public function __construct(App $app)
    {
        parent::__construct($app);
        $this->model = new VisionUsers();
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
            $get = $this->request->get('', null, null);
            $page = isset($get['page']) && !empty($get['page']) ? $get['page'] : 1;
            $limit = isset($get['limit']) && !empty($get['limit']) ? $get['limit'] : 10;
            $group = isset($get['group']) && !empty($get['group']) ? $get['group'] : null;
            $filters = isset($get['filter']) && !empty($get['filter']) ? $get['filter'] : '{}';
            $ops = isset($get['op']) && !empty($get['op']) ? $get['op'] : '{}';

            $where = json_decode($filters, true);

            $count = $this->model->where($where)->count();
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
     * @NodeAnotation(title="添加")
     */
    public function add()
    {
        if ($this->request->isPost()) {
            $post = $this->request->post();

            $users = [];
            $users['member'] = $post['member'];
            $users['name'] = $post['name'];
            $users['phone'] = $post['phone'];
            $users['age'] = $post['age'];
            $users['birthday'] = $post['birthday'];
            $users['sex'] = $post['sex'];
            $users['create_time'] = $users['update_time'] = time();

            $record = [];
            $record['occupation'] = $post['occupation'];
            $record['vision_type'] = $post['vision_type'];
            $record['glasses'] = $post['glasses'];

            $record['r_sph'] = $post['r_sph'];
            $record['r_cyl'] = $post['r_cyl'];
            $record['r_ax'] = $post['r_ax'];
            $record['r_ipd'] = $post['r_ipd'];
            $record['r_iph'] = $post['r_iph'];
            $record['r_add'] = $post['r_add'];
            $record['r_correct'] = $post['r_correct'];
            $record['l_sph'] = $post['l_sph'];
            $record['l_cyl'] = $post['l_cyl'];
            $record['l_ax'] = $post['l_ax'];
            $record['l_ipd'] = $post['l_ipd'];
            $record['l_iph'] = $post['l_iph'];
            $record['l_add'] = $post['l_add'];
            $record['l_correct'] = $post['l_correct'];
            
            $record['optometry'] = $post['optometry'];
            $record['optician'] = $post['optician'];
            $record['quality'] = $post['quality'];
            $record['frame'] = $post['frame'];
            $record['frame_name'] = $post['frame_name'];
            $record['model'] = $post['model'];
            $record['color'] = $post['color'];
            $record['lens_name'] = $post['lens_name'];
            $record['refraction'] = $post['refraction'];
            $record['film'] = $post['film'];

            $record['lens_price'] = $post['lens_price'];
            $record['lens_number'] = $post['lens_number'];
            $record['lens_discount'] = $post['lens_discount'];
            $record['lens_discount_price'] = $post['lens_discount_price'];

            $record['frame_price'] = $post['frame_price'];
            $record['frame_number'] = $post['frame_number'];
            $record['frame_discount'] = $post['frame_discount'];
            $record['frame_discount_price'] = $post['frame_discount_price'];
            
            $record['total_price'] = $post['total_price'];
            $record['actual_price'] = $post['actual_price'];
            $record['remarks'] = $post['remarks'];
            $record['create_time'] = $record['update_time'] = time();

            try {

                $model_admin = $this->model->where('member', $post['member'])->find();

                if (!empty($model_admin)) {
                    throw new \Exception('会员已存在');
                }

                //$save = $this->model->save($users);

                $saveId = $this->model->insertGetId($users);

                if ($saveId) {
                    $record['vision_users_id'] = $saveId;
                    $visionRecord = new VisionRecord();
                    $record = $visionRecord->save($record);
                }
            } catch (\Exception $e) {
                $this->error('保存失败:' . $e->getMessage());
            }
            $record ? $this->success('保存成功') : $this->error('保存失败');
        }
        return $this->fetch();
    }

        /**
     * @NodeAnotation(title="编辑")
     */
    public function edit($id)
    {
        $row = $this->model->find($id);

        $record = new VisionRecord();
        $list = $record->where(['vision_users_id'=>$row->id])->order('create_time desc')->select();
        $row->recordList = $list;

        if ($this->request->isPost()) {
            $post = $this->request->post();
            try {
                $save = $row->save($post);
            } catch (\Exception $e) {
                $this->error('保存失败');
            }
            $save ? $this->success('保存成功') : $this->error('保存失败');
        }

        $this->assign('row', $row);
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

            $record = [];
            $record['occupation'] = $post['occupation'];
            $record['vision_type'] = $post['vision_type'];
            $record['glasses'] = $post['glasses'];

            $record['r_sph'] = $post['r_sph'];
            $record['r_cyl'] = $post['r_cyl'];
            $record['r_ax'] = $post['r_ax'];
            $record['r_ipd'] = $post['r_ipd'];
            $record['r_iph'] = $post['r_iph'];
            $record['r_add'] = $post['r_add'];
            $record['r_correct'] = $post['r_correct'];
            $record['l_sph'] = $post['l_sph'];
            $record['l_cyl'] = $post['l_cyl'];
            $record['l_ax'] = $post['l_ax'];
            $record['l_ipd'] = $post['l_ipd'];
            $record['l_iph'] = $post['l_iph'];
            $record['l_add'] = $post['l_add'];
            $record['l_correct'] = $post['l_correct'];
            
            $record['optometry'] = $post['optometry'];
            $record['optician'] = $post['optician'];
            $record['quality'] = $post['quality'];
            $record['frame'] = $post['frame'];
            $record['frame_name'] = $post['frame_name'];
            $record['model'] = $post['model'];
            $record['color'] = $post['color'];
            $record['lens_name'] = $post['lens_name'];
            $record['refraction'] = $post['refraction'];
            $record['film'] = $post['film'];

            $record['lens_price'] = $post['lens_price'];
            $record['lens_number'] = $post['lens_number'];
            $record['lens_discount'] = $post['lens_discount'];
            $record['lens_discount_price'] = $post['lens_discount_price'];

            $record['frame_price'] = $post['frame_price'];
            $record['frame_number'] = $post['frame_number'];
            $record['frame_discount'] = $post['frame_discount'];
            $record['frame_discount_price'] = $post['frame_discount_price'];
            
            $record['total_price'] = $post['total_price'];
            $record['actual_price'] = $post['actual_price'];
            $record['remarks'] = $post['remarks'];
            $record['create_time'] = $record['update_time'] = time();

            try {
                $record['vision_users_id'] = $id;
                $visionRecord = new VisionRecord();
                $record = $visionRecord->save($record);
            } catch (\Exception $e) {
                $this->error('保存失败');
            }
            $record ? $this->success('保存成功') : $this->error('保存失败');
        }
        $this->assign('row', $row);
        return $this->fetch();
    }

    public function read($id)
    {
        $row = $this->model->find($id);

        $record = new VisionRecord();
        $list = $record->where(['vision_users_id'=>$row->id])->order('create_time desc')->select();
        $row->recordList = $list;

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
