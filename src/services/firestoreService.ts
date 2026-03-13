import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { CloudMenu, Menu } from '../types';

const COLLECTION_NAME = 'menus';

export const firestoreService = {
  /**
   * Save a new menu to Firestore
   */
  async saveMenu(menu: Menu, baseGuestCount: number): Promise<string> {
    if (!db || !auth?.currentUser) {
      throw new Error('Database or User not authenticated');
    }

    const cloudMenu: Omit<CloudMenu, 'id'> = {
      ...menu,
      userId: auth.currentUser.uid,
      baseGuestCount,
      currentGuestCount: baseGuestCount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...cloudMenu,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
      return '';
    }
  },

  /**
   * Load all menus for the current user
   */
  async getUserMenus(): Promise<CloudMenu[]> {
    if (!db || !auth?.currentUser) return [];

    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          // Convert Firestore Timestamps to ISO strings for the UI
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
        } as CloudMenu;
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      return [];
    }
  },

  /**
   * Update an existing menu
   */
  async updateMenu(menuId: string, updates: Partial<CloudMenu>): Promise<void> {
    if (!db) return;

    try {
      const docRef = doc(db, COLLECTION_NAME, menuId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${menuId}`);
    }
  },

  /**
   * Delete a menu
   */
  async deleteMenu(menuId: string): Promise<void> {
    if (!db) return;

    try {
      const docRef = doc(db, COLLECTION_NAME, menuId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${menuId}`);
    }
  }
};
