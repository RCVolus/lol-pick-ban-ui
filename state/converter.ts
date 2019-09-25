import league from '../league';
import lolcsui from '../types';
import Cell = lolcsui.lcu.Cell;
import Action = lolcsui.lcu.Action;
import ActionType = lolcsui.lcu.ActionType;
import Ban = lolcsui.dto.Ban;
import Team = lolcsui.dto.Team;
import Pick = lolcsui.dto.Pick;
import Session = lolcsui.lcu.Session;
import Champion = lolcsui.dto.Champion;

const convertTeam = (team: Array<Cell>, actions: Array<Action>) => {
    const newTeam = new Team();
    newTeam.picks = team.map((cell: Cell) => {
        const pick = new Pick(cell.cellId);
        pick.id = cell.cellId;
        pick.isActive = false;

        pick.spell1 = {
            id: cell.spell1Id,
            icon: league.ddragon.getSummonerSpellById(cell.spell1Id).icon
        };
        pick.spell2 = {
            id: cell.spell2Id,
            icon: league.ddragon.getSummonerSpellById(cell.spell2Id).icon
        };

        pick.champion = {
            id: cell.championId,
            name: league.ddragon.getChampionById(cell.championId).name
        };

        return pick;
    });

    const isInThisTeam = (cellId: number) => {
        return team.filter(cell => cell.cellId === cellId).length !== 0;
    };

    newTeam.bans = actions.filter(action => action.type === ActionType.BAN && isInThisTeam(action.actorCellId)).map(action => {
        const ban = new Ban();

        if (!action.completed) {
            ban.isActive = true;
            ban.champion = new Champion();
            return ban;
        }

        const championData = league.ddragon.getChampionById(action.championId);
        ban.champion = {
            name: championData.name,
            id: action.championId
        };

        return ban;
    });

    return newTeam;
};

const convertState = (lcuSession: Session) => {
    // @ts-ignore
    const flattenedActions: Array<Action> = [].concat(...lcuSession.actions);

    const blueTeam = convertTeam(lcuSession.myTeam, flattenedActions);
    const redTeam = convertTeam(lcuSession.theirTeam, flattenedActions);

    return {
        blueTeam,
        redTeam
    };
};

export default convertState;
