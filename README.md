# rn-circular-linear-progress

## Demo

| IOS                                                                                                                                                | Android                                                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ![IOS-ezgif com-video-to-gif-converter](https://github.com/zay1x/rn-circular-linear-progress/assets/32409681/d27c41f5-fef0-4b6b-9076-904fa77fc1f8) | ![ANDROID-ezgif com-video-to-gif-converter](https://github.com/zay1x/rn-circular-linear-progress/assets/32409681/012323ab-58cd-4655-a352-984169b47348) |

## Installation

```sh
npm install rn-circular-linear-progress
or
yarn add rn-circular-linear-progress
```

## Usage

```js
import CircleLinearProgress from 'rn-circular-linear-progress';

export default function App() {
  return (
    <View style={styles.container}>
      <CircleLinearProgress percent={50} />
    </View>
  );
}
```

### Or

```js
import { Text } from 'react-native';
import CircleLinearProgress from 'rn-circular-linear-progress';

export default function App() {
  return (
    <View style={styles.container}>
      <CircleLinearProgress percent={50}>
        <Text>Helo</Text>
      </CircleLinearProgress>
    </View>
  );
}
```

## Props

| Props               | Type      | Required | Note                   |
| ------------------- | --------- | -------- | ---------------------- |
| percent             | number    |          | 1-100                  |
| children            | ReactNode |          |                        |
| labelStyle          | TextStyle |          | Style of default label |
| duration            | number    |          | Duration for animation |
| colors              | string[]  |          |                        |
| size                | number    |          | Width of circle        |
| strokeWidth         | number    |          |                        |
| bgColorContent      | string    |          |                        |
| childContainerStyle | ViewStyle |          |                        |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
