import { Room } from "./models";

export class AddRoom {
    static readonly type = '[Room] Add';

    constructor(public payload: Room) {
    }
}

export class GetRooms {
    static readonly type = '[Room] Get';
}

export class UpdateRoom {
    static readonly type = '[Room] Update';

    constructor(public payload: Room, public id: string) {
    }
}

export class DeleteRoom {
    static readonly type = '[Room] Delete';

    constructor(public id: string) {
    }
}

export class SetSelectedRoom {
    static readonly type = '[Room] Set';

    constructor(public payload: Room) {
    }
}