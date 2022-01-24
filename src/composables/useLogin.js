import { ref } from '@vue/reactivity';
import { projectAuth } from '../firebase/config';

const error = ref(null);
const isPending = ref(false);

const login = async (email, password) => {
  error.value = '';
  isPending.value = true;

  try {
    const res = await projectAuth.signInWithEmailAndPassword(email, password);
    error.value = null;
    isPending.value = false;
    return res;
  } catch (err) {
    console.log(err.message);
    error.value = '帳號或密碼無效，請再輸入一次';
    isPending.value = false;
  }
};

const userLogin = () => {
  return { error, login, isPending };
};

export default userLogin;
