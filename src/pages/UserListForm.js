import React, { useEffect, useState } from "react";
import { Card } from "semantic-ui-react";
import MessageHeading from "../../src/components/MessageHeading";
import WalkInForm from "./WalkInForm";
import Firebase from "../firebase";
import * as firebaseApp from "firebase/app";

const UserListForm = ({ userOnClick, propertyID, setLoading, error }) => {
  const [guests, setGuests] = useState([]);
  const [walkInFormOpen, setWalkInFormOpen] = useState(false);

  let db = Firebase.firestore();
  useEffect(() => {
    // console.log("Property ID >>" + propertyID);
    setLoading(true);
    const f = async () => {
      console.log("User list fetch");
      let today = new Date().toISOString().substring(0, 10);
      today = `${today} 00:00:00`;
      console.log(today);
      try {
        const todayDate = firebaseApp.firestore.Timestamp.fromDate(
          new Date(today)
        );

        let guestList = [];
        let querySnap = await db
          .collection("Property")
          .doc(propertyID)
          .collection("Guest")
          .where("last_booking_date", "==", todayDate)
          .where("checkedin", "==", false)
          .get();
        querySnap.forEach(function (doc) {
          console.log(doc);
          guestList.push({ id: doc.id, name: doc.data().name });
        });

        setGuests(guestList);
        setLoading(false);
      } catch (error) {
        console.error("UserListForm Line 42" + error);
      }
    };
    f();
  }, []);

  const userListHandleClick = (guestId, name) => {
    console.log("Handle click user list " + guestId);
    userOnClick(guestId, name);
  };

  const userListHandleWalkinClick = () => {
    setWalkInFormOpen(true);
  };

  const closeWorkingForm = () => {
    setWalkInFormOpen(false);
  }
  return (
    <div>
      <MessageHeading main="Please tap on your name to begin" />
      <br />
      <br />
      <Card.Group>
        {guests.map((guest) => (
          <Card
            key={guest.id}
            fluid
            color="orange"
            header={guest.name}
            onClick={() => userListHandleClick(guest.id, guest.name)}
          />
        ))}
        <Card
          key={"walk"}
          fluid
          color="orange"
          header="Walk-in"
          onClick={() => userListHandleWalkinClick("walkin")}
        />
        <WalkInForm
          showModal={walkInFormOpen}
          propertyID={propertyID}
          userListHandleClick={userListHandleClick}
          closeWorkingForm={closeWorkingForm}
        />
      </Card.Group>
    </div>
  );
};

export default UserListForm;
