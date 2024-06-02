import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Card from './Card';
import Colors, { Spacing } from '../constants/Styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import { UndoDialog } from './CommonDialogs';
import { pickTextColorBasedOnBgColor } from '../libs/ColorHelper';

const SingleColorCard = function (props) {
  const [animationType, setAnimationType] = React.useState('fadeInUpBig');
  const [isDeletedActive, setIsDeletedActive] = React.useState(false);
  const timeout = React.useRef(null);
  const { color, onColorDelete } = props;
  const onColorDeleteLocal = () => {
    setIsDeletedActive(true);
    timeout.current = setTimeout(() => {
      onColorDelete(color.color);
    }, 2000);
  };

  const onUndo = React.useCallback(() => {
    setIsDeletedActive(false);
    clearTimeout(timeout.current);
    setAnimationType('fadeInUpBig');
  }, []);

  const textColor = pickTextColorBasedOnBgColor(color.color);

  return (
    <>
      {!isDeletedActive ? (
        <Card {...props} animationType={animationType}>
          <TouchableOpacity
            style={{
              backgroundColor: props.color.color,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: Spacing.medium,
              color: textColor,
              height: 100
            }}
            onPress={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}>
            <Text style={[styles.label, { color: textColor }]}>{props.color.color}</Text>
            <View style={styles.bottom}>
              <View style={styles.actionButtonsView}>
                <TouchableOpacity
                  onPress={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setAnimationType('fadeOutRightBig');
                    onColorDeleteLocal();
                  }}
                  style={styles.actionButton}>
                  <MaterialIcons size={20} color={textColor} name="delete-outline" />
                </TouchableOpacity>
              </View>
              <View style={[styles.actionButtonsView, styles.dragDropButton]}>
                <TouchableOpacity
                  onPressIn={(e) => {
                    props.onPressDrag();
                  }}>
                  <MaterialIcons
                    style={{ alignItems: 'center' }}
                    size={20}
                    color={textColor}
                    name="drag-indicator"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Card>
      ) : (
        <UndoDialog
          key={`UndoDialog-${props.color}`}
          name={props.color.color + (props.color.name ? ' (' + props.color.name + ')' : '')}
          undoDeletion={onUndo}
        />
      )}
    </>
  );
};

SingleColorCard.propTypes = {
  color: PropTypes.object,
  onColorDelete: PropTypes.func,
  onPressDrag: PropTypes.func
};

const styles = StyleSheet.create({
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54
  },
  actionButtonsView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 5
  },
  dragDropButton: {
    marginRight: 10,
    padding: 10
  },
  label: {
    flex: 1,
    marginHorizontal: 4,
    fontWeight: '600',
    color: Colors.darkGrey,
    padding: 10
  }
});

export default SingleColorCard;
