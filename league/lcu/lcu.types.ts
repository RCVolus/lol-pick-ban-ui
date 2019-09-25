declare namespace league.lcu {

    class Session {
        myTeam: Array<Cell>;
        theirTeam: Array<Cell>;
        actions: Array<Array<Action>>;
    }

    class Cell {
        championId: number;
        summonerId: number;
        spell1Id: number;
        spell2Id: number;
    }

    class Action {
        completed: boolean;
        type: ActionType;
    }

    enum ActionType {
        PICK,
        BAN
    }

}