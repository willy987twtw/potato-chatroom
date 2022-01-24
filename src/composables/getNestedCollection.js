import { ref, watchEffect } from 'vue';
import { projectFirestore } from '../firebase/config';

const getCollection = (collection, id, collection2, orderBy, query) => {
  const documents = ref(null);
  const error = ref(null);
  // register the firestore collection reference
  let collectionRef = projectFirestore
    .collection(collection)
    .doc(id)
    .collection(collection2);

  if (orderBy) {
    collectionRef = collectionRef.orderBy(...orderBy);
  }

  if (query) {
    collectionRef = collectionRef.where(...query);
  }

  const unsub = collectionRef.onSnapshot(
    async snap => {
      let results = [];

      snap.docs.forEach(async doc => {
        if (orderBy) {
          doc.data()[orderBy[0]] &&
            results.push({
              ...doc.data(),
              id: doc.id,
            });
        } else {
          results.push({
            ...doc.data(),
            id: doc.id,
          });
        }
      });
      documents.value = results;

      error.value = null;
    },
    err => {
      console.log(err.message);
      documents.value = null;
      error.value = 'could not fetch dada';
    }
  );

  watchEffect(onInvalidate => {
    // unsub from prev collection when watcher is stopped(component unmounted)
    onInvalidate(() => unsub());
  });

  return { documents, error };
};

export default getCollection;
