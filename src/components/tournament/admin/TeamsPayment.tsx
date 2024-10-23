import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  TextField,
  Autocomplete,
  IconButton,
} from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { BiExpand } from "react-icons/bi";
import { Team, Tournament } from "../../../interfaces/interfaces";
import Grid from "@mui/material/Grid2";
import { LoadingButton } from "@mui/lab";
import styles from "../../../assets/styles/buttons.module.css";
import { timestampToDate } from "../../../utils/methods";
import { MdDelete, MdSettingsBackupRestore } from "react-icons/md";
import JoinTeamModal from "../tourForm/JoinTeamModal";

interface TeamsPaymentProps {
  tournament: Tournament;
  setTournament: React.Dispatch<React.SetStateAction<Tournament>>;
  error: string | null;
  success: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  submit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const TeamsPayment: React.FC<TeamsPaymentProps> = ({
  tournament,
  setTournament,
  error,
  success,
  setError,
  submit,
}) => {
  const [teamSearch, setTeamSearch] = useState<string>("");
  const [playerSearch, setPlayerSearch] = useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [expandedPaid, setExpandedPaid] = useState<string | false>(false);
  const [expandedNotPaid, setExpandedNotPaid] = useState<string | false>(false);

  const handleChangePaid =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedPaid(isExpanded ? panel : false);
    };

  const handleChangeNotPaid =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedNotPaid(isExpanded ? panel : false);
    };

  function hasUserPaid(userId: string): boolean {
    return (
      tournament != null &&
      tournament.paidUsersId.some((paidUser) => paidUser.userId === userId)
    );
  }

  function paidUserAt(userId: string): Timestamp {
    const paid = tournament.paidUsersId.filter(
      (paidUser) => paidUser.userId === userId
    );
    if (paid.length > 0) {
      return paid[0].paidAt;
    } else return Timestamp.now();
  }

  const handlePaymentToggle = (userId: string) => {
    const updatedTournament = { ...tournament };
    if (hasUserPaid(userId)) {
      updatedTournament.paidUsersId = updatedTournament.paidUsersId.filter(
        (paidUser) => paidUser.userId !== userId
      );
      updatedTournament.paidUsersJustId.filter(
        (paidUserId) => paidUserId !== userId
      );
    } else {
      updatedTournament.paidUsersJustId.push(userId);
      updatedTournament.paidUsersId.push({
        paidAt: Timestamp.now(),
        userId: userId,
      });
    }
    setTournament({ ...updatedTournament });
  };

  const handleMarkAllAsPaid = (teamId: string) => {
    const updatedTournament = { ...tournament };
    const team = updatedTournament.teams.find((t) => t.id === teamId);
    if (team)
      team.members.forEach((player) => {
        if (!hasUserPaid(player.memberId || "")) {
          updatedTournament.paidUsersId.push({
            paidAt: Timestamp.now(),
            userId: player.memberId || "not-paid",
          });
          updatedTournament.paidUsersJustId.push(player.memberId);
        }
      });
    setTournament(updatedTournament);
  };

  const handleAssignToTeam = (userId: string, teamId: string) => {
    const updatedTournament = { ...tournament };
    const team = updatedTournament.teams.find((team) => team.id === teamId);

    if (team && team.members.length < Number(tournament.teamLimit)) {
      const player = tournament.usersNoTeam.find(
        (user) => user.memberId === userId
      );
      if (player) {
        if (team.members.length === 0) {
          team.captainId = player.memberId;
        }
        team.members.push(player);
        updatedTournament.usersNoTeam = updatedTournament.usersNoTeam.filter(
          (user) => user.memberId !== userId
        );
        setTournament(updatedTournament);
      }
    } else {
      setError("El equipo ha alcanzado el límite de jugadores.");
    }
  };

  function allTeamMembersPaid(team: Team): boolean {
    return team.members.every((player) =>
      tournament.paidUsersId.some(
        (paidUser) => paidUser.userId === player.memberId
      )
    );
  }

  const filterTeamsSearch = (teams: Team[]) => {
    const filteredTeams = teams.filter(
      (team) =>
        team.name.toLowerCase().includes(teamSearch.toLowerCase()) &&
        team.members.some(
          (player) =>
            player.user.nickname
              .toLowerCase()
              .includes(playerSearch.toLowerCase()) ||
            player.user.email
              .toLowerCase()
              .includes(playerSearch.toLowerCase()) ||
            player.user.phone.toString().includes(playerSearch.toLowerCase())
        )
    );
    return filteredTeams;
  };

  const handleRemoveFromTeam = (userId: string, teamId: string) => {
    const updatedTournament = { ...tournament };
    const team = updatedTournament.teams.find((team) => team.id === teamId);

    if (team) {
      const removedPlayer = tournament.teams
        .flatMap((team) => team.members)
        .find((player) => player.memberId === userId);

      team.members = team.members.filter(
        (member) => member.memberId !== userId
      );

      if (removedPlayer) {
        if (team.captainId === removedPlayer.memberId) {
          team.captainId =
            team.members.length > 0 ? team.members[0].memberId : "";
        }
        updatedTournament.usersNoTeam.push(removedPlayer);
      }

      setTournament(updatedTournament);
    }
  };

  const availableTeams = tournament.teams.filter(
    (team) => team.members.length < Number(tournament.teamLimit)
  );

  const handleToggleRemoveTeam = (teamId: string) => {
    const updatedTournament = { ...tournament };
    const team = updatedTournament.teams.find((t) => t.id === teamId);
    if (team) team.deleted = !team.deleted;
    setTournament(updatedTournament);
  };

  const renderUsersNoTeam = () => (
    <>
      <Typography variant="h6" sx={{ marginTop: 4 }}>
        Jugadores Sin Equipo
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />
      {tournament.usersNoTeam
        .filter(
          (player) =>
            player.user.nickname
              .toLowerCase()
              .includes(playerSearch.toLowerCase()) ||
            player.user.email
              .toLowerCase()
              .includes(playerSearch.toLowerCase()) ||
            player.user.phone.toString().includes(playerSearch.toLowerCase())
        )
        .map((user) => (
          <div
            style={{
              borderWidth: 1,
              borderRadius: 20,
              borderColor: "white",
              borderStyle: "solid",
              padding: 10,
              marginBottom: 10,
            }}
            key={user.memberId}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ md: 6, xs: 12 }}>
                <Typography>{user.user.nickname}</Typography>
              </Grid>
              <Grid size={{ md: 6, xs: 12 }}>
                <Typography>{user.user.email}</Typography>
              </Grid>
              <Grid size={{ md: 6, xs: 12 }}>
                <Typography>{user.user.phone}</Typography>
              </Grid>
              {user.user.range && (
                <Grid size={{ md: 6, xs: 12 }}>
                  <Typography>Rango: {user.user.range}</Typography>
                </Grid>
              )}
              <Divider />
              <Grid size={{ md: 6, xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hasUserPaid(user.memberId ?? "")}
                      onChange={() => handlePaymentToggle(user.memberId ?? "")}
                      color="secondary"
                    />
                  }
                  label="Pagado"
                />
              </Grid>
              <Grid size={{ md: 6, xs: 12 }}>
                <Autocomplete
                  options={availableTeams}
                  getOptionLabel={(option) =>
                    option.name + " - Rango: " + (option.range ?? "Sin rango")
                  }
                  onChange={(_event, newValue) => {
                    if (newValue?.id) {
                      handleAssignToTeam(user.memberId ?? "", newValue.id);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Asignar a un equipo"
                      variant="outlined"
                      placeholder="Seleccionar equipo"
                    />
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  noOptionsText="No hay equipos disponibles"
                />
              </Grid>
            </Grid>
          </div>
        ))}
    </>
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await submit(e);
    } catch (error) {
      setError("Error al enviar el formulario. Inténtalo de nuevo.");
    }
    setLoading(false);
  };

  const rendermembers = (teamId: string, members: any[], captainId: string) => (
    <>
      {members
        .filter(
          (player) =>
            player.user.nickname
              .toLowerCase()
              .includes(playerSearch.toLowerCase()) ||
            player.user.email.toLowerCase().includes(playerSearch.toLowerCase())
        )
        .map((player) => (
          <div
            style={{
              borderWidth: 1,
              borderRadius: 20,
              borderColor: "white",
              borderStyle: "solid",
              padding: 10,
              marginBottom: 10,
            }}
            key={player.id}
          >
            <Grid container spacing={2} alignItems="center">
              {captainId === player.memberId && (
                <Grid size={{ md: 12, xs: 12 }}>
                  <Typography color="success">CAPITÁN</Typography>
                </Grid>
              )}
              <Grid size={{ md: 6, xs: 12 }}>
                <Typography>{player.user.nickname}</Typography>
              </Grid>
              <Grid size={{ md: 6, xs: 12 }}>
                <Typography>{player.user.email}</Typography>
              </Grid>
              <Grid size={{ md: 6, xs: 12 }}>
                <Typography>{player.user.phone}</Typography>
              </Grid>
              <Divider />
              <Grid size={{ md: 6, xs: 12 }}>
                <Typography>
                  Se unió el {timestampToDate(player.joinedAt)}
                </Typography>
              </Grid>
              {hasUserPaid(player.memberId) && (
                <Grid size={{ md: 6, xs: 12 }}>
                  <Typography>
                    Pagó el {timestampToDate(paidUserAt(player.memberId))}
                  </Typography>
                </Grid>
              )}
              <Divider />

              <Grid size={{ md: 6, xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hasUserPaid(player.memberId)}
                      onChange={() => handlePaymentToggle(player.memberId)}
                      color="secondary"
                    />
                  }
                  label="Pagado"
                />
              </Grid>
              <Grid size={{ md: 6, xs: 12 }}>
                <Button
                  color="warning"
                  variant="outlined"
                  onClick={() => handleRemoveFromTeam(player.memberId, teamId)}
                >
                  Eliminar de equipo
                </Button>
              </Grid>
            </Grid>
          </div>
        ))}
    </>
  );

  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);

  return (
    <div>
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      {success && (
        <Typography color="success" variant="body2">
          {success}
        </Typography>
      )}

      <Button
        className={styles.continueButton}
        onClick={() => setShowCreateTeamModal(true)}
      >
        Crear equipo
      </Button>

      <br />
      <br />

      <div style={{ maxHeight: window.screenY }}>
        <JoinTeamModal
          view="createTeam"
          tournament={tournament}
          isModalOpen={showCreateTeamModal}
          closeModal={() => setShowCreateTeamModal(false)}
          setUserNoTeam={function (
            _value: React.SetStateAction<boolean>
          ): void {
            throw new Error("Function not implemented.");
          }}
          setUserTeam={function (
            _value: React.SetStateAction<Team | null>
          ): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Buscar equipo por nombre"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={teamSearch}
          onChange={(e) => setTeamSearch(e.target.value)}
        />

        <TextField
          label="Buscar jugador por nickname, email o teléfono"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={playerSearch}
          onChange={(e) => setPlayerSearch(e.target.value)}
        />

        <Typography variant="h6">
          Equipos con Todos los Jugadores Pagados
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        {filterTeamsSearch(
          tournament.teams.filter(
            (team) => !team.deleted && allTeamMembersPaid(team)
          )
        ).map((team, teamIndex) => (
          <Accordion
            key={team.name + teamIndex}
            style={{ background: "#3b3e8f" }}
            expanded={expandedPaid === team.id}
            onChange={handleChangePaid(team.id ?? "false")}
          >
            <AccordionSummary expandIcon={<BiExpand />}>
              <Grid container justifyContent={"center"} alignItems={"center"}>
                <Grid size={{ xs: 8 }}>
                  <Typography>{team.name}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <IconButton
                    onClick={() => handleToggleRemoveTeam(team.id ?? "")}
                  >
                    <MdDelete color="#f48894" />
                  </IconButton>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              {team.range && (
                <>
                  <br />
                  <Typography>Rango: {team.range}</Typography>
                  <br />
                </>
              )}
              {rendermembers(team.id ?? "", team.members, team.captainId)}
            </AccordionDetails>
          </Accordion>
        ))}

        <Divider sx={{ marginBottom: 2 }} />

        <Typography variant="h6" sx={{ marginTop: 4 }}>
          Equipos con Jugadores Pendientes de Pago
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        {filterTeamsSearch(
          tournament.teams.filter(
            (team) => !team.deleted && !allTeamMembersPaid(team)
          )
        ).map((team, teamIndex) => (
          <Accordion
            key={team.name + teamIndex}
            style={{ background: "#3b3e8f" }}
            expanded={expandedNotPaid === team.id}
            onChange={handleChangeNotPaid(team.id ?? "false")}
          >
            <AccordionSummary expandIcon={<BiExpand />}>
              <Grid container justifyContent={"center"} alignItems={"center"}>
                <Grid size={{ xs: 8 }}>
                  <Typography>{team.name}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <IconButton
                    onClick={() => handleToggleRemoveTeam(team.id ?? "")}
                  >
                    <MdDelete color="#f48894" />
                  </IconButton>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              {rendermembers(team.id ?? "", team.members, team.captainId)}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleMarkAllAsPaid(team.id ?? "")}
                sx={{ marginTop: 2 }}
              >
                Marcar a todos como pagados
              </Button>
            </AccordionDetails>
          </Accordion>
        ))}

        {renderUsersNoTeam()}

        <Typography variant="h6" sx={{ marginTop: 4 }}>
          Equipos eliminados
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />

        {tournament.teams
          .filter((team) => team.deleted)
          .map((team) => (
            <AccordionSummary>
              <Grid container justifyContent={"center"} alignItems={"center"}>
                <Grid size={{ xs: 8 }}>
                  <Typography>{team.name}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <IconButton
                    onClick={() => handleToggleRemoveTeam(team.id ?? "")}
                  >
                    <MdSettingsBackupRestore color="#bef488" />
                  </IconButton>
                </Grid>
              </Grid>
            </AccordionSummary>
          ))}

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
          loading={loading}
          className={styles.continueButton}
          style={{ marginTop: 24 }}
        >
          Guardar
        </LoadingButton>
      </form>
    </div>
  );
};

export default TeamsPayment;
