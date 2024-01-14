import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonMenuButton,
  IonContent,
} from "@ionic/react";
import Earth from "react-globe.gl";

const CoordinateSelectionPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Choose trip location</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Earth
          globeImageUrl="/8k_earth_daymap.jpg"
          height={window.innerHeight - 44}
        />
      </IonContent>
    </IonPage>
  );
};

export default CoordinateSelectionPage;
