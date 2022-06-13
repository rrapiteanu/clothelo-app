import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: 'white',
  },
});

type Props = Pick<TouchableOpacityProps, 'onPress'> & {
  color?: string;
  name: string;
  size?: number;
};

const TouchIcon: React.FC<Props> = ({color, name, size, onPress}) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <MaterialCommunityIcons name={name} color={color} size={size} />
  </TouchableOpacity>
);

export default TouchIcon;
