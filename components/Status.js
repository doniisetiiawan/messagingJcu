import React from 'react';
import {
  StyleSheet,
  Platform,
  View,
  StatusBar,
  Text,
} from 'react-native';
import Constants from 'expo-constants';
import NetInfo from '@react-native-community/netinfo';

const statusHeight = Platform.OS === 'ios' ? Constants.statusBarHeight : 0;

const styles = StyleSheet.create({
  status: {
    zIndex: 1,
    height: statusHeight,
  },
  messageContainer: {
    zIndex: 1,
    position: 'absolute',
    top: statusHeight + 20,
    right: 0,
    left: 0,
    height: 80,
    alignItems: 'center',
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'red',
  },
  text: {
    color: 'white',
  },
});

class Status extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      info: 'none',
    };
  }

  // eslint-disable-next-line camelcase
  async UNSAFE_componentWillMount() {
    this.subscription = NetInfo.addEventListener((state) => {
      this.setState({ info: state.type });
    });
  }

  componentWillUnmount() {
    this.subscription();
  }

  render() {
    const { info } = this.state;

    const isConnected = info !== 'none';
    const backgroundColor = isConnected ? 'white' : 'red';

    const statusBar = (
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={
          isConnected ? 'dark-content' : 'light-content'
        }
        animated={false}
      />
    );

    const messageContainer = (
      <View
        style={styles.messageContainer}
        pointerEvents="none"
      >
        {statusBar}
        {!isConnected && (
          <View style={styles.bubble}>
            <Text style={styles.text}>
              No network connection
            </Text>
          </View>
        )}
      </View>
    );

    if (Platform.OS === 'ios') {
      return (
        <View style={[styles.status, { backgroundColor }]}>
          {statusBar}
        </View>
      );
    }

    return messageContainer;
  }
}

export default Status;
