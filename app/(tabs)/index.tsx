import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { RefreshCw, Zap } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { getRandomInsult } from '@/services/insultService';
import { useAuth } from '@/context/AuthContext';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { AdBanner } from '@/components/AdBanner';

export default function HomeScreen() {
  const [currentInsult, setCurrentInsult] = useState('');
  const [loading, setLoading] = useState(true);
  const [insultType, setInsultType] = useState<'mixed' | 'personal'>('mixed');
  const { user } = useAuth();
  
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotateZ: `${rotation.value}deg` }
      ],
    };
  });

  useEffect(() => {
    fetchInsult();
  }, [insultType]);

  const fetchInsult = async () => {
    setLoading(true);
    try {
      const insult = await getRandomInsult(user.uid, insultType);
      setCurrentInsult(insult);
      
      // Trigger animation
      scale.value = withSequence(
        withTiming(0.8, { duration: 100 }),
        withSpring(1)
      );
      rotation.value = withSequence(
        withTiming(-5, { duration: 100 }),
        withTiming(5, { duration: 200 }),
        withTiming(0, { duration: 100 })
      );
    } catch (error) {
      Alert.alert('Hata', 'Hakaret yüklenirken bir hata oluştu.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: 'mixed' | 'personal') => {
    setInsultType(type);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, insultType === 'mixed' && styles.activeTypeButton]}
            onPress={() => handleTypeChange('mixed')}
          >
            <Text style={[styles.typeButtonText, insultType === 'mixed' && styles.activeTypeButtonText]}>
              Karışık Hakaretler
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, insultType === 'personal' && styles.activeTypeButton]}
            onPress={() => handleTypeChange('personal')}
          >
            <Text style={[styles.typeButtonText, insultType === 'personal' && styles.activeTypeButtonText]}>
              Kendi Hakaretlerim
            </Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.insultContainer, animatedStyles]}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <>
              <Zap size={28} color={COLORS.accent} style={styles.icon} />
              <Text style={styles.insultText}>{currentInsult}</Text>
            </>
          )}
        </Animated.View>

        <TouchableOpacity style={styles.generateButton} onPress={fetchInsult}>
          <RefreshCw size={20} color="white" />
          <Text style={styles.generateButtonText}>Yeni Hakaret</Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Bildirimleri özelleştirmek için "Bildirimler" sekmesini kullanabilirsiniz.
          </Text>
        </View>
      </ScrollView>

      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 70,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeTypeButton: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  typeButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  activeTypeButtonText: {
    color: COLORS.primary,
  },
  insultContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 24,
    marginVertical: 24,
    alignItems: 'center',
    minHeight: 200,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  icon: {
    marginBottom: 16,
  },
  insultText: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 32,
  },
  generateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  infoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});