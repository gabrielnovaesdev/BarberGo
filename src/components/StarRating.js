import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';

export const StarRating = ({ rating, size = 14, showCount, count, style }) => {
  const stars = [1, 2, 3, 4, 5];
  
  return (
    <View style={[styles.container, style]}>
      {stars.map((star) => {
        const filled = star <= Math.floor(rating);
        const halfFilled = !filled && star <= rating + 0.5;
        return (
          <Text
            key={star}
            style={[
              styles.star,
              { fontSize: size },
              filled ? styles.starFilled : halfFilled ? styles.starHalf : styles.starEmpty,
            ]}
          >
            {filled ? '★' : halfFilled ? '⭐' : '☆'}
          </Text>
        );
      })}
      {showCount && (
        <Text style={[styles.count, { fontSize: size }]}>
          {rating.toFixed(1)} {count ? `(${count})` : ''}
        </Text>
      )}
    </View>
  );
};

export const InteractiveStarRating = ({ rating, onRate, size = 32 }) => {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onRate(star)} style={styles.starButton}>
          <Text style={[styles.interactiveStar, { fontSize: size }, star <= rating ? styles.starFilled : styles.starEmpty]}>
            {star <= rating ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 1,
  },
  starFilled: {
    color: theme.colors.star,
  },
  starHalf: {
    color: theme.colors.star,
  },
  starEmpty: {
    color: theme.colors.textDisabled,
  },
  count: {
    color: theme.colors.textMuted,
    marginLeft: 4,
    fontWeight: theme.fontWeight.medium,
  },
  starButton: {
    padding: 4,
  },
  interactiveStar: {
    color: theme.colors.star,
  },
});
