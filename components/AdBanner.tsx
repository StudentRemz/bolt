import { Platform, View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/Colors';

export function AdBanner() {
  // Only render the ad on native platforms
  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <View style={styles.adContainer}>
      <View style={styles.placeholder}>
        {/* Placeholder for native ad implementation */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  adContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.cardBackground,
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  placeholder: {
    height: 50, // Standard banner height
    width: '100%',
    backgroundColor: 'transparent',
  }
});