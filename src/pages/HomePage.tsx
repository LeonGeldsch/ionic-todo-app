import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import Globe from "../components/Globe";
import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebaseSetup";

const HomePage: React.FC = () => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, "trips");
    const q = query(collectionRef, limit(20), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const newMarkers: any = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        newMarkers.push({
          lat: data.location?.lat || 43.59010231971526,
          lng: data.location?.lng || -6.478834052310849,
          color: data.color,
          size: 40,
          id: doc.id,
          title: data.title,
        });
      });
      setMarkers(newMarkers);
      console.log("Trips: ", newMarkers);
    });

    return unsub;
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard | Tripture</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Globe markers={markers} />
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
