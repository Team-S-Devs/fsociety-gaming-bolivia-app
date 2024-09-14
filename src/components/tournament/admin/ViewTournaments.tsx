import React, { useEffect, useState } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import TournamentsTable from "./TournamentsTable";
import { Tournament } from "../../../interfaces/interfaces";
import {
  getNumPages,
  getPaginatedTournaments,
} from "../../../utils/firebaseMethods";
import Loader from "../../Loader";

const ViewTournaments: React.FC = () => {
  const numPerPage = 10;
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | undefined>(
    undefined
  );
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(
    undefined
  );
  const [pages, setPages] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalDocs, setTotalDocs] = useState<number>(0);
  const [direction, setDirection] = useState<"prev" | "next" | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getNumPages("tournaments", numPerPage).then((result) => {
      setPages(result.numPages);
      setTotalDocs(result.totalDocs);
    });
  }, []);

  useEffect(() => {
    const startAfterDoc = direction === "next" ? lastDoc : undefined;
    const endBeforeDoc = direction === "prev" ? firstDoc : undefined;

    setLoading(true);
    getPaginatedTournaments(
      direction,
      startAfterDoc,
      endBeforeDoc,
      numPerPage
    ).then((data) => {
      setTournaments(data.result);
      setFirstDoc(data.firstDoc);
      setLastDoc(data.lastDoc);
    });
    setLoading(false);
  }, [page, direction]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <TournamentsTable
          tournaments={tournaments}
          page={page}
          totalDocs={totalDocs}
          setTournaments={setTournaments}
          rowsPerPage={numPerPage}
          setPage={setPage}
          setDirection={setDirection}
          pages={pages ?? 0}
        />
      )}
    </div>
  );
};

export default ViewTournaments;
