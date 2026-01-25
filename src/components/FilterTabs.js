import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, statusConfig } from '../constants/colors';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

const filters = [
  { key: 'all', label: 'Tümü', icon: 'grid', color: colors.primary },
  { key: 'watching', label: 'İzleniyor', icon: 'play-circle', color: colors.watching },
  { key: 'completed', label: 'Tamamlandı', icon: 'checkmark-circle', color: colors.completed },
  { key: 'planToWatch', label: 'İzlenecek', icon: 'time', color: colors.planToWatch },
  { key: 'onHold', label: 'Beklemede', icon: 'pause-circle', color: colors.onHold },
  { key: 'dropped', label: 'Bırakıldı', icon: 'close-circle', color: colors.dropped },
];

const FilterTabs = ({ activeFilter, onFilterChange, counts = {} }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter.key;
        const count = filter.key === 'all' ? counts.total : counts[filter.key];

        return (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.tab,
              isActive && styles.activeTab,
              isActive && { borderColor: filter.color },
            ]}
            onPress={() => onFilterChange(filter.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={filter.icon}
              size={16}
              color={isActive ? filter.color : colors.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                isActive && styles.activeTabText,
                isActive && { color: filter.color },
              ]}
            >
              {filter.label}
            </Text>
            {count > 0 && (
              <View
                style={[
                  styles.countBadge,
                  isActive && { backgroundColor: filter.color },
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    isActive && styles.activeCountText,
                  ]}
                >
                  {count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 50,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: spacing.xs,
  },
  activeTab: {
    backgroundColor: colors.backgroundInput,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  activeTabText: {
    fontWeight: fontWeight.semiBold,
  },
  countBadge: {
    backgroundColor: colors.backgroundInput,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    minWidth: 24,
    alignItems: 'center',
  },
  countText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semiBold,
  },
  activeCountText: {
    color: colors.textPrimary,
  },
});

export default FilterTabs;
