import { ref, watchEffect } from 'vue';
import { projectFirestore } from '../firebase/config';

const getDocument = (collection, id) => {
  const document = ref(null);
  const error = ref(null);

  // register the firebase collection reference
  let documentRef = projectFirestore.collection(collection).doc(id);

  const unsub = documentRef.onSnapshot(
    doc => {
      if (doc.data()) {
        document.value = { ...doc.data(), id: doc.id };
        error.value = null;
      } else {
        error.value = '此資料不存在。';
        document.value = null;
      }
    },
    err => {
      console.log(err.message);
      error.value = '無法取得資料';
    }
  );

  watchEffect(onInvalidate => {
    onInvalidate(() => unsub());
  });

  return { document, error };
};

export default getDocument;
