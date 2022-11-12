define(["jquery", "easy-admin"], function ($, ea) {

    var init = {
        table_elem: '#currentTable',
        table_render_id: 'currentTableRenderId',
        index_url: 'sports.worldcup/index',
        add_url: 'sports.worldcup/add',
        edit_url: 'sports.worldcup/edit',
        delete_url: 'sports.worldcup/delete',
        export_url: 'sports.worldcup/export',
        modify_url: 'sports.worldcup/modify',
        stock_url: 'sports.worldcup/stock',
        read_url: 'sports.worldcup/read',
    };

    var Controller = {

        index: function () {
            ea.table.render({
                init: init,
                totalRow: true,
                toolbar: ['refresh'],
                cols: [[
                    { type: "checkbox" },
                    { field: 'id', width: 80, title: 'ID', totalRowText: '合计：' },
                    { field: 'group_name', minWidth: 120, title: '赛程小组' },
                    { field: 'match_time', minWidth: 200, title: '比赛时间', search: 'range' },
                    {
                        field: 'match_state', width: 120, title: '比赛状态',
                        valueParser(value) {
							if (value == 1){
								return '<a class="layui-btn layui-btn-xs layui-btn-success">进行中</a>';
							} else if (value == 2) {
								return '<a class="layui-btn layui-btn-xs layui-btn-danger">已结束</a>';
							} else {
								return '<a class="layui-btn layui-btn-xs layui-btn-normal">未开始</a>';
							}
                        }
                    },
                    {
                        field: 'open_state', width: 120, title: '开盘状态',
                        valueParser(value) {
							if (value == 1){
								return '<a class="layui-btn layui-btn-xs layui-btn-success">赛前盘</a>';
							} else if (value == 2) {
								return '<a class="layui-btn layui-btn-xs layui-btn-danger">已关盘</a>';
							} else {
								return '<a class="layui-btn layui-btn-xs layui-btn-normal">未开盘</a>';
							}
                        }
                    },
                    { field: 'home_team', minWidth: 120, title: '主队', },
                    { field: 'home_logo', minWidth: 120, title: '主队logo', search: false, templet: ea.table.image },
                    { field: 'home_let_init', minWidth: 150, title: '主队让分初始值', },
                    { field: 'home_let_score', minWidth: 150, title: '主队让分具体值', },
                    { field: 'home_let_odds', minWidth: 150, title: '主队让分赔率值', },
                    { field: 'home_size_init', minWidth: 150, title: '主队大小初始值', },
                    { field: 'home_size_score', minWidth: 150, title: '主队大小具体值', },
                    { field: 'home_size_odds', minWidth: 150, title: '主队大小赔率值', },
                    { field: 'away_team', minWidth: 120, title: '客队', },
                    { field: 'away_logo', minWidth: 120, title: '客队logo', search: false, templet: ea.table.image },
                    { field: 'away_let_init', minWidth: 150, title: '客队让分初始值', },
                    { field: 'away_let_score', minWidth: 150, title: '客队让分具体值', },
                    { field: 'away_let_odds', minWidth: 150, title: '客队让分赔率值', },
                    { field: 'away_size_init', minWidth: 150, title: '客队大小初始值', },
                    { field: 'away_size_score', minWidth: 150, title: '客队大小具体值', },
                    { field: 'away_size_odds', minWidth: 150, title: '客队大小赔率值', },
                    { field: 'create_time', minWidth: 200, title: '创建时间', search: 'range' },
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
                            }, {
                                text: '详情',
                                url: init.read_url,
                                method: 'open',
                                auth: 'edit',
                                extend: 'data-full="true"',
                                class: 'layui-btn layui-btn-xs layui-btn-primary',
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
        stock: function () {
            ea.listen();
        },
        read: function () {
            ea.listen();
        },
    };
    return Controller;
});