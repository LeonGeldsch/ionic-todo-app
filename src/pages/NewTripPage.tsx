import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonMenuButton,
  IonContent,
  IonInput,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  useIonRouter,
  IonLoading,
  IonToast,
  IonActionSheet,
  IonGrid,
  IonCol,
  IonRow,
  IonTextarea,
} from "@ionic/react";
import { camera, locateOutline, trash } from "ionicons/icons";
import { useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseSetup";
import { getAuth } from "firebase/auth";
import { Camera, GalleryPhoto } from "@capacitor/camera";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const NewTripPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [location, setLocation] = useState({
    lat: 43.59010231971526,
    lng: -6.478834052310849,
    country: "Location not found",
  });
  const auth = getAuth();
  const router = useIonRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<GalleryPhoto[]>([]);
  const storage = getStorage();

  async function uploadImage(image: GalleryPhoto) {
    const response = await fetch(image.webPath);
    const blob = await response.blob();
    const imageRef = ref(
      storage,
      `users/${auth.currentUser?.uid}/${new Date().getTime()}.${image.format}`
    );
    const result = await uploadBytes(imageRef, blob);
    const url = await getDownloadURL(imageRef);
    return url;
  }

  async function uploadImages() {
    let imageUrls: String[] = [];
    for (const image of images) {
      imageUrls.push(await uploadImage(image));
    }
    console.log(imageUrls);

    return imageUrls;
  }

  async function handleGeolocationClick() {
    let latitude = 43.59010231971526;
    let longitude = -6.478834052310849;
    await Geolocation.getCurrentPosition()
      .then((res) => {
        latitude = res.coords.latitude;
        longitude = res.coords.longitude;
      })
      .catch((err) => {
        console.log(err);
      });
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=3&accept-language=en-ie`
    );
    const result = await response.json();
    setLocation({
      lat: latitude,
      lng: longitude,
      country: result.name,
    });
  }

  async function postTrip() {
    setLoading(true);
    const imageUrls = await uploadImages();
    // add trip information to database
    const userData = await getDoc(doc(db, `users/${auth.currentUser?.uid}`));
    await addDoc(collection(db, "trips"), {
      title: title,
      text: text,
      userId: auth.currentUser?.uid,
      username: userData.data()?.username,
      createdAt: serverTimestamp(),
      location: location,
      color: userData.data()?.themeColor,
      images: imageUrls,
    })
      .then((res) => {
        router.push("/app/home", "back", "push");
      })
      .catch((err) => {
        setError(err);
      });
    setLoading(false);
  }

  async function pickFromGallery() {
    const selectedImages = await Camera.pickImages({});
    console.log(selectedImages);
    setImages((current) => [...current, ...selectedImages.photos]);
  }

  return (
    <IonPage>
      <IonLoading isOpen={loading} />
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Create new trip | Tripture</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonToast
          isOpen={error.length >= 1}
          message={error}
          onDidDismiss={() => setError("")}
          duration={5000}
          color="danger"
        />
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Trip location:</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton onClick={handleGeolocationClick} size="small">
              <IonIcon icon={locateOutline} slot="start" />
              Use current location
            </IonButton>
            <p>Location: {location?.country}</p>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Trip description:</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonInput
              label="Title"
              labelPlacement="stacked"
              placeholder="Title of the trip..."
              onIonInput={(e) => setTitle(e.detail.value!)}
              fill="outline"
              className="ion-margin-bottom"
            />
            <IonTextarea
              autoGrow
              label="Text"
              labelPlacement="stacked"
              placeholder="Description of the trip..."
              onIonInput={(e) => setText(e.detail.value!)}
              fill="outline"
            />
          </IonCardContent>
        </IonCard>

        <IonGrid>
          <IonRow>
            {images.map((image, index) => (
              <IonCol key={index} size="6">
                <IonCard>
                  <IonFab vertical="bottom" horizontal="center">
                    <IonFabButton
                      onClick={() => {
                        setImages((current) =>
                          current.filter((value) => {
                            return !(value === image);
                          })
                        );
                      }}
                      size="small"
                      color="light"
                    >
                      <IonIcon icon={trash} color="danger"></IonIcon>
                    </IonFabButton>
                  </IonFab>

                  <img src={image.webPath} />
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
        <IonButton className="ion-padding" onClick={postTrip}>
          Post Trip!
        </IonButton>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton id="open-action-sheet">
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>
        <IonActionSheet
          trigger="open-action-sheet"
          header="Photo"
          buttons={[
            {
              text: "From Photos",
              handler: pickFromGallery,
            },
            {
              text: "Take Picture",
            },
            {
              text: "Cancel",
              role: "cancel",
            },
          ]}
        ></IonActionSheet>
      </IonContent>
    </IonPage>
  );
};

export default NewTripPage;
