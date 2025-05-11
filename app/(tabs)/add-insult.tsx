import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Send, Info } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { addUserInsult } from '@/services/insultService';

function AddInsultScreen() {
  const [insultText, setInsultText] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!insultText.trim()) {
      Alert.alert('Hata', 'Lütfen bir hakaret girin.');
      return;
    }

    setLoading(true);
    try {
      await addUserInsult(user.uid, insultText.trim());
      Alert.alert(
        'Başarılı', 
        'Hakaret başarıyla eklendi. Admin onayından sonra kullanılabilir olacaktır.',
        [{ text: 'Tamam', onPress: () => setInsultText('') }]
      );
    } catch (error) {
      console.error('Error adding insult:', error);
      Alert.alert('Hata', 'Hakaret eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.infoBox}>
          <Info size={24} color={COLORS.accent} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Eklediğiniz hakaretler admin onayından sonra kullanılabilir olacaktır. Kendi hakaretlerinizi "Profilim" sekmesinden görüntüleyebilirsiniz.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Hakaretinizi Yazın</Text>
          <TextInput
            style={styles.input}
            placeholder="Ör: Oturmayı bırak ve spor yapmaya başla, tembel!"
            placeholderTextColor={COLORS.textSecondary}
            value={insultText}
            onChangeText={setInsultText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading || !insultText.trim()}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Send size={20} color="white" />
                <Text style={styles.submitButtonText}>Gönder</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.guidelinesContainer}>
          <Text style={styles.guidelinesTitle}>Hakaret Kuralları</Text>
          <Text style={styles.guidelineText}>
            • Hakaretler motive edici olmalıdır.
          </Text>
          <Text style={styles.guidelineText}>
            • Kişisel bilgiler içermemelidir.
          </Text>
          <Text style={styles.guidelineText}>
            • Irkçı, cinsiyetçi veya nefret söylemi içermemelidir.
          </Text>
          <Text style={styles.guidelineText}>
            • Küfür içerebilir ancak aşırıya kaçmamalıdır.
          </Text>
          <Text style={styles.guidelineText}>
            • Diğer kullanıcıları hedef alan içerikler olmamalıdır.
          </Text>
        </View>
      </ScrollView>
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
  },
  infoBox: {
    backgroundColor: COLORS.accentLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  guidelinesContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  guidelinesTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 12,
  },
  guidelineText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default AddInsultScreen;