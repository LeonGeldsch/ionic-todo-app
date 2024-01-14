import {
  IonBackButton,
  IonButtons,
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
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { add } from "ionicons/icons";
import TripPreview from "../components/TripPreview";
import {
  QuerySnapshot,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  startAfter,
  startAt,
  DocumentData,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebaseSetup";
import { Trip } from "../types/Trip";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const MyTrips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDocument, setLastDocument] = useState<any>();
  const auth = getAuth();

  async function getInitialTrips() {
    const tripsRef = collection(db, "trips");
    const q = query(
      tripsRef,
      where("userId", "==", auth.currentUser?.uid),
      orderBy("createdAt", "desc"),
      limit(3)
    );
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
      where("userId", "==", auth.currentUser?.uid),
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getInitialTrips();
      } else {
        // User is signed out
        // ...
      }
    });

    return unsubscribe;
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/home" />
          </IonButtons>
          <IonTitle>My Trips | Tripture</IonTitle>
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

export default MyTrips;
