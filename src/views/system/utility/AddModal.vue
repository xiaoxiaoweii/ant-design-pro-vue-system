<template>
  <a-modal
    :title="!!dataObj.id ? '编辑' : '新增'"
    :width="600"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form">
      <a-row :gutter="12">
        <a-col :span="20">
          <a-form-item label="流程名称" v-bind="formItemLayout">
            <a-input
              placeholder="请输入流程名称"
              v-decorator="[
                  'process_name',
                  { 
                    initialValue: dataObj.process_name,
                    rules: [{ required: true, message: '请输入' }]
                  }
                ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="12">
        <a-col :span="20">
          <a-form-item label="流程参数" v-bind="formItemLayout">
            <a-input
              placeholder="请输入流程参数"
              v-decorator="[
                  'parameters',
                  {
                    initialValue: dataObj.parameters,
                    rules: [{ required: true, message: '请输入' }]
                  }
                ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="12">
        <a-col :span="20">
          <a-form-item label="是否启用" v-bind="formItemLayout">
            <a-select
              placeholder="请选择是否启用"
              v-decorator="[
                  'is_valid',
                  {
                    initialValue: dataObj.is_valid,
                    rules: [{ required: true, message: '请输入' }]
                  }
                ]"
            >
              <a-select-option
                v-for="item in selectData['is_valid']"
                :key="item.value"
                :value="item.title"
              >{{ item.title }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="12">
                    <!-- rules: [{ required: true, message: '请输入' }] -->
        <a-col :span="20">
          <a-form-item label="备注" v-bind="formItemLayout">
            <a-input
              placeholder="请输入备注"
              v-decorator="[
                  'remark',
                  {
                    initialValue: dataObj.remark,
                  }
                ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import STree from '@/components/Tree/Tree'
import { batchAddUser, postUtilityUserAndStation, editUtilityUserAndStation } from '@/api/utility'
import { handleStationtree, getUsers } from '@/api/common'
import { STable } from '@/components'

const selectData = {
  is_valid: [
    {
      title: '是',
      value: '1'
    },
    {
      title: '否',
      value: '0'
    }
  ]
}

export default {
  name: 'HRModal',
  components: {
    STree,
    STable
  },
  computed: {},
  data () {
    return {
      dataObj: {},
      selectData: selectData,
      menuCode: null,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      }
    }
  },
  methods: {
    add (record) {
      if (!record.id) {
        this.menuCode = record
      } else {
        this.dataObj = record
        this.menuCode = record.menu_id
        // this.dataObj.is_valid = this.dataObj.is_valid == '1' ? '是' : '否'
      }
      this.record = Object.assign({}, record)
      this.edit(record)
    },
    edit (record) {
      this.visible = true
      this.confirmDisable = true
    },
    handleOk () {
      this.confirmLoading = true
      const {
        form: { validateFields }
      } = this
      const that = this

      setTimeout(() => {
        validateFields((err, values) => {
          if (!err) {
            console.log(values.is_valid)
            values.is_valid = values.is_valid === '是' ? '1' : '0'
            values.menu_code = that.menuCode
            values.scope_code = that.$store.state.menu_key
            values.menu_id = '88'
            values.scope_name = that.$store.state.org_name
            for (let key in values) {
              if (!values[key]) {
                delete values[key]
              }
            }
            if (!!that.dataObj.id) {
              return editUtilityUserAndStation(values)
                .then(res => {
                  if (res.status === '0') {
                    this.$message.success(res.msg)
                    this.$emit('ok')
                  }
                  that.handleCancel()
                })
                .finally(() => {
                  that.confirmLoading = false
                  that.close()
                })
            } else {
              return postUtilityUserAndStation({ ...values, menu_code: that.menuCode })
                .then(res => {
                  if (res.status === '0') {
                    this.$message.success(res.msg)
                    this.$emit('ok')
                  }
                  that.handleCancel()
                })
                .finally(() => {
                  that.confirmLoading = false
                  that.close()
                })
            }
          }
        })
      }, 100)
    },
    close () {
      this.$emit('close')
      this.dataObj = {}
      this.visible = false
      this.resetForm()
    },
    resetForm () {
      this.form.resetFields()
    },
    handleCancel () {
      this.close()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .line-table tr td:nth-child(2) {
  font-size: 0 !important;
}
</style>
