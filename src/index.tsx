import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { TextStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
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
import {
  arcs,
  circumference,
  cx,
  cy,
  palette,
  radius,
  sampling,
  size,
  strokeWidth,
} from './utils';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  children?: ReactNode;
  percent: number;
  labelStyle?: TextStyle;
}

const CircleLinearProgress = ({ children, percent, labelStyle }: Props) => {
  if (percent < 0 || percent > 100) {
    throw new Error('Value must be in 0 - 100');
  }

  const [isCompleted, setIsCompleted] = useState(false);

  const circleProgress = useSharedValue(0);
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: -(circumference * circleProgress.value) / 100,
  }));

  useEffect(() => {
    circleProgress.value = withTiming(
      percent,
      { duration: 500 },
      (finished) => {
        finished && runOnJS(setIsCompleted)(percent === 100);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percent]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.childrenWrapper,
          {
            width: radius * 2 - strokeWidth,
            height: radius * 2 - strokeWidth,
          },
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
            fill="transparent"
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
    padding: strokeWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CircleLinearProgress;
