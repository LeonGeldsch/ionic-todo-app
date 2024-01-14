import { useIonRouter } from "@ionic/react";
import Earth from "react-globe.gl";
import "./Globe.css";

interface GlobeProps {
  markers: Array<object>;
}

const Globe: React.FC<GlobeProps> = ({ markers }) => {
  const markerSvg = `<svg viewBox="-4 0 36 36">
    <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
    <circle fill="black" cx="14" cy="14" r="7"></circle>
  </svg>`;
  const router = useIonRouter();

  const N = 30;
  const gData = [...Array(N).keys()].map(() => ({
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
    size: 7 + Math.random() * 30,
    color: ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
  }));

  return (
    <Earth
      globeImageUrl="/8k_earth_daymap.jpg"
      htmlElementsData={markers}
      htmlElement={(d: any) => {
        const el: HTMLElement = document.createElement("div");
        el.innerHTML = markerSvg;
        el.style.color = d.color;
        el.classList.add("marker");
        el.style.width = `${d.size}px`;
        el.style.pointerEvents = "auto";
        el.style.cursor = "pointer";
        el.onclick = () => router.push(`/app/trips/${d.id}`, "forward", "push");
        return el;
      }}
      height={window.innerHeight - 44}
    />
  );
};

export default Globe;
