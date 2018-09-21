export class User {
    
    public name : string;
    public email : string;
    public uid : string;

    constructor(user: UserObj) {
        this.name = user && user.name || null;
        this.email = user && user.email || null;
        this.uid = user && user.uid || null;
    }
    
}

interface UserObj {
    uid: string;
    email: string;
    name: string;
}