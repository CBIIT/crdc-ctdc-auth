const {getUserID, logEvent} = require("../bento-event-logging/neo4j/neo4j-operations");
const mySQLOps = require("../bin/mySQL/mySQL-operations.js");
class EventService {
    constructor(databaseConnection) { //rename databse connection
        this.databaseConnection = databaseConnection.connection;
    } 

    async storeLoginEvent(userID,userEmail, userIDP,databaseType){

        if (databaseType.toUpperCase() == "NEO4J"){ //TODO make this toupper
            let userID = await getUserID(this.neo4j, userEmail, userIDP);
            if (userID === undefined){
                userID = 'Not yet registered';
            }
            
            const loginEvent = new LoginEvent(userID, userEmail, userIDP,connectionParams);
            await logEvent(this.neo4j, loginEvent);
            }
        if (databaseType.toUpperCase() == "MYSQL"){
            console.log("Switch to SQL ");
            let eventType = "Login"
            mySQLOps.getCreateCommand(userID,eventType,userEmail,userIDP);
       }
       else {
            console.log("throw error");
         }   
       
    }

    async storeLogoutEvent(userID,userEmail, userIDP,databaseType){
        
        if (databaseType.toUpperCase() == "NEO4J"){
        let userID = await getUserID(this.neo4j, userEmail, userIDP);
        const logoutEvent = new LogoutEvent(userID, userEmail, userIDP);
        await logEvent(this.neo4j, logoutEvent);
        }
        if (databaseType.toUpperCase() == "MYSQL"){
            let eventType = "Logout"
            console.log("Switch to SQL ");
            
            mySQLOps.getCreateCommand(userID,eventType,userEmail,userIDP);
        }
        else {
            console.log("throw error");
        }
    }
}

module.exports = {
    EventService
};
