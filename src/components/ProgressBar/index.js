import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import Animated, {Easing} from 'react-native-reanimated';

const {
  Clock,
  Value,
  set,
  cond,
  startClock,
  clockRunning,
  timing,
  debug,
  stopClock,
  block,
  concat,
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: value,
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 200,
    toValue: dest,
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(clockRunning(clock), 0, [
      // If the clock isn't running we reset all the animation params and start the clock
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    // we run the step here that is going to update position
    timing(clock, state, config),
    // if the animation is over we stop the clock
    cond(state.finished, debug('stop clock', stopClock(clock))),
    // we made the block return the updated position
    state.position,
  ]);
}

export default class ProgressBar extends React.Component {
  static propTypes = {
    progress: PropTypes.number.isRequired,
    height: PropTypes.number,
    color: PropTypes.string,
    borderRadius: PropTypes.number,
  };

  static defaultProps = {
    height: 20,
    color: 'green',
    borderRadius: 2,

    width: 300,
    backgroundColor: 'transparent',
  };
  constructor(props) {
    super(props);
    this.clock = new Clock();
    this.progress = new Value(0);
    this.animation = new Value(0);
    this.transX = new Value(0);
  }

  componentDidUpdate(prevProps) {
    const prevProg = prevProps.progress * 100;
    const progress = this.props.progress * 100;

    this.transX = runTiming(
      this.clock,
      new Value(prevProg),
      new Value(progress),
    );
    console.log('prevProg ', prevProg);
    console.log('progress ', progress);
    console.log(this.transX);
  }

  render() {
    const progressStyle = {
      width: concat(this.transX, '%'),
      height: this.props.height,
      backgroundColor: this.props.color,
      borderRadius: this.props.borderRadius,
    };
    return (
      <View
        style={[
          {
            backgroundColor: this.props.backgroundColor,
            width: this.props.width,
          },
          this.props.style,
        ]}>
        <Animated.View style={progressStyle} />
      </View>
    );
  }
}
