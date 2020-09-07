/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import React from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import CameraRoll from 'expo-cameraroll';
import * as Permissions from 'expo-permissions';
import Grid from './Grid';

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});

const keyExtractor = ({ uri }) => uri;

class ImageGrid extends React.Component {
  loading = false;

  cursor = null;

  constructor(props) {
    super(props);

    this.state = {
      images: [],
    };
  }

  componentDidMount() {
    this.getImages();
  }

  getImages = async (after) => {
    if (this.loading) return;

    this.loading = true;

    const { status } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL,
    );

    if (status !== 'granted') {
      console.log('Camera roll permission denied');
    }

    const results = await CameraRoll.getPhotos({
      first: 20,
      after,
    });

    const {
      edges,
      page_info: { has_next_page, end_cursor },
    } = results;

    const loadedImages = edges.map(
      (item) => item.node.image,
    );

    const { images } = this.state;
    this.setState(
      {
        images: images.concat(loadedImages),
      },
      () => {
        this.loading = false;
        this.cursor = has_next_page ? end_cursor : null;
      },
    );
  };

  getNextImages = () => {
    if (!this.cursor) return;

    this.getImages(this.cursor);
  };

  renderItem = ({
    item: { uri },
    size,
    marginTop,
    marginLeft,
  }) => {
    const { onPressImage } = this.props;

    const style = {
      width: size,
      height: size,
      marginLeft,
      marginTop,
    };

    return (
      <TouchableOpacity
        key={uri}
        activeOpacity={0.75}
        onPress={() => onPressImage(uri)}
        style={style}
      >
        <Image source={{ uri }} style={styles.image} />
      </TouchableOpacity>
    );
  };

  render() {
    const { images } = this.state;

    return (
      <Grid
        data={images}
        renderItem={this.renderItem}
        keyExtractor={keyExtractor}
        onEndReached={this.getNextImages}
      />
    );
  }
}

export default ImageGrid;

ImageGrid.propTypes = {
  onPressImage: PropTypes.func,
};

ImageGrid.defaultProps = {
  onPressImage: () => {},
};
