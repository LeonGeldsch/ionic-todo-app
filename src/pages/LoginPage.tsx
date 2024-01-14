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
  useIonRouter,
  IonToast,
  IonLoading,
} from "@ionic/react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorToastOpen, setErrorToastOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useIonRouter();

  function loginUser() {
    if (email === "" || password === "") {
      setErrorMessage("Please fill out all fields!");
      setErrorToastOpen(true);
      return;
    }
    setLoading(true);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);
        router.push("/app/home", "forward", "push");
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
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonInput
          type="email"
          placeholder="john.doe@gmail.com"
          onIonInput={(e) => setEmail(e.detail.value!)}
          label="Your email"
          labelPlacement="floating"
          fill="outline"
          className="ion-margin-bottom"
        />
        <IonInput
          type="password"
          onIonInput={(e) => setPassword(e.detail.value!)}
          label="Your password"
          labelPlacement="floating"
          fill="outline"
          className="ion-margin-bottom"
        />
        <IonButton className="ion-margin-bottom" onClick={loginUser}>
          Login
        </IonButton>
        <br />
        <IonText>
          Don't have an account?{" "}
          <IonRouterLink routerLink="/register" routerDirection="root">
            Register
          </IonRouterLink>
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
