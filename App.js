import React from 'react';
import {
  StyleSheet,
  View,
  Alert,
  TouchableHighlight,
  Image,
  BackHandler,
} from 'react-native';
import Status from './components/Status';
import {
  createImageMessage,
  createLocationMessage,
  createTextMessage,
} from './utils/MessageUtils';
import MessageList from './components/MessageList';
import Toolbar from './components/Toolbar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white',
  },
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 2,
  },
  fullscreenImage: {
    flex: 1,
    resizeMode: 'contain',
  },
});

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [
        createImageMessage('https://unsplash.it/300/300'),
        createTextMessage('World'),
        createTextMessage('Hello'),
        createLocationMessage({
          latitude: 37.78825,
          longitude: -122.4324,
        }),
      ],
      fullscreenImageId: null,
      isInputFocused: false,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        const { fullscreenImageId } = this.state;

        if (fullscreenImageId) {
          this.dismissFullscreenImage();
          return true;
        }

        return false;
      },
    );
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  dismissFullscreenImage = () => {
    this.setState({ fullscreenImageId: null });
  };

  handlePressToolbarLocation = () => {
    const { messages } = this.state;

    navigator.geolocation.getCurrentPosition((position) => {
      const {
        coords: { latitude, longitude },
      } = position;

      this.setState({
        messages: [
          createLocationMessage({
            latitude,
            longitude,
          }),
          ...messages,
        ],
      });
    });
  };

  handleSubmit = (text) => {
    const { messages } = this.state;

    this.setState({
      messages: [createTextMessage(text), ...messages],
    });
  };

  handleChangeFocus = (isFocused) => {
    this.setState({ isInputFocused: isFocused });
  };

  handlePressMessage = ({ id, type }) => {
    switch (type) {
      case 'text':
        Alert.alert(
          'Delete message?',
          'Are you sure you want to permanently delete this message?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                const { messages } = this.state;
                this.setState({
                  messages: messages.filter(
                    (message) => message.id !== id,
                  ),
                });
              },
            },
          ],
        );
        break;
      case 'image':
        this.setState({
          fullscreenImageId: id,
          isInputFocused: false,
        });
        break;
      default:
        break;
    }
  };

  renderMessageList() {
    const { messages } = this.state;

    return (
      <View style={styles.content}>
        <MessageList
          messages={messages}
          onPressMessage={this.handlePressMessage}
        />
      </View>
    );
  }

  renderToolbar() {
    const { isInputFocused } = this.state;

    return (
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={this.handleSubmit}
          onChangeFocus={this.handleChangeFocus}
          onPressLocation={this.handlePressToolbarLocation}
        />
      </View>
    );
  }

  renderInputMethodEditor() {
    return <View style={styles.inputMethodEditor} />;
  }

  renderFullscreenImage = () => {
    const { messages, fullscreenImageId } = this.state;

    if (!fullscreenImageId) return null;

    const image = messages.find(
      (message) => message.id === fullscreenImageId,
    );

    if (!image) return null;

    const { uri } = image;

    return (
      <TouchableHighlight
        style={styles.fullscreenOverlay}
        onPress={this.dismissFullscreenImage}
      >
        <Image
          style={styles.fullscreenImage}
          source={{ uri }}
        />
      </TouchableHighlight>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Status />
        {this.renderMessageList()}
        {this.renderToolbar()}
        {this.renderInputMethodEditor()}
        {this.renderFullscreenImage()}
      </View>
    );
  }
}
