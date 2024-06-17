import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import interpolate from 'color-interpolate';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
  Svg,
} from 'react-native-svg';

import DefaultChild from './DefaultChild';
import { WINDOW_WIDTH, cos, sampling, sin, step } from './utils';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  children?: ReactNode;
  percent: number;
  labelStyle?: TextStyle;
  duration?: number;
  colors?: string[];
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
  size = WINDOW_WIDTH * 0.5,
  strokeWidth = 20,
  bgColorContent = 'transparent',
  childContainerStyle,
}: Props) => {
  if (percent < 0 || percent > 100) {
    throw new Error('Value must be in 0 - 100');
  }
  if (colors.length !== 2) {
    throw new Error('Only support for two colors');
  }

  // Init some variables
  const palette = interpolate(colors);
  const radius = size / 2 - strokeWidth / 2;
  const cx = size / 2;
  const cy = size / 2;
  const x = (α: number) => cx - radius * cos(α);
  const y = (α: number) => cy - radius * sin(α);
  const arcs: string[] = new Array(sampling).fill(0).map((_, i) => {
    const a = i * step;
    return `M ${x(a)} ${y(a)} A ${radius} ${radius} 0 0 1 ${x(a + step)} ${y(a + step)}`;
  });
  const circumference = 2 * Math.PI * radius;
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
    <View style={styles.container}>
      <View
        style={[
          styles.childrenWrapper,
          {
            width: radius * 2 - strokeWidth,
            height: radius * 2 - strokeWidth,
            padding: strokeWidth,
          },
          childContainerStyle,
        ]}
      >
        {children ?? (
          <DefaultChild circleProgress={circleProgress} style={labelStyle} />
        )}
      </View>

      <Svg width={size} height={size}>
        <Defs>
          {arcs.map((_, i) => {
            const isReversed = i / sampling >= 0.5;
            return (
              <LinearGradient key={i} id={`gradient-${i}`}>
                <Stop
                  stopColor={
                    isCompleted
                      ? palette(arcs.length - 1)
                      : palette(i / sampling)
                  }
                  offset={isReversed ? '100%' : '0%'}
                />
                <Stop
                  stopColor={
                    isCompleted
                      ? palette(arcs.length - 1)
                      : palette(i + 1 / sampling)
                  }
                  offset={isReversed ? '0%' : '100%'}
                />
              </LinearGradient>
            );
          })}
        </Defs>
        <G rotation="90" origin={`${cx}, ${cy}`}>
          {arcs.map((d, i) => (
            <Path
              key={i}
              stroke={`url(#gradient-${i})`}
              fill="transparent"
              d={d}
              strokeWidth={strokeWidth}
            />
          ))}
        </G>
        <G rotation="-90" origin={`${cx}, ${cy}`}>
          <AnimatedCircle
            cx={cx}
            cy={cy}
            r={radius}
            stroke="#044a5d"
            fill={bgColorContent}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            animatedProps={animatedProps}
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  childrenWrapper: {
    backgroundColor: 'white',
    position: 'absolute',
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CircleLinearProgress;
