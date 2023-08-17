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
} from "@ionic/react";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorToastOpen, setErrorToastOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useIonRouter();

  function goToPage(url: string) {
    router.push(url, "root", "replace");
  }

  function registerUser() {
    setLoading(true);
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);
        goToPage("/home");
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
        <IonGrid>
          <IonRow>
            <IonList>
              <IonItem>
                <IonInput
                  type="email"
                  placeholder="john.doe@gmail.com"
                  onIonInput={(e) => setEmail(e.detail.value!)}
                  label="Your email"
                  labelPlacement="floating"
                />
              </IonItem>
              <IonItem>
                <IonInput
                  type="password"
                  onIonInput={(e) => setPassword(e.detail.value!)}
                  label="Your password"
                  labelPlacement="floating"
                />
              </IonItem>
              <IonItem>
                <IonInput
                  type="password"
                  label="Repeat password"
                  labelPlacement="floating"
                />
              </IonItem>
            </IonList>
          </IonRow>
          <IonRow>
            <IonButton className="ion-padding-vertical" onClick={registerUser}>
              Register
            </IonButton>
          </IonRow>
          <IonRow>
            <IonText>
              Already have an account?{" "}
              <IonRouterLink routerLink="/login">Login</IonRouterLink>
            </IonText>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Register;
