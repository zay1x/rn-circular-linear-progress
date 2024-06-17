import { useState } from 'react';
import { Text, type TextStyle } from 'react-native';
import {
  runOnJS,
  useDerivedValue,
  type SharedValue,
} from 'react-native-reanimated';

interface Props {
  circleProgress: SharedValue<number>;
  style?: TextStyle;
}

const DefaultChild = ({ circleProgress, style }: Props) => {
  const [percent, setPercent] = useState(0);

  useDerivedValue(() => {
    runOnJS(setPercent)(Math.floor(circleProgress.value));
  });

  return <Text style={style}>{percent}%</Text>;
};

export default DefaultChild;
