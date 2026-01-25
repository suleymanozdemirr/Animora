import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { borderRadius } from '../constants/theme';

const ProgressBar = ({ progress, color = colors.primary, height = 6 }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={[styles.container, { height }]}>
      <View
        style={[
          styles.progress,
          {
            width: `${clampedProgress}%`,
            backgroundColor: color,
            height,
          },
        ]}
      />
      {/* Glow effect */}
      {clampedProgress > 0 && (
        <View
          style={[
            styles.glow,
            {
              left: `${clampedProgress - 2}%`,
              backgroundColor: color,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    position: 'relative',
  },
  progress: {
    borderRadius: borderRadius.full,
  },
  glow: {
    position: 'absolute',
    top: -2,
    width: 12,
    height: 10,
    borderRadius: borderRadius.full,
    opacity: 0.6,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});

export default ProgressBar;
