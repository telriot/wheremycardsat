import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import { IEvent, IUser } from "../../declarations/index";
import { selectAuthorizedUser } from "../auth/authSlice";
import {
  fetchPersonalProfile,
  selectPersonalProfile,
  selectPersonalProfileStatus,
} from "./usersSlice";
import AddEmailField from "./AddEmailField";

import AlertCard from "../../components/AlertCard";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: { maxWidth: "48rem" },
    headerDiv: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    emailDiv: {
      display: "flex",
      alignItems: "center",
    },
    email: { marginRight: theme.spacing(1) },
    eventSelectorDiv: { display: "flex", justifyContent: "center" },
  })
);

function MyProfile() {
  const classes = useStyles();
  const user = useSelector(selectAuthorizedUser);
  const personalProfile = useSelector(selectPersonalProfile);
  const status = useSelector(selectPersonalProfileStatus);
  const dispatch = useDispatch();

  React.useEffect(() => {
    user &&
      user?._id !== personalProfile?._id &&
      dispatch(fetchPersonalProfile(user._id));
  }, [dispatch, personalProfile, user]);

  const profileIsFetched = Boolean(
    status === "fulfilled" &&
      personalProfile &&
      personalProfile._id === user?._id
  );
  const filterByDate = (
    arr: Array<IEvent>,
    direction: "past" | "future"
  ): Array<IEvent> => {
    if (!arr || !arr.length) return [];

    return arr.filter((event) => {
      let eventDate = new Date(event.day);

      if (event.startsAt)
        eventDate.setHours(parseInt(event.startsAt.slice(0, 2)));

      const now = new Date(Date.now());
      return direction === "past" ? eventDate < now : eventDate > now;
    });
  };

  const eventsToDisplay = {
    myEvents: filterByDate(personalProfile?.createdEvents, "future"),
    joined: filterByDate(personalProfile?.joinedEvents, "future"),
    archived: filterByDate(
      [
        ...(personalProfile?.createdEvents || []),
        ...(personalProfile?.joinedEvents || []),
      ],
      "past"
    ),
  };

  const FetchedProfile = ({
    personalProfile,
  }: {
    personalProfile: IUser | null;
  }) => {
    return (
      <div>

      </div>
    );
  };

  const Skeletons = () => {
    const skeletonsArr = new Array(3).fill("");
    return (
      <div>

      </div>
    );
  };

  return (
    <Container className={classes.container}>
      {profileIsFetched ? (
        <FetchedProfile personalProfile={personalProfile} />
      ) : status === "pending" ? (
        <Skeletons />
      ) : status === "rejected" ? (
        <AlertCard message="Something went wrong with our servers" />
      ) : (
        ""
      )}
    </Container>
  );
}

export default MyProfile;
