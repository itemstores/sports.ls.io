define(["jquery", "easy-admin"], function ($, ea) {

    var init = {
        table_elem: '#currentTable',
        table_render_id: 'currentTableRenderId',
        index_url: 'sports.ball/index',
        add_url: 'sports.ball/add',
        edit_url: 'sports.ball/edit',
        delete_url: 'sports.ball/delete',
        export_url: 'sports.ball/export',
        modify_url: 'sports.ball/modify',
    };

    var Controller = {

        index: function () {
            ea.table.render({
                init: init,
                toolbar: ['refresh'],
                cols: [[
                    {type: "checkbox"},
                    {field: 'id', width: 80, title: 'ID'},
                    {field: 'group_name', minWidth: 80, title: '赛程小组'},
                    {field: 'ball_name', width: 200, title: '队伍', edit: 'text'},
                    {field: 'ball_logo', minWidth: 80, title: '队伍logo', search: false, templet: ea.table.image},
                    {field: 'match_rank', minWidth: 80, title: '排名'},
                    {field: 'match_count', minWidth: 80, title: '赛'},
                    {field: 'match_won', minWidth: 80, title: '胜'},
                    {field: 'match_got', minWidth: 80, title: '平'},
                    {field: 'match_lost', minWidth: 80, title: '负'},
                    {field: 'match_ga', minWidth: 80, title: '进球'},
                    {field: 'match_pts', minWidth: 80, title: '积分'},
                    /*{width: 250, title: '操作', templet: ea.table.tool},*/
                    {
                        width: 200,
                        title: '操作',
                        templet: ea.table.tool,
                        fixed: 'right',
                        operat: [
                            [{
                                text: '编辑',
                                url: init.edit_url,
                                method: 'open',
                                auth: 'edit',
                                class: 'layui-btn layui-btn-xs layui-btn-success',
                                extend: 'data-full="true"',
                            },]
						]
                    }
                ]],
            });

            ea.listen();
        },
        add: function () {
            ea.listen();
        },
        edit: function () {
            ea.listen();
        },
    };
    return Controller;
});