const { db } = require("./db");

const showList = async () => {
  try {
    const players = await db.collection("users").getFullList({
      filter: db.filter("isPlaying = {:isPlaying} || isSpare = {:isSpare} ", {
        isPlaying: true,
        isSpare: true,
      }),
      sort: "updated",
    });
    const activePlayers = players
      .filter((player) => player.isPlaying && !player.isSpare)
      .map((player, index) => `${index + 1}. ${player.username}`)
      .join("\n");
    const sparePlayers = players
      .filter((player) => player.isSpare)
      .map((player) => player.username)
      .join("\n");
    return players.length > 0
      ? `
        Lista graczy:\n${activePlayers}
        ${sparePlayers.length ? `\nRezerwa:\n${sparePlayers}` : ""}
      `
      : "Lista jest pusta";
  } catch (err) {
    console.error("Error showing list:", err);
    return `Error showing list: ${err.message}`;
  }
};

const addToList = async (discordId, username) => {
  console.log("Adding to list:", discordId, username);
  try {
    const activePlayers = await db.collection("users").getFullList({
      filter: "isPlaying=true",
    });

    const data = {
      discordId,
      username,
      isPlaying: activePlayers.length <= 10,
      isSpare: activePlayers.length > 10,
    };

    try {
      const existingPlayer = await db
        .collection("users")
        .getFirstListItem(`discordId="${discordId}"`);
      if (existingPlayer.isPlaying === true || existingPlayer.isSpare === true)
        return `${username} nie wal w ch*ja jesteś już na liście.`;

      await db.collection("users").update(existingPlayer.id, data);
      return `Gracz ${username} dodany do ${
        data.isPlaying ? "listy" : "rezerwy"
      }.`;
    } catch (err) {
      if (err.status === 404) {
        console.log("addTolist", err);
      } else {
        throw err;
      }
    }
  } catch (err) {
    console.error("addTolist", err);
    return `Error adding to list: ${err}`;
  }
};

const removeFromList = async (discordId, username) => {
  try {
    const existingPlayer = await db
      .collection("users")
      .getFirstListItem(`discordId="${discordId}"`);

    if (
      (existingPlayer.isPlaying === false) &
      (existingPlayer.isSpare === false)
    )
      return `${username} nie jest na liście.`;

    await db
      .collection("users")
      .update(existingPlayer.id, { isPlaying: false, isSpare: false });
    return `${username} usunięty z listy.`;
  } catch (err) {
    console.error("Error removing from list:", err);
    return `Wystąpił błąd podczas usuwania z listy. Spróbuj ponownie.`;
  }
};

const checkAndCreateUser = async (discordId, username) => {
  try {
    const user = await db
      .collection("users")
      .getFirstListItem(`discordId="${discordId}"`);
    return user.discordId;
  } catch (err) {
    if (err.status === 404) {
      console.log("User does not exist...");

      const newUser = await db
        .collection("users")
        .create({ discordId, username });
      return newUser.discordId;
    } else {
      throw err;
    }
  }
};

module.exports = {
  showList,
  addToList,
  checkAndCreateUser,
  removeFromList
};
