import PropTypes from 'prop-types';
import React from 'react';
import Constants from 'expo-constants';
import { Platform, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class MeasureLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layout: null,
    };
  }

  handleLayout = (event) => {
    const {
      nativeEvent: { layout },
    } = event;

    this.setState({
      layout: {
        ...layout,
        y:
          layout.y
          + (Platform.OS === 'android'
            ? Constants.statusBarHeight
            : 0),
      },
    });
  };

  render() {
    const { children } = this.props;
    const { layout } = this.state;

    if (!layout) {
      return (
        <View
          onLayout={this.handleLayout}
          style={styles.container}
        />
      );
    }

    return children(layout);
  }
}

export default MeasureLayout;

MeasureLayout.propTypes = {
  children: PropTypes.func.isRequired,
};
