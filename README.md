# Fastspot API

Typescript library to interact with the [Fastspot](https://fastspot.io) API

```bash
yarn add @nimiq/fastspot-api
```

```js
import { init, getEstimate, SwapAsset } from '@nimiq/fastspot-api'

init('https://api.test.fastspot.io/fast/v1', '<API Key>')

// Get an estimate to buy 1000 NIM with EUR
const estimate = await getEstimate(SwapAsset.EUR, { [SwapAsset.NIM]: 1000 })
```
