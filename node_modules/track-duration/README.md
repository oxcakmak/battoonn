## Track duration

[![npm version](https://badge.fury.io/js/track-duration.svg)](https://badge.fury.io/js/track-duration)
[![](https://github.com/believer/track-duration/workflows/Release/badge.svg)](https://github.com/believer/track-duration/actions?workflow=Release)

Converts milliseconds to a format like Spotify's track durations.

### Installation

```
npm install track-duration --save
```

### Parse

```js
parse(milliseconds: number): string
```

Takes milliseconds and returns a formatted duration.

#### Example

```js
import { parse } from 'track-duration'

parse(5000000) // 1:23:19
parse(223452) // 3:43
```

### Tests

```sh
npm run build # compile javascript code
npm test
```
