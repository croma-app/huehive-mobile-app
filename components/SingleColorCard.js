import * as React from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import Card from './Card';
import Colors from '../constants/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import { UndoDialog } from './CommonDialogs';

const SingleColorCard = function (props) {
  const [animationType, setAnimationType] = React.useState('fadeInLeftBig');
  const [isDeletedActive, setIsDeletedActive] = React.useState(false);
  const timeout = React.useRef(null);
  const { color, onColorDelete } = props;
  const onColorDeleteLocal = () => {
    setIsDeletedActive(true);
    timeout.current = setTimeout(() => {
      console.log(`Deleting color ${color.color}`);
      onColorDelete(color.color);
      setIsDeletedActive(false);
    }, 2000);
  };

  const onUndo = React.useCallback(() => {
    setIsDeletedActive(false);
    clearTimeout(timeout.current);
    setAnimationType('fadeInLeftBig');
  }, []);

  return (
    <>
      {!isDeletedActive ? (
        <Card {...props} animationType={animationType}>
          <View>
            <View style={{ backgroundColor: props.color.color, height: 100 }} />
            <View style={styles.bottom}>
              <Text style={styles.label}>
                {props.color.color + (props.color.name ? ' (' + props.color.name + ')' : '')}
              </Text>
              <View style={styles.actionButtonsView}>
                <TouchableOpacity
                  {...{
                    [Platform.OS === 'web' ? 'onClick' : 'onPress']: (event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setAnimationType('fadeOutRightBig');
                      onColorDeleteLocal();
                    }
                  }}
                  style={styles.actionButton}>
                  <FontAwesome size={20} name="trash" />
                </TouchableOpacity>
              </View>

              <View style={styles.actionButtonsView}>
                <TouchableOpacity onPressIn={props.onPressDrag}>
                  <MaterialIcons style={{ alignItems: 'center' }} size={20} name="drag-indicator" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    padding: 16,
    height: 54
  },
  actionButtonsView: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  actionButton: {
    paddingRight: 16
  },
  label: {
    flex: 1,
    marginHorizontal: 4,
    fontWeight: '500',
    color: Colors.darkGrey
  }
});

export default SingleColorCard;
