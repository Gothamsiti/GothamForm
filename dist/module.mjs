import { createJiti } from "file:///Users/robertosilvestri/Sites/starkIndustries/GothamForm/node_modules/.pnpm/jiti@2.6.1/node_modules/jiti/lib/jiti.mjs";

const jiti = createJiti(import.meta.url, {
  "interopDefault": true,
  "alias": {
    "gothamform": "/Users/robertosilvestri/Sites/starkIndustries/GothamForm"
  },
  "transformOptions": {
    "babel": {
      "plugins": []
    }
  }
})

/** @type {import("/Users/robertosilvestri/Sites/starkIndustries/GothamForm/src/module.js")} */
const _module = await jiti.import("/Users/robertosilvestri/Sites/starkIndustries/GothamForm/src/module.ts");

export default _module?.default ?? _module;