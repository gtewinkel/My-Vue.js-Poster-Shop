var PRICE = 9.99;
var LOAD_NUM = 12;

new Vue({
  el: "#app",
  data: {
    total: 0.0,
    items: [],
    cart: [],
    results: [],
    newSearch: "netherlands",
    lastSearch: "",
    loading: false,
    price: PRICE,
    pageSize: LOAD_NUM
  },
  methods: {
    addItem: function(index) {
      this.total += this.price;
      var item = this.items[index];
      var found = false;
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id == item.id) {
          found = true;
          this.cart[i].qty++;
          break;
        }
      }
      if (!found) {
        this.cart.push({
          id: item.id,
          title: item.title,
          price: this.price,
          qty: 1
        });
      }
    },
    inc: function(item) {
      item.qty++;
      this.total += item.price;
    },
    dec: function(item) {
      item.qty--;
      this.total -= item.price;
      if (item.qty <= 0) {
        for (var i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id == item.id) {
            this.cart.splice(i, 1);
            break;
          }
        }
      }
    },
    onSubmit: function() {
      this.items = [];
      this.loading = true;
      this.$http.get("/search/".concat(this.newSearch)).then(function(res) {
        this.pageSize = LOAD_NUM;
        this.results = res.data;
        this.items = res.data.slice(0, this.pageSize);
        this.lastSearch = this.newSearch;
        this.loading = false;
      });
    },
    appendItems: function() {
      this.pageSize += LOAD_NUM;
      this.items = this.results.slice(0, this.pageSize);
    }
  },
  filters: {
    currency: function(price) {
      return "$".concat(price.toFixed(2));
    }
  },
  mounted: function() {
    this.onSubmit();

    var vueInstance = this;
    var elem = document.getElementById("product-list-bottom");
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport(function() {
      vueInstance.appendItems();
    });
  }
});
