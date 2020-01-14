<template>
  <a-modal
    title="添加枚举值"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="父ID"
          v-show="false"
        >
          <a-input v-decorator="['dic_type_id', {}]" />
        </a-form-item>
        <a-form-item
          label="父名称"
          v-show="false"
        >
          <a-input v-decorator="['dic_type_name', {}]" />
        </a-form-item>
        <a-form-item
          label="编码"
          v-show="false"
        >
          <a-input v-decorator="['dic_enum_id', {}]" />
        </a-form-item>
        <a-form-item
          label="枚举值"
          v-bind="formlayout"
        >
          <a-input v-decorator="['dic_enum_name', { rules: [{ required: true, message: '请输入枚举值' }], }]"/>
        </a-form-item>
        <a-form-item
          label="备注"
          v-bind="formlayout"
        >
          <a-textarea v-decorator="['remark']" />
        </a-form-item>
        <a-form-item
          label="状态"
          v-bind="formlayout"
        >
          <a-radio-group v-decorator="['is_valid', { initialValue: 1 }]">
            <a-radio :value="1">
              启用
            </a-radio>
            <a-radio :value="0">
              禁用
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { dictionaryEnum } from '@/api/dictionary'

export default {
  name: 'EnumModal',
  data () {
    return {
      formlayout: {
        labelCol: {
          xs: { span: 4 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 18 },
          sm: { span: 18 }
        }
      },
      visible: false,
      confirmLoading: false,
      mdl: {}
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
    console.log('form::', this.form)
  },
  methods: {
    add (record) {
      this.form.resetFields()
      this.edit(record)
    },
    edit (record) {
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        const formData = pick(record, ['dic_type_id', 'dic_type_name', 'dic_enum_id', 'dic_enum_name', 'remark', 'is_valid'])
        formData.remark = formData.remark || ''
        this.form.setFieldsValue({ ...formData })
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('form values', values)

          _this.confirmLoading = true
          dictionaryEnum(values).then(res => {
            // Do something
            _this.$message.success(res.msg)
            _this.$emit('ok')
          }).catch(() => {
            // Do something
          }).finally(() => {
            _this.confirmLoading = false
            _this.close()
          })
        }
      })
    },
    handleCancel () {
      this.close()
    }

  }
}
</script>
