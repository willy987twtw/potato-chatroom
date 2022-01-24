import { ref } from 'vue';
import { projectFirestore } from '../firebase/config';

const useDocument = (collection, id) => {
  const error = ref(null);
  const isPending = ref(false);

  let docRef = projectFirestore.collection(collection).doc(id);

  const addDoc = async data => {
    isPending.value = true;
    error.value = null;
    try {
      docRef.set(data);
    } catch (err) {
      console.log(err.message);
      error.value = '無法新增資料，請再試一次';
      isPending.value = false;
    }
  };

  const deleteDoc = async () => {
    isPending.value = true;
    error.value = null;
    try {
      const res = await docRef.delete();
      isPending.value = false;
      return res;
    } catch (err) {
      console.log(err.message);
      error.value = '無法刪除資料，請再試一次';
      isPending.value = false;
    }
  };

  const updateDoc = async updates => {
    isPending.value = true;
    error.value = null;
    try {
      const res = await docRef.update(updates);
      isPending.value = false;
      return res;
    } catch (err) {
      console.log(err.message);
      error.value = '無法更新資料，請再試一次';
      isPending.value = false;
    }
  };

  return { error, isPending, document, deleteDoc, updateDoc, addDoc };
};

export default useDocument;
