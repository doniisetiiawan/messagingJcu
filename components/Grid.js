import PropTypes from 'prop-types';
import React from 'react';
import {
  Dimensions,
  FlatList,
  PixelRatio,
  StyleSheet,
} from 'react-native';

class Grid extends React.Component {
  renderGridItem = (info) => {
    const { index } = info;
    const {
      renderItem,
      numColumns,
      itemMargin,
    } = this.props;

    // We want to get the device width on render, in case the device is rotated
    const { width } = Dimensions.get('window');

    // Fix visual inconsistencies by aligning to the nearest pixel
    const size = PixelRatio.roundToNearestPixel(
      (width - itemMargin * (numColumns - 1)) / numColumns,
    );

    const marginTop = index < numColumns ? 0 : itemMargin;
    const marginLeft = index % numColumns === 0 ? 0 : itemMargin;

    return renderItem({
      ...info,
      size,
      marginLeft,
      marginTop,
    });
  };

  render() {
    return (
      <FlatList
        {...this.props}
        renderItem={this.renderGridItem}
      />
    );
  }
}

export default Grid;

Grid.propTypes = {
  itemMargin: PropTypes.number,
  numColumns: PropTypes.number,
  renderItem: PropTypes.func.isRequired,
};

Grid.defaultProps = {
  numColumns: 4,
  itemMargin: StyleSheet.hairlineWidth,
};
