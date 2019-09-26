namespace lolcsui {
    export namespace dto {
        export class StateData {
            leagueConnected = false;
            champSelectActive = false;
            blueTeam = new Team();
            redTeam = new Team();

            meta = new Meta();
        }

        export class Team {
            bans: Array<Ban> = [];
            picks: Array<Pick> = [];
        }

        export interface IAction {
            isActive: boolean;
        }

        export class Ban implements IAction {
            champion = new Champion();
            isActive = false;
        }

        export class Pick implements IAction {
            id: number;
            spell1!: Spell;
            spell2!: Spell;
            champion!: Champion;
            isActive = false;
            displayName: string = '';

            constructor(id: number) {
                this.id = id;
            }
        }

        export class Champion {
            id = 0;
            name = '';
            key? = '';
            splashImg = '';
            loadingImg = '';
            squareImg = '';
            idName = '';
        }

        export class Spell {
            id = 0;
            key?: string;
            icon = '';
        }

        export class Meta {
            cdn = '';
            version = new Version();
        }

        export class Version {
            champion = '';
            item = '';
        }
    }

    export namespace lcu {
        export class Session {
            myTeam: Array<Cell> = [];
            theirTeam: Array<Cell> = [];
            actions: Array<Array<Action>> = [];
        }

        export class Cell {
            cellId!: number;
            championId!: number;
            summonerId!: number;
            spell1Id!: number;
            spell2Id!: number;
        }

        export class Action {
            completed!: boolean;
            championId!: number;
            type!: ActionType;
            actorCellId!: number;
        }

        export enum ActionType {
            PICK = 'pick',
            BAN = 'ban'
        }
    }
}

export default lolcsui;
