var vm = new Vue({
    el: '#app',
    data: {
        totalMoney: 0,
        msgShow: false,
        checkAllFlag: false,
        delIndex: 0,
        productList: []
    },
    mounted: function(){
      this.$nextTick(function () {
          vm.cartView();
      });
    },
    filters:{
        money:function(value,type){
            if(type)
                return value.toFixed(2)+ " "+type;
            return "￥"+value.toFixed(2);
        }
    },
    methods: {
        cartView: function () {
           this.$http.get("data/cartData.json",{"id":123}).then(
               res=> (this.productList = res.data.result.list)
           )},
        changeQuantity: function (item,flag) {
            if(flag > 0){
                item.productQuantity ++;
            }else{
                if(item.productQuantity > 1)
                    item.productQuantity --;
            }
            this.calcTotalMoney();
        },
        slectProduct: function (item) {
            if(typeof(item.checked) == 'undefined'){
                Vue.set(item,'checked',true);
            }else{
                item.checked = !item.checked;
            }
            try{
                this.productList.forEach((item,index)=>{
                    if((typeof(item.checked) == 'undefined')||(item.checked == false)){
                        this.checkAllFlag = false;
                        throw new Error("取消全选！");    // 抛出异常跳出循环
                    }else if((index == (this.productList.length-1))&&(item.checked == true)){
                        this.checkAllFlag = true;
                    }
                });
            }catch(e){
                //console.log(e);
            };
            this.calcTotalMoney();
        },
        checkAll: function (flag) {
            if(this.productList.length == 0)
                return false;
            this.checkAllFlag = flag;
            this.productList.forEach(function(item,index){
                if(typeof(item.checked) == 'undefined'){
                    Vue.set(item,'checked',true);
                }else{
                    item.checked = flag;
                }
            });
            this.calcTotalMoney();
        },
        calcTotalMoney: function () {
            this.totalMoney = 0;
            var _this = this;
            this.productList.forEach(function(item,index){
                if(item.checked){
                   _this.totalMoney += item.productQuantity*item.productPrice;
                }
            })
        },
        delProduct: function () {
            this.productList.splice(this.delIndex,1);
            this.msgShow = false;
            this.calcTotalMoney();
            if(this.productList.length == 0)
                this.checkAllFlag = false;
        }
    }
})