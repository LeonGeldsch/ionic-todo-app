import {
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  QuerySnapshot,
  Timestamp,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { add } from "ionicons/icons";
import { db } from "../firebaseSetup";
import { useEffect, useState } from "react";
import { Trip as TripType } from "../types/Trip";
import TripPreview from "../components/TripPreview";

const TripsFeedPage: React.FC = () => {
  const [trips, setTrips] = useState<TripType[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDocument, setLastDocument] = useState<any>();

  let lastSnapshot: QuerySnapshot;

  async function getInitialTrips() {
    const tripsRef = collection(db, "trips");
    const q = query(tripsRef, orderBy("createdAt", "desc"), limit(3));
    const querySnapshot = await getDocs(q);
    const newTripsArray: any[] = [];
    querySnapshot.forEach((doc) => {
      newTripsArray.push({ ...doc.data(), id: doc.id });
    });
    setLastDocument(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setTrips(newTripsArray);
    setLoading(false);
  }

  async function loadMoreTrips() {
    const tripsRef = collection(db, "trips");
    const q = query(
      tripsRef,
      orderBy("createdAt", "desc"),
      limit(3),
      startAfter(lastDocument)
    );
    const newTripsArray: any[] = [];
    await getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          newTripsArray.push({ ...doc.data(), id: doc.id });
        });
        let last = querySnapshot.docs[querySnapshot.docs.length - 1];
        if (last) setLastDocument(last);
        setTrips((current: any) => current.concat(newTripsArray));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    getInitialTrips();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/home" />
          </IonButtons>
          <IonTitle>Feed | Tripture</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonLoading isOpen={loading} />
        {trips.map((trip, index) => (
          <TripPreview key={index} {...trip} />
        ))}
        <IonInfiniteScroll
          onIonInfinite={(ev) => {
            loadMoreTrips();
            setTimeout(() => ev.target.complete(), 500);
          }}
        >
          <IonInfiniteScrollContent></IonInfiniteScrollContent>
        </IonInfiniteScroll>
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton routerLink="/app/my-trips/new">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default TripsFeedPage;
