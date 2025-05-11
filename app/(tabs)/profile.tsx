import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Trash2, Edit2, User } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { getUserInsults, deleteUserInsult } from '@/services/insultService';

type Insult = {
  id: string;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
};

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [insults, setInsults] = useState<Insult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserInsults();
  }, []);

  const loadUserInsults = async () => {
    setLoading(true);
    try {
      const userInsults = await getUserInsults(user.uid);
      setInsults(userInsults);
    } catch (error) {
      console.error('Error loading user insults:', error);
      Alert.alert('Hata', 'Hakaretleriniz yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInsult = async (insultId: string) => {
    Alert.alert(
      'Hakaret Sil',
      'Bu hakareti silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUserInsult(user.uid, insultId);
              setInsults(prevInsults => prevInsults.filter(insult => insult.id !== insultId));
              Alert.alert('Başarılı', 'Hakaret başarıyla silindi.');
            } catch (error) {
              console.error('Error deleting insult:', error);
              Alert.alert('Hata', 'Hakaret silinirken bir hata oluştu.');
            }
          }
        }
      ]
    );
  };

  const handleEditInsult = (insult: Insult) => {
    // In a real app, this would open a modal or navigate to an edit screen
    Alert.alert('Düzenleme', 'Hakaret düzenleme özelliği yakında eklenecektir.');
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Onaylandı';
      case 'rejected':
        return 'Reddedildi';
      case 'pending':
      default:
        return 'Onay Bekliyor';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return styles.statusApproved;
      case 'rejected':
        return styles.statusRejected;
      case 'pending':
      default:
        return styles.statusPending;
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          onPress: () => signOut()
        }
      ]
    );
  };

  const renderInsultItem = ({ item }: { item: Insult }) => (
    <View style={styles.insultItem}>
      <View style={styles.insultContent}>
        <Text style={styles.insultText}>{item.text}</Text>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      <View style={styles.insultActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleEditInsult(item)}
          disabled={item.status === 'approved'}
        >
          <Edit2 size={18} color={item.status === 'approved' ? COLORS.textSecondary : COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => handleDeleteInsult(item.id)}
        >
          <Trash2 size={18} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.userIconContainer}>
          <User size={32} color={COLORS.text} />
        </View>
        <Text style={styles.emailText}>{user.email}</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.insultListContainer}>
        <Text style={styles.sectionTitle}>Hakaretlerim</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : insults.length > 0 ? (
          <FlatList
            data={insults}
            renderItem={renderInsultItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz hiç hakaret eklemediniz.</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => {/* Navigate to add insult tab */}}
            >
              <Text style={styles.addButtonText}>Hakaret Ekle</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileHeader: {
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  userIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emailText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 12,
  },
  signOutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.error,
  },
  signOutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  insultListContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: COLORS.text,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 20,
  },
  insultItem: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  insultContent: {
    marginBottom: 12,
  },
  insultText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: COLORS.warningLight,
  },
  statusApproved: {
    backgroundColor: COLORS.successLight,
  },
  statusRejected: {
    backgroundColor: COLORS.errorLight,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  insultActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: COLORS.errorLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
  }
});