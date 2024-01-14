import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSplitPane,
  IonAvatar,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonRouterOutlet,
  IonIcon,
  IonPage,
  IonMenuToggle,
  useIonRouter,
} from "@ionic/react";
import {
  bookmarkOutline,
  checkmarkDoneOutline,
  homeOutline,
  listCircleOutline,
  listOutline,
  personCircleOutline,
} from "ionicons/icons";
import TripPage from "./TripPage";
import MyTrips from "./MyTrips";
import { Redirect, Route } from "react-router";
import HomePage from "./HomePage";
import NewTripPage from "./NewTripPage";
import TripsFeedPage from "./TripsFeedPage";
import { getAuth, signOut } from "firebase/auth";

interface Trip {
  name: string;
  url: string;
  icon: string;
  direction: "back" | "forward" | "root" | "none";
}

const Menu: React.FC = () => {
  const paths: Trip[] = [
    { name: "Home", url: "/app/home", icon: homeOutline, direction: "back" },
    {
      name: "Feed",
      url: "/app/trips",
      icon: listOutline,
      direction: "forward",
    },
    {
      name: "Following",
      url: "/app/home",
      icon: checkmarkDoneOutline,
      direction: "forward",
    },
    {
      name: "My account",
      url: "/app/home",
      icon: personCircleOutline,
      direction: "forward",
    },
    {
      name: "My trips",
      url: "/app/my-trips",
      icon: listCircleOutline,
      direction: "forward",
    },
    {
      name: "Saved trips",
      url: "/app/home",
      icon: bookmarkOutline,
      direction: "forward",
    },
  ];
  const auth = getAuth();
  const router = useIonRouter();

  function logout() {
    signOut(auth)
      .then(() => {
        router.push("/login", "back", "replace");
      })
      .catch((error) => {
        console.error(error.message);
        router.push("/login", "back", "replace");
      });
  }

  return (
    <IonPage>
      <IonSplitPane contentId="main">
        <IonMenu contentId="main">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Tripture</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div className="flex flex-col ion-align-items-center">
              <IonAvatar className="ion-margin">
                <img
                  alt="Silhouette of a person's head"
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
              </IonAvatar>
              <IonButton className="ion-margin-bottom" onClick={logout}>
                Log out
              </IonButton>
            </div>
            <IonList lines="inset">
              <IonListHeader>
                <IonLabel>Menu</IonLabel>
              </IonListHeader>
              {paths.map((path, index) => (
                <IonMenuToggle key={index}>
                  <IonItem
                    routerLink={path.url}
                    routerDirection={path.direction}
                  >
                    <IonIcon icon={path.icon} slot="start" />
                    {path.name}
                  </IonItem>
                </IonMenuToggle>
              ))}
            </IonList>
          </IonContent>
        </IonMenu>

        <IonRouterOutlet id="main">
          <Route exact path="/app/home" component={HomePage} />
          <Route exact path="/app/my-trips" component={MyTrips} />
          <Route exact path="/app/my-trips/new" component={NewTripPage} />
          <Route exact path="/app/trips" component={TripsFeedPage} />
          <Route path="/app/trips/:id" component={TripPage} />
          <Route exact path="/app">
            <Redirect to="/app/home" />
          </Route>
        </IonRouterOutlet>
      </IonSplitPane>
    </IonPage>
  );
};

export default Menu;
