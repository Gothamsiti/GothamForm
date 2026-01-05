<template lang='pug'>
section.contactForm(ref="$el" :class="{submitting:submitting,submitted:submittedComputed}")
    .system.message(v-if="submittedComputed")
        h4(v-html="$__('submitOkTitle')")
        p {{ $__('submitOkText') }}
    template(v-else)
        form(@submit="formSubmit")
            template(v-if="!submittedComputed" v-for="field of fields" :key="field._uid")
                .flexGroup(v-if="field.component == 'fieldFlexGroup'")
                    template(v-for="subfield of field.fields" :key="subfield._uid")
                        StoryblokComponent( v-if="subfield.name" v-model:model="subfield.value" :blok="{component:subfield.component,originalblok:subfield}" :field="subfield" @addEvalFunction="addEvalFunction" v-editable="subfield")
                        StoryblokComponent( v-else :blok="{component:subfield.component,originalblok:subfield}" :field="subfield" v-editable="subfield")
                StoryblokComponent( v-else-if="field.name" v-model:model="field.value" :blok="{component:field.component,originalblok:field}" :field="field" @addEvalFunction="addEvalFunction" v-editable="field")
                StoryblokComponent( v-else :blok="{component:field.component,originalblok:field}" :field="field" v-editable="field")
            .error.system.message(v-if="error")
                h4(v-html="$__('submitKoTitle')")
                p {{ $__('submitKoText') }}
</template>

<script setup>
const route = useRoute()
const { blok, storyUuid } = defineProps(['blok', 'storyUuid'])

const fields = ref(undefined)
const formId = ref(undefined)
if (storyUuid) {
  const { data: story, error, refresh } = await useAsyncData(`form_${storyUuid}`, async () => {
    const per_page = 6
    const params = {
      fullSlug: storyUuid,
      find_by: 'uuid',
    }

    return $fetch('/api/storyblok/request', { query: params })
  })
  if (story?.value?.content?.component !== 'contactForm') throw createError({ statusCode: 500, statusMessage: 'story is not a form', fatal: false })

  fields.value = story?.value?.content.fields
  formId.value = story.value.uuid
}
else if (blok) {
  fields.value = blok.fields
  formId.value = blok.formWrapperId ?? blok._uid
}

for (const field of fields.value) if (field.name) field.value = ref()

const submittedComputed = computed(() => {
  return submitted.value === formId.value
})

const {
  submitting,
  submitted,
  error,
  formSubmit,
  addEvalFunction,
} = useForm(fields.value, formId.value)
</script>

<style lang="scss">
section.contactForm{
    position: relative;
	justify-self: center;
    width: 100%;
    &.submitting{
        opacity: .5;
        pointer-events: none;
    }
    .error.field{
        color: red;
    }
    .system.message{
        h4{
            margin: 0;
        }
        p{
            color: #112330;
            font-size: 1.4rem;
        }
        &.error{
            color: #990000;
            background: rgba(red,.3);
            border: 1px solid red;
            p{
                color: #600000;
            }
        }
    }

    form{
        display: flex;
        flex-direction: column;
        gap: mw(1);
        font-size: 1.6rem;
        *:not(h1,h2,h2 span,h3,h4,h5,p,.BodyCTA,span.label){
            font-size: inherit;
            font-family: inherit;
        }
        .flexGroup{
            display: flex;
            gap: mw(1);
            width: 100%;
            >*{
                flex: 1;
            }
        }
        .input{
            position: relative;
            label{
                position: absolute;
                top: mw(1.5);
                left: mw(1);
                transform: translateY(-50%);
                z-index: 2;
                line-height: 1.2rem;
                transition: background-color $dt $de,top $dt $de,font-size $dt $de, border-radius $dt $de;
                font-size: inherit;
                color: inherit;
                background: #8a8a8a00;
                border-radius: 0;
                pointer-events: none;
                *{
                    font-size: inherit;
                }
                &+input[type="text"],&+input[type="email"],&+input[type="search"],&+textarea{
                    &::placeholder{
                        color: #00000000;
                    }
                    &:focus{
                        outline: none;
                    }
                }
            }
            input[type="text"],input[type="email"],input[type="search"],textarea{
                z-index: 1;
                appearance: none;
                border: none;
                background: transparent;
                border-radius: $dbr;
                width: 100%;
                box-sizing: border-box;
                padding: 0 mw(1);
                height: mw(3);
                line-height: mw(3);
                vertical-align: middle;
                border: 1px solid $black;
                color: $black;
                .compiled &{
                    border-color: $rose;
                }
            }
            textarea{
                padding: 0 mw(1);
                height: 20rem;
            }
            &.fieldSelect .iconify{
                display: block;
                content: ' ';
                width: 20px;
                height: 20px;
                position: absolute;
                right:  mw(.5);
                top: 50%;
                transform: translateY(-50%) rotate(180deg);
            }
            select,option{
                width: 100%;
                height: 4rem;
                border: 1px solid $black;
                overflow: hidden;
                text-overflow: ellipsis;
                color: $black;
                box-sizing: border-box;
                padding: 0 mw(1);
                height: mw(3);
                background: #ffffff00;
                border-radius: $dbr;
                font-size: 1.6rem;
                appearance: none;
                &::placeholder{
                    color: rgba($black,.5);
                }
                &:not(.compiled){
                    color: rgba($black,.5);
                }
            }
            &.fieldPrivacy{
                >label{
                    display: none;
                }
                .inputContent{
                    display: flex;
                    flex-direction: row-reverse;
                    justify-content: flex-end;
                    align-items: flex-start;
                    label{
                        background: none;
                        border: 0;
                        color: inherit;
                        font-size: inherit;
                        line-height: inherit;
                        padding: inherit;
                        height: unset;
                        position: static;
                        top: auto;
                        transform: none;
                        border-radius: 0;
                    }
                }
            }
            &.fieldFile{
                >label{
                    display: none;
                }
                .icon{
                    font-size: 3rem;
                    height: 3rem;
                    width: 3rem;
                }
                cursor: pointer;
                border: 1px solid $black;
                user-select: none;
                background: $white;
                padding: 0 .5rem 0 1rem;
                height: 4rem;
                border-radius: $dbr;
                color: rgba($white,.4);
            }
            &.fieldRadioGroup{
                display: flex;
                gap: 3rem;
                .inputOption{
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    cursor: pointer;
                    gap: .4rem;
                    input{
                        height: 2rem;
                    }
                    label{
                        position: relative;
                        height: 100%;
                        top: 0 !important;
                        left: 0 !important;
                        transform: unset;
                        color: $black !important;
                        pointer-events: all;
                        cursor: pointer;
                        height: 2rem;
                        display: flex;
                        align-items: center;
                    }
                }
            }
            &.error{
                input[type="text"],input[type="email"],input[type="search"],textarea{
                    color: $red;
                    border: 1px solid $red;
                }
                label{
                    color: $red;
                }
                .inputContent{
                    color: $red;
                    *{
                        color: inherit;
                    }
                }
            }
            &.compiled{
                label{
                    color: $rose !important;
                }
                *{
                    border-color: $rose !important;
                }
            }
        }
        .dp__main{
            .dp__input_wrap{
                --dp-font-size:1.6rem;
                input.dp__input{
                    z-index: 1;
                    appearance: none;
                    border: none;
                    border-radius: $dbr;
                    width: 100%;
                    box-sizing: border-box;
                    height: mw(3);
                    padding: 0 mw(1);
                    border: 1px solid $black;
                    padding-left: mw(2);
                    background: transparent;
                    color: inherit;
                    &::placeholder{
                        color: inherit;
                        opacity: 1;
                    }
                    &+div>svg.dp__input_icon{
                        left: mw(1.25);
                        margin: 0;
                        padding: mw(.5);
                        transform: translate(-50%,-50%);
                        >*{
                            fill: $black;
                        }

                    }
                }
            }
        }
        .submit{
            align-self: flex-start;
            justify-self: flex-end;
        }
    }

    .flexGroup{
        width: 100%;
        display: flex;
        > * {
            flex: 1;
        }
    }
}
</style>
