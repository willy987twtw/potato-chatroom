import { ref } from '@vue/reactivity';
import { projectFirestore } from '../firebase/config';

const useCollection = collection => {
  const error = ref(null);

  const addDoc = async doc => {
    error.value = null;
    try {
      await projectFirestore.collection(collection).add(doc);
    } catch (err) {
      console.log(err.message);
      error.value = 'could not send the message';
    }
  };

  const addDocWithId = async (id, doc) => {
    error.value = null;
    try {
      await projectFirestore.collection(collection).doc(id).set(doc);
    } catch (err) {
      console.log(err.message);
      error.value = 'could not send the message';
    }
  };

  return { error, addDoc, addDocWithId };
};

export default useCollection;
