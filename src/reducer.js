const initialState = {
  join: {
    gamePin: null,
    gameName: null,
    playerName: null,
  },
  game: {
    gamePin: null,
    gameName: null,
    host: null,
    activePlayer: null,
  },
  app: {
    isLoading: false,
  },
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "loading/start":
      return {
        ...state,
        app: {
          ...state.app,
          isLoading: true,
        },
      };
    case "loading/stop":
      return {
        ...state,
        app: {
          ...state.app,
          isLoading: false,
        },
      };
    case "join/setGameData":
      return {
        ...state,
        join: {
          ...state.join,
          gamePin: action.payload.gamePin,
          gameName: action.payload.gameName,
        },
      };
    case "join/setPlayerName":
      return {
        ...state,
        join: {
          ...state.join,
          playerName: action.payload,
        },
      };
    case "game/setGameData":
      console.log(action.payload);
      return {
        ...state,
        game: {
          ...state.game,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}

export default reducer;
