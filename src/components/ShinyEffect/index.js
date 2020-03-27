import React, { useState, useEffect, useRef } from 'react';
import Animated, { Easing } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
const {
  Clock,
  Value,
  set,
  cond,
  startClock,
  clockRunning,
  timing,
  block,
  interpolate,
} = Animated;

function runTranslationTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: value,
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 800,
    toValue: dest,
    easing: Easing.linear,
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, new Value(0)),
      set(state.frameTime, 0),
    ]),
    state.position,
  ]);
}
//let range = new Animated.Value(0);
let transX = new Animated.Value(0);
transX = runTranslationTiming(
  new Clock(),
  new Value(0),
  new Value(5000),
);

const ShinyEffect = (props) => {

  let range = useRef(new Value(0));
  range.current = interpolate(transX, {
    inputRange: [0, 5000],
    outputRange: [-500, props.progress * props.barWidth],
  });

  useEffect(() => {
    range.current = interpolate(transX, {
      inputRange: [0, 5000],
      outputRange: [-500, props.progress * props.barWidth],
    });
  }, [props.progress])

  return (
    <Animated.View
      style={{
        height: 35,
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
        transform: [{ translateX: range.current }, { skewX: '20deg' }],
      }}>
      <LinearGradient
        style={{
          width: 150,
          height: 35,
          bottom: 0,
          right: 0,
          left: 0,
        }}
        useAngle={true}
        angle={45}
        angleCenter={{ x: 0.5, y: 0.5 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[
          '#ffffff00',
          '#ffffff20',
          '#ffffffB3',
          '#ffffff20',
          '#ffffff00',
        ]}></LinearGradient>
    </Animated.View>
  );
}

export default ShinyEffect
