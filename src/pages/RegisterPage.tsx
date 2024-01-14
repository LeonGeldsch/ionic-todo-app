import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonText,
  IonGrid,
  IonRow,
  IonRouterLink,
  IonLoading,
  IonToast,
  useIonRouter,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonItemDivider,
} from "@ionic/react";
import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebaseSetup";
import { getStorage, ref } from "firebase/storage";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorToastOpen, setErrorToastOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useIonRouter();
  const auth = getAuth();

  async function uploadProfilePic() {
    const uid = auth.currentUser?.uid;
    const storage = getStorage();
    const usersRef = ref(storage, `users/${uid}`);
  }

  async function registerUser() {
    if (email === "" || password === "" || name === "" || color === "") {
      setErrorMessage("Please fill out all fields!");
      setErrorToastOpen(true);
      return;
    }
    setLoading(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        await setDoc(doc(db, `/users/${userCredential.user.uid}`), {
          username: name,
          id: userCredential.user.uid,
          themeColor: color,
          profilePic: "",
        })
          .then(() => {
            setLoading(false);
            router.push("/app/home", "forward", "replace");
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setErrorToastOpen(true);
        setLoading(false);
      });
  }

  return (
    <IonPage>
      {loading && <IonLoading isOpen={true} />}
      <IonToast
        isOpen={errorToastOpen}
        message={errorMessage}
        onDidDismiss={() => setErrorToastOpen(false)}
        duration={5000}
        color="danger"
      />
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonInput
          type="email"
          placeholder="john.doe@gmail.com"
          onIonInput={(e) => setEmail(e.detail.value!)}
          label="Your email"
          labelPlacement="stacked"
          fill="outline"
          className="ion-margin-bottom"
        />
        <IonInput
          type="text"
          placeholder="John Doe"
          onIonInput={(e) => setName(e.detail.value!)}
          label="Your full name"
          labelPlacement="stacked"
          fill="outline"
          className="ion-margin-bottom"
        />
        <IonInput
          type="password"
          onIonInput={(e) => setPassword(e.detail.value!)}
          label="Your password"
          labelPlacement="stacked"
          fill="outline"
          className="ion-margin-bottom"
        />
        <IonSelect
          onIonChange={(e) => setColor(e.detail.value!)}
          label="Themecolour*"
          placeholder="Choose a colour"
          justify="start"
          fill="outline"
        >
          <IonSelectOption value="green">Green</IonSelectOption>
          <IonSelectOption value="red">Red</IonSelectOption>
          <IonSelectOption value="blue">Blue</IonSelectOption>
          <IonSelectOption value="yellow">Yellow</IonSelectOption>
          <IonSelectOption value="pink">Pink</IonSelectOption>
        </IonSelect>
        <p>
          *Your theme colour will mainly affect the colour that your markers on
          the map appear in.
        </p>
        <IonButton className="ion-margin-bottom" onClick={registerUser}>
          Register
        </IonButton>
        <br />
        <IonText>
          Already have an account?{" "}
          <IonRouterLink routerLink="/login" routerDirection="root">
            Login
          </IonRouterLink>
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
