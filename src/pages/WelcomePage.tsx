import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
} from "@ionic/react";

const LoginPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <img
            src="/logo.png"
            alt="Tripture logo"
            slot="start"
            width={32}
            height={32}
            className="ion-margin-start"
          />
          <IonTitle>Tripture</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonText color="primary">
          <h1>Welcome to Tripture!</h1>
        </IonText>
        <p>The place for sharing your trips with your friends and family.</p>
        <IonButton routerLink="/login" routerDirection="root">
          Continue
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
