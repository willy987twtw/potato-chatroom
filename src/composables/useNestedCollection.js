import { ref } from 'vue';
import { projectFirestore } from '../firebase/config';

const useDocument = (collection, id, collection2) => {
  const error = ref(null);
  const isPending = ref(false);

  let docRef = projectFirestore
    .collection(collection)
    .doc(id)
    .collection(collection2);

  const addDoc = async data => {
    isPending.value = true;
    error.value = null;
    try {
      docRef.add(data);
    } catch (err) {
      console.log(err.message);
      error.value = '無法新增資料，請再試一次';
      isPending.value = false;
    }
  };

  const deleteDoc = async id => {
    isPending.value = true;
    error.value = null;
    try {
      const res = await docRef.doc(id).delete();
      isPending.value = false;
      return res;
    } catch (err) {
      console.log(err.message);
      error.value = '無法刪除資料，請再試一次';
      isPending.value = false;
    }
  };

  const updateDoc = async (id, updates) => {
    isPending.value = true;
    error.value = null;
    try {
      const res = await docRef.doc(id).update(updates);
      isPending.value = false;
      return res;
    } catch (err) {
      console.log(err.message);
      error.value = '無法更新資料，請再試一次';
      isPending.value = false;
    }
  };

  const addDocWithId = async (id, doc) => {
    error.value = null;
    try {
      const res = await docRef.doc(id).set(doc);
      isPending.value = false;

      return res;
    } catch (err) {
      console.log(err.message);
      error.value = 'could not send the message';
    }
  };

  return {
    error,
    isPending,
    document,
    deleteDoc,
    updateDoc,
    addDoc,
    addDocWithId,
  };
};

export default useDocument;
