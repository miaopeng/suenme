var Puzzle = new Class({
    Implements: [Options],

    options: {
        rotationDeg: 20,
        delay: 40,
        duration: 900,
        transition: 'back:out'
    },

    initialize: function(config, options) {
        this.setOptions(options);
        this.wrapper = config.wrapper;
        this.items = config.items;
        this.btnPanel = config.btnPanel;
        this.btns = {
            startPlay: this.btnPanel.getElement('.btn-start'),
            returnToMain: this.btnPanel.getElement('.btn-return')
        };
        this.avatarPanel = config.avatarPanel;
        this.infoPanel = config.infoPanel;
        this.collapsed = false;
        this.select = null;
        this.setDefaults();
    },

    setDefaults: function() {
        var pos;

        this.setStatus('idle'); // "idle" or "waiting" or "buzy";
        this.infoPanel.set('tween', {transition: Fx.Transitions.Elastic.easeOut});

        this.items.each(function(stackItem) {
            pos = stackItem.getPosition(this.wrapper);

            stackItem.store('default:coords', pos);
            stackItem.store('cur:coords', pos);

            stackItem.set('styles', {
                top: pos.y,
                left: pos.x
            });

            stackItem.set('morph', {
                transition: this.options.transition,
                duration: this.options.duration
            });

            // MooTools bug (?)
            (function() {
                this.setStyle('position', 'absolute');
            }).delay(1, stackItem);
        }, this);

        this.attachActions();
    },

    /**
     * flat els or stack els to altEl
     * @param {El} altEl [option] elment which all items stack to.
     * @param {Function}
     *  callback [option] callback func after all items stacked.
     */
    reStack: function(altEl, callback) {
        var self = this, deg = self.options.rotationDeg;
        this.items.each(function(item, i, items) {
            (function() {
                var el = [altEl, this].pick();
                var rand = (altEl ? Number.random(-deg, deg) : 0);

                this.set('styles', {
                    '-webkit-transform': 'rotate(' + rand + 'deg)',
                    '-moz-transform': 'rotate(' + rand + 'deg)'
                });

                new Fx.Morph(this, {}).start({
                    top: el.retrieve('default:coords').y + rand,
                    left: el.retrieve('default:coords').x + rand
                }).chain(function() {
                    if (i === items.length - 1 && typeof(callback) == 'function') {
                        callback();
                    }
                });

             }).delay(self.options.delay * i, item);
        });
    },

    /**
     * check player win the game or not
     */
    checkWin: function() {
        var win = true;
        this.items.each(function(item) {
            var x = item.getStyle('left').toInt(),
                y = item.getStyle('top').toInt(),
                defaultPos = item.retrieve('default:coords');
            if (x != defaultPos.x || y != defaultPos.y) {
                win = false;
                return false;
            }
        }.bind(this));

        if (win) {
          this._win();
        }
    },

    /**
     * display winning messages
     */
    _win: function() {
        $('time').innerHTML = (+new Date() - this.startTime) / 1000 + ' seconds.';
        this.infoPanel.removeClass('hide').tween('margin-top', 40);
        this.setStatus('idle');
    },

    /**
     * close winning messages
     */
    _closewin: function() {
        this.infoPanel.tween('margin-top', 0).addClass('hide');
    },

    /**
     * clear selection status
     */
    clearSelect: function() {
        if (this.select) {
            this.items.removeClass('selected');
            this.select = null;
        }
    },

    /**
     * switch two element's position
     * @param {El} a elment to switch.
     * @param {El} b elment to switch.
     */
    exchange: function(a, b) {
        var aCoords = a.retrieve('cur:coords'),
            bCoords = b.retrieve('cur:coords');

        this.setStatus('buzy');

        if (aCoords && bCoords) {

            new Fx.Morph(a, {}).start({
              top: bCoords.y,
              left: bCoords.x
            }).chain(function() {
              a.store('cur:coords', bCoords);
            });

            new Fx.Morph(b, {}).start({
              top: aCoords.y,
              left: aCoords.x
            }).chain(function() {
              this.clearSelect();
              b.store('cur:coords', aCoords);
              this.setStatus('waiting');
              this.checkWin.delay(1, this);
            }.bind(this));
        }
    },

    /**
     * return the random reordered array
     * @param {Array} array original array.
     */
    getRandom: function(array) {
        var len = array.length - 1, rand, temp;
        for (; len > 0; len--) {
            rand = Math.round(Math.random() * (len - 1));
            temp = array[len];
            array[len] = array[rand];
            array[rand] = temp;
        }
        return array;
    },

    /**
     * mess items and start
     */
    start: function() {
        this.setStatus('waiting');
        this._closewin();
        this.reStack(this.items[0], messItems.bind(this));

        function messItems() {
            var order = [], rand = [];
            this.items.each(function(item, i) {
                order.push(i);
            });
            rand = this.getRandom(order);

            this.items.each(function(item, index) {
                var randPos = this.items[rand[index]].retrieve('default:coords');

                item
                  .store('cur:coords', randPos)
                  .set('styles', {
                      '-webkit-transform': 'rotate(0deg)',
                      '-moz-transform': 'rotate(0deg)'
                  })
                  .morph({
                      top: randPos.y,
                      left: randPos.x
                  });
            }.bind(this));

            this.collapsed = false;
            this.startTime = +new Date();
        }
    },

    /**
     * stop cur game and return beginning
     */
    cancel: function() {
        this.setStatus('idle');
        this.reStack(this.items[0], this.reStack.bind(this));
    },

    /**
     * set the game status
     * @param {String} status Game status string idle/waiting/buzy.
     */
    setStatus: function(status) {
        this.status = status;
        switch (status) {
            case 'idle' :
                this.clearSelect();
                this.startTime = null;
                this.btns.startPlay.removeClass('hide');
                this.btns.returnToMain.addClass('hide');
                break;
            case 'waiting' :
                this.btns.startPlay.addClass('hide');
                this.btns.returnToMain.removeClass('hide');
                break;
            default :
                break;
        }
    },

    /**
     * bind events
     */
    attachActions: function() {
        var self = this;

        this.btns.startPlay.addEvent('click', this.start.bind(this));
        this.btns.returnToMain.addEvent('click', this.cancel.bind(this));

        this.avatarPanel.addEvent('click:relay(li)', function(e) {
            if (self.status === 'idle') {
                self.wrapper.className = this.get('data-avatar');
                this.getSiblings().removeClass('hi');
                this.addClass('hi');
                self._closewin();
            }
        });

        this.items.addEvents({
            click: function(e) {
                var el = $(e.target);
                if (this.collapsed === false && this.status === 'waiting') {
                    el.addClass('selected');

                    if (this.select) {
                        this.exchange(this.select, el);
                    }
                    else {
                        this.select = el;
                    }
                }
            }.bind(this),

            dblclick: function(e) {
                if (this.status !== 'idle') {
                    return;
                }
                this.clearSelect();
                if (this.collapsed) {
                    this.reStack();
                    this.collapsed = false;
                } else {
                    var target = $(e.target);
                    if (target.retrieve('default:coords')) {
                       this.reStack(target);
                       this.collapsed = true;
                    }
                }
            }.bind(this)
        });
    }
});


