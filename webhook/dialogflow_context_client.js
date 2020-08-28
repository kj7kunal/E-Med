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

    // https://googleapis.dev/nodejs/dialogflow/1.2.0/v2.ContextsClient.html#createContext
    // https://github.com/googleapis/nodejs-dialogflow/blob/94e1b7bc7e78b985bc5d03bc0351115a66ce2af1/samples/resource.js#L308-L334
    async createContext(sessionId, contextId, lifespanCount) {
        const sessionPath = this.contextsClient.sessionPath(
            this.projectId, sessionId);
        // session path is = "projects/<Project ID>/agent/sessions/<Session ID>"
        const contextPath = this.contextsClient.contextPath(
            this.projectId, sessionId, contextId);
        // context path is "projects/<Project ID>/agent/sessions/<Session ID>/contexts/<Context ID>"

        const request = this.constructContextRequest(sessionPath, contextPath, lifespanCount);

        const responses = await this.contextsClient.createContext(request);
        // console.log(`Created ${responses[0].name} context`);
        console.log("Created context");
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

    // https://googleapis.dev/nodejs/dialogflow/1.2.0/v2.ContextsClient.html#deleteAllContexts
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
