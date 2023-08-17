import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonRedirect,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import "./Home.css";
import TodoList from "../components/TodoList";
import { getAuth, signOut } from "firebase/auth";
import { logOutOutline } from "ionicons/icons";

const Home: React.FC = () => {
  const router = useIonRouter();

  function goToPage(url: string) {
    router.push(url, "root", "replace");
  }

  function logout() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        goToPage("/login");
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Todo list</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={logout}>
              <IonIcon icon={logOutOutline} size="medium" slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <TodoList />
      </IonContent>
    </IonPage>
  );
};

export default Home;
