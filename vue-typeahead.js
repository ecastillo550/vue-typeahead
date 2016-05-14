import Vue from 'vue'

export default {
  props: ['src'],
  data () {
    return {
      items: [],
      query: '',
      current: -1,
      loading: false
    }
  },

  ready () {
    if (! this.$http) {
      this.warn('`vue-resource` plugin')
    }

    if (! this.src) {
      this.warn('`src` property')
    }

    if (! this.onHit) {
      this.warn('`onHit` method')
    }    
  },

  computed: {
    hasItems () {
      return this.items.length > 0
    },

    isEmpty () {
      return !this.query
    },

    isDirty () {
      return !!this.query
    }
  },

  methods: {
    warn (msg) {
      Vue.util.warn('Typeahead requires the ' + msg)
    },

    update () {
      if (! this.query) {
        this.reset()
        return
      }

      this.loading = true
      var auxArray = [];

      var self = this;
      function filter(item) {
        for (var property in item) {
          if (item.hasOwnProperty(property)) {
            if (typeof item[property] === 'string') {
              if(item[property].match(new RegExp(self.query, 'i'))) {
                //auxArray.push(item);
                return true;
              }
            } else if(typeof item[property] === 'object'){
              return filter(item[property]);
            }
          }
        }
      }

      this.src.filter(function (item) {
        if(filter(item)){
          auxArray.push(item);
        }
      }.bind(this));


      if (this.query) {
        auxArray = this.prepareResponseData ? this.prepareResponseData(auxArray) : auxArray
        this.items = !!this.limit ? auxArray.slice(0, this.limit) : auxArray;
        this.current = -1
        this.loading = false
      }
      // this.$http.get(this.src, Object.assign({q:this.query}, this.data))
      //   .then(function (response) {
      //     if (this.query) {
      //       var data = response.data
      //       data = this.prepareResponseData ? this.prepareResponseData(data) : data
      //       this.items = !!this.limit ? data.slice(0, this.limit) : data
      //       this.current = -1
      //       this.loading = false
      //     }
      //   }.bind(this))
    },

    reset () {
      this.items = []
      this.query = ''
      this.loading = false
    },

    setActive (index) {
      this.current = index
    },

    activeClass (index) {
      return {
        active: this.current == index
      }
    },

    hit () {
      if (this.current === -1) return

      this.onHit(this.items[this.current])

    },

    up () {
      if (this.current > 0)
        this.current--
      else if (this.current == -1)
        this.current = this.items.length - 1
      else
        this.current = -1
    },

    down () {
      if (this.current < this.items.length-1)
        this.current++
      else
        this.current = -1
    }
  }
}
