define(["jquery", "easy-admin"], function ($, ea) {

    var init = {
        table_elem: '#currentTable',
        table_render_id: 'currentTableRenderId',
        index_url: 'vision.users/index',
        add_url: 'vision.users/add',
        edit_url: 'vision.users/edit',
        delete_url: 'vision.users/delete',
        export_url: 'vision.users/export',
        modify_url: 'vision.users/modify',
        stock_url: 'vision.users/stock',
        read_url: 'vision.users/read',
    };

    var Controller = {

        index: function () {
            ea.table.render({
                init: init,
                totalRow: true,
                toolbar: ['refresh',
                    [{
                        text: '添加',
                        url: init.add_url,
                        method: 'open',
                        auth: 'add',
                        class: 'layui-btn layui-btn-normal layui-btn-sm',
                        icon: 'fa fa-plus ',
                        extend: 'data-full="true"',
                    }],
                    'delete', 'export'],
                cols: [[
                    { type: "checkbox" },
                    { field: 'id', width: 80, title: 'ID', totalRowText: '合计：', search: 'disable' },
                    { field: 'member', minWidth: 80, title: '会员卡号' },
                    { field: 'name', minWidth: 80, title: '姓名' },
                    { field: 'phone', minWidth: 80, title: '电话' },
                    { field: 'sex', minWidth: 80, title: '性别', search: 'disable' },
                    { field: 'age', minWidth: 80, title: '年龄', search: 'disable' },
                    { field: 'birthday', minWidth: 80, title: '生日', search: 'disable' },
                    // { field: 'status', title: '状态', width: 85, selectList: { 0: '禁用', 1: '启用' }, templet: ea.table.switch },
                    { field: 'create_time', minWidth: 80, title: '创建时间', search: 'disable' },
                    {
                        width: 250,
                        title: '操作',
                        templet: ea.table.tool,
                        fixed: 'right',
                        operat: [
                            [{
                                text: '测配记录',
                                url: init.stock_url,
                                method: 'open',
                                auth: 'edit',
                                class: 'layui-btn layui-btn-xs layui-btn-normal',
                                extend: 'data-full="true"',
                            },
                            {
                                text: '编辑',
                                url: init.edit_url,
                                method: 'open',
                                auth: 'edit',
                                class: 'layui-btn layui-btn-xs layui-btn-success',
                                extend: 'data-full="true"',
                            }, 
                            
                            {
                                text: '详情',
                                url: init.read_url,
                                method: 'open',
                                auth: 'edit',
                                extend: 'data-full="true"',
                                class: 'layui-btn layui-btn-xs layui-btn-primary',
                            },],
                            'delete']
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