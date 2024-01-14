import {
  IonModal,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonAvatar,
  IonImg,
  IonLabel,
} from "@ionic/react";
import { useEffect, useRef } from "react";

const BottomDrawer: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);

  function handleBackButton() {
    modal.current?.setCurrentBreakpoint(0.1);
  }

  useEffect(() => {
    document.addEventListener("ionBackButton", handleBackButton);

    return () =>
      document.removeEventListener("ionBackButton", handleBackButton);
  }, []);

  return (
    <IonModal
      ref={modal}
      isOpen={true}
      initialBreakpoint={0.1}
      breakpoints={[0.1, 0.5, 0.7, 1]}
      canDismiss={false}
      backdropBreakpoint={1}
    >
      <IonContent className="ion-padding">
        <IonSearchbar
          onClick={() => modal.current?.setCurrentBreakpoint(1)}
          placeholder="Search"
        ></IonSearchbar>
        <IonList>
          <IonItem>
            <IonAvatar slot="start">
              <IonImg src="https://i.pravatar.cc/300?u=b" />
            </IonAvatar>
            <IonLabel>
              <h2>Connor Smith</h2>
              <p>Sales Rep</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar slot="start">
              <IonImg src="https://i.pravatar.cc/300?u=a" />
            </IonAvatar>
            <IonLabel>
              <h2>Daniel Smith</h2>
              <p>Product Designer</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar slot="start">
              <IonImg src="https://i.pravatar.cc/300?u=d" />
            </IonAvatar>
            <IonLabel>
              <h2>Greg Smith</h2>
              <p>Director of Operations</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar slot="start">
              <IonImg src="https://i.pravatar.cc/300?u=e" />
            </IonAvatar>
            <IonLabel>
              <h2>Zoey Smith</h2>
              <p>CEO</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default BottomDrawer;
