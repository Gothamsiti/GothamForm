<template>
<div id="pluginGothamForm">
    <p>Plugin per la configurazione di un form di contatto.</p>
    <section :class="{'open' : openConfigs}">
      <div class="title" @click="() => {this.openConfigs = !this.openConfigs}">
        <i class="form__section-caret uk-icon-caret-down"></i>
        <h3>Configurazioni base</h3>
      </div>
      <div class="content" v-if="openConfigs">
        <div class="uk-margin-top">
          <input type="text" placeholder="Admin destinatario (se diverso dal mittente)" v-model="structure.adminReciever" />
        </div>

        <div class="uk-margin-top">
          <input type="text" placeholder="ReplyTo (se diverso dal mittente)" v-model="structure.replyTo" />
        </div>

        <div class="uk-margin-top">
          <input type="text" placeholder="Thankyou message" v-model="structure.thankyouMessage" />
        </div>

        <div class="uk-margin-top">
          <input type="text" placeholder="Error message" v-model="structure.errorMessage" />
        </div>

      </div>
    </section>
    <section :class="{'open' : openConfigsSMTP}">
      <div class="title" @click="() => {this.openConfigsSMTP = !this.openConfigsSMTP}">
        <i class="form__section-caret uk-icon-caret-down"></i>
        <h3>Configurazioni SMTP</h3>
      </div>
      <div class="content" v-if="openConfigsSMTP">
        <div class="uk-margin-top">
          <input type="text" placeholder="Host" v-model="structure.smtp.host" />
        </div>
        <div class="uk-margin-top">
          <input type="text" placeholder="Port" v-model="structure.smtp.port" />
        </div>
        <div class="uk-margin-top">
          <input type="text" placeholder="Username" v-model="structure.smtp.user" />
        </div>
        <div class="uk-margin-top">
          <input type="text" placeholder="Password" v-model="structure.smtp.psw" />
        </div>
        <div class="uk-margin-top">
          <input type="text" placeholder="Email" v-model="structure.smtp.sender" />
        </div>
        <div class="uk-margin-top">
          <input type="checkbox" v-model="structure.smtp.ssl" id="smtpSSL"> <label class="uk-margin-left" for="smtpSSL">SSL</label>
        </div>
      </div>
    </section>
    <section :class="{'open' : openFields}">
      <div class="title"  @click="() => {this.openFields = !this.openFields}">
        <i class="form__section-caret uk-icon-caret-down"></i>
        <h3>Campi</h3>
      </div>
      <div class="content uk-margin-top" v-if="openFields">
        <div class="fields">
          <div class="field uk-margin-bottom" v-for="(field,index) in structure.fields" :key="index">
            <div class="heading" @click="() => {field.open = !field.open}">
              <h4>{{field.label}}</h4>
              <a href="#" class="uk-button uk-button-primary uk-button-small">{{field.open ? 'Close' : 'Open'}}</a>
            </div>
            <div class="content" v-if="field.open">
              <div class="uk-margin-top">
                <label class="uk-form-label" :for="'field-type-' + index">Type</label>
                <select v-model="field.type" :id="'field-type-' + index">
                  <option v-for="(option,ind) in types" :value="option" :key="index+'-'+ind">{{ option }}</option>
                </select>
              </div>
              <div class="uk-margin-top">
                <label class="uk-form-label" :for="'field-label-' + index">Label</label>
                <input type="text" placeholder="label" :id="'field-label-' + index" v-model="field.label">
              </div>
              <div class="uk-margin-top">
                <label class="uk-form-label" :for="'field-placeholder-' + index">Placeholder</label><input type="text" placeholder="placeholder" :id="'field-placeholder-' + index" v-model="field.placeholder">
              </div>
              <div class="uk-margin-top">
                <input type="checkbox" v-model="field.required" :id="'field-required-' + index"> <label class="uk-margin-left" :for="'field-required-' + index">Campo obbligatgorio</label>
              </div>
              <div class="uk-margin-top deleteAction">
                <a href="#" class=" uk-button uk-button-danger uk-button-small" @click="deleteField(index)">Delete</a>
              </div>
            </div>
          </div>
      </div>
      <a href="#" class="uk-button uk-button-primary uk-button-small uk-margin-top" @click.prevent="addField">Add</a>
      </div>
    </section>

    
  </div>
</template>

<script>
export default {
  mixins: [window.Storyblok.plugin],
  data() {
    return {
      structure : {
        adminReciever: null,
        replyTo: null,
        thankyouMessage: null,
        errorMessage: null,
        smtp: {
          host: null,
          port: null,
          user: null,
          psw: null,
          ssl: true,
          sender: null
        },
        fields : [],
      },
      types : [
        'text',
        'email',
        'tel',
        'textarea',
        'privacy',
        'file'
      ],
      openFields : false,
      openConfigs : false,
      openConfigsSMTP : false
    }
  },
  methods: {
    addField(){
      var field = {
        type : null,
        label : 'Campo vuoto',
        placeholder : null,
        required : false,
        open : false
      }
      this.structure.fields.push(field);
    },
    deleteField(index){
      this.structure.fields.splice(index,1);
    },
    initWith() {
      return {
        plugin: 'GothamForm',
        fields : []
      }
    },
    pluginCreated() {
      // eslint-disable-next-line
      console.log('View source and customize: https://github.com/storyblok/storyblok-fieldtype')
    }
  },
  watch: {
    'structure' : {
      handler: function (value) {
        this.model.fields = value;
        this.$emit('changed-model', this.model);
      },
      deep: true
    }
  }
}
</script>
<style scoped lang="scss">
  #pluginGothamForm{
    background-color: white;
    padding: 20px;
    box-sizing: border-box;
    section{
      border: 2px solid #f7f7f7;
      border-radius: 5px;
      padding: 10px;
      box-sizing: border-box;
      &:not(:last-child){
        margin-bottom: 20px;
      }
      .title{
        display: flex;
        align-items: center;
        h3{
          cursor: pointer;
          display: inline-block;
          margin: 0;
          font-weight: bold;
        }
        i{
          display: block;
          width: 10px;
          height: 10px;
          line-height: 10px;
          margin-right: 5px;
          transform: rotate(-90deg);
          transform-origin: center;
        }
      }
      &.open{
        .title{
          i{
            transform: rotate(0deg);
          }
        }
      }
      .content{
        > div
          input[type="text"]{
            width: 100%;
          }
        }
        .fields{
          .field{
            background-color: #f7f7f7;
            padding: 20px;
            box-sizing: border-box;
            .heading{
              display: flex;
              align-items: center;
              cursor: pointer;
              h4{
                display: block;
                width: calc(100% - 110px);
                font-weight: bold;
                margin: 0;
              }
              a{
                display: block;
                margin-left: 10px;
                width: 100px;
              }

            }
            .content{
              .deleteAction{
                text-align: right;
              }
            }
          }
        }
      }
    }
</style>