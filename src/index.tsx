import MaskedView from '@react-native-masked-view/masked-view';
import { useEffect, useState, type ReactNode } from 'react';
import { Circle, G, Svg } from 'react-native-svg';
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import DefaultChild from './DefaultChild';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  children?: ReactNode;
  percent: number;
  labelStyle?: TextStyle;
  duration?: number;
  colors?: string[];
  bgStrokeColor?: string;
  size?: number;
  strokeWidth?: number;
  bgColorContent?: string;
  childContainerStyle?: ViewStyle;
}

const CircleLinearProgress = ({
  children,
  percent = 0,
  labelStyle,
  duration = 1000,
  colors = ['#206374', '#2bc3ee'],
  bgStrokeColor = '#044a5d',
  size = WINDOW_WIDTH * 0.5,
  strokeWidth = 20,
  bgColorContent = '#fff',
  childContainerStyle,
}: Props) => {
  if (percent < 0 || percent > 100) {
    throw new Error('Value must be in 0 - 100');
  }
  if (colors.length !== 2) {
    throw new Error('Only support for two colors');
  }

  // Init some variables
  const r = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  // End init some variables

  const [isCompleted, setIsCompleted] = useState(false);

  const circleProgress = useSharedValue(0);
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: -(circumference * circleProgress.value) / 100,
  }));

  useEffect(() => {
    circleProgress.value = withTiming(percent, { duration }, (finished) => {
      finished && runOnJS(setIsCompleted)(percent === 100);
    });
  }, [circleProgress, percent, duration]);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: isCompleted ? colors[1] : colors[0],
        },
      ]}
    >
      <MaskedView
        style={styles.maskView}
        maskElement={
          <Image
            style={styles.maskImage}
            source={{
              uri: 'https://github.com/zay1x/rn-circular-linear-progress/assets/32409681/ce94f204-67c9-4c89-8e23-ec16f3155fbb',
            }}
          />
        }
      >
        <View
          style={[
            styles.innerMaskView,
            {
              backgroundColor: colors[1],
            },
          ]}
        />
      </MaskedView>
      <View
        style={[
          styles.inner,
          {
            padding: strokeWidth,
          },
        ]}
      >
        <Svg width={size} height={size} style={styles.svg}>
          <G rotation="-90" origin={`${cx}, ${cy}`}>
            <AnimatedCircle
              cx={cx}
              cy={cy}
              r={r}
              stroke={bgStrokeColor}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              animatedProps={animatedProps}
            />
          </G>
        </Svg>
        <View
          style={[
            styles.innerContent,
            {
              backgroundColor: bgColorContent,
            },
            childContainerStyle,
          ]}
        >
          {children ?? (
            <DefaultChild circleProgress={circleProgress} style={labelStyle} />
          )}
        </View>
      </View>
    </View>
  );
};

export default CircleLinearProgress;

const styles = StyleSheet.create({
  container: {
    transform: [{ rotateZ: '-90deg' }],
    position: 'relative',
    borderRadius: 9999,
  },
  maskView: {
    flex: 1,
  },
  maskImage: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    backgroundColor: 'transparent',
  },
  innerMaskView: {
    flex: 1,
    borderRadius: 9999,
  },
  inner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    transform: [{ rotateZ: '90deg' }],
  },
  svg: {
    position: 'absolute',
  },
  innerContent: {
    flex: 1,
    borderRadius: 1000,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
