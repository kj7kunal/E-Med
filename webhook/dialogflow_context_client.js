/**
 * @fileoverview Contacts dialogflow and returns response.
 */
const dialogflow = require('dialogflow');

module.exports = class DialogflowContextClient {

    constructor(projectId){
        this.contextsClient = new dialogflow.ContextsClient();
        this.projectId = projectId;
    }

    constructContextRequest(sessionPath, contextPath, lifespanCount) {
        return {
            parent: sessionPath,
            context: {
                name: contextPath,
                lifespanCount: lifespanCount,
            },
        };
    }

    async createContext(sessionId, contextId, lifespanCount) {
        const sessionPath = this.contextsClient.sessionPath(
            this.projectId, sessionId);
        const contextPath = this.contextsClient.contextPath(
            this.projectId, sessionId, contextId);

        const request = this.constructContextRequest(sessionPath, contextPath, lifespanCount);

        const responses = await this.contextsClient.createContext(request);
        console.log(`Created ${responses[0].name} context`);
    }

    async deleteContexts(sessionId, contexts) {
        contexts.map(contextPath => {
            this.contextsClient.deleteContext({
                name: contextPath
            }).then(() => {
                console.log("Deleted context");
            }).catch(err => {
                console.error(err);
            })
        });
    }

    async deleteAllContexts(sessionId) {
        const sessionPath = this.contextsClient.sessionPath(
            this.projectId, sessionId);
        this.contextsClient.deleteAllContexts({
            parent: sessionPath
        }).then(() => {
            console.log("Deleted all contexts");
        }).catch(err => {
            console.error(err);
        });
    }
};