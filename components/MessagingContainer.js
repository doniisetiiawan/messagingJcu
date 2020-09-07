import PropTypes from 'prop-types';
import React from 'react';
import {
  BackHandler, LayoutAnimation, Platform, UIManager, View,
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export const INPUT_METHOD = {
  NONE: 'NONE',
  KEYBOARD: 'KEYBOARD',
  CUSTOM: 'CUSTOM',
};

class MessagingContainer extends React.Component {
  componentDidMount() {
    this.subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        const {
          onChangeInputMethod,
          inputMethod,
        } = this.props;

        if (inputMethod === INPUT_METHOD.CUSTOM) {
          onChangeInputMethod(INPUT_METHOD.NONE);
          return true;
        }

        return false;
      },
    );
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { onChangeInputMethod } = this.props;

    const { keyboardVisible, inputMethod } = this.props;
    if (!keyboardVisible && nextProps.keyboardVisible) {
      // Keyboard shown
      onChangeInputMethod(INPUT_METHOD.KEYBOARD);
    } else if (
      // Keyboard hidden
      keyboardVisible
      && !nextProps.keyboardVisible
      && inputMethod !== INPUT_METHOD.CUSTOM
    ) {
      onChangeInputMethod(INPUT_METHOD.NONE);
    }

    // const { keyboardAnimationDuration } = nextProps;

    // Animate between states
    const animation = LayoutAnimation.create(
      250,
      Platform.OS === 'android'
        ? LayoutAnimation.Types.easeInEaseOut
        : LayoutAnimation.Types.keyboard,
      LayoutAnimation.Properties.opacity,
    );
    LayoutAnimation.configureNext(animation);
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  render() {
    const {
      children,
      renderInputMethodEditor,
      inputMethod,
      containerHeight,
      contentHeight,
      keyboardHeight,
      keyboardWillShow,
      keyboardWillHide,
    } = this.props;

    const useContentHeight = keyboardWillShow
      || inputMethod === INPUT_METHOD.KEYBOARD;

    const containerStyle = {
      height: useContentHeight
        ? contentHeight
        : containerHeight,
    };

    const showCustomInput = inputMethod === INPUT_METHOD.CUSTOM
      && !keyboardWillShow;

    const keyboardIsHidden = inputMethod === INPUT_METHOD.NONE
      && !keyboardWillShow;

    const keyboardIsHiding = inputMethod === INPUT_METHOD.KEYBOARD
      && keyboardWillHide;

    const inputStyle = {
      height: showCustomInput ? keyboardHeight || 250 : 0,
      marginTop:
        isIphoneX()
        && (keyboardIsHidden || keyboardIsHiding)
          ? 24
          : 0,
    };

    return (
      <View style={containerStyle}>
        {children}
        <View style={inputStyle}>
          {renderInputMethodEditor()}
        </View>
      </View>
    );
  }
}

export default MessagingContainer;

MessagingContainer.propTypes = {
  containerHeight: PropTypes.number.isRequired,
  contentHeight: PropTypes.number.isRequired,
  keyboardHeight: PropTypes.number.isRequired,
  keyboardVisible: PropTypes.bool.isRequired,
  keyboardWillShow: PropTypes.bool.isRequired,
  keyboardWillHide: PropTypes.bool.isRequired,
  // keyboardAnimationDuration: PropTypes.number.isRequired,
  inputMethod: PropTypes.oneOf(Object.values(INPUT_METHOD))
    .isRequired,
  onChangeInputMethod: PropTypes.func,
  children: PropTypes.node,
  renderInputMethodEditor: PropTypes.func.isRequired,
};

MessagingContainer.defaultProps = {
  children: null,
  onChangeInputMethod: () => {},
};
