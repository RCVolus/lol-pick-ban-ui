import Team from './data/team';
import league from '../league';
import Champion from "./data/champion";
import Spell from "./data/spell";

const convertTeam = (team, actions) => {
    const newTeam = new Team();
    newTeam.picks = team.map(cell => {
        const spell1 = new Spell(cell.spell1Id, league.ddragon.getSummonerSpellById(cell.spell1Id).icon);
        const spell2 = new Spell(cell.spell2Id, league.ddragon.getSummonerSpellById(cell.spell2Id).icon);

        const champion = new Champion(cell.championId, league.ddragon.getChampionById(cell.championId));

        return {
            spell1,
            spell2,
            champion: champion.name,
            summonerId: cell.summonerId
        };
    });

    const isInThisTeam = cellId => {
        return team.filter(cell => cell.cellId === cellId).length !== 0;
    };

    newTeam.bans = actions.filter(action => action.type === 'ban' && isInThisTeam(action.actorCellId)).map(action => {
        if (!action.completed) {
            const champion = new Champion(0, null);
            champion.isActive = true;
            return champion;
        }
        const champion = league.ddragon.getChampionById(action.championId);
        return new Champion(action.championId, champion.name);
    });

    return newTeam;
};

const convertState = lcuState => {
    const flattenedActions = [].concat.apply([], lcuState.actions);

    const blueTeam = convertTeam(lcuState.myTeam, flattenedActions);
    const redTeam = convertTeam(lcuState.theirTeam, flattenedActions);

    return {
        blueTeam,
        redTeam
    };
};

export default convertState;
