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
          <input type="text" placeholder="Thankyou message" v-model="structure.thankyouMessage" />
        </div>
        <div class="uk-margin-top">
          <input type="text" placeholder="Error message" v-model="structure.errorMessage" />
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
            <div class="heading">
              <div class="order">
                <div>{{index}}</div>
                <button class="arrowUp" v-if="index != 0" @click.prevent="move(index,index-1)"> ↥ </button>
                <button class="arrowDown" v-if="index != structure.fields.length-1" @click.prevent="move(index,index+1)"> ↧ </button>
              </div>
              <h4>{{field.name ? field.name : (field.type == 'testo' ? 'Testo html' : 'Nuovo input')}}</h4>
              <a href="#" class="uk-button uk-button-primary uk-button-small" @click="() => {field.open = !field.open}">{{field.open ? 'Close' : 'Open'}}</a>
            </div>
            <div class="content" v-if="field.open && field.type != 'testo'">
              <div class="uk-margin-top">
                <label class="uk-form-label" :for="'field-type-' + index">Type</label>
                <select v-model="field.type" :id="'field-type-' + index" v-on:change="clearField(index)">
                  <option v-for="(option,ind) in types" :value="option" :key="index+'-'+ind">{{ option }}</option>
                </select>
              </div>
              <div class="uk-margin-top">
                <label class="uk-form-label" :for="'field-name-' + index">Name</label>
                <input type="text" placeholder="name" :id="'field-name-' + index" v-model="field.name">
              </div>
              <div class="uk-margin-top">
                <label class="uk-form-label" :for="'field-label-' + index">Label</label>
                <input type="text" placeholder="label" :id="'field-label-' + index" v-model="field.label">
              </div>
              <div class="uk-margin-top" v-if="field.type != 'privacy' && field.type != 'file' && field.type != 'checkbox' && field.type != 'select' && field.type != 'radio'">
                <label class="uk-form-label" :for="'field-placeholder-' + index">Placeholder</label><input type="text" placeholder="placeholder" :id="'field-placeholder-' + index" v-model="field.placeholder">
              </div>

              <div class="uk-margin-top" v-if="field.type == 'file'">
                <label class="uk-form-label" :for="'field-acceptFormat-' + index">Accepted formats</label><input type="text" placeholder="Accepted formats" :id="'field-acceptFormat-' + index" v-model="field.acceptFormat">
              </div>
              <div class="uk-margin-top" v-if="field.type == 'file'">
                <label class="uk-form-label" :for="'field-maxSize-' + index">Max size (KB)</label><input type="text" placeholder="Max size (KB)" :id="'field-maxSize-' + index" v-model="field.maxSize">
              </div>

              <div class="uk-margin-top" v-if="field.type == 'checkbox'">
                <label class="uk-form-label" :for="'field-checkbox-' + index">Value</label>
                <input type="text" placeholder="label" :id="'field-checkbox-' + index" v-model="field.value">
              </div>

              <div class="uk-margin-top" v-if="field.type == 'select'">
                <label class="uk-form-label" :for="'field-select-' + index">Options</label>
                <div uk-grid class="field uk-margin-bottom" v-for="(option,OptionIndex) in structure.fields[index].select" :key="'option_'+OptionIndex">
                  <input type="text" class="uk-width-1-2" placeholder="Label" :id="'field-optionLabel-' + OptionIndex" v-model="field.select[OptionIndex].label">
                  <input type="text" class="uk-width-1-2" placeholder="Value" :id="'field-optionValue-' + OptionIndex" v-model="field.select[OptionIndex].value">
                  <a href="#" class="uk-width-1-1 uk-button uk-button-danger uk-button-small" @click.prevent="removeOption(index,OptionIndex)">Remove option</a>
                </div>
                <a href="#" class=" uk-button uk-button-primary uk-button-small" @click.prevent="addOption(index)">Add option</a>
              </div>

              <div class="uk-margin-top" v-if="field.type == 'radio'">
                <label class="uk-form-label" :for="'field-radio-' + index">Options</label>
                <div uk-grid class="field uk-margin-bottom" v-for="(option,RadioIndex) in structure.fields[index].radio" :key="'option_'+RadioIndex">
                  <input type="text" class="uk-width-1-2" placeholder="Label" :id="'field-optionLabel-' + OptionIndex" v-model="field.radio[RadioIndex].label">
                  <input type="text" class="uk-width-1-2" placeholder="Value" :id="'field-optionValue-' + OptionIndex" v-model="field.radio[RadioIndex].value">
                  <a href="#" class="uk-width-1-1 uk-button uk-button-danger uk-button-small" @click.prevent="removeRadio(index,RadioIndex)">Remove option</a>
                </div>
                <a href="#" class=" uk-button uk-button-primary uk-button-small" @click.prevent="addRadio(index)">Add option</a>
              </div>

              <div class="uk-margin-top">
                <input type="checkbox" v-model="field.required" :id="'field-required-' + index"> <label class="uk-margin-left" :for="'field-required-' + index">Campo obbligatgorio</label>
              </div>
              <div class="uk-margin-top deleteAction">
                <a href="#" class=" uk-button uk-button-danger uk-button-small" @click="deleteField(index)">Delete</a>
              </div>
            </div>
            <div class="content" v-else-if="field.open && field.type == 'testo'">
              <div class="uk-margin-top">
                <label class="uk-form-label" :for="'field-type-' + index">Type</label>
                <select v-model="field.type" :id="'field-type-' + index">
                  <option v-for="(option,ind) in types" :value="option" :key="index+'-'+ind">{{ option }}</option>
                </select>
              </div>
              <p>Questo campo serve ad inserire del testo (html) all'interno di un div</p>
              <textarea v-model="field.value"></textarea>

              <div class="uk-margin-top deleteAction">
                <a href="#" class=" uk-button uk-button-danger uk-button-small" @click="deleteField(index)">Delete</a>
              </div>
            </div>
          </div>
      </div>
      <a href="#" class="uk-button uk-button-primary uk-button-small uk-margin-top" @click.prevent="addField">Add</a>
      </div>
    </section>
    <section :class="{'open' : openTemplate}">
      <div class="title"  @click="() => {this.openTemplate = !this.openTemplate}">
        <i class="form__section-caret uk-icon-caret-down"></i>
        <h3>Email template</h3>
      </div>
      <div class="uk-margin-top" v-if="openTemplate">
        <div>
          <input type="text" placeholder="Email object" v-model="structure.emailObject" />
        </div>
        <div class="uk-margin-top" v-if="openTemplate">
          <textarea v-model="structure.emailTemplate"></textarea>
        </div>
        <div class="uk-margin-top">
            <p>Puoi inserire nel template e nell'oggetto della mail delle costanti per andare a compilare il messaggio (es. [email]).<br>
          Sono presenti anche delle costanti di sistema che puoi utilizzare:</p>
          <ul>
            <li>[path] : link della pagina da cui è stato compilato il form</li>
            <li>[timeStamp] : orario di compilazione del form</li>
            <li>[userAgent] : user-agent inviato dal browser</li>
          </ul>
        </div>
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
        emailObject: null,
        thankyouMessage: null,
        errorMessage: null,
        emailTemplate: null,
        fields : [],
      },
      types : [
        'text',
        'email',
        'tel',
        'textarea',
        'select',
        'radio',
        'privacy',
        'checkbox',
        'file',
        'testo'
      ],
      openFields : false,
      openConfigs : false,
      openTemplate: false
    }
  },
  methods: {
    addField(){
      var field = {
        type : null,
        name : null,
        label : null,
        value : null,
        placeholder : null,
        required : false,
        acceptFormat : '.doc,.docx,.pdf',
        maxSize : 3072,
        open : false,
        select : [],
        radio : []
      }
      this.structure.fields.push(field);
    },
    addOption(index){
      var option = {
        label : null,
        value : null,
      }
      this.structure.fields[index].select.push(option);
    },
    removeOption(index,optionIndex){
      this.structure.fields[index].select.splice(optionIndex,1);
    },
    addRadio(index){
      var radio = {
        label : null,
        value : null,
      }
      this.structure.fields[index].radio.push(radio);
    },
    removeRadio(index,radioIndex){
      this.structure.fields[index].radio.splice(radioIndex,1);
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
      console.log('This is GothamForm!');
      if(this.model.fields.fields && this.model.fields.fields.length > 0){
        this.structure = this.model.fields;
      }
    },
    clearField(index){
      this.structure.fields[index].name = null;
    },
    move(o,n){
      this.structure.fields.splice(n, 0, this.structure.fields.splice(o, 1)[0]);
    },
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
      textarea{
        width: 100%;
        height: 300px;
        resize: none;
      }
      input[type="text"]{
        width: 100%;
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
            .order{
              display: flex;
              align-items: center;
              min-width: 100px;
              > div {
                min-width: 20px;
              }
              button{
                background-color: #09b3af;
                cursor: pointer;
                outline: none;
                height: 30px;
                width: 30px;
                border: 0;
                border-radius: 2px;
                color: #fff;
                &.arrowUp{
                  margin-right: 5px;
                }
              }
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