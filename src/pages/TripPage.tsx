import {
  IonAlert,
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { locationOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseSetup";
import { getAuth } from "firebase/auth";
import { deleteObject, getStorage, ref } from "firebase/storage";

interface TripPageParams {
  id: string;
}

const TripPage: React.FC = () => {
  const { id } = useParams<TripPageParams>();
  const [tripData, setTripData] = useState<any>();
  const auth = getAuth();
  const storage = getStorage();
  const router = useIonRouter();
  const [loading, setLoading] = useState(false);

  async function getTripData() {
    setLoading(true);
    const tripRef = doc(db, "trips", id);
    const docSnap = await getDoc(tripRef);
    setTripData(docSnap.data());
    console.log(tripData);
    console.log(tripData?.images.length);
    setLoading(false);
  }

  async function deleteImage(imageUrl: string) {
    const imageRef = ref(storage, imageUrl);

    // Delete the file
    deleteObject(imageRef)
      .then(() => {
        console.log("file deleted");
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
  }

  async function deleteImages(imageUrlArray: string[]) {
    for (const imageUrl of imageUrlArray) {
      await deleteImage(imageUrl);
    }
  }

  async function deleteTrip() {
    setLoading(true);
    if (tripData.images) deleteImages(tripData.images);
    await deleteDoc(doc(db, "trips", id));
    setLoading(false);
    router.push("/app/home", "back", "push");
  }

  useEffect(() => {
    getTripData();
  }, []);

  return (
    <IonPage id="main-content">
      <IonLoading isOpen={loading} />
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Trip detail | Tripture</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonAvatar className="ion-margin-end">
                <img
                  alt="Silhouette of a person's head"
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
              </IonAvatar>
            </IonCardTitle>
            <IonCardSubtitle>
              <h5>{tripData?.username}</h5>
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                {tripData?.images?.map((image: any, index: any) => (
                  <IonCol key={index} size="6">
                    <img alt="Image from the trip" src={image} />
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{tripData?.title}</IonCardTitle>
            <IonCardSubtitle>
              <IonChip>
                <IonLabel>{tripData?.location.country || "Loading"}</IonLabel>
                <IonIcon icon={locationOutline} />
              </IonChip>
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>{tripData?.text}</IonCardContent>
        </IonCard>
        {tripData?.userId === auth.currentUser?.uid && (
          <>
            <IonButton color="danger" id="delete">
              Delete Trip
            </IonButton>
            <IonAlert
              header="Delete Trip"
              subHeader="This can't be undone."
              message="Are you sure you want to delete this trip?"
              trigger="delete"
              buttons={[
                {
                  text: "Cancel",
                  role: "cancel",
                },
                {
                  text: "OK",
                  role: "confirm",
                  handler: deleteTrip,
                },
              ]}
            ></IonAlert>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TripPage;
