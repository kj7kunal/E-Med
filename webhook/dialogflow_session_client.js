/**
 * @fileoverview Contacts dialogflow and returns response.
 */
const dialogflow = require('dialogflow');
const jsonToProto = require('./json_to_proto')
module.exports = class DialogflowSessionClient {

    constructor(projectId){
        this.sessionClient = new dialogflow.SessionsClient();
        this.projectId = projectId;
    }

    constructRequest(text, sessionPath, payload) {
        return {
            session: sessionPath,
            queryInput: {
                text: {
                    text: text,
                    languageCode: 'en'
                }
            },
            queryParams: {
                payload: jsonToProto.jsonToStructProto(payload)
            }
        };
    }

    constructRequestWithEvent(eventName, sessionPath) {
        return {
            session: sessionPath,
            queryInput: {
                event: {
                    name: eventName,
                    languageCode: 'en'
                },
            },
        };
    }

    //This function calls Dialogflow DetectIntent API to retrieve the response
    //https://cloud.google.com/dialogflow/docs/reference/rest/v2/projects.agent.sessions/detectIntent
    async detectIntentHelper(detectIntentRequest) {
        let [response] = await this.sessionClient.detectIntent(detectIntentRequest);
        return (response.queryResult);
    }

    async detectIntent(text, sessionId, payload) {
        const sessionPath = this.sessionClient.sessionPath(
            this.projectId, sessionId);
        const request = this.constructRequest(text, sessionPath, payload);
        //const request = this.constructRequest(text, "projects/<Project ID>/agent/sessions/" + sessionId.toString(), payload);
        return await this.detectIntentHelper(request);
    }

    async detectIntentWithEvent(eventName, sessionId) {
        const sessionPath = this.sessionClient.sessionPath(
            this.projectId, sessionId);
        const request = this.constructRequestWithEvent(
            eventName, sessionPath);
        return await this.detectIntentHelper(request);
    }
};
