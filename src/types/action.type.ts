export type ActionType = {
    comment: string;
    action: 'like' | 'dislike' ;
    user?: string;
}