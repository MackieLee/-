Component({
    externalClasses: ['i-class'],
    properties: {
        full: {
            type: Boolean,
            value: false
        },
        thumb: {
            type: String,
            value: ''
        },
        title: {
            type: String,
            value: ''
        },
        extra: {
            type: String,
            value: ''
        }
    },
    methods: {
      bindCardTap: function() {
        this.triggerEvent('tapevent', {})
      }
    }
});
