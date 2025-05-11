import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView, Linking } from 'react-native';
import { Shield, Info, ExternalLink } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { AdBanner } from '@/components/AdBanner';

export default function SettingsScreen() {
  const [receiveMarketing, setReceiveMarketing] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handlePrivacyPolicy = () => {
    // In a real app, we would link to a privacy policy page
    Linking.openURL('https://example.com/privacy-policy');
  };

  const handleTermsOfService = () => {
    // In a real app, we would link to a terms of service page
    Linking.openURL('https://example.com/terms-of-service');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: () => {
            // Handle account deletion
            Alert.alert('Bilgi', 'Hesap silme özelliği yakında eklenecektir.');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uygulama Ayarları</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingTitle}>Karanlık Mod</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
              thumbColor={darkMode ? COLORS.primary : COLORS.textSecondary}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingTitle}>Pazarlama Bildirimleri</Text>
            <Switch
              value={receiveMarketing}
              onValueChange={setReceiveMarketing}
              trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
              thumbColor={receiveMarketing ? COLORS.primary : COLORS.textSecondary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hakkında</Text>
          
          <TouchableOpacity style={styles.linkRow} onPress={handlePrivacyPolicy}>
            <Shield size={20} color={COLORS.text} />
            <Text style={styles.linkText}>Gizlilik Politikası</Text>
            <ExternalLink size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkRow} onPress={handleTermsOfService}>
            <Info size={20} color={COLORS.text} />
            <Text style={styles.linkText}>Kullanım Şartları</Text>
            <ExternalLink size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.dangerSection}>
          <Text style={styles.dangerSectionTitle}>Tehlikeli Bölge</Text>
          
          <TouchableOpacity style={styles.deleteAccountButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteAccountText}>Hesabımı Sil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versiyon 1.0.0</Text>
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
    padding: 20,
    paddingBottom: 70,
  },
  section: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  linkText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
    marginLeft: 10,
  },
  dangerSection: {
    backgroundColor: COLORS.errorLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  dangerSectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: COLORS.error,
    marginBottom: 16,
  },
  deleteAccountButton: {
    backgroundColor: COLORS.error,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteAccountText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});