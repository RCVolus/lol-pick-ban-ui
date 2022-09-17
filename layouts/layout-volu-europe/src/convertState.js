import banImg from "./assets/logo_ban_todo.png";
import topSplash from "./assets/top_splash_placeholder.svg";
import jungSplash from "./assets/jung_splash_placeholder.svg";
import midSplash from "./assets/mid_splash_placeholder.svg";
import botSplash from "./assets/bot_splash_placeholder.svg";
import supSplash from "./assets/sup_splash_placeholder.svg";

const pickSplashes = [topSplash, jungSplash, midSplash, botSplash, supSplash];

const makeUrlAbsolute = (url, backendUrl) => {
  if (!url || !url.startsWith('/cache')) {
    return url;
  }

  const httpBackendUrl = backendUrl.replace('ws://', 'http://').replace('wss://', 'https://');
  const components = httpBackendUrl.split('/')

  return components[0] + '//' + components[2] + url;
};

const putPlaceholders = (team,  backendUrl) => {
  for (let i = 0; i < 5; i++) {
    // Picks
    // Check if exists
    if (i >= team.picks.length) {
      // Does not exists, push
      team.picks.push({
        champion: {
          loadingImg: pickSplashes[i],
          id: 0
        }
      });
    } else {
      // Exists, check!
      const pick = team.picks[i];
      if (!pick.champion || !pick.champion.loadingImg) {
        pick.champion = {
          loadingImg: pickSplashes[i],
          id: 0
        };
        // pick.spell1 = null;
        // pick.spell2 = null;
      }

      if (pick.spell1) {
        pick.spell1.icon = makeUrlAbsolute(pick.spell1.icon, backendUrl);
      }
      if (pick.spell2) {
        pick.spell2.icon = makeUrlAbsolute(pick.spell2.icon, backendUrl);
      }
      pick.champion.loadingImg = makeUrlAbsolute(pick.champion.loadingImg, backendUrl);
      pick.champion.splashImg = makeUrlAbsolute(pick.champion.splashImg, backendUrl);
      pick.champion.squareImg = makeUrlAbsolute(pick.champion.squareImg, backendUrl);
    }

    // Bans
    if (i >= team.bans.length) {
      // Does not exist
      team.bans.push({
        champion: {
          squareImg: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', // banImg,
          id: 0
        }
      });
    } else {
      const ban = team.bans[i];
      if (!ban.champion || !ban.champion.squareImg) {
        ban.champion = {
          squareImg: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', // banImg,
          id: 0
        }
      }

      ban.champion.squareImg = makeUrlAbsolute(ban.champion.squareImg, backendUrl);
    }
  }
};

const convertState = (state, backendUrl) => {
  if (Object.keys(state).length !== 0) {
    putPlaceholders(state.blueTeam, backendUrl);
    putPlaceholders(state.redTeam, backendUrl);
  }
  if (state.state) { state.state = state.state.split('')[0] + state.state.toLowerCase().substring(1) };
  return state;
}

export default convertState;
