Component({
    properties: {
        data: Object,
        handle: Boolean
    },
    methods: {
        toDelete(e) {
            //组件间通信传递需要删除的数据id，让父组件根据此id去实现删除
            const { id } = e.currentTarget.dataset;
            this.triggerEvent('getdelete', id);
        },
        toUpdate(e) {
            //组件间通信传递需要修改的数据id
            const { info } = e.currentTarget.dataset;
            this.triggerEvent('getupdate', JSON.stringify(info));
        }
    }
})