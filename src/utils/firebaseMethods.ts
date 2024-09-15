import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  getDocs,
  DocumentSnapshot,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "./firebase-config";
import { Tournament } from "../interfaces/interfaces";

export const getPaginatedTournaments = async (
  direction: "next" | "prev" | undefined,
  startAfterDoc?: DocumentSnapshot,
  endBeforeDoc?: DocumentSnapshot,
  numPerPage: number = 10
) => {
  const tournamentsCollection = collection(db, "tournaments");

  let tournamentsQuery = query(
    tournamentsCollection,
    where("deleted", "==", false),
    orderBy("startDate", "desc"),
    limit(numPerPage)
  );

  if (direction === "next" && startAfterDoc) {
    tournamentsQuery = query(tournamentsQuery, startAfter(startAfterDoc));
  } else if (direction === "prev" && endBeforeDoc) {
    tournamentsQuery = query(
      tournamentsCollection,
      where("deleted", "==", false),
      orderBy("startDate", "desc"),
      endBefore(endBeforeDoc),
      limitToLast(numPerPage)
    );
  }

  const snapshot = await getDocs(tournamentsQuery);
  const tournaments = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Tournament[];

  return {
    result: tournaments,
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
    firstDoc: snapshot.docs[0],
  };
};

export const getNumPages = async (
  collectionName: string,
  numPerPage: number
): Promise<{ numPages: number; totalDocs: number }> => {
  const dataCollection = collection(db, collectionName);
  const countSnapshot = (await getCountFromServer(dataCollection)).data().count;
  const numPages = Math.ceil(countSnapshot / numPerPage);
  return { numPages, totalDocs: countSnapshot };
};
