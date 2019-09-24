import Team from './data/team';
import league from '../league';

const convertTeam = (team, actions) => {
    const newTeam = new Team();
    newTeam.picks = team.map(cell => {
        cell.spell1 = league.ddragon.getSummonerSpellById(cell.spell1id);
        cell.spell2 = league.ddragon.getSummonerSpellById(cell.spell2id);

        return cell;
    });

    const isInThisTeam = cellId => {
        return team.filter(cell => cell.cellId === cellId).length !== 0;
    };

    newTeam.bans = actions.filter(action => action.type === 'ban' && isInThisTeam(action.actorCellId));

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
