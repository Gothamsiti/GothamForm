# GothamForm

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Un modulo Nuxt 4 completo per la creazione di form dinamici, interattivi e validati. 

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Funzionalità

- 📝 **Form Dinamici**: Crea form da strutture di dati dinamiche
- ✅ **Validazione**: Validazione lato client con regex personalizzati e campi obbligatori
- 🎯 **Campi Condizionali**: Mostra/nascondi campi in base a condizioni dinamiche
- 📤 **Upload File**: Supporto completo per file upload multi-file
- 📧 **Invio Email**: Integrazione con Brevo (Sendinblue) per invio email automatico
- 📅 **Date Picker**: Date picker interattivo e intuitivo
- 🔍 **Ricerca**: Campi con autocomplete e ricerca
- 🎨 **Componenti Personalizzati**: Campi text, textarea, email, checkbox, radio, select e altro
- 🌐 **Supporto Multilingua**: Integrazione con i18n
- ♿ **Accessibile**: Componenti seguono le best practice di accessibilità

## Installazione

Installa il modulo nell'applicazione Nuxt:

```bash
npm install gothamform
# oppure
pnpm add gothamform
```

Aggiungi il modulo a `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['gothamform'],
  gothamform: {
    from: 'noreply@example.com',
    to: 'contact@example.com',
    brevo: {
      key: process.env.BREVO_API_KEY
    }
  }
})
```

## Configurazione

Il modulo richiede la seguente configurazione nella sezione `gothamform` del file `nuxt.config.ts`:

### Opzioni Obbligatorie

| Opzione | Tipo | Descrizione |
|---------|------|-------------|
| `from` | `string` | Email mittente per l'invio dei form (es. `noreply@example.com`) |
| `to` | `string` | Email destinataria dove ricevere i form (es. `contact@example.com`) |
| `brevo.key` | `string` | API Key di Brevo per l'autenticazione |

### Opzioni Consigliate

```typescript
gothamform: {
  from: process.env.FORM_FROM_EMAIL || 'noreply@example.com',
  to: process.env.FORM_TO_EMAIL || 'contact@example.com',
  brevo: {
    key: process.env.BREVO_API_KEY // Obbligatorio per funzionalità email
  }
}
```

### Variabili di Ambiente

Creare un file `.env` nella root del progetto:

```env
# Email Configuration
FORM_FROM_EMAIL=noreply@tuodominio.com
FORM_TO_EMAIL=contact@tuodominio.com

# Brevo Configuration
BREVO_API_KEY=your_brevo_api_key_here
```

Per ottenere l'API Key di Brevo:
1. Registrati su [Brevo.com](https://www.brevo.com)
2. Vai a "Impostazioni" → "Chiavi API"
3. Crea una nuova chiave API con permessi SMTP
4. Copia la chiave nel file `.env`

## Utilizzo

### Componente Form Principale

```vue
<template>
  <FormMain 
    :blok="formBlock"
    @submit="handleFormSubmit"
    :submitting="isSubmitting"
    :submitted="isSubmitted"
    :error="hasError"
  />
</template>

<script setup>
import { ref } from 'vue'

const isSubmitting = ref(false)
const isSubmitted = ref(false)
const hasError = ref(false)

const formBlock = {
  fields: [
    {
      name: 'email',
      component: 'fieldEmail',
      required: true,
      placeholder: 'La tua email'
    },
    {
      name: 'message',
      component: 'fieldTextArea',
      required: true,
      placeholder: 'Il tuo messaggio'
    }
  ]
}

const handleFormSubmit = async (data) => {
  isSubmitting.value = true
  try {
    // Invia il form
    const response = await $fetch('/api/gothamform/brevo', {
      method: 'POST',
      body: data.formData
    })
    isSubmitted.value = true
  } catch (error) {
    hasError.value = true
    console.error('Errore invio form:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
```

### Composable useForm

Gestisci la logica del form con il composable `useForm`:

```typescript
const { formSubmit, addEvalFunction, formUid } = useForm(fields, 'form-id')
```

**Proprietà**:
- `formSubmit(event)`: Gestisce l'invio del form, valida i campi e ritorna payload e formData
- `addEvalFunction(callback)`: Aggiunge una funzione di validazione personalizzata
- `formUid`: ID univoco del form

### Composable useField

Gestisci la validazione di singoli campi:

```typescript
const { gobalFieldsStore, hide, globalEvalFieldsStore } = useField(
  model, 
  field, 
  emit, 
  formSlug
)
```

**Proprietà**:
- `gobalFieldsStore`: Store globale dei valori dei campi
- `hide`: Computed che determina se un campo deve essere nascosto
- `globalEvalFieldsStore`: Store delle funzioni di validazione

## Componenti Disponibili

### Campi Disponibili

Tutti i componenti sono automaticamente registrati come globali con prefisso `Form`:

| Componente | Descrizione | Proprietà Richieste |
|-----------|-------------|-------------------|
| `FormFieldText` | Campo testo semplice | `name`, `component: 'fieldText'` |
| `FormFieldEmail` | Campo email con validazione | `name`, `component: 'fieldEmail'` |
| `FormFieldTextArea` | Area di testo multi-linea | `name`, `component: 'fieldTextArea'` |
| `FormFieldSelect` | Dropdown di selezione | `name`, `component: 'fieldSelect'`, `options` |
| `FormFieldCheckbox` | Checkbox singolo o multiplo | `name`, `component: 'fieldCheckbox'` |
| `FormFieldRadioGroup` | Gruppo di radio button | `name`, `component: 'fieldRadioGroup'`, `options` |
| `FormFieldFile` | Upload file | `name`, `component: 'fieldFile'` |
| `FormFieldDateText` | Data in formato testuale | `name`, `component: 'fieldDateText'` |
| `FormFieldDatePickerRange` | Intervallo di date | `name`, `component: 'fieldDatePickerRange'` |
| `FormFieldSearch` | Campo con autocomplete | `name`, `component: 'fieldSearch'` |
| `FormFieldFlexGroup` | Raggruppamento flessibile di campi | `component: 'fieldFlexGroup'`, `fields: []` |
| `FormFieldHidden` | Campo nascosto | `name`, `component: 'fieldHidden'`, `value` |
| `FormFieldCustomFunction` | Campo personalizzato | `name`, `component: 'fieldCustomFunction'` |
| `FormButtonSubmit` | Pulsante di invio | `component: 'buttonSubmit'` |

### Proprietà Comuni dei Campi

```typescript
{
  name: string                  // Nome univoco del campo
  component: string             // Tipo di componente
  required?: boolean            // Campo obbligatorio (default: false)
  value?: any                   // Valore iniziale
  placeholder?: string          // Placeholder (per input testuali)
  regex?: string               // Validazione regex personalizzata
  hideCondition?: string       // Condizione per nascondere il campo
  options?: Array<{            // Opzioni per select/radio/checkbox
    label: string
    value: any
  }>
  fields?: Array<Field>        // Sub-campi (per fieldFlexGroup)
}
```

## Validazione

### Validazione Incorporata

I campi supportano validazione lato client:

```typescript
{
  name: 'email',
  component: 'fieldEmail',
  required: true,              // Obbligatorio
  regex: '^[^@]+@[^@]+\.[^@]+$' // Regex personalizzato
}
```

### Validazione Personalizzata

Aggiungi logica di validazione personalizzata:

```typescript
const { addEvalFunction } = useForm(fields, 'form-id')

addEvalFunction(() => {
  const emailField = fields.find(f => f.name === 'email')
  if (emailField.value && emailField.value.includes('spam')) {
    emailField.error = true
    emailField.errorMessage = 'Email non valida'
  }
})
```

## Campi Condizionali

Mostra/nascondi campi in base a condizioni dinamiche:

```typescript
{
  name: 'company',
  component: 'fieldText',
  hideCondition: "!gobalFieldsStore[formSlug]?.['isCompany']"
}
```

La condizione ha accesso a:
- `gobalFieldsStore`: Store dei valori dei campi
- `formSlug`: Identificatore del form
- `field`: Configurazione del campo
- `value`: Valore corrente

## Server-Side Routes

Il modulo registra automaticamente le seguenti rotte API:

### POST /api/gothamform/brevo

Invia un form via email utilizzando Brevo.

**Request**:
- Content-Type: `multipart/form-data`
- Campi form con i dati del modulo

**Response**:
```json
{
  "sent": true
}
```

**Errori**:
- `400`: Body del form mancante
- `500`: Errore nell'invio email

## Esempi

### Form di Contatto Semplice

```vue
<template>
  <div class="contact-section">
    <h2>Contattaci</h2>
    <FormMain :blok="contactForm" />
  </div>
</template>

<script setup>
const contactForm = {
  fields: [
    {
      name: 'name',
      component: 'fieldText',
      required: true,
      placeholder: 'Nome Completo'
    },
    {
      name: 'email',
      component: 'fieldEmail',
      required: true,
      placeholder: 'Email'
    },
    {
      name: 'phone',
      component: 'fieldText',
      placeholder: 'Telefono'
    },
    {
      name: 'message',
      component: 'fieldTextArea',
      required: true,
      placeholder: 'Messaggio',
      rows: 5
    },
    {
      component: 'buttonSubmit',
      label: 'Invia'
    }
  ]
}
</script>
```

### Form con Campi Condizionali

```typescript
const advancedForm = {
  fields: [
    {
      name: 'isCompany',
      component: 'fieldCheckbox',
      label: 'Sto cercando come azienda'
    },
    {
      name: 'companyName',
      component: 'fieldText',
      required: true,
      placeholder: 'Nome Azienda',
      hideCondition: "!gobalFieldsStore[formSlug]?.['isCompany']"
    },
    {
      name: 'companyVat',
      component: 'fieldText',
      placeholder: 'Partita IVA',
      hideCondition: "!gobalFieldsStore[formSlug]?.['isCompany']"
    }
  ]
}
```

### Form con File Upload

```typescript
const fileForm = {
  fields: [
    {
      name: 'email',
      component: 'fieldEmail',
      required: true
    },
    {
      name: 'cv',
      component: 'fieldFile',
      required: true,
      accept: '.pdf,.doc,.docx',
      label: 'Carica il tuo CV'
    },
    {
      component: 'buttonSubmit'
    }
  ]
}
```

## Integrazione con Storyblok

Se utilizzi Storyblok come headless CMS, puoi caricare i form dal tuo spazio di contenuto:

```vue
<template>
  <FormMain 
    :storyUuid="story.uuid"
    :blok="story.content"
  />
</template>

<script setup>
const { data: story } = await useAsyncData('form', () => {
  return $fetch('/api/storyblok/request', {
    query: {
      fullSlug: 'forms/contact',
      find_by: 'slug'
    }
  })
})
</script>
```

## Sviluppo Locale

Clona il repository e installa le dipendenze:

```bash
git clone https://github.com/Gothamsiti/GothamForm.git
cd GothamForm
npm install
```

Comandi disponibili:

```bash
# Installa le dipendenze
npm install

# Preparazione sviluppo
npm run dev:prepare

# Sviluppo con playground
npm run dev

# Build playground
npm run dev:build

# Linting
npm run lint

# Test
npm run test
npm run test:watch

# Release versione
npm run release
```

## Troubleshooting

### Email non viene inviata

1. Verifica che `BREVO_API_KEY` sia impostata correttamente in `.env`
2. Controlla che l'email mittente (`from`) sia verificata in Brevo
3. Verifica i log di Brevo nella console di amministrazione

### Campi non si validano

1. Assicurati che `required: true` sia impostato
2. Verifica che il `regex` sia valido
3. Controlla che il campo abbia un `name`

### Stili non applicati

1. Verifica che il CSS del form sia importato
2. Controlla le classi CSS applicate ai componenti
3. Usa gli strumenti di sviluppo del browser per ispezionare gli elementi


## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  pnpm install
  
  # Generate type stubs
  pnpm run dev:prepare
  
  # Develop with the playground
  pnpm run dev
  
  # Build the playground
  pnpm run dev:build
  
  # Run ESLint
  pnpm run lint
  
  # Run Vitest
  pnpm run test
  pnpm run test:watch
  
  # Release new version
  pnpm run release
  ```

</details>

## Licenza

MIT - Vedi [LICENSE](./LICENSE) per dettagli

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/gothamform/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/gothamform

[npm-downloads-src]: https://img.shields.io/npm/dm/gothamform.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/gothamform

[license-src]: https://img.shields.io/npm/l/gothamform.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/gothamform

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
