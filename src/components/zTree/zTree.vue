<template>
  <div>
    <a-input type="text" :value="valTree" placeholder="请输入要查询的名称" @change="valueChange" :id="ipt" v-if="ishow" @focus="valueChange"/>
    <div class="ztree" :id="ztreeId"></div>
  </div>
</template>

<script>
import * as $ from 'jquery'
if (!window.jQuery) {
  window.jQuery = $
}

require('@ztree/ztree_v3/js/jquery.ztree.all')
require('@ztree/ztree_v3/js/jquery.ztree.exhide')

export default {
  props: {
    setting: {
      type: Object,
      require: false,
      default: function() {
        return {}
      }
    },
    nodes: {
      type: Array,
      require: true,
      default: function() {
        return []
      }
    },
    ishow: {
      type: Boolean,
      require: false,
      default: false
    },
    id:{
      type:String,
      default:'ipt'
    }
  },
  watch:{
    // ipt() {
    //   return '#ztree_1' + parseInt(Math.random() * 1e10)
    // }
  },
  data() {
    return {
      valTree: '',
      ipt:'ztree_1' + parseInt(Math.random() * 1e10),
      visibale: false,
      ztreeId: 'ztree_' + parseInt(Math.random() * 1e10),
      ztreeObj: null,
      list: [],
      ztreeSetting: {
        view: {
          showIcon: false // default to hide icon
        },
        callback: {
          onAsyncError: (...arg) => {
            this.$emit('onAsyncError', ...arg)
          },
          onAsyncSuccess: (...arg) => {
            this.$emit('onAsyncSuccess', ...arg)
          },
          onCheck: (...arg) => {
            this.$emit('onCheck', ...arg)
          },
          onClick: (...arg) => {
            this.$emit('onClick', ...arg)
          },
          onCollapse: (...arg) => {
            this.$emit('onCollapse', ...arg)
          },
          onDblClick: (...arg) => {
            this.$emit('onDblClick', ...arg)
          },
          onDrag: (...arg) => {
            this.$emit('onDrag', ...arg)
          },
          onDragMove: (...arg) => {
            this.$emit('onDragMove', ...arg)
          },
          onDrop: (...arg) => {
            this.$emit('onDrop', ...arg)
          },
          onExpand: (...arg) => {
            this.$emit('onExpand', ...arg)
          },
          onMouseDown: (...arg) => {
            this.$emit('onMouseDown', ...arg)
          },
          onMouseUp: (...arg) => {
            this.$emit('onMouseUp', ...arg)
          },
          onRemove: (...arg) => {
            this.$emit('onRemove', ...arg)
          },
          onRename: (...arg) => {
            this.$emit('onRename', ...arg)
          },
          onRightClick: (...arg) => {
            this.$emit('onRightClick', ...arg)
          }
        }
      }
    }
  },
  watch: {
    nodes: {
      handler: function(nodes) {
        this.list = nodes
        // update tree
        if (this.ztreeObj) {
          this.ztreeObj.destroy()
        }
        this.$nextTick(() => {
          this.ztreeObj = $.fn.zTree.init(
            $('#' + this.ztreeId),
            Object.assign({}, this.ztreeSetting, this.setting),
            this.list
          )
          this.$emit('onCreated', this.ztreeObj)
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    valueChange(e) {
      // console.log(e)
      this.fuzzySearch(this.ztreeId, `#${this.ipt}`, null, true)
      
      this.valTree = e.target.value
    },
    // 模糊搜索
    fuzzySearch(zTreeId, searchField, isHighLight, isExpand) {
      var zTreeObj = $.fn.zTree.getZTreeObj(zTreeId) //get the ztree object by ztree id
      if (!zTreeObj) {
        alert('fail to get ztree object')
      }
      var nameKey = zTreeObj.setting.data.key.name //get the key of the node name
      isHighLight = isHighLight === false ? false : true //default true, only use false to disable highlight
      isExpand = isExpand ? true : false // not to expand in default
      zTreeObj.setting.view.nameIsHTML = isHighLight //allow use html in node name for highlight use
      var metaChar = '[\\[\\]\\\\^\\$\\.\\|\\?\\*\\+\\(\\)]' //js meta characters
      var rexMeta = new RegExp(metaChar, 'gi') //regular expression to match meta characters
      // keywords filter function
      function ztreeFilter(zTreeObj, _keywords, callBackFunc) {
        if (!_keywords) {
          _keywords = '' //default blank for _keywords
        }
        
        // function to find the matching node
        function filterFunc(node) {
          if (node && node.oldname && node.oldname.length > 0) {
            node[nameKey] = node.oldname //recover oldname of the node if exist
          }
          zTreeObj.updateNode(node) //update node to for modifications take effect
          if (_keywords.length == 0) {
            //return true to show all nodes if the keyword is blank
            zTreeObj.showNode(node)
            zTreeObj.expandNode(node, isExpand)
            return true
          }
          //transform node name and keywords to lowercase
          if (node[nameKey] && node[nameKey].toLowerCase().indexOf(_keywords.toLowerCase()) != -1) {
            if (isHighLight) {
              //highlight process
              //a new variable 'newKeywords' created to store the keywords information
              //keep the parameter '_keywords' as initial and it will be used in next node
              //process the meta characters in _keywords thus the RegExp can be correctly used in str.replace
              var newKeywords = _keywords.replace(rexMeta, function(matchStr) {
                //add escape character before meta characters
                return '\\' + matchStr
              })
              node.oldname = node[nameKey] //store the old name
              var rexGlobal = new RegExp(newKeywords, 'gi') //'g' for global,'i' for ignore case
              //use replace(RegExp,replacement) since replace(/substr/g,replacement) cannot be used here
              node[nameKey] = node.oldname.replace(rexGlobal, function(originalText) {
                //highlight the matching words in node name
                var highLightText = originalText
                //   '<span style="color: whitesmoke;background-color: darkred;">' + originalText + '</span>'
                return highLightText
              })
              zTreeObj.updateNode(node) //update node for modifications take effect
            }
            zTreeObj.showNode(node) //show node with matching keywords
            return true //return true and show this node
          }

          zTreeObj.hideNode(node) // hide node that not matched
          return false //return false for node not matched
        }

        var nodesShow = zTreeObj.getNodesByFilter(filterFunc) //get all nodes that would be shown
        processShowNodes(nodesShow, _keywords) //nodes should be reprocessed to show correctly
      }

      /**
       * reprocess of nodes before showing
       */
      function processShowNodes(nodesShow, _keywords) {
        if (nodesShow && nodesShow.length > 0) {
          //process the ancient nodes if _keywords is not blank
          if (_keywords.length > 0) {
            $.each(nodesShow, function(n, obj) {
              var pathOfOne = obj.getPath() //get all the ancient nodes including current node
              if (pathOfOne && pathOfOne.length > 0) {
                //i < pathOfOne.length-1 process every node in path except self
                for (var i = 0; i < pathOfOne.length - 1; i++) {
                  zTreeObj.showNode(pathOfOne[i]) //show node
                  zTreeObj.expandNode(pathOfOne[i], true) //expand node
                }
              }
            })
          } else {
            //show all nodes when _keywords is blank and expand the root nodes
            var rootNodes = zTreeObj.getNodesByParam('level', '0') //get all root nodes
            $.each(rootNodes, function(n, obj) {
              zTreeObj.expandNode(obj, true) //expand all root nodes
            })
          }
        }
      }

      //listen to change in input element
      $(searchField).bind('input propertychange', function() {
        var _keywords = $(this).val()
        searchNodeLazy(_keywords) //call lazy load
      })

      var timeoutId = null
      var lastKeyword = ''
      // excute lazy load once after input change, the last pending task will be cancled
      function searchNodeLazy(_keywords) {
        if (timeoutId) {
          //clear pending task
          clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(function() {
          if (lastKeyword === _keywords) {
            return
          }
          ztreeFilter(zTreeObj, _keywords) //lazy load ztreeFilter function
          // $(searchField).focus();//focus input field again after filtering
          lastKeyword = _keywords
        }, 500)
      }
    }
  }
}
</script>

<style scoped>
/* beauty ztree! */
.ztree {
  text-align: left;
  font-size: 14px;
}
.ztree >>> li {
  list-style-type: none;
  white-space: nowrap;
  outline: none;
}
.ztree >>> li ul {
  position: relative;
  padding: 0 0 0 20px;
  margin: 0;
}
.ztree >>> .line:before {
  position: absolute;
  top: 0;
  left: 10px;
  height: 100%;
  content: '';
  border-right: 1px dotted #dbdbdb;
}
.ztree >>> .roots_docu:before,
.ztree >>> .roots_docu:after,
.ztree >>> .center_docu:before,
.ztree >>> .bottom_docu:before,
.ztree >>> .center_docu:after,
.ztree >>> .bottom_docu:after {
  position: absolute;
  content: '';
  border: 0 dotted #dbdbdb;
}
.ztree >>> .roots_docu:before {
  left: 10px;
  height: 50%;
  top: 50%;
  border-left-width: 1px;
}
.ztree >>> .roots_docu:after {
  top: 50%;
  left: 11px;
  width: 50%;
  border-top-width: 1px;
}
.ztree >>> .center_docu:before {
  left: 10px;
  height: 100%;
  border-left-width: 1px;
}
.ztree >>> .center_docu:after {
  top: 50%;
  left: 11px;
  width: 50%;
  border-top-width: 1px;
}
.ztree >>> .bottom_docu:before {
  left: 10px;
  height: 50%;
  border-left-width: 1px;
}
.ztree >>> .bottom_docu:after {
  top: 50%;
  left: 11px;
  width: 50%;
  border-top-width: 1px;
}
.ztree >>> li a {
  display: inline-block;
  line-height: 22px;
  height: 22px;
  margin: 0;
  padding: 0 3px;
  cursor: pointer;
  transition: none;
  vertical-align: middle;
  color: #555555;
}
.ztree >>> .curSelectedNode {
  color: #000;
  border-radius: 4px;
  background-color: #c9e9f7;
}
.ztree >>> .curSelectedNode_Edit {
  height: 20px;
  opacity: 0.8;
  color: #000;
  border: 1px #6cc2e8 solid;
  background-color: #9dd6f0;
}
.ztree >>> .tmpTargetNode_inner {
  opacity: 0.8;
  color: #fff;
  background-color: #4fcbf0;
  filter: alpha(opacity=80);
}
.ztree >>> .rename {
  font-size: 12px;
  line-height: 22px;
  width: 80px;
  height: 22px;
  margin: 0;
  padding: 0;
  vertical-align: top;
  border: 0;
  background: none;
}
.ztree >>> .button {
  position: relative;
  display: inline-block;
  line-height: 22px;
  height: 22px;
  width: 22px;
  cursor: pointer;
  text-align: center;
  vertical-align: middle;
}

.ztree >>> .button.edit {
  color: #25ae88;
}
.ztree >>> .button.remove {
  color: #cb4042;
}
.ztree >>> .button.chk {
  position: relative;
  width: 14px;
  height: 14px;
  margin: 0 4px 0 0;
  border: 1px solid #d7dde4;
  border-radius: 2px;
  background: #fff;
}
.ztree >>> .chk.radio_true_full,
.ztree >>> .chk.radio_false_full,
.ztree >>> .chk.radio_true_full_focus,
.ztree >>> .chk.radio_false_full_focus,
.ztree >>> .chk.radio_false_disable,
.ztree >>> .chk.radio_true_disable,
.ztree >>> .chk.radio_true_part,
.ztree >>> .chk.radio_false_part,
.ztree >>> .chk.radio_true_part_focus,
.ztree >>> .chk.radio_false_part_focus {
  border-radius: 8px;
}
.ztree >>> .button.chk:after {
  position: absolute;
  top: 1px;
  left: 4px;
  width: 4px;
  height: 8px;
  content: '';
  transition: -webkit-transform 0.2s ease-in-out;
  transition: transform 0.2s ease-in-out;
  transition: transform 0.2s ease-in-out, -webkit-transform 0.2s ease-in-out;
  -webkit-transform: rotate(0deg) scale(0);
  transform: rotate(0deg) scale(0);
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
}
.ztree >>> .button.checkbox_false_full_focus {
  border-color: #ccc;
}
.ztree >>> .button.checkbox_true_full,
.ztree >>> .button.checkbox_true_full_focus,
.ztree >>> .button.checkbox_true_part,
.ztree >>> .button.checkbox_true_part_focus,
.ztree >>> .button.checkbox_true_disable {
  border-color: #39f;
  background-color: #39f;
}
.ztree >>> .button.checkbox_true_full:after,
.ztree >>> .button.checkbox_true_full_focus:after,
.ztree >>> .button.checkbox_true_disable:after {
  -webkit-transform: rotate(45deg) scale(1);
  transform: rotate(45deg) scale(1);
}
.ztree >>> .button.checkbox_true_part:after,
.ztree >>> .button.checkbox_true_part_focus:after {
  top: 5px;
  left: 2px;
  width: 10px;
  height: 1px;
  -webkit-transform: rotate(0deg) scale(1);
  transform: rotate(0deg) scale(1);
  border-right: 0;
}
.ztree >>> .button.radio_true_full,
.ztree >>> .chk.radio_true_full_focus,
.ztree >>> .chk.radio_true_part,
.ztree >>> .chk.radio_true_part_focus {
  border-color: #39f;
}
.ztree >>> .button.radio_true_full:after,
.ztree >>> .chk.radio_true_full_focus:after,
.ztree >>> .chk.radio_true_part:after,
.ztree >>> .chk.radio_true_part_focus:after {
  top: 3px;
  left: 3px;
  width: 8px;
  -webkit-transform: rotate(0deg) scale(1);
  transform: rotate(0deg) scale(1);
  border: 0;
  border-radius: 4px;
  background: #39f;
}
.ztree >>> .button.checkbox_true_disable,
.ztree >>> .button.checkbox_false_disable,
.ztree >>> .chk.radio_false_disable,
.ztree >>> .chk.radio_true_disable {
  cursor: not-allowed;
}
.ztree >>> .button.checkbox_false_disable {
  background-color: #f3f3f3;
}
.ztree >>> .button.noline_close:before,
.ztree >>> .button.noline_open:before,
.ztree >>> .button.root_open:before,
.ztree >>> .button.root_close:before,
.ztree >>> .button.roots_open:before,
.ztree >>> .button.roots_close:before,
.ztree >>> .button.bottom_open:before,
.ztree >>> .button.bottom_close:before,
.ztree >>> .button.center_open:before,
.ztree >>> .button.center_close:before {
  position: absolute;
  top: 5px;
  left: 5px;
  content: '';
  transition: -webkit-transform ease 0.3s;
  transition: transform ease 0.3s;
  transition: transform ease 0.3s, -webkit-transform ease 0.3s;
  -webkit-transform: rotateZ(0deg);
  transform: rotateZ(0deg);
  -webkit-transform-origin: 25% 50%;
  transform-origin: 25% 50%;
  border: 6px solid;
  border-color: transparent transparent transparent #666;
}
.ztree >>> .button.noline_open:before,
.ztree >>> .button.root_open:before,
.ztree >>> .button.roots_open:before,
.ztree >>> .button.bottom_open:before,
.ztree >>> .button.center_open:before {
  -webkit-transform: rotateZ(90deg);
  transform: rotateZ(90deg);
}
.ztree >>> .button.ico_loading {
  margin-right: 2px;
  background: url('data:image/gif;base64,R0lGODlhEAAQAKIGAMLY8YSx5HOm4Mjc88/g9Ofw+v///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgAGACwAAAAAEAAQAAADMGi6RbUwGjKIXCAA016PgRBElAVlG/RdLOO0X9nK61W39qvqiwz5Ls/rRqrggsdkAgAh+QQFCgAGACwCAAAABwAFAAADD2hqELAmiFBIYY4MAutdCQAh+QQFCgAGACwGAAAABwAFAAADD1hU1kaDOKMYCGAGEeYFCQAh+QQFCgAGACwKAAIABQAHAAADEFhUZjSkKdZqBQG0IELDQAIAIfkEBQoABgAsCgAGAAUABwAAAxBoVlRKgyjmlAIBqCDCzUoCACH5BAUKAAYALAYACgAHAAUAAAMPaGpFtYYMAgJgLogA610JACH5BAUKAAYALAIACgAHAAUAAAMPCAHWFiI4o1ghZZJB5i0JACH5BAUKAAYALAAABgAFAAcAAAMQCAFmIaEp1motpDQySMNFAgA7')
    0 center no-repeat;
}
.ztree >>> .tmpTargetzTree {
  opacity: 0.8;
  background-color: #2ea9df;
  filter: alpha(opacity=80);
}
.ztree >>> .tmpzTreeMove_arrow {
  position: absolute;
  width: 18px;
  height: 18px;
  color: #4fcbf0;
}
.ztree >>> .ztree.zTreeDragUL {
  overflow: hidden;
  position: absolute;
  width: auto;
  height: auto;
  margin: 0;
  padding: 0;
  opacity: 0.8;
  border: 1px #176b53 dotted;
  background-color: #dbdbdb;
  filter: alpha(opacity=80);
}
.zTreeMask {
  position: absolute;
  z-index: 10000;
  opacity: 0;
  background-color: #cfcfcf;
  filter: alpha(opacity=0);
}
#ipt {
  margin-bottom: 10px;
}
</style>
