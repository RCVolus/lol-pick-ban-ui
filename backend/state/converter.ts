import {Action, ActionType, Cell, Timer} from '../types/lcu';
import {Ban, Champion, Pick, Team} from '../types/dto';
import DataProviderService from '../data/DataProviderService';
import DataDragon from '../data/league/DataDragon';
import {CurrentState} from '../data/CurrentState';
import RecordingDatapoint from '../recording/RecordingDatapoint';

const convertTeam = (kwargs: { team: Array<Cell>; actions: Array<Action>; dataProvider: DataProviderService; ddragon: DataDragon }): Team => {
  const newTeam = new Team();
  newTeam.picks = kwargs.team.map((cell: Cell) => {
    const currentAction = kwargs.actions.find((action) => !action.completed);

    const pick = new Pick(cell.cellId);

    const spell1 = kwargs.ddragon.getSummonerSpellById(cell.spell1Id);
    pick.spell1 = {
      id: cell.spell1Id,
      icon: spell1 ? spell1.icon : '',
    };

    const spell2 = kwargs.ddragon.getSummonerSpellById(cell.spell2Id);
    pick.spell2 = {
      id: cell.spell2Id,
      icon: spell2 ? spell2.icon : '',
    };

    const champion = kwargs.ddragon.getChampionById(cell.championId);
    pick.champion = {
      id: cell.championId,
      name: champion ? champion.name : '',
      idName: champion ? champion.id.toString() : '',
      loadingImg: champion ? champion.loadingImg : '',
      splashImg: champion ? champion.splashImg : '',
      splashCenteredImg: champion ? champion.splashCenteredImg : '',
      squareImg: champion ? champion.squareImg : '',
    };

    const summoner = kwargs.dataProvider.getSummonerById(cell.summonerId);
    if (summoner) {
      pick.displayName = summoner.displayName;
    }

    if (currentAction && currentAction.type === ActionType.PICK && currentAction.actorCellId === cell.cellId && !currentAction.completed) {
      pick.isActive = true;
      newTeam.isActive = true;
    }

    return pick;
  });

  const isInThisTeam = (cellId: number): boolean => kwargs.team.filter((cell) => cell.cellId === cellId).length !== 0;

  let isBanDetermined = false;
  newTeam.bans = kwargs.actions.filter((action) => action.type === ActionType.BAN && isInThisTeam(action.actorCellId)).map((action) => {
    const ban = new Ban();

    if (!action.completed && !isBanDetermined) {
      isBanDetermined = true;
      ban.isActive = true;
      newTeam.isActive = true;
      ban.champion = new Champion();
      return ban;
    }

    const champion = kwargs.ddragon.getChampionById(action.championId);
    ban.champion = {
      id: action.championId,
      name: champion ? champion.name : '',
      idName: champion ? champion.id.toString() : '',
      loadingImg: champion ? champion.loadingImg : '',
      splashImg: champion ? champion.splashImg : '',
      splashCenteredImg: champion ? champion.splashCenteredImg : '',
      squareImg: champion ? champion.squareImg : '',
    };

    return ban;
  });

  return newTeam;
};

const convertTimer = (timer: Timer, currentDate: Date): number => {
  const startOfPhase = timer.internalNowInEpochMs;
  const expectedEndOfPhase = startOfPhase + timer.adjustedTimeLeftInPhase;

  const countdown = expectedEndOfPhase - currentDate.getTime();
  const countdownSec = Math.floor(countdown / 1000);

  if (countdownSec < 0) {
    return 0;
  }
  return countdownSec;
};

const convertStateName = (actions: Array<Action>) => {
  const currentActionIndex = actions.findIndex((action) => !action.completed);

  if (currentActionIndex === -1) {
    return '';
  }

  const currentAction = actions[currentActionIndex];
  if (currentAction.type == ActionType.BAN) {
    if (currentActionIndex <= 6) {
      return 'BAN PHASE 1';
    } else {
      return 'BAN PHASE 2';
    }
  } else {
    if (currentActionIndex <= 12) {
      return 'PICK PHASE 1';
    } else {
      return 'PICK PHASE 2';
    }
  }
};

const convertState = (state: CurrentState, dataProvider: DataProviderService, ddragon: DataDragon): { blueTeam: Team; redTeam: Team; timer: number; state: string } => {
  const lcuSession = state.session;

  const currentDate = (state as RecordingDatapoint).time ? new Date((state as RecordingDatapoint).time) : new Date();

  const flattenedActions: Array<Action> = [];
  lcuSession.actions.forEach(actionGroup => {
    flattenedActions.push(...actionGroup);
  });

  const blueTeam = convertTeam({ team: lcuSession.myTeam, actions: flattenedActions, dataProvider, ddragon });
  const redTeam = convertTeam({ team: lcuSession.theirTeam, actions: flattenedActions, dataProvider, ddragon });

  const timer = convertTimer(lcuSession.timer, currentDate);
  const stateName = convertStateName(flattenedActions);

  return {
    blueTeam,
    redTeam,
    timer,
    state: stateName
  };
};

export default convertState;
