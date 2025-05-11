import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Clock, Save } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import DatePicker from 'react-native-date-picker';
import { getUserNotificationSettings, updateUserNotificationSettings } from '@/services/notificationService';
import { useAuth } from '@/context/AuthContext';
import { registerForPushNotificationsAsync } from '@/services/notificationService';

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Pazartesi' },
  { id: 'tuesday', label: 'Salı' },
  { id: 'wednesday', label: 'Çarşamba' },
  { id: 'thursday', label: 'Perşembe' },
  { id: 'friday', label: 'Cuma' },
  { id: 'saturday', label: 'Cumartesi' },
  { id: 'sunday', label: 'Pazar' },
];

const TIME_SLOTS = [
  { id: 'morning', label: 'Sabah (06:00 - 12:00)' },
  { id: 'afternoon', label: 'Öğleden Sonra (12:00 - 18:00)' },
  { id: 'evening', label: 'Akşam (18:00 - 22:00)' },
  { id: 'night', label: 'Gece (22:00 - 06:00)' },
];

const TimePickerComponent = ({ 
  date, 
  onConfirm, 
  onCancel, 
  open 
}: { 
  date: Date; 
  onConfirm: (date: Date) => void; 
  onCancel: () => void; 
  open: boolean; 
}) => {
  if (Platform.OS === 'web') {
    if (!open) return null;
    
    return (
      <input
        type="time"
        value={`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`}
        onChange={(e) => {
          const [hours, minutes] = e.target.value.split(':').map(Number);
          const newDate = new Date(date);
          newDate.setHours(hours);
          newDate.setMinutes(minutes);
          onConfirm(newDate);
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          padding: '10px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: 'white',
        }}
      />
    );
  }

  return (
    <DatePicker
      modal
      open={open}
      date={date}
      mode="time"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

export default function NotificationsScreen() {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      const settings = await getUserNotificationSettings(user.uid);
      if (settings) {
        setNotificationsEnabled(settings.enabled);
        
        if (settings.startTime) {
          const [hours, minutes] = settings.startTime.split(':').map(Number);
          const startDate = new Date();
          startDate.setHours(hours, minutes, 0);
          setStartTime(startDate);
        }
        
        if (settings.endTime) {
          const [hours, minutes] = settings.endTime.split(':').map(Number);
          const endDate = new Date();
          endDate.setHours(hours, minutes, 0);
          setEndTime(endDate);
        }
        
        setSelectedDays(settings.days || []);
        setSelectedTimeSlots(settings.timeSlots || []);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDay = (dayId: string) => {
    setSelectedDays(prev => {
      if (prev.includes(dayId)) {
        return prev.filter(d => d !== dayId);
      } else {
        return [...prev, dayId];
      }
    });
  };

  const handleToggleTimeSlot = (slotId: string) => {
    setSelectedTimeSlots(prev => {
      if (prev.includes(slotId)) {
        return prev.filter(s => s !== slotId);
      } else {
        return [...prev, slotId];
      }
    });
  };

  const saveSettings = async () => {
    try {
      if (notificationsEnabled) {
        // Request permissions if enabling notifications
        const token = await registerForPushNotificationsAsync();
        if (!token && Platform.OS !== 'web') {
          Alert.alert(
            'Bildirim İzni Gerekli',
            'Bildirimleri alabilmek için izin vermeniz gerekiyor.',
            [{ text: 'Tamam' }]
          );
          return;
        }
      }

      // Format times as HH:MM
      const formatTime = (date: Date) => {
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      };

      await updateUserNotificationSettings(user.uid, {
        enabled: notificationsEnabled,
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
        days: selectedDays,
        timeSlots: selectedTimeSlots,
      });

      Alert.alert('Başarılı', 'Bildirim ayarlarınız kaydedildi.');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      Alert.alert('Hata', 'Ayarlar kaydedilirken bir hata oluştu.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Ayarlar yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <Text style={styles.settingTitle}>Bildirimleri Etkinleştir</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
              thumbColor={notificationsEnabled ? COLORS.primary : COLORS.textSecondary}
            />
          </View>
        </View>

        {notificationsEnabled && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bildirim Saatleri</Text>
              <Text style={styles.sectionDescription}>
                Bildirimlerin gönderilmesini istediğiniz saat aralığını seçin.
              </Text>

              <View style={styles.timeSection}>
                <TouchableOpacity
                  style={styles.timeSelector}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Clock size={20} color={COLORS.text} />
                  <Text style={styles.timeText}>
                    Başlangıç: {startTime.getHours().toString().padStart(2, '0')}:
                    {startTime.getMinutes().toString().padStart(2, '0')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.timeSelector}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Clock size={20} color={COLORS.text} />
                  <Text style={styles.timeText}>
                    Bitiş: {endTime.getHours().toString().padStart(2, '0')}:
                    {endTime.getMinutes().toString().padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              </View>

              <TimePickerComponent
                open={showStartPicker}
                date={startTime}
                onConfirm={(date) => {
                  setShowStartPicker(false);
                  setStartTime(date);
                }}
                onCancel={() => setShowStartPicker(false)}
              />

              <TimePickerComponent
                open={showEndPicker}
                date={endTime}
                onConfirm={(date) => {
                  setShowEndPicker(false);
                  setEndTime(date);
                }}
                onCancel={() => setShowEndPicker(false)}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bildirim Günleri</Text>
              <Text style={styles.sectionDescription}>
                Bildirimleri almak istediğiniz günleri seçin.
              </Text>

              <View style={styles.optionsContainer}>
                {DAYS_OF_WEEK.map((day) => (
                  <TouchableOpacity
                    key={day.id}
                    style={[
                      styles.optionButton,
                      selectedDays.includes(day.id) && styles.selectedOption,
                    ]}
                    onPress={() => handleToggleDay(day.id)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedDays.includes(day.id) && styles.selectedOptionText,
                      ]}
                    >
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Zaman Dilimleri</Text>
              <Text style={styles.sectionDescription}>
                Bildirim almak istediğiniz zaman dilimlerini seçin.
              </Text>

              <View style={styles.optionsContainer}>
                {TIME_SLOTS.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.optionButton,
                      selectedTimeSlots.includes(slot.id) && styles.selectedOption,
                    ]}
                    onPress={() => handleToggleTimeSlot(slot.id)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedTimeSlots.includes(slot.id) && styles.selectedOptionText,
                      ]}
                    >
                      {slot.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Save size={20} color="white" />
          <Text style={styles.saveButtonText}>Ayarları Kaydet</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    color: COLORS.text,
    fontSize: 16,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: COLORS.text,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  timeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 0.48,
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    color: COLORS.text,
    fontSize: 15,
    marginLeft: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  optionButton: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedOption: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontFamily: 'Inter-SemiBold',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
});