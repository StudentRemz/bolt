import firebase from 'firebase/app';
import 'firebase/firestore';

// Sample system insults for demo purposes
const SAMPLE_INSULTS = [
  "Hala oturuyor musun tembel şey? Kalk ve biraz hareket et!",
  "Yazık, bu kadar tembelliği nasıl başarıyorsun? Hadi spor yap!",
  "Bu göbek kendiliğinden erimeyecek, tembel adam/kadın!",
  "Excuse'ları bırak ve harekete geç, kaytarıcı!",
  "Senin için endişeleniyorum, şu koltuğu bir bırak artık!",
  "O telefonu bırak ve bir tane şınav çek, güçsüz!"
];

export const getRandomInsult = async (userId: string, type: 'mixed' | 'personal' = 'mixed') => {
  try {
    // In a real app, we would fetch from Firestore
    // For now, return a sample insult
    if (type === 'personal') {
      return "Kendi eklediğin hakaret: Hadi artık şu koltuğu bırak ve biraz hareket et!";
    }
    
    // Return a random insult from the sample list
    const randomIndex = Math.floor(Math.random() * SAMPLE_INSULTS.length);
    return SAMPLE_INSULTS[randomIndex];
  } catch (error) {
    console.error('Error getting random insult:', error);
    throw error;
  }
};

export const addUserInsult = async (userId: string, insultText: string) => {
  try {
    // In a real app, we would add to Firestore
    // For now, simulate adding the insult
    console.log(`Adding insult for user ${userId}: ${insultText}`);
    return true;
  } catch (error) {
    console.error('Error adding user insult:', error);
    throw error;
  }
};

export const getUserInsults = async (userId: string) => {
  try {
    // In a real app, we would fetch from Firestore
    // For now, return sample user insults
    return [
      {
        id: '1',
        text: 'Spor yapmadığın her gün, biraz daha tembelleşiyorsun!',
        status: 'approved',
        createdAt: new Date(),
      },
      {
        id: '2',
        text: 'O koltuğa yapışmış kalçanı kaldır ve biraz hareket et!',
        status: 'pending',
        createdAt: new Date(),
      },
      {
        id: '3',
        text: 'Bu tembellikle hayatta hiçbir şey başaramayacaksın, kalk ve çalış!',
        status: 'rejected',
        createdAt: new Date(),
      }
    ];
  } catch (error) {
    console.error('Error getting user insults:', error);
    throw error;
  }
};

export const deleteUserInsult = async (userId: string, insultId: string) => {
  try {
    // In a real app, we would delete from Firestore
    // For now, simulate deleting the insult
    console.log(`Deleting insult ${insultId} for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error deleting user insult:', error);
    throw error;
  }
};