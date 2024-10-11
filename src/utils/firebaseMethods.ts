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
import { Banner, Tournament } from "../interfaces/interfaces";
import { CollectionNames } from "./collectionNames";

export const getPaginatedTournaments = async (
  direction: "next" | "prev" | undefined,
  startAfterDoc?: DocumentSnapshot,
  endBeforeDoc?: DocumentSnapshot,
  numPerPage: number = 10
) => {
  const tournamentsCollection = collection(db, CollectionNames.Tournaments);

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

export const getPaginatedBanners = async (
  direction: "next" | "prev" | undefined,
  startAfterDoc?: DocumentSnapshot,
  endBeforeDoc?: DocumentSnapshot,
  numPerPage: number = 10
) => {
  const tournamentsCollection = collection(db, CollectionNames.Banners);

  let tournamentsQuery = query(
    tournamentsCollection,
    orderBy("position", "desc"),
    limit(numPerPage),
  );

  if (direction === "next" && startAfterDoc) {
    tournamentsQuery = query(tournamentsQuery, startAfter(startAfterDoc));
  } else if (direction === "prev" && endBeforeDoc) {
    tournamentsQuery = query(
      tournamentsCollection,
      orderBy("position", "desc"),
      endBefore(endBeforeDoc),
      limitToLast(numPerPage)
    );
  }

  const snapshot = await getDocs(tournamentsQuery);
  const tournaments = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Banner[];

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

export const getNumPagesForUserTournaments = async (
  userId: string,
  numPerPage: number
): Promise<{ numPages: number; totalDocs: number }> => {
  const tournamentsRef = collection(db, CollectionNames.Tournaments);

  const tournamentsQuery = query(
    tournamentsRef,
    where("deleted", "==", false),
    where("paidUsersJustId", "array-contains", userId)
  );

  const countSnapshot = (await getCountFromServer(tournamentsQuery)).data()
    .count;

  const numPages = Math.ceil(countSnapshot / numPerPage);

  return { numPages, totalDocs: countSnapshot };
};

export const getPaginatedTournamentsHistory = async (
  userId: string,
  direction: "next" | "prev" | undefined,
  startAfterDoc?: DocumentSnapshot,
  endBeforeDoc?: DocumentSnapshot,
  numPerPage: number = 10
) => {
  const tournamentsCollection = collection(db, CollectionNames.Tournaments);

  let tournamentsQuery = query(
    tournamentsCollection,
    where("deleted", "==", false),
    where("paidUsersJustId", "array-contains", userId),
    orderBy("startDate", "desc"),
    limit(numPerPage)
  );

  if (direction === "next" && startAfterDoc) {
    tournamentsQuery = query(tournamentsQuery, startAfter(startAfterDoc));
  } else if (direction === "prev" && endBeforeDoc) {
    tournamentsQuery = query(
      tournamentsCollection,
      where("deleted", "==", false),
      where("teams.members", "array-contains", {
        memberId: userId,
      }),
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
