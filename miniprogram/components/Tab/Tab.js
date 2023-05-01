Component({
    properties: {
        tabList: Array
    },
    data: {
        select: 0
    },
    methods: {
        selectTab(e) {
            const { id } = e.currentTarget.dataset;
            this.setData({
                select: id,
            })
            this.triggerEvent('gettab', id);//组件间通信，该函数向父组件传参id
        },
    }
})