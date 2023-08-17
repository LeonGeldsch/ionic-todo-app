import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { add, chevronBack } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import "./TodoList.css";
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseSetup";
import { getAuth } from "firebase/auth";

interface TodoItemProps {
  id: number;
  title: string;
  text: string;
  completed: boolean;
  remove: Function;
  toggleCompleted: Function;
}

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  title,
  text,
  completed,
  remove,
  toggleCompleted,
}) => {
  function deleteItem() {
    remove(id);
  }

  return (
    <IonItemSliding>
      <IonItem detail={false} className="item-remove-animate">
        <IonCheckbox
          labelPlacement="end"
          justify="start"
          onIonChange={() => {
            toggleCompleted(id, completed);
          }}
          checked={completed}
        >
          <IonLabel>
            <h3>{title}</h3>
            <p>{text}</p>
          </IonLabel>
        </IonCheckbox>
        <IonIcon icon={chevronBack} slot="end" />
      </IonItem>
      <IonItemOptions onIonSwipe={deleteItem}>
        <IonItemOption color="danger" expandable onClick={deleteItem}>
          Delete
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoText, setNewTodoText] = useState("");
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  const modal = useRef<HTMLIonModalElement>(null);

  async function removeTodo(id: string) {
    await deleteDoc(doc(db, `users/${getAuth().currentUser?.uid}/todos`, id));
  }

  async function addTodo() {
    setOverlayLoading(true);
    await addDoc(collection(db, `users/${getAuth().currentUser?.uid}/todos`), {
      title: newTodoTitle,
      text: newTodoText,
      completed: false,
      createdAt: serverTimestamp(),
    });
    setOverlayLoading(false);
    modal.current?.dismiss();
    setNewTodoTitle("");
    setNewTodoText("");
  }

  async function toggleCompleted(id: string, completed: boolean) {
    await updateDoc(doc(db, `users/${getAuth().currentUser?.uid}/todos`, id), {
      completed: !completed,
    });
  }

  useEffect(() => {
    const q = query(
      collection(db, `users/${getAuth().currentUser?.uid}/todos`),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArray: any = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArray);
      setListLoading(false);
    });
  }, []);

  return (
    <>
      <IonList>
        {listLoading && <IonLoading isOpen={true} />}
        {todos.map(({ title, text, id, completed }) => (
          <TodoItem
            title={title}
            text={text}
            key={id}
            id={id}
            completed={completed}
            remove={removeTodo}
            toggleCompleted={toggleCompleted}
          />
        ))}
      </IonList>
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton id="open-modal">
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
      <IonModal ref={modal} trigger="open-modal">
        {overlayLoading && <IonLoading isOpen={true} />}
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => modal.current?.dismiss()}>
                Cancel
              </IonButton>
            </IonButtons>
            <IonTitle>Add new todo</IonTitle>
            <IonButtons slot="end">
              <IonButton strong={true} onClick={addTodo}>
                Confirm
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonItem>
              <IonInput
                type="text"
                placeholder="My todo"
                label="Title"
                labelPlacement="stacked"
                onIonInput={(e) => setNewTodoTitle(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonInput
                type="text"
                placeholder="This todo is about..."
                label="Text"
                labelPlacement="stacked"
                onIonInput={(e) => setNewTodoText(e.detail.value!)}
              />
            </IonItem>
          </IonList>
        </IonContent>
      </IonModal>
    </>
  );
};

export default TodoList;
