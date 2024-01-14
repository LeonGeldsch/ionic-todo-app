import { IonCard, IonCardHeader, IonAvatar } from "@ionic/react";
import { Trip as TripType } from "../types/Trip";

const TripPreview: React.FC<TripType> = ({ id, userId, title }) => {
  return (
    <IonCard routerLink={`/app/trips/${id}`} routerDirection="forward">
      <img
        alt="Silhouette of mountains"
        src="https://ionicframework.com/docs/img/demos/card-media.png"
        height={512}
        width={1024}
      />
      <IonCardHeader>
        <div className="flex items-center">
          <IonAvatar>
            <img
              alt="Silhouette of a person's head"
              src="https://ionicframework.com/docs/img/demos/avatar.svg"
            />
          </IonAvatar>
          <h4 className="ion-margin-start">{title}</h4>
        </div>
      </IonCardHeader>
    </IonCard>
  );
};

export default TripPreview;
