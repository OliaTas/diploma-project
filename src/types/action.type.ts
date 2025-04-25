export type ActionType = {
    comment: string;
    action: Actions;
    user?: string;
}

export enum Actions {
    LIKE = 'like',
    DISLIKE = 'dislike',
    VIOLATE = 'violate'

}